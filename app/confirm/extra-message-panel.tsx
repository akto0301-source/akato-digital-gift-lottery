"use client";

import { useState } from "react";

import styles from "./confirm-page.module.css";
import { getLocaleCopy } from "@/lib/i18n";
import type { GiftLocale } from "@/lib/gift-links";

const MAX_SHUFFLE_ATTEMPTS = 3;
const FINAL_MESSAGES: Record<GiftLocale, string> = {
  zh: "今日的溫柔已安放",
  ja: "今日のやさしさは、そっと届きました",
};

function pickNextIndex(currentIndex: number, max: number) {
  if (max <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * max);
  }

  return nextIndex;
}

type ExtraMessagePanelProps = {
  locale: GiftLocale;
};

export function ExtraMessagePanel({ locale }: ExtraMessagePanelProps) {
  const copy = getLocaleCopy(locale);
  const messages = copy.extraMessages;
  const [messageIndex, setMessageIndex] = useState(() => Math.floor(Math.random() * messages.length));
  const [animateKey, setAnimateKey] = useState(0);
  const [shuffleAttempts, setShuffleAttempts] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  function handleShuffle() {
    if (isLimitReached) {
      return;
    }

    if (shuffleAttempts >= MAX_SHUFFLE_ATTEMPTS) {
      setIsLimitReached(true);
      setAnimateKey((current) => current + 1);
      return;
    }

    setMessageIndex((currentIndex) => pickNextIndex(currentIndex, messages.length));
    setAnimateKey((current) => current + 1);
    setShuffleAttempts((current) => current + 1);
  }

  return (
    <div className={styles.extraSection}>
      <p className={styles.extraLead}>{copy.confirm.extraLead}</p>
      <p key={animateKey} className={`${styles.extraMessage} ${styles.extraMessageVisible}`}>
        {isLimitReached ? FINAL_MESSAGES[locale] : messages[messageIndex]}
      </p>
      <button type="button" className={styles.shuffleButton} onClick={handleShuffle} disabled={isLimitReached}>
        {copy.confirm.shuffleButton}
      </button>
    </div>
  );
}
