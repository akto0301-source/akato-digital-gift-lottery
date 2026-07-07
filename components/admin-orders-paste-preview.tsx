"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";

const supportedHeaders = ["交付日期", "收禮人", "送禮人", "品項", "金額", "賀卡狀態", "照片狀態", "備註"] as const;
const requiredHeaders = ["收禮人", "送禮人", "品項", "金額", "賀卡狀態", "照片狀態", "備註"] as const;
const supportedItemTypes = ["蘭花", "植物", "永生花", "落地花籃", "其他"];
const supportedCardStatuses = ["未整理", "已確認", "已印製"];
const supportedPhotoStatuses = ["未拍照", "已拍照", "已整理"];

const samplePasteText = [
  supportedHeaders.join("\t"),
  "2026-07-04\t測試收禮人 H\t範例送禮人 H\t蘭花\t6800\t未整理\t未拍照\t純 mock 預覽資料，不可配送",
  "2026-07-05\t測試收禮人 I\tMock Team I\t永生花\t3200\t已確認\t已拍照\tpreview-only sample",
].join("\n");

type BatchContext = {
  name: string;
  deliveryDate: string;
};

type PreviewOrder = {
  amount: number;
  cardStatus: string;
  deliveryDate: string;
  deliveryDateSource: "batch" | "order";
  itemType: string;
  note: string;
  orderNumber: string;
  photoStatus: string;
  recipientName: string;
  senderName: string;
};

type ParseResult = {
  errors: string[];
  orders: PreviewOrder[];
};

function normalizeHeader(value: string) {
  return value.trim();
}

function parseAmount(value: string) {
  const normalized = value.replace(/[,$，\s]/g, "");
  const amount = Number(normalized);

  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function parseTabSeparatedOrders(input: string, batchContext?: BatchContext): ParseResult {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return { errors: ["請貼上 mock/sample 表格資料。"], orders: [] };
  }

  const rows = trimmedInput
    .split(/\r?\n/)
    .map((row) => row.split("\t").map((cell) => cell.trim()))
    .filter((row) => row.some(Boolean));
  const headerRow = rows[0]?.map(normalizeHeader) ?? [];
  const errors: string[] = [];
  const orders: PreviewOrder[] = [];

  const missingHeaders = requiredHeaders.filter((header) => !headerRow.includes(header));
  const hasDeliveryDateHeader = headerRow.includes("交付日期");

  if (missingHeaders.length > 0) {
    errors.push(`缺欄位：${missingHeaders.join("、")}`);
  }

  if (rows.length <= 1) {
    errors.push("缺少訂單資料列。");
  }

  if (errors.length > 0) {
    return { errors, orders };
  }

  const headerIndexes = Object.fromEntries(
    requiredHeaders.map((header) => [header, headerRow.indexOf(header)]),
  ) as Record<(typeof requiredHeaders)[number], number>;
  const deliveryDateIndex = hasDeliveryDateHeader ? headerRow.indexOf("交付日期") : -1;

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    const rowDeliveryDate = deliveryDateIndex >= 0 ? row[deliveryDateIndex] ?? "" : "";
    const deliveryDate = rowDeliveryDate || batchContext?.deliveryDate || "";
    const deliveryDateSource = rowDeliveryDate ? "order" : "batch";
    const recipientName = row[headerIndexes["收禮人"]] ?? "";
    const senderName = row[headerIndexes["送禮人"]] ?? "";
    const itemType = row[headerIndexes["品項"]] ?? "";
    const amountText = row[headerIndexes["金額"]] ?? "";
    const cardStatus = row[headerIndexes["賀卡狀態"]] ?? "";
    const photoStatus = row[headerIndexes["照片狀態"]] ?? "";
    const note = row[headerIndexes["備註"]] ?? "";
    const amount = parseAmount(amountText);

    if (!deliveryDate || !recipientName || !senderName) {
      errors.push(`第 ${rowNumber} 列缺少交付日期、收禮人或送禮人。`);
    }

    if (amount === null) {
      errors.push(`第 ${rowNumber} 列金額格式錯誤。`);
    }

    if (!supportedItemTypes.includes(itemType)) {
      errors.push(`第 ${rowNumber} 列不支援品項：${itemType || "空白"}`);
    }

    if (!supportedCardStatuses.includes(cardStatus)) {
      errors.push(`第 ${rowNumber} 列賀卡狀態不合法：${cardStatus || "空白"}`);
    }

    if (!supportedPhotoStatuses.includes(photoStatus)) {
      errors.push(`第 ${rowNumber} 列照片狀態不合法：${photoStatus || "空白"}`);
    }

    if (amount !== null && supportedItemTypes.includes(itemType) && supportedCardStatuses.includes(cardStatus) && supportedPhotoStatuses.includes(photoStatus)) {
      orders.push({
        amount,
        cardStatus,
        deliveryDate,
        deliveryDateSource,
        itemType,
        note,
        orderNumber: `PREVIEW-${String(index + 1).padStart(3, "0")}`,
        photoStatus,
        recipientName,
        senderName,
      });
    }
  });

  return { errors, orders: errors.length > 0 ? [] : orders };
}

function formatPreviewAmount(amount: number) {
  return new Intl.NumberFormat("zh-TW", {
    currency: "TWD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function AdminOrdersPastePreview({ batchContext }: { batchContext?: BatchContext }) {
  const [draft, setDraft] = useState("");
  const [parseRequested, setParseRequested] = useState(false);
  const parseResult = useMemo(() => (parseRequested ? parseTabSeparatedOrders(draft, batchContext) : { errors: [], orders: [] }), [batchContext, draft, parseRequested]);

  return (
    <section className={styles.pastePreview} aria-label="貼上表格預覽">
      <div className={styles.pastePreviewHeader}>
        <div>
          <span>Step 4 / Browser-memory preview</span>
          <h2>貼上表格預覽</h2>
          <p>Preview only. Do not paste real customer/order data here.</p>
          <small>適合從整理好的表格複製多筆 mock/sample 訂單；若日期空白，會先沿用目前批次日期。</small>
        </div>
      </div>

      <div className={styles.pastePreviewColumns} aria-label="支援欄位格式">
        {supportedHeaders.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>

      {batchContext ? (
        <div className={styles.previewBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>若表格沒有交付日期或該列空白，preview 會顯示沿用批次日期。</small>
        </div>
      ) : null}

      <label className={styles.pastePreviewInput}>
        <span>Tab-separated sample text</span>
        <textarea
          onChange={(event) => {
            setDraft(event.target.value);
            setParseRequested(false);
          }}
          placeholder={samplePasteText}
          value={draft}
        />
      </label>

      <div className={styles.pastePreviewActions}>
        <button type="button" onClick={() => setParseRequested(true)}>解析預覽</button>
        <button
          type="button"
          onClick={() => {
            setDraft("");
            setParseRequested(false);
          }}
        >
          清除
        </button>
      </div>

      {parseRequested && parseResult.errors.length > 0 ? (
        <div className={styles.pastePreviewErrors} role="status">
          <strong>解析錯誤</strong>
          <ul>
            {parseResult.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parseResult.orders.length > 0 ? (
        <div className={styles.pastePreviewResults}>
          {parseResult.orders.map((order) => (
            <article key={order.orderNumber}>
              <div>
                <strong>{order.orderNumber}</strong>
                <span>{order.deliveryDate}</span>
              </div>
              <p>{order.recipientName}</p>
              <dl>
                <div><dt>日期來源</dt><dd>{order.deliveryDateSource === "batch" ? "沿用批次日期" : "單筆日期"}</dd></div>
                <div><dt>送禮人</dt><dd>{order.senderName}</dd></div>
                <div><dt>品項</dt><dd>{order.itemType}</dd></div>
                <div><dt>金額</dt><dd>{formatPreviewAmount(order.amount)}</dd></div>
                <div><dt>賀卡</dt><dd>{order.cardStatus}</dd></div>
                <div><dt>照片</dt><dd>{order.photoStatus}</dd></div>
                <div><dt>備註</dt><dd>{order.note || "無 mock 備註"}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
