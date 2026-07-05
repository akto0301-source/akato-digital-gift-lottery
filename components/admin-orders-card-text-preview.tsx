"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";

const titles = ["處長", "經理", "副總", "主任", "董事長", "總經理", "協理", "店長", "老師", "醫師"];
const blessingPhrases = ["榮陞誌慶", "榮任誌慶", "喬遷誌慶", "開幕誌慶", "開業誌慶", "生日快樂", "平安順心"];

const sampleCardText = `祝 測試處長 小花

榮陞誌慶

Mock Trade 測試有限公司
範例送禮人 A 範例送禮人 B 敬賀

5000落地蘭`;

type BatchContext = {
  name: string;
  deliveryDate: string;
};

type CardTextPreview = {
  amount: number | null;
  blessing: string;
  cardText: string;
  itemNote: string;
  itemType: string;
  recipient: string;
  sender: string;
  title: string;
  warnings: string[];
};

type ParseResult = {
  errors: string[];
  preview: CardTextPreview | null;
};

function getNonEmptyLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseRecipient(line: string) {
  const withoutPrefix = line.replace(/^祝\s*/, "").trim();
  const title = titles.find((candidate) => withoutPrefix.includes(candidate)) ?? "";

  return {
    recipient: withoutPrefix,
    title,
  };
}

function parseAmountItem(line: string) {
  const match = line.match(/^(\d{3,6})\s*(.+)$/);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  const itemNote = match[2]?.trim() ?? "";

  if (!Number.isFinite(amount)) {
    return null;
  }

  return { amount, itemNote };
}

function inferItemType(itemNote: string) {
  if (itemNote.includes("永生")) {
    return "永生花";
  }

  if (itemNote.includes("植物") || itemNote.includes("盆栽")) {
    return "植物";
  }

  if (itemNote.includes("落地花籃") || itemNote.includes("花籃")) {
    return "落地花籃";
  }

  if (itemNote.includes("蘭花") || itemNote.includes("蘭") || itemNote.includes("落地蘭")) {
    return "蘭花";
  }

  return "其他";
}

function parseCardText(input: string): ParseResult {
  const cardText = input.trim();
  const lines = getNonEmptyLines(cardText);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (lines.length === 0) {
    return { errors: ["完全沒有可解析內容。"], preview: null };
  }

  const firstLine = lines[0] ?? "";
  const lastLine = lines[lines.length - 1] ?? "";
  const amountItem = parseAmountItem(lastLine);

  if (!amountItem) {
    return { errors: ["找不到金額品項行。"], preview: null };
  }

  const { recipient, title } = firstLine.startsWith("祝") ? parseRecipient(firstLine) : { recipient: firstLine, title: "" };
  const blessing = lines.find((line) => blessingPhrases.includes(line)) ?? "";
  const itemType = inferItemType(amountItem.itemNote);
  const senderLines = lines.filter((line, index) => {
    const isFirstLine = index === 0;
    const isLastLine = index === lines.length - 1;
    const isBlessing = line === blessing;

    return !isFirstLine && !isLastLine && !isBlessing;
  });

  if (!firstLine.startsWith("祝") || !recipient) {
    warnings.push("收禮人格式不明確");
  }

  if (!title) {
    warnings.push("未偵測到職稱");
  }

  if (!blessing) {
    warnings.push("未偵測到賀詞");
  }

  if (itemType === "其他") {
    warnings.push("品項判斷為其他，請人工確認");
  }

  if (amountItem.itemNote.includes("落地蘭")) {
    warnings.push("落地蘭已判為蘭花，但備註保留原文");
  }

  if (senderLines.length === 0) {
    warnings.push("送禮人可能需要人工確認");
  }

  return {
    errors,
    preview: {
      amount: amountItem.amount,
      blessing,
      cardText,
      itemNote: amountItem.itemNote,
      itemType,
      recipient,
      sender: senderLines.join(" / "),
      title,
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

export function AdminOrdersCardTextPreview({ batchContext }: { batchContext?: BatchContext }) {
  const [draft, setDraft] = useState("");
  const [parseRequested, setParseRequested] = useState(false);
  const parseResult = useMemo(() => (parseRequested ? parseCardText(draft) : { errors: [], preview: null }), [draft, parseRequested]);

  return (
    <section className={styles.cardTextPreview} aria-label="賀卡文字預覽">
      <div className={styles.cardTextHeader}>
        <div>
          <span>Preview-only mock tool</span>
          <h2>賀卡文字預覽</h2>
          <p>Preview only. Do not paste real customer/order data here.</p>
        </div>
      </div>

      <label className={styles.cardTextInput}>
        <span>Akato mock card text</span>
        <textarea
          onChange={(event) => {
            setDraft(event.target.value);
            setParseRequested(false);
          }}
          placeholder={sampleCardText}
          value={draft}
        />
      </label>

      {batchContext ? (
        <div className={styles.previewBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>賀卡文字 preview 先不做單筆日期覆蓋，顯示沿用批次日期。</small>
        </div>
      ) : null}

      <div className={styles.cardTextActions}>
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
        <div className={styles.cardTextErrors} role="status">
          <strong>解析錯誤</strong>
          <ul>
            {parseResult.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parseResult.preview ? (
        <article className={styles.cardTextResult}>
          <div className={styles.cardTextResultHeader}>
            <div>
              <span>Preview result</span>
              <strong>{parseResult.preview.recipient || "請人工確認收禮人"}</strong>
            </div>
            <span>{formatAmount(parseResult.preview.amount)}</span>
          </div>

          <dl>
            {batchContext ? (
              <>
                <div><dt>批次名稱</dt><dd>{batchContext.name}</dd></div>
                <div><dt>批次出貨日期</dt><dd>{batchContext.deliveryDate}</dd></div>
                <div><dt>日期來源</dt><dd>沿用批次日期</dd></div>
              </>
            ) : null}
            <div><dt>職稱</dt><dd>{parseResult.preview.title || "請人工確認"}</dd></div>
            <div><dt>賀詞</dt><dd>{parseResult.preview.blessing || "請人工確認"}</dd></div>
            <div><dt>送禮人</dt><dd>{parseResult.preview.sender || "請人工確認"}</dd></div>
            <div><dt>品項</dt><dd>{parseResult.preview.itemType}</dd></div>
            <div><dt>備註</dt><dd>{parseResult.preview.itemNote}</dd></div>
          </dl>

          {parseResult.preview.warnings.length > 0 ? (
            <div className={styles.cardTextWarnings}>
              <strong>需人工確認</strong>
              <ul>
                {parseResult.preview.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className={styles.cardTextOriginal}>
            <strong>完整賀卡內容</strong>
            <pre>{parseResult.preview.cardText}</pre>
          </div>
        </article>
      ) : null}
    </section>
  );
}
