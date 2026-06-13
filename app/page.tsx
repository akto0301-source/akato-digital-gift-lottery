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
          {locale === "zh" ? (
            <span className={styles.languageCurrent}>{copy.switcher.zhLabel}</span>
          ) : (
            <Link className={styles.languageLink} href={copy.switcher.zhHref}>
              {copy.switcher.zhLabel}
            </Link>
          )}
          <span className={styles.languageDivider}>|</span>
          {locale === "ja" ? (
            <span className={styles.languageCurrent}>{copy.switcher.jaLabel}</span>
          ) : (
            <Link className={styles.languageLink} href={copy.switcher.jaHref}>
              {copy.switcher.jaLabel}
            </Link>
          )}
        </nav>
      </div>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{copy.hero.eyebrow}</p>
        <h1>{copy.hero.title}</h1>
        <p className={styles.subtitle}>{copy.hero.subtitle}</p>
      </section>

      <section className={styles.entryChooser}>
        <div className={styles.moduleHeader}>
          <p className={styles.moduleEyebrow}>{copy.entryChooser.eyebrow}</p>
          <h2>{copy.entryChooser.title}</h2>
          <p className={styles.moduleLead}>{copy.entryChooser.lead}</p>
        </div>

        <div className={styles.entryChooserGrid}>
          <article className={styles.entryChooserCard}>
            <span className={styles.entryChooserLabel}>{copy.entryChooser.letterLabel}</span>
            <h3>{copy.entryChooser.letterTitle}</h3>
            <p>{copy.entryChooser.letterLead}</p>
            <p className={styles.entryChooserFit}>{copy.entryChooser.letterFit}</p>
            <Link className={styles.entryChooserButton} href="#gift-form">
              {copy.entryChooser.letterButton}
            </Link>
          </article>

          <article className={styles.entryChooserCard}>
            <span className={styles.entryChooserLabel}>{copy.entryChooser.lotLabel}</span>
            <h3>{copy.entryChooser.lotTitle}</h3>
            <p>{copy.entryChooser.lotLead}</p>
            <p className={styles.entryChooserFit}>{copy.entryChooser.lotFit}</p>
            <Link className={styles.entryChooserButton} href="/lot">
              {copy.entryChooser.lotButton}
            </Link>
          </article>
        </div>
      </section>

      <GiftEntryPanel locale={locale} />
      <section className={styles.orderGuide}>
        <div className={styles.moduleHeader}>
          <p className={styles.moduleEyebrow}>{copy.orderGuide.eyebrow}</p>
          <h2>{copy.orderGuide.title}</h2>
          <p className={styles.moduleLead}>{copy.orderGuide.lead}</p>
        </div>

        <div className={styles.orderGuideGrid}>
          <div className={styles.orderGuidePanel}>
            <h3>{copy.orderGuide.situationsTitle}</h3>
            <ul>
              {copy.orderGuide.situations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.orderGuidePanel}>
            <h3>{copy.orderGuide.stepsTitle}</h3>
            <ol>
              {copy.orderGuide.steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div className={styles.orderGuidePanel}>
            <h3>{copy.orderGuide.priceTitle}</h3>
            <ul className={styles.priceList}>
              {copy.orderGuide.prices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles.orderGuideNote}>{copy.orderGuide.note}</p>
      </section>
    </main>
  );
}

export default function RootHomePage() {
  return <HomePage locale="zh" />;
}
