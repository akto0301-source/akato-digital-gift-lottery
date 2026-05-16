"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function LetterPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFromName(params.get("from")?.trim() || "");
    setToName(params.get("to")?.trim() || "");
  }, []);

  const petals = useMemo(
    () => [
      { left: "8%", delay: "0s", duration: "11s", scale: 0.8, opacity: 0.45 },
      { left: "16%", delay: "2s", duration: "13s", scale: 1, opacity: 0.55 },
      { left: "24%", delay: "5s", duration: "12s", scale: 0.7, opacity: 0.38 },
      { left: "33%", delay: "1s", duration: "14s", scale: 1.15, opacity: 0.48 },
      { left: "42%", delay: "4s", duration: "10s", scale: 0.75, opacity: 0.42 },
      { left: "51%", delay: "6s", duration: "15s", scale: 1, opacity: 0.5 },
      { left: "61%", delay: "3s", duration: "12s", scale: 0.9, opacity: 0.42 },
      { left: "70%", delay: "7s", duration: "14s", scale: 1.18, opacity: 0.48 },
      { left: "78%", delay: "2.5s", duration: "11s", scale: 0.72, opacity: 0.4 },
      { left: "87%", delay: "5.5s", duration: "13s", scale: 1, opacity: 0.5 },
      { left: "94%", delay: "1.5s", duration: "16s", scale: 0.85, opacity: 0.36 },
      { left: "12%", delay: "8s", duration: "15s", scale: 1.1, opacity: 0.42 },
      { left: "46%", delay: "9s", duration: "16s", scale: 0.68, opacity: 0.35 },
      { left: "66%", delay: "10s", duration: "13s", scale: 0.95, opacity: 0.44 },
    ],
    []
  );

  return (
    <main style={styles.page}>
      <div style={styles.petals} aria-hidden="true">
        {petals.map((petal, index) => (
          <span
            key={index}
            style={{
              ...styles.petal,
              left: petal.left,
              opacity: petal.opacity,
              transform: `scale(${petal.scale})`,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          />
        ))}
      </div>

      <section style={styles.card}>
        <p style={styles.kicker}>AKATO GIFT LETTER</p>

        {toName ? <p style={styles.recipient}>給 {toName}</p> : null}

        <h1 style={styles.title}>你收到一封來自 Akato 的祝福信</h1>

        <p style={styles.subtitle}>有人為你留下了一份心意。</p>

        <div
          style={{
            ...styles.envelope,
            transform: isOpened ? "translateY(-8px)" : "translateY(0)",
          }}
        >
          <div
            style={{
              ...styles.letterPaper,
              opacity: isOpened ? 1 : 0,
              transform: isOpened
                ? "translate(-50%, -52px)"
                : "translate(-50%, 8px)",
            }}
          />

          <div
            style={{
              ...styles.envelopeFlap,
              transform: isOpened
                ? "translateX(-50%) rotateX(58deg) rotate(45deg)"
                : "translateX(-50%) rotate(45deg)",
              opacity: isOpened ? 0.78 : 1,
            }}
          />

          <div style={styles.envelopeBody}>
            <div style={styles.foldLineLeft} />
            <div style={styles.foldLineRight} />

            <div
              style={{
                ...styles.heartSeal,
                opacity: isOpened ? 0 : 1,
                transform: isOpened
                  ? "translate(-50%, -50%) scale(0.86)"
                  : "translate(-50%, -50%) scale(1)",
              }}
            >
              ♥
            </div>
          </div>
        </div>

        {!isOpened ? (
          <button style={styles.button} onClick={() => setIsOpened(true)}>
            打開信封
          </button>
        ) : (
          <div style={styles.messageBox}>
            <p style={styles.message}>願今天的你，被溫柔地接住。</p>
            <p style={styles.messageSmall}>
              慢慢來也沒關係，這份祝福會陪你一下。
            </p>
            {fromName ? (
              <p style={styles.sender}>來自 {fromName} 的祝福</p>
            ) : null}
          </div>
        )}

        <Link href="/" style={styles.homeLink}>
          我也想送出一封祝福
        </Link>
      </section>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-36px) rotate(0deg);
          }
          100% {
            transform: translateY(112vh) rotate(260deg);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 520px) {
          main {
            padding: 24px 14px !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "42px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, #fff7ef 0%, #f8e6dc 38%, #fffaf4 100%)",
    color: "#2b2421",
    position: "relative",
    overflow: "hidden",
  },
  petals: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 0,
  },
  petal: {
    position: "absolute",
    top: "-28px",
    width: "14px",
    height: "20px",
    borderRadius: "14px 14px 14px 4px",
    background: "rgba(245, 190, 198, 0.58)",
    animationName: "fall",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  card: {
    width: "min(560px, 100%)",
    padding: "34px 22px 30px",
    borderRadius: "30px",
    border: "1px solid rgba(210, 170, 145, 0.48)",
    background: "rgba(255, 252, 247, 0.86)",
    boxShadow: "0 20px 60px rgba(120, 80, 54, 0.12)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 1,
  },
  kicker: {
    margin: 0,
    color: "#c85d45",
    fontSize: "12px",
    letterSpacing: "0.22em",
    fontWeight: 700,
  },
  recipient: {
    margin: "16px 0 0",
    color: "#9f6a55",
    fontSize: "16px",
    letterSpacing: "0.08em",
    fontWeight: 600,
  },
  title: {
    margin: "14px auto 0",
    fontSize: "clamp(26px, 4.2vw, 40px)",
    lineHeight: 1.22,
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  subtitle: {
    margin: "14px auto 0",
    color: "#6e625c",
    fontSize: "16px",
    lineHeight: 1.7,
  },
  envelope: {
    width: "210px",
    height: "148px",
    margin: "26px auto 22px",
    position: "relative",
    transition: "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)",
    perspective: "800px",
  },
  letterPaper: {
    position: "absolute",
    left: "50%",
    bottom: "54px",
    width: "150px",
    height: "98px",
    borderRadius: "18px",
    background:
      "linear-gradient(180deg, rgba(255, 253, 248, 0.98), rgba(250, 239, 228, 0.98))",
    border: "1px solid rgba(215, 186, 158, 0.45)",
    boxShadow: "0 12px 28px rgba(120, 90, 60, 0.12)",
    transition:
      "opacity 0.78s ease 0.18s, transform 0.82s cubic-bezier(0.22, 1, 0.36, 1) 0.12s",
    zIndex: 1,
  },
  envelopeFlap: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "144px",
    height: "144px",
    background:
      "linear-gradient(135deg, #fffaf3 0%, #f6e5d7 58%, #eed8c8 100%)",
    borderRadius: "20px",
    border: "1px solid rgba(210, 185, 155, 0.52)",
    boxShadow: "0 10px 24px rgba(120, 90, 60, 0.1)",
    transformOrigin: "center 78%",
    transition:
      "transform 0.76s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
    zIndex: 2,
  },
  envelopeBody: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "102px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #fffaf3 0%, #f8efe4 48%, #f3e4d5 100%)",
    border: "1px solid rgba(210, 185, 155, 0.55)",
    boxShadow: "0 18px 36px rgba(120, 90, 60, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 3,
  },
  foldLineLeft: {
    position: "absolute",
    left: "-8px",
    bottom: "6px",
    width: "132px",
    height: "1px",
    background: "rgba(210, 185, 155, 0.42)",
    transform: "rotate(31deg)",
    transformOrigin: "left center",
  },
  foldLineRight: {
    position: "absolute",
    right: "-8px",
    bottom: "6px",
    width: "132px",
    height: "1px",
    background: "rgba(210, 185, 155, 0.42)",
    transform: "rotate(-31deg)",
    transformOrigin: "right center",
  },
  heartSeal: {
    position: "absolute",
    left: "50%",
    top: "48%",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#c97972",
    fontSize: "27px",
    lineHeight: 1,
    background:
      "radial-gradient(circle at 35% 30%, #fff7ef 0%, #f3c8c0 58%, #dba69c 100%)",
    border: "1px solid rgba(205, 148, 137, 0.46)",
    boxShadow:
      "0 10px 22px rgba(150, 95, 82, 0.16), inset 0 1px 4px rgba(255, 255, 255, 0.6)",
    transition: "opacity 0.24s ease, transform 0.26s ease",
    zIndex: 4,
  },
  button: {
    appearance: "none",
    border: "none",
    borderRadius: "999px",
    padding: "13px 32px",
    background: "#c85d45",
    color: "#fff",
    fontSize: "17px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(200, 93, 69, 0.22)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBox: {
    margin: "4px auto 0",
    maxWidth: "460px",
    padding: "22px 20px",
    borderRadius: "24px",
    background: "rgba(255, 246, 240, 0.96)",
    border: "1px solid rgba(210, 170, 145, 0.4)",
    boxShadow: "0 14px 34px rgba(120, 80, 54, 0.1)",
    animation: "fadeUp 0.72s ease both",
  },
  message: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.7,
    fontWeight: 700,
  },
  messageSmall: {
    margin: "12px 0 0",
    color: "#756860",
    fontSize: "15px",
    lineHeight: 1.8,
  },
  sender: {
    margin: "16px 0 0",
    color: "#a45b4b",
    fontSize: "14px",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  homeLink: {
    display: "block",
    marginTop: "22px",
    color: "#9f4d3d",
    fontSize: "15px",
    textDecoration: "none",
  },
};
