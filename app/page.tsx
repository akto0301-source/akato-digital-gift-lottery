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
  const isSampleLibrary = library.lots.some((lot) => {
    const fortune = lot.fortune ?? "";
    const blessing = lot.blessing ?? "";
    const theme = lot.theme ?? "";

    return lot.category === "sample" || fortune.includes("請提供") || blessing.includes("請提供") || theme.includes("sample");
  });

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
      <section className={styles.orderGuide}>
        <div className={styles.moduleHeader}>
          <p className={styles.moduleEyebrow}>AKATO DIGITAL GIFT</p>
          <h2>數位回禮，可以這樣送</h2>
          <p className={styles.moduleLead}>一封可以保存的祝福信，適合補上來不及準備、卻仍想好好送出的心意。</p>
        </div>

        <div className={styles.orderGuideGrid}>
          <div className={styles.orderGuidePanel}>
            <h3>適合情境</h3>
            <ul>
              <li>臨時補上一份祝福</li>
              <li>合送後想給每個人一份小心意</li>
              <li>生日、升遷、調動、感謝支持</li>
              <li>花禮之外，再加一封可以保存的祝福信</li>
            </ul>
          </div>

          <div className={styles.orderGuidePanel}>
            <h3>使用方式</h3>
            <ol>
              <li>填寫送禮人與收禮人</li>
              <li>選擇一張祝福花箋</li>
              <li>產生專屬祝福連結</li>
              <li>複製或用 LINE 分享給對方</li>
            </ol>
          </div>

          <div className={styles.orderGuidePanel}>
            <h3>價格測試</h3>
            <ul className={styles.priceList}>
              <li>49 元｜一份輕祝福</li>
              <li>99 元｜客製文字祝福</li>
              <li>149 元｜加長祝福／合送版本</li>
            </ul>
          </div>
        </div>

        <p className={styles.orderGuideNote}>若需要由 Akato 協助代製，可透過 LINE 聯繫。</p>
      </section>
      {isSampleLibrary ? (
        <section className={styles.lotteryModule}>
          <p className={styles.moduleEyebrow}>今日好籤</p>
          <h2>今日好籤正在準備中</h2>
          <p className={styles.moduleLead}>稍後會帶著剛剛好的祝福回來。</p>
        </section>
      ) : (
        <LotteryPanel library={library} initialLot={initialLot} locale={locale} />
      )}
    </main>
  );
}

export default function RootHomePage() {
  return <HomePage locale="zh" />;
}
