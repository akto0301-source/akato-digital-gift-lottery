"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";
import { AdminOrdersCardTextPreview } from "@/components/admin-orders-card-text-preview";
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

export function AdminOrdersBatchPreviewWorkspace() {
  const [selectedBatchId, setSelectedBatchId] = useState(mockShipmentBatches[2].id);
  const selectedBatch = mockShipmentBatches.find((batch) => batch.id === selectedBatchId) ?? mockShipmentBatches[0];
  const progress = selectedBatch.expectedCount > 0 ? selectedBatch.organizedCount / selectedBatch.expectedCount : 0;
  const batchContext = useMemo<BatchContext>(
    () => ({
      deliveryDate: selectedBatch.deliveryDate,
      name: selectedBatch.name,
    }),
    [selectedBatch.deliveryDate, selectedBatch.name],
  );

  return (
    <>
      <section className={styles.batchContext} aria-label="出貨批次 context">
        <div className={styles.batchHeader}>
          <div>
            <span>Mock shipment grouping</span>
            <h2>出貨批次 context</h2>
            <p>Mock only. This batch context helps preview order grouping and workload pressure. It is not saved.</p>
          </div>
          <label>
            <span>目前批次</span>
            <select value={selectedBatch.id} onChange={(event) => setSelectedBatchId(event.target.value)}>
              {mockShipmentBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.batchOverview}>
          <article>
            <span>出貨日</span>
            <strong>{selectedBatch.deliveryDate}</strong>
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
          <div><dt>保存狀態</dt><dd>重新整理後不會保存 preview 資料</dd></div>
        </dl>
      </section>

      <AdminOrdersLineMessagePreview batchContext={batchContext} />

      <AdminOrdersPastePreview batchContext={batchContext} />

      <AdminOrdersCardTextPreview batchContext={batchContext} />
    </>
  );
}
