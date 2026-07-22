"use client";

import { useEffect, useState } from "react";
import { FlowerCardImage } from "@/components/flower-card-image";
import type { ContentLibrary, ContentLot } from "@/lib/content";
import type { GiftLocale } from "@/lib/gift-links";
import styles from "@/app/page.module.css";

type LotteryPanelProps = {
  library: ContentLibrary;
  initialLot: ContentLot | null;
  locale: GiftLocale;
  showNotes?: boolean;
  showShareForm?: boolean;
};

type LotteryResponse = {
  ok: boolean;
  error?: string;
  lot?: ContentLot;
};

type SavedShareState = {
  lot: ContentLot | null;
  fromName: string;
  toName: string;
  giftMessage: string;
  hasEditedGiftMessage: boolean;
  letterLink: string;
  hasShareStarted: boolean;
};

const LOT_SHARE_STORAGE_KEY = "akato-lot-share-state";

function readSavedShareState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedState = window.sessionStorage.getItem(LOT_SHARE_STORAGE_KEY);

    return savedState ? (JSON.parse(savedState) as SavedShareState) : null;
  } catch {
    return null;
  }
}

function writeSavedShareState(state: SavedShareState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(LOT_SHARE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can fail in restricted browsing modes; the form should still work.
  }
}

function getLotPoem(fortune: string | undefined) {
  if (!fortune) {
    return "";
  }

  return fortune
    .replace(/^小籤詩：/, "")
    .split("溫柔解讀：")[0]
    ?.trim() ?? fortune;
}

function getLotInterpretation(fortune: string | undefined) {
  if (!fortune || !fortune.includes("溫柔解讀：")) {
    return "";
  }

  return fortune.split("溫柔解讀：")[1]?.trim() ?? "";
}

export function LotteryPanel({ library, initialLot, locale, showNotes = true, showShareForm = false }: LotteryPanelProps) {
  const [lot, setLot] = useState<ContentLot | null>(initialLot);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [giftMessage, setGiftMessage] = useState(initialLot?.blessing ?? "");
  const [hasEditedGiftMessage, setHasEditedGiftMessage] = useState(false);
  const [letterLink, setLetterLink] = useState("");
  const [hasShareStarted, setHasShareStarted] = useState(false);
  const [hasLoadedShareState, setHasLoadedShareState] = useState(!showShareForm);

  useEffect(() => {
    if (!showShareForm) {
      return;
    }

    const savedState = readSavedShareState();

    if (savedState) {
      setLot(savedState.lot);
      setFromName(savedState.fromName ?? "");
      setToName(savedState.toName ?? "");
      setGiftMessage(savedState.giftMessage ?? savedState.lot?.blessing ?? "");
      setHasEditedGiftMessage(Boolean(savedState.hasEditedGiftMessage));
      setLetterLink(savedState.letterLink ?? "");
      setHasShareStarted(Boolean(savedState.hasShareStarted));
    }

    setHasLoadedShareState(true);
  }, [showShareForm]);

  useEffect(() => {
    if (!showShareForm || !hasLoadedShareState) {
      return;
    }

    writeSavedShareState({
      lot,
      fromName,
      giftMessage,
      hasEditedGiftMessage,
      hasShareStarted,
      toName,
      letterLink,
    });
  }, [fromName, giftMessage, hasEditedGiftMessage, hasLoadedShareState, hasShareStarted, letterLink, lot, showShareForm, toName]);

  async function drawLot() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lots/random", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json()) as LotteryResponse;

      if (!response.ok || !data.ok || !data.lot) {
        throw new Error(data.error ?? library.fallbackMessages.error);
      }

      setLot(data.lot);
      if (!hasEditedGiftMessage) {
        setGiftMessage(data.lot.blessing ?? "");
      }
      setLetterLink("");
      setHasShareStarted(showShareForm);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : library.fallbackMessages.error;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const copy = locale === "ja"
    ? {
        cardHeaderLeft: "おみくじ結果",
        cardHeaderRight: lot?.label ?? "まだ引いていません",
        empty: "まだおみくじデータが入っていません。",
        category: "分類",
        number: "番号",
        poem: "小さな詩",
        interpretation: "やさしい読み解き",
        blessing: "祝福のことば",
        drawButton: isLoading ? "ひいています..." : library.meta.ctaLabel ?? "今日のおみくじを引く",
        notes: [
          "正式な 25 枚のおみくじ内容は `data/content-library.json` に入れてください。",
          "LINE Webhook endpoint: `/api/line/webhook`",
          "ランダム抽選 API: `GET /api/lots/random`",
        ],
      }
    : {
        cardHeaderLeft: "抽籤結果",
        cardHeaderRight: lot?.label ?? "尚未抽籤",
        empty: library.fallbackMessages.empty,
        category: "分類",
        number: "編號",
        poem: "小籤詩",
        interpretation: "溫柔解讀",
        blessing: "今日花語",
        drawButton: isLoading ? "抽籤中..." : library.meta.ctaLabel ?? "抽一支籤",
        notes: [
          "正式 25 籤與今日花語內容請填入 `data/content-library.json`。",
          "LINE Webhook endpoint: `/api/line/webhook`",
          "隨機抽籤 API: `GET /api/lots/random`",
        ],
      };

  function updateFromName(value: string) {
    setFromName(value);
    setLetterLink("");
  }

  function updateToName(value: string) {
    setToName(value);
    setLetterLink("");
  }

  function updateGiftMessage(value: string) {
    setGiftMessage(value);
    setHasEditedGiftMessage(true);
    setLetterLink("");
  }

  async function copyLetterLink() {
    if (!letterLink) {
      return;
    }

    await navigator.clipboard.writeText(letterLink);
  }

  async function generateLetterLink() {
    const trimmedMessage = giftMessage.trim();

    if (!lot || !fromName.trim() || !toName.trim()) {
      return;
    }

    if (!trimmedMessage) {
      setLetterLink("");
      setError("請寫下一句想送給對方的祝福。");
      return;
    }

    if (trimmedMessage.length > 2000) {
      setLetterLink("");
      setError("祝福內容請控制在 2000 字以內。");
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/gift-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromName: fromName.trim(),
          toName: toName.trim(),
          message: trimmedMessage,
          locale,
          cardId: "shared-blessing",
          lotKey: lot.id,
          lotSnapshot: lot,
        }),
      });
      const data = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? library.fallbackMessages.error);
      }

      setLetterLink(data.url);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : library.fallbackMessages.error;
      setLetterLink("");
      setError(message);
    }
  }

  const canGenerateLetter = Boolean(lot && fromName.trim() && toName.trim() && giftMessage.trim());
  const lineShareHref = letterLink
    ? `https://line.me/R/msg/text/?${encodeURIComponent(`我抽到一張今日小花籤，想送給你。\n打開這封祝福信：${letterLink}`)}`
    : "";
  const shouldShowShareForm = Boolean(showShareForm && lot && hasShareStarted);
  const lotPoem = getLotPoem(lot?.fortune);
  const lotInterpretation = getLotInterpretation(lot?.fortune);

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <span>{copy.cardHeaderLeft}</span>
          <span>{copy.cardHeaderRight}</span>
        </div>

        {lot ? (
          <>
            <div className={styles.lotIllustrationWrap}>
              <FlowerCardImage lot={lot} className={styles.lotIllustration} imageClassName={styles.lotIllustrationImage} size={168} />
              <span className={`${styles.lotButterfly} ${styles.lotButterflyPng}`} aria-hidden="true">
                <span className={styles.lotButterflyFlight}>
                  <span className={styles.lotButterflyFlyingPose} />
                  <span className={styles.lotButterflyRestingPose} />
                </span>
              </span>
            </div>
            <h2>{lot.title}</h2>
            <div className={styles.lotReading}>
              <section className={styles.lotReadingBlock}>
                <h3>{copy.poem}</h3>
                <p>{lotPoem || lot.fortune}</p>
              </section>
              {lotInterpretation ? (
                <section className={styles.lotReadingBlock}>
                  <h3>{copy.interpretation}</h3>
                  <p>{lotInterpretation}</p>
                </section>
              ) : null}
            </div>
            <div className={styles.blessingBlock}>
              <h3>{copy.blessing}</h3>
              <p>{lot.blessing}</p>
            </div>
            <div className={styles.metaRow}>
              <span>{copy.category}：{lot.category ?? (locale === "ja" ? "未分類" : "未分類")}</span>
              <span>{copy.number}：{lot.order}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.drawButton} onClick={drawLot} disabled={isLoading}>
                {copy.drawButton}
              </button>
            </div>
            {shouldShowShareForm ? (
              <div className={styles.lotShareBox}>
                <h3>把這張小花籤送給對方</h3>
                <p>把剛剛抽到的花籤，變成一封可以打開的祝福信。</p>
                <div className={styles.lotShareGrid}>
                  <label className={styles.field}>
                    <span>送禮人</span>
                    <input
                      type="text"
                      value={fromName}
                      onChange={(event) => updateFromName(event.target.value)}
                      placeholder="例如：Akato"
                    />
                  </label>
                  <label className={styles.field}>
                    <span>收禮人</span>
                    <input
                      type="text"
                      value={toName}
                      onChange={(event) => updateToName(event.target.value)}
                      placeholder="例如：重要的人"
                    />
                  </label>
                  <label className={`${styles.field} ${styles.fieldFull}`}>
                    <span>想送給對方的祝福</span>
                    <textarea
                      value={giftMessage}
                      onChange={(event) => updateGiftMessage(event.target.value)}
                      maxLength={2000}
                      placeholder="寫下一句想送給對方的祝福。"
                    />
                  </label>
                </div>
                <div className={styles.primaryActionRow}>
                  <button type="button" className={styles.primaryGiftButton} onClick={generateLetterLink} disabled={!canGenerateLetter}>
                    產生祝福信連結
                  </button>
                </div>
                {letterLink ? (
                  <div className={styles.resultCard}>
                    <p className={styles.resultLink}>{letterLink}</p>
                    <div className={styles.resultActions}>
                      <button type="button" className={styles.secondaryButton} onClick={copyLetterLink}>
                        複製祝福信連結
                      </button>
                      <a className={styles.lineButton} href={lineShareHref} target="_blank" rel="noreferrer">
                        用 LINE 分享
                      </a>
                      <a className={styles.secondaryButton} href={letterLink} target="_blank" rel="noreferrer">
                        預覽祝福信
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <p className={styles.empty}>{copy.empty}</p>
            <div className={styles.actions}>
              <button className={styles.drawButton} onClick={drawLot} disabled={isLoading}>
                {copy.drawButton}
              </button>
            </div>
          </>
        )}

        {error ? <p className={styles.errorText}>{error}</p> : null}
      </section>

      {showNotes ? (
        <section className={styles.notes}>
          {copy.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </section>
      ) : null}
    </>
  );
}
