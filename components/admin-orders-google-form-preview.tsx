"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";
import type { BatchContext } from "@/components/admin-orders-batch-preview-workspace";

const sampleResponseText = [
  "時間戳記\tEmail Address\t訂購單位\t訂購人\t送達日期\t收禮人\t收禮單位\t送禮人\t品項\t金額\t配送地址\t聯絡方式\t賀卡內容\t備註",
  "2026/07/01 10:00:00\tmock-form-a@example.test\t測試單位 A\t範例訂購人 A\t2026-07-06\t測試收禮人 A\t測試部門 A\t範例送禮人 A\t蘭花\t3,000\t測試地址，不可配送\t0900-000-000\t祝 測試收禮人 A 平安順心\tmock row only",
  "2026/07/01 10:08:00\tmock-form-b@example.test\t測試單位 B\t範例訂購人 B\t\t測試收禮人 B\t測試公司 B\t範例送禮人 B\t永生花\t$2500\t測試地址，不可配送\t\t\tmissing card sample",
].join("\n");

const fieldAliases = {
  amount: ["金額"],
  cardText: ["賀卡內容", "賀卡", "卡片", "賀詞"],
  deliveryAddress: ["配送地址", "地址", "送達地址"],
  deliveryContact: ["聯絡方式", "電話", "聯絡電話"],
  deliveryDate: ["送達日期", "配送日期", "交付日期"],
  itemName: ["品項", "品名", "商品"],
  notes: ["備註", "備注"],
  orderingContactName: ["訂購人", "下單人"],
  orderingOrganization: ["訂購單位"],
  recipientName: ["收禮人"],
  recipientOrganization: ["收禮單位", "收禮公司", "收禮部門"],
  senderName: ["送禮人"],
} as const;

type DateSource = "batch" | "form" | "missing";

type GoogleFormPreviewRow = {
  amount: number | null;
  cardText: string;
  dateSource: DateSource;
  deliveryAddress: string;
  deliveryContact: string;
  deliveryDate: string;
  itemName: string;
  itemType: string;
  notes: string;
  orderingContactName: string;
  orderingOrganization: string;
  rawRow: string;
  recipientName: string;
  recipientOrganization: string;
  senderName: string;
  warnings: string[];
};

type ParseResult = {
  errors: string[];
  rows: GoogleFormPreviewRow[];
};

function normalizeHeader(value: string) {
  return value.trim();
}

function getCell(row: string[], headerIndexes: Map<string, number>, aliases: readonly string[]) {
  for (const alias of aliases) {
    const index = headerIndexes.get(alias);

    if (index !== undefined) {
      return row[index]?.trim() ?? "";
    }
  }

  return "";
}

function normalizeDate(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const isoMatch = trimmed.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  const slashMatch = trimmed.match(/\b(20\d{2})\/(\d{1,2})\/(\d{1,2})\b/);
  const match = isoMatch ?? slashMatch;

  if (!match) {
    return trimmed;
  }

  return [
    match[1],
    String(Number(match[2])).padStart(2, "0"),
    String(Number(match[3])).padStart(2, "0"),
  ].join("-");
}

function parseAmount(value: string) {
  const normalized = value.replace(/[$,，\s元]/g, "");
  const amount = Number(normalized);

  return normalized && Number.isFinite(amount) ? amount : null;
}

function inferItemType(value: string) {
  if (value.includes("永生")) {
    return "永生花";
  }

  if (value.includes("植物") || value.includes("盆栽")) {
    return "植物";
  }

  if (value.includes("花籃") || value.includes("落地")) {
    return "落地花籃";
  }

  if (value.includes("蘭花") || value.includes("蘭")) {
    return "蘭花";
  }

  return "其他";
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

function getDateSourceLabel(source: DateSource) {
  if (source === "form") {
    return "Google Form 回覆日期";
  }

  if (source === "batch") {
    return "沿用批次日期";
  }

  return "請人工確認";
}

function parseGoogleFormResponses(input: string, batchContext?: BatchContext): ParseResult {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return { errors: ["請貼上 mock/sample Google Form 回覆表資料。"], rows: [] };
  }

  const rawRows = trimmedInput
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
  const rows = rawRows.map((row) => row.split("\t").map((cell) => cell.trim()));
  const headerRow = rows[0]?.map(normalizeHeader) ?? [];
  const dataRows = rows.slice(1);
  const errors: string[] = [];

  if (headerRow.length === 0) {
    errors.push("缺少 header row。");
  }

  if (dataRows.length === 0) {
    errors.push("缺少回覆資料列。");
  }

  if (errors.length > 0) {
    return { errors, rows: [] };
  }

  const headerIndexes = new Map(headerRow.map((header, index) => [header, index]));
  const previewRows = dataRows.map((row, index) => {
    const warnings: string[] = [];
    const formDate = normalizeDate(getCell(row, headerIndexes, fieldAliases.deliveryDate));
    const deliveryDate = formDate || batchContext?.deliveryDate || "";
    const dateSource: DateSource = formDate ? "form" : batchContext ? "batch" : "missing";
    const itemName = getCell(row, headerIndexes, fieldAliases.itemName);
    const itemType = inferItemType(itemName);
    const amountText = getCell(row, headerIndexes, fieldAliases.amount);
    const amount = parseAmount(amountText);
    const recipientName = getCell(row, headerIndexes, fieldAliases.recipientName);
    const deliveryAddress = getCell(row, headerIndexes, fieldAliases.deliveryAddress);
    const cardText = getCell(row, headerIndexes, fieldAliases.cardText);
    const orderingOrganization = getCell(row, headerIndexes, fieldAliases.orderingOrganization);
    const orderingContactName = getCell(row, headerIndexes, fieldAliases.orderingContactName);

    if (!recipientName) {
      warnings.push("缺收禮人");
    }

    if (!itemName) {
      warnings.push("缺品項");
    }

    if (amount === null) {
      warnings.push(amountText ? "金額格式錯誤" : "缺金額");
    }

    if (!deliveryDate) {
      warnings.push("缺送達日期");
    }

    if (!deliveryAddress) {
      warnings.push("缺配送地址");
    }

    if (!cardText) {
      warnings.push("缺賀卡內容");
    }

    if (itemName && itemType === "其他") {
      warnings.push("品項判斷為其他");
    }

    if (!orderingContactName) {
      warnings.push("訂購人空白");
    }

    if (!orderingOrganization) {
      warnings.push("訂購單位空白");
    }

    if (formDate && batchContext && formDate !== batchContext.deliveryDate) {
      warnings.push("送達日期與目前批次日期不同，請人工確認");
    }

    return {
      amount,
      cardText,
      dateSource,
      deliveryAddress,
      deliveryContact: getCell(row, headerIndexes, fieldAliases.deliveryContact),
      deliveryDate,
      itemName,
      itemType,
      notes: getCell(row, headerIndexes, fieldAliases.notes),
      orderingContactName,
      orderingOrganization,
      rawRow: rawRows[index + 1] ?? "",
      recipientName,
      recipientOrganization: getCell(row, headerIndexes, fieldAliases.recipientOrganization),
      senderName: getCell(row, headerIndexes, fieldAliases.senderName),
      warnings,
    };
  });

  return { errors: [], rows: previewRows };
}

export function AdminOrdersGoogleFormPreview({ batchContext }: { batchContext?: BatchContext }) {
  const [draft, setDraft] = useState("");
  const [parseRequested, setParseRequested] = useState(false);
  const parseResult = useMemo(
    () => (parseRequested ? parseGoogleFormResponses(draft, batchContext) : { errors: [], rows: [] }),
    [batchContext, draft, parseRequested],
  );

  return (
    <section className={styles.googleFormPreview} aria-label="Google Form 回覆預覽">
      <div className={styles.googleFormHeader}>
        <div>
          <span>Step 3 / Browser-memory preview</span>
          <h2>Google Form 回覆預覽</h2>
          <p>Preview only. Do not paste real customer/order data here.</p>
          <small>This is not a Google Form or Google Sheet integration. Paste mock/sample response rows only.</small>
          <small>這不是 Google Form 串接，只是貼上回覆表預覽；適合檢查零星內部訂單欄位是否完整。</small>
        </div>
      </div>

      {batchContext ? (
        <div className={styles.previewBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>若回覆列沒有送達日期，preview 會顯示沿用批次日期。</small>
        </div>
      ) : null}

      <label className={styles.googleFormInput}>
        <span>Tab-separated mock Google Form response rows</span>
        <textarea
          onChange={(event) => {
            setDraft(event.target.value);
            setParseRequested(false);
          }}
          placeholder={sampleResponseText}
          value={draft}
        />
      </label>

      <div className={styles.googleFormActions}>
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
        <div className={styles.googleFormErrors} role="status">
          <strong>解析錯誤</strong>
          <ul>
            {parseResult.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parseResult.rows.length > 0 ? (
        <div className={styles.googleFormResults}>
          {parseResult.rows.map((row, index) => (
            <article key={`${row.rawRow}-${index}`}>
              <div className={styles.googleFormResultHeader}>
                <div>
                  <span>Response preview {index + 1}</span>
                  <strong>{row.recipientName || "請人工確認收禮人"}</strong>
                </div>
                <span>{formatAmount(row.amount)}</span>
              </div>

              <dl>
                <div><dt>訂購單位</dt><dd>{row.orderingOrganization || "請人工確認"}</dd></div>
                <div><dt>訂購人</dt><dd>{row.orderingContactName || "請人工確認"}</dd></div>
                <div><dt>送達日期</dt><dd>{row.deliveryDate || "請人工確認"}</dd></div>
                <div><dt>日期來源</dt><dd>{getDateSourceLabel(row.dateSource)}</dd></div>
                <div><dt>收禮人</dt><dd>{row.recipientName || "請人工確認"}</dd></div>
                <div><dt>收禮單位</dt><dd>{row.recipientOrganization || "請人工確認"}</dd></div>
                <div><dt>配送地址</dt><dd>{row.deliveryAddress || "請人工確認"}</dd></div>
                <div><dt>聯絡方式</dt><dd>{row.deliveryContact || "請人工確認"}</dd></div>
                <div><dt>送禮人</dt><dd>{row.senderName || "請人工確認"}</dd></div>
                <div><dt>品項</dt><dd>{row.itemType}{row.itemName ? ` / ${row.itemName}` : ""}</dd></div>
                <div><dt>賀卡內容</dt><dd>{row.cardText || "請人工確認"}</dd></div>
                <div><dt>備註</dt><dd>{row.notes || "無 mock 備註"}</dd></div>
              </dl>

              {row.warnings.length > 0 ? (
                <div className={styles.googleFormWarnings}>
                  <strong>需要人工確認的欄位</strong>
                  <ul>
                    {row.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className={styles.googleFormOriginal}>
                <strong>原始 row</strong>
                <pre>{row.rawRow}</pre>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
