import { promises as fs } from "node:fs";
import path from "node:path";
import { customAlphabet } from "nanoid";

export type GiftLocale = "zh" | "ja";

export type GiftRecord = {
  from: string;
  to: string;
  message: string;
  locale?: GiftLocale;
  createdAt: string;
};

const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const createId = customAlphabet(alphabet, 10);
const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "gift-links.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "{}\n", "utf8");
  }
}

async function readStore(): Promise<Record<string, GiftRecord>> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");

  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw) as Record<string, GiftRecord>;
}

async function writeStore(store: Record<string, GiftRecord>) {
  await fs.writeFile(dataFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function createGiftRecord(input: Omit<GiftRecord, "createdAt">) {
  const store = await readStore();
  const id = createId();

  store[id] = {
    ...input,
    locale: input.locale ?? "zh",
    createdAt: new Date().toISOString(),
  };

  await writeStore(store);

  return id;
}

export async function getGiftRecord(id: string) {
  const store = await readStore();
  return store[id] ?? null;
}
