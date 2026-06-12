import Link from "next/link";
import { LotteryPanel } from "@/components/lottery-panel";
import { getContentLibrary, getRandomLot } from "@/lib/content";
import styles from "./page.module.css";

export default function LotPage() {
  const library = getContentLibrary();
  const initialLot = getRandomLot();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>AKATO FLOWER LOT</p>
        <h1>今日小花籤</h1>
        <p>抽一張小小的花箋，看看今天有什麼話想陪你一下。</p>
      </section>

      <LotteryPanel library={library} initialLot={initialLot} locale="zh" showNotes={false} />

      <section className={styles.cta}>
        <p>想把這份祝福送給別人？</p>
        <Link href="/">製作一封數位回禮</Link>
      </section>
    </main>
  );
}
