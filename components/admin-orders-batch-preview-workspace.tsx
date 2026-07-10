"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";
import { AdminOrdersCardTextPreview } from "@/components/admin-orders-card-text-preview";
import { AdminOrdersCheckCardPreview } from "@/components/admin-orders-check-card-preview";
import { AdminOrdersGoogleFormPreview } from "@/components/admin-orders-google-form-preview";
import { AdminOrdersLineMessagePreview } from "@/components/admin-orders-line-message-preview";
import { AdminOrdersPastePreview } from "@/components/admin-orders-paste-preview";

type MockShipmentBatch = {
  id: string;
  name: string;
  deliveryDate: string;
  expectedCount: number;
  organizedCount: number;
  cardsNeedConfirmation: number;
  missingItemOrAmount: number;
  unphotographedCount: number;
  context: string;
  pressureStatus: "整理中" | "高峰" | "接近出貨";
  notes?: string;
};

export type BatchContext = {
  name: string;
  deliveryDate: string;
};

const mockShipmentBatches: MockShipmentBatch[] = [
  {
    id: "mock-2026-06-23-promotion",
    name: "2026-06-23 升遷賀禮批次",
    deliveryDate: "2026-06-23",
    expectedCount: 50,
    organizedCount: 38,
    cardsNeedConfirmation: 6,
    missingItemOrAmount: 2,
    unphotographedCount: 14,
    context: "Mock Bank 升遷賀禮",
    pressureStatus: "接近出貨",
    notes: "Mock preview batch. Used to test grouped delivery context only.",
  },
  {
    id: "mock-2026-06-29-promotion",
    name: "2026-06-29 升遷賀禮批次",
    deliveryDate: "2026-06-29",
    expectedCount: 80,
    organizedCount: 42,
    cardsNeedConfirmation: 18,
    missingItemOrAmount: 7,
    unphotographedCount: 32,
    context: "Mock Bank 升遷賀禮",
    pressureStatus: "高峰",
    notes: "Mock preview batch. Short-window message intake pressure.",
  },
  {
    id: "mock-2026-07-02-promotion",
    name: "2026-07-02 升遷賀禮批次",
    deliveryDate: "2026-07-02",
    expectedCount: 170,
    organizedCount: 42,
    cardsNeedConfirmation: 18,
    missingItemOrAmount: 7,
    unphotographedCount: 32,
    context: "Mock Bank 升遷賀禮 / 分多車配送",
    pressureStatus: "高峰",
    notes: "Mock preview batch. High-volume grouped shipment context.",
  },
];

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function isValidDateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function AdminOrdersBatchPreviewWorkspace() {
  const [selectedBatchId, setSelectedBatchId] = useState(mockShipmentBatches[2].id);
  const [customBatchDate, setCustomBatchDate] = useState("");
  const [appliedCustomBatchDate, setAppliedCustomBatchDate] = useState("");
  const [customBatchWarning, setCustomBatchWarning] = useState("");
  const selectedBatch = mockShipmentBatches.find((batch) => batch.id === selectedBatchId) ?? mockShipmentBatches[0];
  const activeBatchDate = appliedCustomBatchDate || selectedBatch.deliveryDate;
  const activeBatchName = appliedCustomBatchDate ? `自訂 ${appliedCustomBatchDate} 出貨批次` : selectedBatch.name;
  const progress = selectedBatch.expectedCount > 0 ? selectedBatch.organizedCount / selectedBatch.expectedCount : 0;
  const batchContext = useMemo<BatchContext>(
    () => ({
      deliveryDate: activeBatchDate,
      name: activeBatchName,
    }),
    [activeBatchDate, activeBatchName],
  );

  function handleBatchChange(batchId: string) {
    setSelectedBatchId(batchId);
    setCustomBatchDate("");
    setAppliedCustomBatchDate("");
    setCustomBatchWarning("");
  }

  function applyCustomBatchDate() {
    if (!isValidDateValue(customBatchDate)) {
      setCustomBatchWarning("請輸入完整有效日期，例如 2026-07-15。");
      return;
    }

    setAppliedCustomBatchDate(customBatchDate);
    setCustomBatchWarning("");
  }

  return (
    <>
      <section className={styles.batchContext} aria-label="出貨批次 context">
        <div className={styles.batchHeader}>
          <div>
            <span>Mock shipment grouping</span>
            <h2>出貨批次 context</h2>
            <p>Mock only. 先選目前核單批次，再用下方預覽工具檢查 LINE、Google Form、表格與賀卡文字。</p>
          </div>
          <label>
            <span>目前批次</span>
            <select value={selectedBatch.id} onChange={(event) => handleBatchChange(event.target.value)}>
              {mockShipmentBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.customBatchControl}>
          <div>
            <span>自訂出貨批次日期</span>
            <p>Mock only / Browser-memory only. 可以臨時套用不同出貨日給下方 preview；重新整理後會消失。</p>
          </div>
          <label>
            <span>出貨日期</span>
            <input
              type="date"
              value={customBatchDate}
              onChange={(event) => {
                setCustomBatchDate(event.target.value);
                setCustomBatchWarning("");
              }}
            />
          </label>
          <button type="button" onClick={applyCustomBatchDate}>套用這個日期</button>
          {customBatchWarning ? <p className={styles.customBatchWarning}>{customBatchWarning}</p> : null}
          {appliedCustomBatchDate ? (
            <p className={styles.customBatchApplied}>目前 preview 已沿用自訂日期：{appliedCustomBatchDate}</p>
          ) : null}
        </div>

        <div className={styles.batchOverview}>
          <article>
            <span>出貨日</span>
            <strong>{activeBatchDate}</strong>
          </article>
          <article>
            <span>預估盆數</span>
            <strong>{selectedBatch.expectedCount}</strong>
          </article>
          <article>
            <span>整理進度</span>
            <strong>{selectedBatch.organizedCount} / {selectedBatch.expectedCount}</strong>
          </article>
          <article>
            <span>待確認賀卡</span>
            <strong>{selectedBatch.cardsNeedConfirmation}</strong>
          </article>
          <article>
            <span>缺品項 / 缺金額</span>
            <strong>{selectedBatch.missingItemOrAmount}</strong>
          </article>
          <article>
            <span>未拍照</span>
            <strong>{selectedBatch.unphotographedCount}</strong>
          </article>
        </div>

        <div className={styles.batchProgress}>
          <div>
            <span>Mock 整理進度</span>
            <strong>{formatPercent(progress)}</strong>
          </div>
          <div className={styles.batchProgressTrack} aria-hidden="true">
            <span style={{ width: formatPercent(progress) }} />
          </div>
        </div>

        <dl className={styles.batchDetails}>
          <div><dt>壓力狀態</dt><dd>{selectedBatch.pressureStatus}整理中</dd></div>
          <div><dt>批次情境</dt><dd>{selectedBatch.context}</dd></div>
          <div><dt>備註</dt><dd>{selectedBatch.notes ?? "Mock preview only."}</dd></div>
          <div><dt>資料狀態</dt><dd>只存在瀏覽器記憶體，重新整理後 preview 會消失</dd></div>
        </dl>
      </section>

      <section className={styles.previewWorkflowGuide} aria-label="預覽工作流程說明">
        <div>
          <span>Preview workflow</span>
          <h2>核單預覽動線</h2>
          <p>依序從最常見的 LINE 訊息開始，再檢查 Google Form 回覆、表格資料與賀卡文字；所有區塊都只是 mock preview。</p>
        </div>
        <ol>
          <li><strong>1</strong><span>選批次</span></li>
          <li><strong>2</strong><span>貼來源</span></li>
          <li><strong>3</strong><span>看 warning</span></li>
          <li><strong>4</strong><span>人工確認</span></li>
        </ol>
      </section>

      <AdminOrdersLineMessagePreview batchContext={batchContext} />

      <AdminOrdersGoogleFormPreview batchContext={batchContext} />

      <AdminOrdersCheckCardPreview batchContext={batchContext} />

      <AdminOrdersPastePreview batchContext={batchContext} />

      <AdminOrdersCardTextPreview batchContext={batchContext} />
    </>
  );
}
