import Link from "next/link";
import { GiftEntryPanel } from "@/components/gift-entry-panel";
import { getLocaleCopy } from "@/lib/i18n";
import type { GiftLocale } from "@/lib/gift-links";
import styles from "./page.module.css";

type HomePageProps = {
  locale?: GiftLocale;
};

export function HomePage({ locale = "zh" }: HomePageProps) {
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

      <section className={styles.entryChooser}>
        <div className={styles.moduleHeader}>
          <p className={styles.moduleEyebrow}>AKATO BLESSING ENTRY</p>
          <h2>今天，想用哪一種方式送出祝福？</h2>
          <p className={styles.moduleLead}>一封可以打開的信，或一張剛好遇見你的花籤，都可以成為送給某人的小小心意。</p>
        </div>

        <div className={styles.entryChooserGrid}>
          <article className={styles.entryChooserCard}>
            <span className={styles.entryChooserLabel}>LETTER</span>
            <h3>寫一封祝福信</h3>
            <p>自己寫下想說的話，選一張花箋，產生一封可以打開的專屬祝福信。</p>
            <p className={styles.entryChooserFit}>生日、升遷、調動、感謝、合送、晚到祝福</p>
            <Link className={styles.entryChooserButton} href="#gift-form">
              製作數位回禮
            </Link>
          </article>

          <article className={styles.entryChooserCard}>
            <span className={styles.entryChooserLabel}>FLOWER LOT</span>
            <h3>抽一張今日小花籤</h3>
            <p>先抽一張今日花語，若剛好想到某個人，也可以把它做成一封祝福信送出去。</p>
            <p className={styles.entryChooserFit}>輕量祝福、安慰朋友、臨時想傳一句話、LINE 分享</p>
            <Link className={styles.entryChooserButton} href="/lot">
              抽今日小花籤
            </Link>
          </article>
        </div>
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
    </main>
  );
}

export default function RootHomePage() {
  return <HomePage locale="zh" />;
}
