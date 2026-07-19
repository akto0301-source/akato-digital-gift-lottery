import type { Metadata } from "next";
import { GiftLetterExperience } from "@/components/gift-letter-experience";
import styles from "@/app/confirm/confirm-page.module.css";
import { getGiftRecord, isGiftRecordAvailable } from "@/lib/gift-links";

type GiftPageProps = {
  params: Promise<{ id: string }>;
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AKATO_GIFT_BASE_URL ?? "https://gift.akato.net"),
  title: "Akato 今日小花籤",
  description: "一封為你準備的數位祝福信",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Akato 今日小花籤",
    description: "一封為你準備的數位祝福信",
    images: ["/flowers/lily.png"],
    siteName: "Akato",
    type: "website",
  },
};

function isValidGiftId(id: string) {
  return /^[A-Za-z0-9_-]{12,64}$/.test(id);
}

async function loadGift(id: string) {
  if (!isValidGiftId(id)) {
    return null;
  }

  try {
    return await getGiftRecord(id);
  } catch {
    return null;
  }
}

function PetalsLayer() {
  return (
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
  );
}

function MissingGiftMessage() {
  return (
    <main className={styles.page}>
      <PetalsLayer />
      <section className={styles.card}>
        <p className={styles.eyebrow}>AKATO GIFT LETTER</p>
        <h1 className={styles.recipient}>這封祝福信暫時無法開啟</h1>
        <p className={styles.meta}>連結可能已過期，或短代碼不存在。</p>
        <div className={styles.messageCard}>請回到送禮人提供的最新連結，再試一次。</div>
        <div className={styles.footerAction}>
          <a className={styles.backLink} href="/">
            回到 Akato
          </a>
        </div>
      </section>
    </main>
  );
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const gift = await loadGift(id);

  if (!gift || !isGiftRecordAvailable(gift)) {
    return <MissingGiftMessage />;
  }

  return (
    <GiftLetterExperience
      locale={gift.locale}
      fromName={gift.fromName}
      toName={gift.toName}
      giftMessage={gift.message}
      categoryId={gift.cardId}
      sceneId={gift.sceneId}
      sharedFlowerLot={gift.lotSnapshot}
    />
  );
}
