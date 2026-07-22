import { NextResponse } from "next/server";
import { buildGiftUrl, createGiftRecord, type GiftLocale, type GiftLotSnapshot } from "@/lib/gift-links";
import { getAllLots, type ContentLot } from "@/lib/content";
import { blessingCards } from "@/lib/i18n";
import { sceneMap, type SceneId } from "@/lib/scene-map";

const MAX_BODY_LENGTH = 12_000;
const MAX_NAME_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_ID_LENGTH = 80;
const MAX_LOT_SNAPSHOT_LENGTH = 5000;

const validCardIds = new Set(blessingCards.map((card) => card.id));
const validSceneIds = new Set(Object.keys(sceneMap));

type GiftLinkBody = {
  from?: unknown;
  fromName?: unknown;
  to?: unknown;
  toName?: unknown;
  message?: unknown;
  locale?: unknown;
  cardId?: unknown;
  sceneId?: unknown;
  lotKey?: unknown;
  lotSnapshot?: unknown;
};

function validationError(message = "Invalid gift link request.") {
  return NextResponse.json({ error: message }, { status: 400 });
}

function getTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalTrimmedString(value: unknown) {
  if (value == null) {
    return null;
  }

  return typeof value === "string" ? value.trim() : "";
}

function isLengthInRange(value: string, min: number, max: number) {
  return value.length >= min && value.length <= max;
}

function sanitizeSceneId(value: unknown) {
  const sceneId = getOptionalTrimmedString(value);

  if (!sceneId) {
    return null;
  }

  if (sceneId.length > MAX_ID_LENGTH || !validSceneIds.has(sceneId)) {
    return undefined;
  }

  return sceneId as SceneId;
}

function sanitizeCardId(value: unknown) {
  const cardId = getOptionalTrimmedString(value);

  if (!cardId) {
    return null;
  }

  if (cardId.length > MAX_ID_LENGTH || !validCardIds.has(cardId)) {
    return undefined;
  }

  return cardId;
}

function sanitizeLotSnapshot(lot: ContentLot): GiftLotSnapshot {
  return {
    id: lot.id,
    order: lot.order,
    label: lot.label,
    title: lot.title,
    fortune: lot.fortune,
    blessing: lot.blessing,
    category: lot.category,
    flowerName: lot.flowerName,
    flowerIllustration: lot.flowerIllustration,
    flowerAlt: lot.flowerAlt,
  };
}

function resolveLot(body: GiftLinkBody) {
  const rawLotKey = getOptionalTrimmedString(body.lotKey);
  const lotSnapshot = body.lotSnapshot;

  if (lotSnapshot != null && JSON.stringify(lotSnapshot).length > MAX_LOT_SNAPSHOT_LENGTH) {
    return { error: "Invalid lot snapshot." };
  }

  if (lotSnapshot != null && (typeof lotSnapshot !== "object" || Array.isArray(lotSnapshot))) {
    return { error: "Invalid lot snapshot." };
  }

  const snapshotId =
    lotSnapshot && typeof lotSnapshot === "object" && "id" in lotSnapshot
      ? getOptionalTrimmedString((lotSnapshot as { id?: unknown }).id)
      : null;
  const lotKey = rawLotKey || snapshotId;

  if (!lotKey) {
    return { lotKey: null, lotSnapshot: null };
  }

  if (lotKey.length > MAX_ID_LENGTH) {
    return { error: "Invalid lot key." };
  }

  const lot = getAllLots().find((candidate) => candidate.id === lotKey);

  if (!lot) {
    return { error: "Invalid lot key." };
  }

  return {
    lotKey: lot.id,
    lotSnapshot: sanitizeLotSnapshot(lot),
  };
}

export async function POST(request: Request) {
  let rawBody = "";

  try {
    rawBody = await request.text();
  } catch {
    return validationError();
  }

  if (rawBody.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let body: GiftLinkBody;

  try {
    body = JSON.parse(rawBody) as GiftLinkBody;
  } catch {
    return validationError("Invalid JSON.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return validationError();
  }

  const fromName = getTrimmedString(body.fromName ?? body.from);
  const toName = getTrimmedString(body.toName ?? body.to);
  const message = getTrimmedString(body.message);

  if (!isLengthInRange(fromName, 1, MAX_NAME_LENGTH) || !isLengthInRange(toName, 1, MAX_NAME_LENGTH)) {
    return validationError("Invalid name fields.");
  }

  if (!isLengthInRange(message, 1, MAX_MESSAGE_LENGTH)) {
    return validationError("Invalid message field.");
  }

  if (body.locale !== "zh" && body.locale !== "ja") {
    return validationError("Invalid locale.");
  }

  const cardId = sanitizeCardId(body.cardId);

  if (cardId === undefined) {
    return validationError("Invalid card id.");
  }

  const sceneId = sanitizeSceneId(body.sceneId);

  if (sceneId === undefined) {
    return validationError("Invalid scene id.");
  }

  const resolvedLot = resolveLot(body);

  if ("error" in resolvedLot) {
    return validationError(resolvedLot.error);
  }

  try {
    const id = await createGiftRecord({
      fromName,
      toName,
      message,
      locale: body.locale as GiftLocale,
      cardId,
      sceneId,
      lotKey: resolvedLot.lotKey,
      lotSnapshot: resolvedLot.lotSnapshot,
    });

    return NextResponse.json({ id, url: buildGiftUrl(id, new URL(request.url).origin) });
  } catch {
    return NextResponse.json({ error: "Unable to create gift link." }, { status: 500 });
  }
}
