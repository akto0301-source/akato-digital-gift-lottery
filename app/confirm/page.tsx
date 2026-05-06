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
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 16px 56px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          borderRadius: "32px",
          padding: "32px 24px",
          background: "linear-gradient(180deg, rgba(255, 252, 247, 0.96), rgba(255, 243, 241, 0.98))",
          border: "1px solid rgba(215, 197, 171, 0.92)",
          boxShadow: "0 22px 72px rgba(114, 83, 74, 0.12)",
        }}
      >
        <p style={{ margin: 0, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b6716f", fontSize: "0.82rem" }}>
          Akato Gift
        </p>
        <h1 style={{ margin: "12px 0 0", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>{to || "收禮人"}</h1>
        <p style={{ margin: "10px 0 0", lineHeight: 1.8, color: "rgba(31, 26, 23, 0.76)" }}>
          這份祝福由 {from || "送禮人"} 為你送上。
        </p>
        <div
          style={{
            marginTop: "24px",
            padding: "22px",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid rgba(215, 197, 171, 0.92)",
            lineHeight: 1.9,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message || "願今天的心意，正好落在你最需要被溫柔接住的時候。"}
        </div>
      </section>
    </main>
  );
}
