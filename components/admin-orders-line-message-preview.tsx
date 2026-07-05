"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";
import type { BatchContext } from "@/components/admin-orders-batch-preview-workspace";

const MOCK_YEAR = 2026;
const titles = ["經理", "處長", "主任", "副總", "董事長", "總經理", "協理", "老師", "醫師"];
const organizationKeywords = ["公司", "銀行", "分行", "部門", "單位"];

const sampleLineMessage = `7/6 幫我送一盆蘭花給 測試公司 王經理
金額 5000
送禮人：Mock Gift Co. 陳先生
賀卡寫：祝 王經理 榮陞誌慶
地址：測試市測試路 123 號`;

type DateParseResult = {
  date: string;
  hasExplicitYear: boolean;
};

type LineMessagePreview = {
  address: string;
  amount: number | null;
  cardText: string;
  dateSource: "batch" | "line" | "missing";
  deliveryDate: string;
  itemType: string;
  note: string;
  originalMessage: string;
  recipientName: string;
  recipientOrganization: string;
  senderName: string;
  warnings: string[];
};

type ParseResult = {
  errors: string[];
  preview: LineMessagePreview | null;
};

function normalizeDate(year: number, month: number, day: number) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function parseLineDate(input: string): DateParseResult | null {
  const isoMatch = input.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);

  if (isoMatch) {
    return {
      date: normalizeDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3])),
      hasExplicitYear: true,
    };
  }

  const fullSlashMatch = input.match(/\b(20\d{2})\/(\d{1,2})\/(\d{1,2})\b/);

  if (fullSlashMatch) {
    return {
      date: normalizeDate(Number(fullSlashMatch[1]), Number(fullSlashMatch[2]), Number(fullSlashMatch[3])),
      hasExplicitYear: true,
    };
  }

  const slashMatch = input.match(/(?:^|[^\d])(\d{1,2})\/(\d{1,2})(?:[^\d]|$)/);

  if (slashMatch) {
    return {
      date: normalizeDate(MOCK_YEAR, Number(slashMatch[1]), Number(slashMatch[2])),
      hasExplicitYear: false,
    };
  }

  const zhDateMatch = input.match(/(\d{1,2})月(\d{1,2})(?:日|號)/);

  if (zhDateMatch) {
    return {
      date: normalizeDate(MOCK_YEAR, Number(zhDateMatch[1]), Number(zhDateMatch[2])),
      hasExplicitYear: false,
    };
  }

  return null;
}

function parseAmount(input: string) {
  const amountMatch =
    input.match(/金額\s*[:：]?\s*\$?\s*([\d,，]{3,6})/) ??
    input.match(/\$\s*([\d,，]{3,6})/) ??
    input.match(/([\d,，]{3,6})\s*元/);

  if (!amountMatch) {
    return null;
  }

  const amount = Number(amountMatch[1].replace(/[，,]/g, ""));

  return Number.isFinite(amount) ? amount : null;
}

function inferItemType(input: string) {
  if (input.includes("永生")) {
    return "永生花";
  }

  if (input.includes("植物") || input.includes("盆栽")) {
    return "植物";
  }

  if (input.includes("花籃") || input.includes("落地")) {
    return "落地花籃";
  }

  if (input.includes("蘭花") || input.includes("蘭")) {
    return "蘭花";
  }

  return "其他";
}

function findValueByLabels(input: string, labels: string[]) {
  for (const label of labels) {
    const match = input.match(new RegExp(`${label}\\s*[:：]\\s*([^\\n]+)`));

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function parseRecipient(input: string) {
  const giveMatch = input.match(/給\s+([^\n，,。]+)/);
  const recipientText = giveMatch?.[1]?.trim() ?? "";

  if (!recipientText) {
    return {
      needsConfirmation: true,
      recipientName: "",
      recipientOrganization: "",
    };
  }

  const parts = recipientText.split(/\s+/).filter(Boolean);
  const titleIndex = parts.findIndex((part) => titles.some((title) => part.includes(title)));
  const orgIndex = parts.findIndex((part) => organizationKeywords.some((keyword) => part.includes(keyword)));
  const recipientName = titleIndex >= 0 ? parts.slice(titleIndex).join(" ") : parts[parts.length - 1] ?? recipientText;
  const recipientOrganization =
    orgIndex >= 0 && titleIndex > orgIndex
      ? parts.slice(orgIndex, titleIndex).join(" ")
      : orgIndex >= 0
        ? parts[orgIndex]
        : "";

  return {
    needsConfirmation: !recipientName || !recipientOrganization,
    recipientName,
    recipientOrganization,
  };
}

function parseLineMessage(input: string, batchContext?: BatchContext): ParseResult {
  const originalMessage = input.trim();
  const warnings: string[] = [];

  if (!originalMessage) {
    return { errors: ["請貼上 mock/sample LINE 訊息。"], preview: null };
  }

  const parsedDate = parseLineDate(originalMessage);
  const deliveryDate = parsedDate?.date ?? batchContext?.deliveryDate ?? "";
  const dateSource = parsedDate ? "line" : batchContext ? "batch" : "missing";
  const amount = parseAmount(originalMessage);
  const itemType = inferItemType(originalMessage);
  const senderName = findValueByLabels(originalMessage, ["送禮人", "送禮", "贈"]);
  const address = findValueByLabels(originalMessage, ["配送地址", "地址", "送達"]);
  const cardText = findValueByLabels(originalMessage, ["賀卡寫", "卡片", "賀詞"]);
  const recipient = parseRecipient(originalMessage);

  if (!deliveryDate) {
    warnings.push("找不到送貨日期");
  }

  if (parsedDate && !parsedDate.hasExplicitYear) {
    warnings.push("日期未包含年份，已使用 mock 年份 2026，請人工確認");
  }

  if (parsedDate && batchContext && parsedDate.date !== batchContext.deliveryDate) {
    warnings.push("LINE 訊息日期與目前批次日期不同，請人工確認");
  }

  if (amount === null) {
    warnings.push("找不到金額");
  }

  if (itemType === "其他") {
    warnings.push("找不到品項");
    warnings.push("品項判斷為其他");
  }

  if (recipient.needsConfirmation) {
    warnings.push("收禮人 / 收禮單位可能需要人工確認");
  }

  if (!address) {
    warnings.push("地址可能需要人工確認");
  }

  if (!cardText) {
    warnings.push("賀卡內容未偵測到");
  }

  return {
    errors: [],
    preview: {
      address,
      amount,
      cardText,
      dateSource,
      deliveryDate,
      itemType,
      note: "自然語句可能解析錯，必須人工確認。這不是正式 LINE 串接，也不是自動接單或正式訂單建立。",
      originalMessage,
      recipientName: recipient.recipientName,
      recipientOrganization: recipient.recipientOrganization,
      senderName,
      warnings,
    },
  };
}

function formatAmount(amount: number | null) {
  if (amount === null) {
    return "請人工確認";
  }

  return new Intl.NumberFormat("zh-TW", {
    currency: "TWD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function getDateSourceLabel(source: LineMessagePreview["dateSource"]) {
  if (source === "line") {
    return "LINE 訊息日期";
  }

  if (source === "batch") {
    return "沿用批次日期";
  }

  return "請人工確認";
}

export function AdminOrdersLineMessagePreview({ batchContext }: { batchContext?: BatchContext }) {
  const [draft, setDraft] = useState("");
  const [parseRequested, setParseRequested] = useState(false);
  const parseResult = useMemo(
    () => (parseRequested ? parseLineMessage(draft, batchContext) : { errors: [], preview: null }),
    [batchContext, draft, parseRequested],
  );

  return (
    <section className={styles.lineMessagePreview} aria-label="LINE 訊息預覽">
      <div className={styles.lineMessageHeader}>
        <div>
          <span>Browser-memory preview</span>
          <h2>LINE 訊息預覽</h2>
          <p>Preview only. Do not paste real customer/order data here.</p>
          <small>重新整理後 preview 會消失。這不是正式 LINE 串接，也不是自動接單。</small>
        </div>
      </div>

      {batchContext ? (
        <div className={styles.previewBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>若 LINE 訊息沒有日期，preview 會顯示沿用批次日期。</small>
        </div>
      ) : null}

      <label className={styles.lineMessageInput}>
        <span>Mock LINE message text</span>
        <textarea
          onChange={(event) => {
            setDraft(event.target.value);
            setParseRequested(false);
          }}
          placeholder={sampleLineMessage}
          value={draft}
        />
      </label>

      <div className={styles.lineMessageActions}>
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
        <div className={styles.lineMessageErrors} role="status">
          <strong>解析錯誤</strong>
          <ul>
            {parseResult.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parseResult.preview ? (
        <article className={styles.lineMessageResult}>
          <div className={styles.lineMessageResultHeader}>
            <div>
              <span>Preview result</span>
              <strong>{parseResult.preview.recipientName || "請人工確認收禮人"}</strong>
            </div>
            <span>{formatAmount(parseResult.preview.amount)}</span>
          </div>

          <dl>
            <div><dt>送貨日期</dt><dd>{parseResult.preview.deliveryDate || "請人工確認"}</dd></div>
            <div><dt>日期來源</dt><dd>{getDateSourceLabel(parseResult.preview.dateSource)}</dd></div>
            <div><dt>收禮人</dt><dd>{parseResult.preview.recipientName || "請人工確認"}</dd></div>
            <div><dt>收禮單位</dt><dd>{parseResult.preview.recipientOrganization || "請人工確認"}</dd></div>
            <div><dt>地址</dt><dd>{parseResult.preview.address || "請人工確認"}</dd></div>
            <div><dt>送禮人</dt><dd>{parseResult.preview.senderName || "請人工確認"}</dd></div>
            <div><dt>品項</dt><dd>{parseResult.preview.itemType}</dd></div>
            <div><dt>賀卡內容</dt><dd>{parseResult.preview.cardText || "請人工確認"}</dd></div>
            <div><dt>備註</dt><dd>{parseResult.preview.note}</dd></div>
          </dl>

          {parseResult.preview.warnings.length > 0 ? (
            <div className={styles.lineMessageWarnings}>
              <strong>需要人工確認</strong>
              <ul>
                {parseResult.preview.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className={styles.lineMessageOriginal}>
            <strong>原始 LINE mock 訊息</strong>
            <pre>{parseResult.preview.originalMessage}</pre>
          </div>
        </article>
      ) : null}
    </section>
  );
}
