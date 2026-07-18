"use client";

import { useEffect, useMemo } from "react";
import styles from "@/app/admin/orders/admin-orders.module.css";
import type { BatchContext } from "@/components/admin-orders-batch-preview-workspace";

export type ProductionCard = {
  amountNote: string;
  blessingPhrase: string;
  cardText: string;
  id: string;
  itemType: string;
  recipientLine: string;
  recipientName: string;
  senderText: string;
  status: "可打卡" | "需人工確認";
  title: string;
  warnings: string[];
};

type ParseResult = {
  cards: ProductionCard[];
  errors: string[];
};

const sampleCardText = [
  "祝 測試經理 淑真",
  "",
  "榮任誌慶",
  "",
  "Mock Gift Co.",
  "範例送禮人 A 敬賀",
  "",
  "5000蘭花",
  "",
  "祝 測試經理 淑真",
  "",
  "榮陞誌慶",
  "",
  "範例送禮人 B 敬賀",
  "",
  "3500蘭",
].join("\n");

const blessingPhrases = ["榮陞誌慶", "榮任誌慶", "喬遷誌慶", "開幕誌慶", "開業誌慶", "生日快樂", "平安順心"];
const titleWords = ["處長", "經理", "副總", "主任", "董事長", "總經理", "協理", "店長", "老師", "醫師"];
const cardOpeningPattern = /^(?:\d+\s*)?(?:祝|賀)\s*/;
const delimitedCardOpeningPattern = /^\d+\s*[|｜]\s*\S+/;

function inferItemType(value: string) {
  if (value.includes("永生")) return "永生花";
  if (value.includes("植物") || value.includes("盆栽")) return "植物";
  if (value.includes("花籃") || value.includes("落地")) return "落地花籃";
  if (value.includes("蘭花") || value.includes("蘭")) return "蘭花";
  return "其他";
}

function splitCardBlocks(input: string) {
  const lines = input.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const startsNewCard =
      (cardOpeningPattern.test(trimmedLine) || delimitedCardOpeningPattern.test(trimmedLine)) &&
      current.some((item) => item.trim());

    if (startsNewCard) {
      blocks.push(current);
      current = [line];
      return;
    }

    current.push(line);
  });

  if (current.some((line) => line.trim())) {
    blocks.push(current);
  }

  return blocks
    .map((block) => block.join("\n").trim())
    .filter(Boolean);
}

function parseRecipient(line: string) {
  const delimitedFields = line.split(/[|｜]/).map((field) => field.trim()).filter(Boolean);
  const cleaned =
    delimitedFields.length > 1 && /^\d+$/.test(delimitedFields[0])
      ? delimitedFields[1]
      : line.replace(cardOpeningPattern, "").trim();
  const title = titleWords.find((word) => cleaned.includes(word)) ?? "";
  const recipientName = title ? cleaned.replace(title, "").trim() : cleaned;

  return { recipientName, title };
}

function getDelimitedFields(line: string) {
  return line.split(/[|｜]/).map((field) => field.trim()).filter(Boolean);
}

function getCompactDeliveryText(card: ProductionCard) {
  const fields = getDelimitedFields(card.recipientLine);
  if (fields.length > 2 && /^\d+$/.test(fields[0])) {
    return fields.slice(2).join("・");
  }

  return "請人工確認";
}

function getCompactSenderText(card: ProductionCard) {
  const firstLine = card.senderText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0];
  return firstLine || "請人工確認";
}

function parseProductionCards(input: string, batchContext?: BatchContext): ParseResult {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return { cards: [], errors: ["請貼上 mock/sample 賀卡文字。"] };
  }

  const blocks = splitCardBlocks(trimmedInput);
  const cards: ProductionCard[] = blocks.map((block, index) => {
    const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const recipientLine = lines.find((line) => cardOpeningPattern.test(line) || delimitedCardOpeningPattern.test(line)) ?? "";
    const { recipientName, title } = parseRecipient(recipientLine);
    const blessingPhrase = lines.find((line) => blessingPhrases.includes(line)) ?? "";
    const amountNote = lines.findLast((line) => /^\d{3,6}\s*\S+/.test(line)) ?? "";
    const itemType = amountNote ? inferItemType(amountNote) : "請人工確認";
    const blessingIndex = blessingPhrase ? lines.indexOf(blessingPhrase) : -1;
    const amountIndex = amountNote ? lines.lastIndexOf(amountNote) : lines.length;
    const senderLines = lines.slice(Math.max(blessingIndex + 1, 0), amountIndex).filter((line) => line !== recipientLine);
    const senderText = senderLines.join("\n");
    const warnings: string[] = [];

    if (!recipientName) warnings.push("收禮人需確認");
    if (!title) warnings.push("職稱需確認");
    if (!blessingPhrase) warnings.push("賀詞需確認");
    if (!senderText.includes("敬賀")) warnings.push("敬賀人需確認");
    if (!amountNote) warnings.push("缺品項金額");
    if (itemType === "其他") warnings.push("品項需確認");

    return {
      amountNote,
      blessingPhrase,
      cardText: block,
      id: `mock-production-card-${index + 1}`,
      itemType,
      recipientLine,
      recipientName,
      senderText,
      status: warnings.length === 0 ? "可打卡" : "需人工確認",
      title,
      warnings,
    };
  });

  const recipientCounts = new Map<string, number>();
  cards.forEach((card) => {
    if (!card.recipientName) return;
    recipientCounts.set(card.recipientName, (recipientCounts.get(card.recipientName) ?? 0) + 1);
  });

  const cardsWithDuplicateWarnings = cards.map((card) => {
    if (!card.recipientName || (recipientCounts.get(card.recipientName) ?? 0) <= 1) return card;

    return {
      ...card,
      status: "需人工確認" as const,
      warnings: [...card.warnings, "同一收禮人有多張賀卡"],
    };
  });

  return { cards: cardsWithDuplicateWarnings, errors: [] };
}

export function AdminOrdersCardProductionPreview({
  batchContext,
  draft,
  onPreviewCardsChange,
  onDraftChange,
  onParseRequestedChange,
  parseRequested,
}: {
  batchContext?: BatchContext;
  draft: string;
  onPreviewCardsChange?: (cards: ProductionCard[]) => void;
  onDraftChange: (draft: string) => void;
  onParseRequestedChange: (parseRequested: boolean) => void;
  parseRequested: boolean;
}) {
  const parseResult = useMemo(
    () => (parseRequested ? parseProductionCards(draft, batchContext) : { cards: [], errors: [] }),
    [batchContext, draft, parseRequested],
  );
  const readyCount = parseResult.cards.filter((card) => card.status === "可打卡").length;
  const warningCount = parseResult.cards.length - readyCount;
  const uniqueRecipientCount = new Set(parseResult.cards.map((card) => card.recipientName).filter(Boolean)).size;

  useEffect(() => {
    onPreviewCardsChange?.(parseResult.cards);
  }, [onPreviewCardsChange, parseResult.cards]);

  return (
    <section className={styles.cardProductionPreview} aria-label="賀卡製作預覽">
      <div className={styles.cardProductionHeader}>
        <div>
          <span>Primary workflow / Browser-memory preview</span>
          <h2>賀卡製作預覽</h2>
          <p>Preview only. Do not paste real customer/order data here.</p>
          <small>先把客人提供的文字整理成一張一張完整賀卡，讓打字人員可以照內容打卡片。</small>
        </div>
      </div>

      {batchContext ? (
        <div className={styles.previewBatchNote}>
          <strong>目前批次</strong>
          <span>{batchContext.name} / {batchContext.deliveryDate}</span>
          <small>這裡只用批次日期輔助核對，不會寫入資料。</small>
        </div>
      ) : null}

      <label className={styles.cardProductionInput}>
        <span>貼上 mock/sample 賀卡文字</span>
        <textarea
          onChange={(event) => {
            onDraftChange(event.target.value);
            onParseRequestedChange(false);
            onPreviewCardsChange?.([]);
          }}
          placeholder={sampleCardText}
          value={draft}
        />
      </label>

      <div className={styles.cardProductionActions}>
        <button type="button" onClick={() => onParseRequestedChange(true)}>解析預覽</button>
        <button
          type="button"
          onClick={() => {
            onDraftChange("");
            onParseRequestedChange(false);
            onPreviewCardsChange?.([]);
          }}
        >
          清除
        </button>
      </div>

      {parseRequested && parseResult.errors.length > 0 ? (
        <div className={styles.cardProductionErrors} role="status">
          <strong>解析提示</strong>
          <ul>
            {parseResult.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parseResult.cards.length > 0 ? (
        <>
          <div className={styles.cardProductionSummary}>
            <article><span>賀卡張數</span><strong>{parseResult.cards.length}</strong></article>
            <article><span>收禮人數</span><strong>{uniqueRecipientCount}</strong></article>
            <article><span>可打卡</span><strong>{readyCount}</strong></article>
            <article><span>需確認</span><strong>{warningCount}</strong></article>
          </div>

          <div className={styles.cardProductionGrid}>
            {parseResult.cards.map((card, index) => (
              <details key={card.id} className={styles.productionCard}>
                <summary className={styles.productionCardSummaryLine}>
                  <div>
                    <strong>{index + 1}｜{card.recipientName || "請人工確認收禮人"}</strong>
                    <span>{getCompactDeliveryText(card)}</span>
                  </div>
                  <em className={card.status === "可打卡" ? styles.productionCardReady : styles.productionCardNeedsCheck}>
                    {card.status}
                  </em>
                </summary>

                <dl className={styles.productionCardCompactRows}>
                  <div><dt>收禮人</dt><dd>{card.recipientName || "請人工確認"}</dd></div>
                  <div><dt>賀詞</dt><dd>{card.blessingPhrase || "請人工確認"}</dd></div>
                  <div><dt>送禮人</dt><dd>{getCompactSenderText(card)}</dd></div>
                  <div><dt>配送</dt><dd>{getCompactDeliveryText(card)}</dd></div>
                  <div><dt>品項</dt><dd>{card.amountNote || "請人工確認"}</dd></div>
                  <div><dt>日期</dt><dd>{batchContext?.deliveryDate ?? "請人工確認"}</dd></div>
                </dl>

                <div className={styles.productionCardText}>
                  <strong>完整賀卡內容</strong>
                  <pre>{card.cardText}</pre>
                </div>

                {card.warnings.length > 0 ? (
                  <div className={styles.productionCardWarnings}>
                    <strong>人工確認</strong>
                    <ul>
                      {card.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </details>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
