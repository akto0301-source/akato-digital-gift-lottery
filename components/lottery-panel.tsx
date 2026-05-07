"use client";

import { useState } from "react";
import type { ContentLibrary, ContentLot } from "@/lib/content";
import styles from "@/app/page.module.css";

type LotteryPanelProps = {
  library: ContentLibrary;
  initialLot: ContentLot | null;
};

type LotteryResponse = {
  ok: boolean;
  error?: string;
  lot?: ContentLot;
};

const demoBlessing = "願今天有一點光，剛好照進你的心裡。";

function getDisplayText(value?: string, category?: string) {
  const normalized = value?.trim();

  if (!normalized || normalized === "請提供此籤文內容。" || normalized === "請提供祝福" || category === "sample") {
    return demoBlessing;
  }

  return normalized;
}

export function LotteryPanel({ library, initialLot }: LotteryPanelProps) {
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

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <span>抽籤結果</span>
          <span>{lot?.label ?? "尚未抽籤"}</span>
        </div>

        {lot ? (
          <>
            <h2>{lot.title}</h2>
            <p className={styles.fortune}>{getDisplayText(lot.fortune, lot.category)}</p>
            <div className={styles.metaRow}>
              <span>分類：{lot.category ?? "未分類"}</span>
              <span>編號：{lot.order}</span>
            </div>
            <div className={styles.blessingBlock}>
              <h3>祝賀語</h3>
              <p>{getDisplayText(lot.blessing, lot.category)}</p>
            </div>
          </>
        ) : (
          <p className={styles.empty}>{library.fallbackMessages.empty}</p>
        )}

        <div className={styles.actions}>
          <button className={styles.drawButton} onClick={drawLot} disabled={isLoading}>
            {isLoading ? "抽籤中..." : library.meta.ctaLabel ?? "抽一支籤"}
          </button>
        </div>

        {error ? <p className={styles.errorText}>{error}</p> : null}
      </section>

    </>
  );
}
