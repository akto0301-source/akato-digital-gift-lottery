import { GiftEntryPanel } from "@/components/gift-entry-panel";
import { LotteryPanel } from "@/components/lottery-panel";
import { getContentLibrary, getRandomLot } from "@/lib/content";
import styles from "./page.module.css";

export default function HomePage() {
  const library = getContentLibrary();
  const initialLot = getRandomLot();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Akato Gift Lottery</p>
        <h1>{library.meta.title}</h1>
        <p className={styles.subtitle}>{library.meta.subtitle}</p>
      </section>

      <GiftEntryPanel />
      <LotteryPanel library={library} initialLot={initialLot} />
    </main>
  );
}
