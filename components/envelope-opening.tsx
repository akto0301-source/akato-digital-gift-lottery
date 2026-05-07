"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import styles from "./envelope-opening.module.css";

type EnvelopeOpeningProps = {
  children: ReactNode;
};

export function EnvelopeOpening({ children }: EnvelopeOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const openTimer = window.setTimeout(() => setIsOpen(true), 260);
    const revealTimer = window.setTimeout(() => setIsRevealed(true), 1980);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className={styles.stage}>
      <div className={`${styles.envelopeScene} ${isRevealed ? styles.sceneHidden : ""}`} aria-hidden={isRevealed}>
        <div className={`${styles.envelope} ${isOpen ? styles.envelopeOpen : ""}`}>
          <div className={styles.sparkle} />
          <div className={styles.heart}>♡</div>
          <div className={styles.flap} />
          <div className={styles.letter}>
            <span className={styles.letterLine} />
            <span className={styles.letterLine} />
            <span className={styles.letterLineShort} />
          </div>
          <div className={styles.body} />
          <div className={styles.shadow} />
        </div>
      </div>

      <div className={`${styles.content} ${isRevealed ? styles.contentVisible : ""}`}>
        {children}
      </div>
    </div>
  );
}
