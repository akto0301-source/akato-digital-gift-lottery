import contentLibrary from "@/data/content-library.json";

export type ContentLot = {
  id: string;
  order: number;
  label: string;
  title: string;
  theme: string;
  blessing?: string;
  giftIntent: string;
  suggestion: string;
  wish: string;
  fortune?: string;
  category?: string;
  tags?: string[];
  image?: string;
  active?: boolean;
};

export type ContentLibrary = {
  meta: {
    title: string;
    subtitle: string;
    ctaLabel?: string;
  };
  lots: ContentLot[];
  fallbackMessages: {
    empty: string;
    error: string;
    defaultReply: string;
  };
};

const library = contentLibrary as ContentLibrary;

export function getContentLibrary(): ContentLibrary {
  return library;
}

export function getAllLots(): ContentLot[] {
  return [...library.lots]
    .filter((lot) => lot.active !== false)
    .sort((a, b) => a.order - b.order);
}

export function getRandomLot(): ContentLot | null {
  const lots = getAllLots();

  if (!lots.length) {
    return null;
  }

  const index = Math.floor(Math.random() * lots.length);
  return lots[index] ?? null;
}

export function formatLotReply(lot: ContentLot): string {
  return [
    "✨ Akato 今日祝福籤 ✨",
    "",
    `${lot.label}｜${lot.title}`,
    "",
    "主題：",
    lot.theme,
    "",
    "祝福：",
    lot.giftIntent,
    "",
    "回禮心意：",
    lot.suggestion,
    "",
    "今日建議：",
    lot.wish,
    "",
    "願你：",
    lot.blessing?.trim() || lot.wish,
  ].join("\n");
}
