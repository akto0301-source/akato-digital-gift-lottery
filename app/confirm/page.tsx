import { getGiftRecord, type GiftLocale } from "@/lib/gift-links";
import { getLocaleCopy } from "@/lib/i18n";
import { FlowerCardImage } from "@/components/flower-card-image";
import { OrchidIllustration } from "@/components/orchid-illustration";
import { getAllLots } from "@/lib/content";
import styles from "./confirm-page.module.css";
import { ExtraMessagePanel } from "./extra-message-panel";

type ConfirmPageProps = {
  params?: Promise<{ id?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const petals = [
  { left: "5%", size: "18px", delay: "-2s", duration: "17s", drift: "34px", color: "linear-gradient(180deg, #f9dfe7 0%, #f2c9d6 100%)" },
  { left: "12%", size: "14px", delay: "-7s", duration: "21s", drift: "-42px", color: "linear-gradient(180deg, #fff7ef 0%, #f4e4d6 100%)" },
  { left: "19%", size: "20px", delay: "-4s", duration: "18s", drift: "48px", color: "linear-gradient(180deg, #f8e4d8 0%, #efcab4 100%)" },
  { left: "28%", size: "16px", delay: "-11s", duration: "23s", drift: "-36px", color: "linear-gradient(180deg, #f7dce5 0%, #edc1d1 100%)" },
  { left: "36%", size: "13px", delay: "-5s", duration: "19s", drift: "30px", color: "linear-gradient(180deg, #fff8f1 0%, #f2e4d8 100%)" },
  { left: "44%", size: "19px", delay: "-9s", duration: "24s", drift: "-54px", color: "linear-gradient(180deg, #fae5db 0%, #f2d0bc 100%)" },
  { left: "52%", size: "15px", delay: "-3s", duration: "20s", drift: "40px", color: "linear-gradient(180deg, #fbe4ea 0%, #f0c8d5 100%)" },
  { left: "60%", size: "17px", delay: "-13s", duration: "22s", drift: "-32px", color: "linear-gradient(180deg, #fff8f2 0%, #f6e5da 100%)" },
  { left: "68%", size: "21px", delay: "-6s", duration: "25s", drift: "52px", color: "linear-gradient(180deg, #f9e3d6 0%, #efc7b0 100%)" },
  { left: "75%", size: "14px", delay: "-10s", duration: "18s", drift: "-28px", color: "linear-gradient(180deg, #f9dce5 0%, #efc4d0 100%)" },
  { left: "82%", size: "18px", delay: "-1s", duration: "23s", drift: "44px", color: "linear-gradient(180deg, #fff7ee 0%, #f4e6d8 100%)" },
  { left: "90%", size: "15px", delay: "-8s", duration: "20s", drift: "-38px", color: "linear-gradient(180deg, #f9e2d7 0%, #f0cbb8 100%)" },
];

function pickValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function resolveLocale(raw: string | undefined, fallback: GiftLocale = "zh"): GiftLocale {
  if (raw === "ja" || raw === "zh") {
    return raw;
  }

  return fallback;
}

function getSharedFlowerLot(message: string) {
  if (!message.includes("小籤詩") || !message.includes("今日花語")) {
    return null;
  }

  return getAllLots().find((lot) => message.includes(`${lot.label}｜${lot.title}`) || message.includes(lot.title)) ?? null;
}

export default async function ConfirmPage({ params, searchParams }: ConfirmPageProps) {
  const routeParams = params ? await params : {};
  const gift = routeParams.id ? await getGiftRecord(routeParams.id) : null;
  const queryParams = searchParams ? await searchParams : {};

  const locale = resolveLocale(gift?.locale ?? pickValue(queryParams.locale), "zh");
  const copy = getLocaleCopy(locale);
  const from = gift?.from ?? pickValue(queryParams.from);
  const to = gift?.to ?? pickValue(queryParams.to);
  const message = gift?.message ?? pickValue(queryParams.message);
  const sharedFlowerLot = getSharedFlowerLot(message);

  return (
    <main className={styles.page}>
      <div className={styles.petalsLayer} aria-hidden="true">
        {petals.map((petal, index) => (
          <span
            key={`${petal.left}-${index}`}
            className={styles.petal}
            style={{
              ["--left" as string]: petal.left,
              ["--size" as string]: petal.size,
              ["--delay" as string]: petal.delay,
              ["--fall-duration" as string]: petal.duration,
              ["--drift" as string]: petal.drift,
              ["--petal-color" as string]: petal.color,
            }}
          />
        ))}
      </div>

      <section className={styles.card}>
        <p className={styles.eyebrow}>{copy.confirm.eyebrow}</p>
        <h1 className={styles.recipient}>{to || copy.confirm.recipientFallback}</h1>
        <p className={styles.meta}>{copy.confirm.meta(from)}</p>
        {sharedFlowerLot ? (
          <FlowerCardImage lot={sharedFlowerLot} className={styles.flowerLotIllustration} imageClassName={styles.flowerLotImage} size={132} />
        ) : (
          <OrchidIllustration
            orchidKey="romantic"
            className={styles.flowerIllustrationWrap}
            imageClassName={styles.flowerIllustration}
            glowClassName={styles.flowerGlow}
          />
        )}
        <div className={styles.messageCard}>{message || copy.confirm.messageFallback}</div>
        <ExtraMessagePanel locale={locale} />
        <div className={styles.footerAction}>
          <a className={styles.backLink} href={copy.confirm.footerHref}>
            {copy.confirm.footerButton}
          </a>
        </div>
      </section>
    </main>
  );
}
