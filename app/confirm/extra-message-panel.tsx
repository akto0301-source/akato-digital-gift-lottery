"use client";

import { useState } from "react";

import styles from "./confirm-page.module.css";
import { getLocaleCopy } from "@/lib/i18n";
import type { GiftLocale } from "@/lib/gift-links";

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

  function handleShuffle() {
    setMessageIndex((currentIndex) => pickNextIndex(currentIndex, messages.length));
    setAnimateKey((current) => current + 1);
  }

  return (
    <div className={styles.extraSection}>
      <p className={styles.extraLead}>{copy.confirm.extraLead}</p>
      <p key={animateKey} className={`${styles.extraMessage} ${styles.extraMessageVisible}`}>
        {messages[messageIndex]}
      </p>
      <button type="button" className={styles.shuffleButton} onClick={handleShuffle}>
        {copy.confirm.shuffleButton}
      </button>
    </div>
  );
}
