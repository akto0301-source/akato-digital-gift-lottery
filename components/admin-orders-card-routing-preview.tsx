"use client";

import styles from "@/app/admin/orders/admin-orders.module.css";
import type { BatchContext } from "@/components/admin-orders-batch-preview-workspace";
import type { ProductionCard } from "@/components/admin-orders-card-production-preview";

type RoutingBucket = {
  id: string;
  routeName: string;
  owner: string;
  count: number;
  itemType: string;
  summaries: string[];
  notes: string[];
  linePreview: string;
  tone: "inside" | "orchid" | "plant" | "manual";
};

const mockRoutingBuckets: RoutingBucket[] = [
  {
    id: "inside-card-typing",
    routeName: "店內自出",
    owner: "給珊珊打卡片",
    count: 8,
    itemType: "蘭花 / 永生花 / 店內整理",
    summaries: [
      "第 1 張｜測試經理 淑真｜榮任誌慶｜5000 蘭花",
      "第 2 張｜測試主任 安平｜喬遷誌慶｜2500 永生花",
    ],
    notes: ["店內出貨，賀卡內容可先交給打字人員。", "同名收禮人仍需核對是否為不同賀卡。"],
    linePreview: [
      "珊珊，這批 mock 店內自出賀卡先看這 8 張：",
      "1. 測試經理 淑真｜榮任誌慶｜5000 蘭花",
      "2. 測試主任 安平｜喬遷誌慶｜2500 永生花",
      "請人工確認後再照完整賀卡內容打卡片。",
    ].join("\n"),
    tone: "inside",
  },
  {
    id: "market-orchid",
    routeName: "落地蘭花",
    owner: "給花市蘭花攤商",
    count: 14,
    itemType: "落地蘭 / 蘭花",
    summaries: [
      "第 9 張｜測試副總 柏安｜榮陞誌慶｜6000 落地蘭",
      "第 10 張｜測試處長 之寧｜榮任誌慶｜7500 蘭花",
    ],
    notes: ["品項含蘭或落地蘭，先放入蘭花攤商文字包。", "金額與指定色系仍要人工核對。"],
    linePreview: [
      "蘭花攤商 mock 預覽，尚未傳送 LINE：",
      "出貨批次請看目前批次日期。",
      "1. 測試副總 柏安｜榮陞誌慶｜6000 落地蘭",
      "2. 測試處長 之寧｜榮任誌慶｜7500 蘭花",
      "請確認品項、金額、賀卡文字後再使用。",
    ].join("\n"),
    tone: "orchid",
  },
  {
    id: "market-plant",
    routeName: "落地植物",
    owner: "給花市植物攤商",
    count: 5,
    itemType: "落地植 / 落地植物",
    summaries: [
      "第 23 張｜測試協理 佑庭｜開幕誌慶｜3500 落地植物",
      "第 24 張｜測試店長 宜芳｜平安順心｜3000 落地植",
    ],
    notes: ["品項明確寫落地植或落地植物，才放入植物攤商文字包。", "一般植物或盆栽先留在店內自出，避免誤分派。"],
    linePreview: [
      "植物攤商 mock 預覽，尚未傳送 LINE：",
      "1. 測試協理 佑庭｜開幕誌慶｜3500 落地植物",
      "2. 測試店長 宜芳｜平安順心｜3000 落地植",
      "請人工確認尺寸與備註後再使用。",
    ].join("\n"),
    tone: "plant",
  },
  {
    id: "manual-check",
    routeName: "需人工判斷",
    owner: "先留在核單人員手上",
    count: 6,
    itemType: "品項不明 / 金額不明 / 路線不明",
    summaries: [
      "第 29 張｜請人工確認收禮人｜賀詞缺漏｜金額不明",
      "第 30 張｜測試經理 淑真｜同一收禮人多張卡｜品項需確認",
    ],
    notes: ["品項、金額或路線不明時，不放進任何對外文字包。", "同一收禮人多張賀卡要確認是多張卡，還是重複資料。"],
    linePreview: [
      "人工判斷清單 mock 預覽：",
      "1. 收禮人不明｜缺金額｜不要分派",
      "2. 測試經理 淑真｜同一收禮人多張卡｜請核對是否重複",
      "確認完成前不給店內或攤商使用。",
    ].join("\n"),
    tone: "manual",
  },
];

function formatCardSummary(card: ProductionCard, index: number) {
  const recipient = card.recipientName || "請人工確認收禮人";
  const phrase = card.blessingPhrase || "賀詞需確認";
  const amountNote = card.amountNote || "金額品項需確認";

  return `第 ${index + 1} 張｜${recipient}｜${phrase}｜${amountNote}`;
}

function buildLinePreview(owner: string, cards: ProductionCard[], indexes: number[]) {
  const previewLines = indexes.slice(0, 4).map((cardIndex) => `${cardIndex + 1}. ${formatCardSummary(cards[cardIndex], cardIndex)}`);

  return [
    `${owner} mock 文字包預覽，尚未傳送 LINE：`,
    ...previewLines,
    "請人工確認賀卡內容、品項、金額與路線後再使用。",
  ].join("\n");
}

function createEmptyBucket(
  id: string,
  routeName: string,
  owner: string,
  itemType: string,
  tone: RoutingBucket["tone"],
  fallbackNote: string,
): RoutingBucket & { indexes: number[] } {
  return {
    id,
    routeName,
    owner,
    count: 0,
    itemType,
    summaries: [],
    notes: [fallbackNote],
    linePreview: `${owner} mock 文字包預覽：目前沒有來自賀卡製作預覽的卡片。`,
    tone,
    indexes: [],
  };
}

function hasManualWarning(card: ProductionCard) {
  return (
    card.status === "需人工確認" ||
    !card.amountNote ||
    card.itemType === "其他" ||
    card.itemType === "請人工確認" ||
    card.warnings.some((warning) => warning.includes("同一收禮人") || warning.includes("品項") || warning.includes("缺"))
  );
}

function routeProductionCard(card: ProductionCard) {
  if (hasManualWarning(card)) return "manual-check";
  if (card.amountNote.includes("落地植")) return "market-plant";
  if (card.amountNote.includes("落地蘭")) return "market-orchid";
  return "inside-card-typing";
}

function createBucketsFromProductionCards(cards: ProductionCard[]): RoutingBucket[] {
  const buckets = [
    createEmptyBucket("inside-card-typing", "店內自出", "給珊珊打卡片", "店內自出 / 其他可打卡", "inside", "沒有店內自出卡片。"),
    createEmptyBucket("market-orchid", "落地蘭花", "給花市蘭花攤商", "落地蘭 / 蘭花", "orchid", "沒有蘭花攤商卡片。"),
    createEmptyBucket("market-plant", "落地植物", "給花市植物攤商", "落地植 / 落地植物", "plant", "沒有植物攤商卡片。"),
    createEmptyBucket("manual-check", "需人工判斷", "先留在核單人員手上", "品項不明 / 金額不明 / 路線不明", "manual", "目前沒有需要人工判斷的卡片。"),
  ];
  const bucketMap = new Map(buckets.map((bucket) => [bucket.id, bucket]));

  cards.forEach((card, index) => {
    const bucket = bucketMap.get(routeProductionCard(card)) ?? bucketMap.get("manual-check");
    if (!bucket) return;

    bucket.indexes.push(index);
    bucket.summaries.push(formatCardSummary(card, index));
  });

  return buckets.map((bucket) => ({
    ...bucket,
    count: bucket.indexes.length,
    notes:
      bucket.indexes.length > 0
        ? [
            "這個分流來自目前賀卡製作預覽，只存在瀏覽器記憶體。",
            bucket.id === "manual-check" ? "人工判斷卡片不放入對外文字包。" : "正式使用前仍需人工確認完整賀卡內容。",
          ]
        : bucket.notes,
    linePreview: bucket.indexes.length > 0 ? buildLinePreview(bucket.owner, cards, bucket.indexes) : bucket.linePreview,
  }));
}

function getToneClass(tone: RoutingBucket["tone"]) {
  if (tone === "inside") return styles.cardRouteInside;
  if (tone === "orchid") return styles.cardRouteOrchid;
  if (tone === "plant") return styles.cardRoutePlant;
  return styles.cardRouteManual;
}

export function AdminOrdersCardRoutingPreview({
  batchContext,
  productionCards = [],
}: {
  batchContext?: BatchContext;
  productionCards?: ProductionCard[];
}) {
  const hasProductionCards = productionCards.length > 0;
  const routingBuckets = hasProductionCards ? createBucketsFromProductionCards(productionCards) : mockRoutingBuckets;
  const totalCards = routingBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const manualCards = routingBuckets.find((bucket) => bucket.id === "manual-check")?.count ?? 0;

  return (
    <section className={styles.cardRoutingPreview} aria-label="賀卡分流預覽">
      <div className={styles.cardRoutingHeader}>
        <div>
          <span>Mock routing / Browser-memory preview</span>
          <h2>賀卡分流預覽</h2>
          <p>Mock only. 這裡只示範賀卡整理後可能交給誰處理，尚未傳送 LINE，也不會產生正式分派。</p>
          <small>
            {hasProductionCards
              ? "目前使用賀卡製作預覽的 browser-memory 結果分流；重新整理後會消失。"
              : "尚未解析賀卡時先顯示 mock example；需要人工確認後才可以使用。"}
          </small>
        </div>
      </div>

      {batchContext ? (
        <div className={styles.previewBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>分流預覽會沿用目前批次日期作為核對提示，不會寫入資料。</small>
        </div>
      ) : null}

      <div className={styles.cardRoutingSummary}>
        <article><span>預覽張數</span><strong>{totalCards}</strong></article>
        <article><span>分流路線</span><strong>{routingBuckets.length}</strong></article>
        <article><span>人工判斷</span><strong>{manualCards}</strong></article>
      </div>

      <div className={styles.cardRouteGrid}>
        {routingBuckets.map((bucket) => (
          <details key={bucket.id} className={`${styles.cardRouteBucket} ${getToneClass(bucket.tone)}`}>
            <summary className={styles.cardRouteTopline}>
              <div>
                <span>路線</span>
                <h3>{bucket.routeName}</h3>
              </div>
              <strong>{bucket.count} 張</strong>
            </summary>

            <dl className={styles.cardRouteMeta}>
              <div><dt>負責對象</dt><dd>{bucket.owner}</dd></div>
              <div><dt>品項類型</dt><dd>{bucket.itemType}</dd></div>
            </dl>

            <div className={styles.cardRouteList}>
              <strong>mock 賀卡摘要</strong>
              <ul>
                {bucket.summaries.map((summary) => (
                  <li key={summary}>{summary}</li>
                ))}
              </ul>
            </div>

            <div className={styles.cardRouteWarnings}>
              <strong>注意事項</strong>
              <ul>
                {bucket.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <details className={styles.cardRouteLinePreview}>
              <summary>LINE 訊息包預覽</summary>
              <span>尚未傳送 LINE / 需要人工確認後才可以使用</span>
              <pre>{bucket.linePreview}</pre>
            </details>
          </details>
        ))}
      </div>
    </section>
  );
}
