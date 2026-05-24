import Link from "next/link";
import { GiftEntryPanel } from "@/components/gift-entry-panel";
import { LotteryPanel } from "@/components/lottery-panel";
import { getContentLibrary, getRandomLot } from "@/lib/content";
import { getLocaleCopy } from "@/lib/i18n";
import type { GiftLocale } from "@/lib/gift-links";
import styles from "./page.module.css";

type HomePageProps = {
  locale?: GiftLocale;
};

export function HomePage({ locale = "zh" }: HomePageProps) {
  const library = getContentLibrary();
  const initialLot = getRandomLot();
  const copy = getLocaleCopy(locale);

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <nav className={styles.languageSwitcher} aria-label="Language switcher">
          <span className={locale === "zh" ? styles.languageCurrent : styles.languageLink}>中文</span>
          <span className={styles.languageDivider}>|</span>
          {locale === "ja" ? (
            <span className={styles.languageCurrent}>日本語</span>
          ) : (
            <Link className={styles.languageLink} href="/ja">
              日本語
            </Link>
          )}
          {locale === "ja" ? (
            <>
              <span className={styles.languageDivider}>|</span>
              <Link className={styles.languageLink} href="/">
                中文
              </Link>
            </>
          ) : null}
        </nav>
      </div>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{copy.hero.eyebrow}</p>
        <h1>{copy.hero.title}</h1>
        <p className={styles.subtitle}>{copy.hero.subtitle}</p>
      </section>

      <GiftEntryPanel locale={locale} />
      <LotteryPanel library={library} initialLot={initialLot} locale={locale} />
    </main>
  );
}

export default function RootHomePage() {
  return <HomePage locale="zh" />;
}
