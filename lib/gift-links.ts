import { customAlphabet } from "nanoid";
import type { ContentLot } from "@/lib/content";
import { resolveSceneId, type SceneId } from "@/lib/scene-map";

export type GiftLocale = "zh" | "ja";
export type GiftLinkStatus = "active" | "disabled";
export type GiftLotSnapshot = Pick<
  ContentLot,
  "id" | "order" | "label" | "title" | "flowerName" | "flowerIllustration" | "flowerAlt"
> &
  Partial<Pick<ContentLot, "fortune" | "blessing" | "category">>;

export type GiftRecord = {
  id: string;
  fromName: string;
  toName: string;
  message: string;
  locale: GiftLocale;
  cardId: string | null;
  sceneId: SceneId | null;
  lotKey: string | null;
  lotSnapshot: GiftLotSnapshot | null;
  status: GiftLinkStatus;
  schemaVersion: number;
  createdAt: string;
  expiresAt: string | null;
};

export type CreateGiftRecordInput = {
  fromName: string;
  toName: string;
  message: string;
  locale?: GiftLocale;
  cardId?: string | null;
  sceneId?: string | null;
  lotKey?: string | null;
  lotSnapshot?: GiftLotSnapshot | null;
  expiresAt?: string | null;
};

type GiftLinkRow = {
  id: string;
  from_name: string;
  to_name: string;
  message: string;
  locale: GiftLocale;
  card_id: string | null;
  scene_id: string | null;
  lot_key: string | null;
  lot_snapshot: GiftLotSnapshot | null;
  status: GiftLinkStatus;
  schema_version: number;
  created_at: string;
  expires_at: string | null;
};

const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const createId = customAlphabet(alphabet, 12);
const schemaVersion = 1;

export function buildGiftUrl(id: string, requestOrigin?: string) {
  const baseUrl = process.env.AKATO_GIFT_BASE_URL ?? requestOrigin;

  if (!baseUrl) {
    throw new Error("Gift link base URL is not configured.");
  }

  return `${baseUrl.replace(/\/$/, "")}/gift/${id}`;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase gift link storage is not configured.");
  }

  return { serviceRoleKey, url };
}

function toRow(id: string, input: CreateGiftRecordInput): Omit<GiftLinkRow, "created_at"> {
  const sceneId = input.sceneId ? resolveSceneId(input.sceneId) : null;

  return {
    id,
    from_name: input.fromName,
    to_name: input.toName,
    message: input.message,
    locale: input.locale ?? "zh",
    card_id: input.cardId ?? null,
    scene_id: sceneId,
    lot_key: input.lotKey ?? null,
    lot_snapshot: input.lotSnapshot ?? null,
    status: "active",
    schema_version: schemaVersion,
    expires_at: input.expiresAt ?? null,
  };
}

function fromRow(row: GiftLinkRow): GiftRecord {
  return {
    id: row.id,
    fromName: row.from_name,
    toName: row.to_name,
    message: row.message,
    locale: row.locale,
    cardId: row.card_id,
    sceneId: row.scene_id ? resolveSceneId(row.scene_id) : null,
    lotKey: row.lot_key,
    lotSnapshot: row.lot_snapshot,
    status: row.status,
    schemaVersion: row.schema_version,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

function isConflict(status: number) {
  return status === 409;
}

export async function createGiftRecord(input: CreateGiftRecordInput) {
  const { serviceRoleKey, url } = getSupabaseConfig();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = createId();
    const response = await fetch(`${url}/rest/v1/gift_links`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(toRow(id, input)),
      cache: "no-store",
    });

    if (response.ok) {
      return id;
    }

    if (!isConflict(response.status)) {
      throw new Error(`Supabase gift link insert failed with status ${response.status}.`);
    }
  }

  throw new Error("Unable to allocate a unique gift link id.");
}

export async function getGiftRecord(id: string) {
  const { serviceRoleKey, url } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/gift_links?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase gift link read failed with status ${response.status}.`);
  }

  const rows = (await response.json()) as GiftLinkRow[];

  return rows[0] ? fromRow(rows[0]) : null;
}

export function isGiftRecordAvailable(record: GiftRecord) {
  if (record.status !== "active") {
    return false;
  }

  if (!record.expiresAt) {
    return true;
  }

  return Date.parse(record.expiresAt) > Date.now();
}
