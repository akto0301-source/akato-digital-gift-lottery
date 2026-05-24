"use client";

import { useState } from "react";
import type { ContentLibrary, ContentLot } from "@/lib/content";
import type { GiftLocale } from "@/lib/gift-links";
import styles from "@/app/page.module.css";

type LotteryPanelProps = {
  library: ContentLibrary;
  initialLot: ContentLot | null;
  locale: GiftLocale;
};

type LotteryResponse = {
  ok: boolean;
  error?: string;
  lot?: ContentLot;
};

export function LotteryPanel({ library, initialLot, locale }: LotteryPanelProps) {
  const [lot, setLot] = useState<ContentLot | null>(initialLot);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        blessing: "祝賀語",
        drawButton: isLoading ? "抽籤中..." : library.meta.ctaLabel ?? "抽一支籤",
        notes: [
          "正式 25 籤與祝賀語內容請填入 `data/content-library.json`。",
          "LINE Webhook endpoint: `/api/line/webhook`",
          "隨機抽籤 API: `GET /api/lots/random`",
        ],
      };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <span>{copy.cardHeaderLeft}</span>
          <span>{copy.cardHeaderRight}</span>
        </div>

        {lot ? (
          <>
            <h2>{lot.title}</h2>
            <p className={styles.fortune}>{lot.fortune}</p>
            <div className={styles.metaRow}>
              <span>{copy.category}：{lot.category ?? (locale === "ja" ? "未分類" : "未分類")}</span>
              <span>{copy.number}：{lot.order}</span>
            </div>
            <div className={styles.blessingBlock}>
              <h3>{copy.blessing}</h3>
              <p>{lot.blessing}</p>
            </div>
          </>
        ) : (
          <p className={styles.empty}>{copy.empty}</p>
        )}

        <div className={styles.actions}>
          <button className={styles.drawButton} onClick={drawLot} disabled={isLoading}>
            {copy.drawButton}
          </button>
        </div>

        {error ? <p className={styles.errorText}>{error}</p> : null}
      </section>

      <section className={styles.notes}>
        {copy.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </section>
    </>
  );
}
