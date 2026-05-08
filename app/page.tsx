import { GiftEntryPanel } from "@/components/gift-entry-panel";
import { LotteryPanel } from "@/components/lottery-panel";
import { getContentLibrary, getRandomLot } from "@/lib/content";
import styles from "./page.module.css";

export default function HomePage() {
  const library = getContentLibrary();
  const initialLot = getRandomLot();

  return (
    <main className={styles.page}>
      <div className={styles.petalsLayer} aria-hidden="true">
        <span className={`${styles.petal} ${styles.petalOne}`} />
        <span className={`${styles.petal} ${styles.petalTwo}`} />
        <span className={`${styles.petal} ${styles.petalThree}`} />
        <span className={`${styles.petal} ${styles.petalFour}`} />
        <span className={`${styles.petal} ${styles.petalFive}`} />
        <span className={`${styles.petal} ${styles.petalSix}`} />
      </div>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Akato Gift Lottery</p>
        <h1>{library.meta.title}</h1>
        <p className={styles.subtitle}>{library.meta.subtitle}</p>
      </section>

      <GiftEntryPanel />

      <section className={styles.lotterySection}>
        <div className={styles.lotteryIntro}>
          <p className={styles.moduleEyebrow}>今日好籤</p>
          <h2>抽一支今日好籤</h2>
          <p className={styles.moduleLead}>讓一段剛剛好的祝福，落在今天最需要被輕輕接住的地方。</p>
        </div>
        <LotteryPanel library={library} initialLot={initialLot} />
      </section>
    </main>
  );
}
