"use client";

import styles from "@/app/admin/orders/admin-orders.module.css";
import type { BatchContext } from "@/components/admin-orders-batch-preview-workspace";

type MockCheckCard = {
  id: string;
  recipientName: string;
  senderLabel: string;
  itemType: string;
  amountLabel: string;
  deliveryDate?: string;
  checkStatus: "可核對" | "需補資料" | "需人工判斷";
  cardCompletion: "賀卡完整" | "賀卡待確認" | "賀卡未完成";
  cardTextStatus: "已整理" | "待確認" | "未完成";
  amountSource: "LINE 金額" | "Google Form 金額" | "表格金額" | "缺金額";
  source: "LINE" | "Google Form" | "貼上表格";
  warnings: string[];
};

const mockCheckCards: MockCheckCard[] = [
  {
    id: "mock-check-line-001",
    recipientName: "測試收禮人 A",
    senderLabel: "Mock Gift Co. / 範例送禮人 B",
    itemType: "蘭花",
    amountLabel: "$5,000",
    checkStatus: "需人工判斷",
    cardCompletion: "賀卡待確認",
    cardTextStatus: "待確認",
    amountSource: "LINE 金額",
    source: "LINE",
    warnings: ["賀卡文字需人工確認", "地址欄位待核對"],
  },
  {
    id: "mock-check-form-002",
    recipientName: "測試收禮人 C",
    senderLabel: "Mock Bank 測試分行",
    itemType: "植物",
    amountLabel: "$3,200",
    deliveryDate: "2026-07-03",
    checkStatus: "需補資料",
    cardCompletion: "賀卡未完成",
    cardTextStatus: "未完成",
    amountSource: "Google Form 金額",
    source: "Google Form",
    warnings: ["送達日期與目前批次不同", "賀卡文字未完成"],
  },
  {
    id: "mock-check-table-003",
    recipientName: "測試收禮人 E",
    senderLabel: "範例送禮單位 D",
    itemType: "其他",
    amountLabel: "待確認",
    checkStatus: "需補資料",
    cardCompletion: "賀卡完整",
    cardTextStatus: "已整理",
    amountSource: "缺金額",
    source: "貼上表格",
    warnings: ["金額不明", "品項需確認"],
  },
];

function getStatusTone(status: MockCheckCard["cardTextStatus"]) {
  if (status === "已整理") return styles.checkCardStatusDone;
  if (status === "待確認") return styles.checkCardStatusPending;
  return styles.checkCardStatusMissing;
}

function getCheckStatusTone(status: MockCheckCard["checkStatus"]) {
  if (status === "可核對") return styles.checkCardTagGood;
  if (status === "需人工判斷") return styles.checkCardTagCaution;
  return styles.checkCardTagMissing;
}

function getCompletionTone(completion: MockCheckCard["cardCompletion"]) {
  if (completion === "賀卡完整") return styles.checkCardTagGood;
  if (completion === "賀卡待確認") return styles.checkCardTagCaution;
  return styles.checkCardTagMissing;
}

function getAmountSourceTone(source: MockCheckCard["amountSource"]) {
  return source === "缺金額" ? styles.checkCardTagMissing : styles.checkCardTagNeutral;
}

export function AdminOrdersCheckCardPreview({ batchContext }: { batchContext?: BatchContext }) {
  return (
    <section className={styles.checkCardPreview} aria-label="核對卡片預覽">
      <div className={styles.checkCardHeader}>
        <div>
          <span>Mock check cards / Browser-memory preview</span>
          <h2>核對卡片預覽</h2>
          <p>Preview only. Do not paste real customer/order data here.</p>
          <small>把不同來源整理成同一種人工核單小卡；這裡只展示未來視覺格式，不會保存或合併資料。</small>
        </div>
      </div>

      {batchContext ? (
        <div className={styles.checkCardBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>未填單筆日期時，小卡會先顯示沿用批次日期的樣子。</small>
        </div>
      ) : null}

      <div className={styles.checkCardGrid}>
        {mockCheckCards.map((card) => {
          const effectiveDeliveryDate = card.deliveryDate ?? batchContext?.deliveryDate ?? "需人工確認";
          const dateSource = card.deliveryDate ? "單筆日期" : batchContext ? "沿用批次日期" : "缺少日期";
          const dateSourceTone = card.deliveryDate || batchContext ? styles.checkCardTagNeutral : styles.checkCardTagMissing;

          return (
            <article key={card.id} className={styles.checkCard}>
              <div className={styles.checkCardTopline}>
                <span>{card.source}</span>
                <strong>{dateSource}</strong>
              </div>

              <div className={styles.checkCardMain}>
                <h3>{card.recipientName}</h3>
                <p>{card.senderLabel}</p>
              </div>

              <div className={styles.checkCardTags} aria-label="人工核單判斷標籤">
                <span className={getCheckStatusTone(card.checkStatus)}>核對狀態：{card.checkStatus}</span>
                <span className={getCompletionTone(card.cardCompletion)}>卡片完成度：{card.cardCompletion}</span>
                <span className={dateSourceTone}>日期來源：{dateSource}</span>
                <span className={getAmountSourceTone(card.amountSource)}>金額來源：{card.amountSource}</span>
              </div>

              <dl>
                <div><dt>品項</dt><dd>{card.itemType}</dd></div>
                <div><dt>金額</dt><dd>{card.amountLabel}</dd></div>
                <div><dt>送達日期</dt><dd>{effectiveDeliveryDate}</dd></div>
                <div>
                  <dt>賀卡文字</dt>
                  <dd><span className={getStatusTone(card.cardTextStatus)}>{card.cardTextStatus}</span></dd>
                </div>
              </dl>

              <div className={styles.checkCardWarnings}>
                <strong>人工核對提醒</strong>
                <ul>
                  {card.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
