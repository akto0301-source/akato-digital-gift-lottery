"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";

const extraMessages = [
  "願你在平凡的日子裡，也總能遇見剛剛好的溫柔。",
  "希望這份心意，替你把今天多留下一點柔軟和光。",
  "願你被在乎、被惦記，也被世界輕輕善待。",
  "如果最近有點累，願這一句話剛好替你擋住一點風。",
  "願你抬頭時有光，低頭時有安心，回頭時有溫暖的人。",
  "希望你收下的不只是祝福，還有被好好放在心上的感覺。"
];

function pickNextIndex(currentIndex: number) {
  if (extraMessages.length <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * extraMessages.length);
  }

  return nextIndex;
}

export function ExtraMessagePanel() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * extraMessages.length));
  }, []);

  function handleShuffle() {
    setMessageIndex((currentIndex) => pickNextIndex(currentIndex));
    setAnimateKey((current) => current + 1);
  }

  return (
    <div className={styles.extraSection}>
      <p className={styles.extraLead}>這份心意還想對你說⋯</p>
      <p key={animateKey} className={`${styles.extraMessage} ${styles.extraMessageVisible}`}>
        {extraMessages[messageIndex]}
      </p>
      <button type="button" className={styles.shuffleButton} onClick={handleShuffle}>
        換一句看看
      </button>
    </div>
  );
}
