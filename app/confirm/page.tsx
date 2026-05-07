import { EnvelopeOpening } from "@/components/envelope-opening";

import styles from "./page.module.css";

type ConfirmPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pickValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const params = searchParams ? await searchParams : {};
  const from = pickValue(params.from);
  const to = pickValue(params.to);
  const message = pickValue(params.message);

  return (
    <main className={styles.page}>
      <EnvelopeOpening>
        <section className={styles.card}>
          <p className={styles.eyebrow}>Akato Gift</p>
          <h1 className={styles.title}>{to || "收禮人"}</h1>
          <p className={styles.fromText}>這份祝福由 {from || "送禮人"} 為你送上。</p>
          <div className={styles.messageCard}>
            {message || "願今天的心意，正好落在你最需要被溫柔接住的時候。"}
          </div>
        </section>
      </EnvelopeOpening>
    </main>
  );
}
