"use client";

import styles from "@/app/admin/orders/admin-orders.module.css";
import type { BatchContext } from "@/components/admin-orders-batch-preview-workspace";

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
    itemType: "植物 / 盆栽 / 落地植物",
    summaries: [
      "第 23 張｜測試協理 佑庭｜開幕誌慶｜3500 植物",
      "第 24 張｜測試店長 宜芳｜平安順心｜3000 盆栽",
    ],
    notes: ["品項含植物或盆栽，先放入植物攤商文字包。", "尺寸、盆器、配送地點需人工確認。"],
    linePreview: [
      "植物攤商 mock 預覽，尚未傳送 LINE：",
      "1. 測試協理 佑庭｜開幕誌慶｜3500 植物",
      "2. 測試店長 宜芳｜平安順心｜3000 盆栽",
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

function getToneClass(tone: RoutingBucket["tone"]) {
  if (tone === "inside") return styles.cardRouteInside;
  if (tone === "orchid") return styles.cardRouteOrchid;
  if (tone === "plant") return styles.cardRoutePlant;
  return styles.cardRouteManual;
}

export function AdminOrdersCardRoutingPreview({ batchContext }: { batchContext?: BatchContext }) {
  const totalCards = mockRoutingBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const manualCards = mockRoutingBuckets.find((bucket) => bucket.id === "manual-check")?.count ?? 0;

  return (
    <section className={styles.cardRoutingPreview} aria-label="賀卡分流預覽">
      <div className={styles.cardRoutingHeader}>
        <div>
          <span>Mock routing / Browser-memory preview</span>
          <h2>賀卡分流預覽</h2>
          <p>Mock only. 這裡只示範賀卡整理後可能交給誰處理，尚未傳送 LINE，也不會產生正式分派。</p>
          <small>需要人工確認後才可以使用；重新整理後 preview 會消失。</small>
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
        <article><span>分流路線</span><strong>{mockRoutingBuckets.length}</strong></article>
        <article><span>人工判斷</span><strong>{manualCards}</strong></article>
      </div>

      <div className={styles.cardRouteGrid}>
        {mockRoutingBuckets.map((bucket) => (
          <article key={bucket.id} className={`${styles.cardRouteBucket} ${getToneClass(bucket.tone)}`}>
            <div className={styles.cardRouteTopline}>
              <div>
                <span>路線</span>
                <h3>{bucket.routeName}</h3>
              </div>
              <strong>{bucket.count} 張</strong>
            </div>

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

            <div className={styles.cardRouteLinePreview}>
              <strong>LINE 訊息包預覽</strong>
              <span>尚未傳送 LINE / 需要人工確認後才可以使用</span>
              <pre>{bucket.linePreview}</pre>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
