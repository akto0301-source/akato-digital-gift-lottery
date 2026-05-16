"use client";

import { useState } from "react";
import Link from "next/link";

export default function LetterPage() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main style={styles.page}>
      <div style={styles.petals} aria-hidden="true">
        <span style={{ ...styles.petal, left: "12%", animationDelay: "0s" }} />
        <span style={{ ...styles.petal, left: "24%", animationDelay: "2s" }} />
        <span style={{ ...styles.petal, left: "38%", animationDelay: "4s" }} />
        <span style={{ ...styles.petal, left: "57%", animationDelay: "1s" }} />
        <span style={{ ...styles.petal, left: "73%", animationDelay: "3s" }} />
        <span style={{ ...styles.petal, left: "86%", animationDelay: "5s" }} />
      </div>

      <section style={styles.card}>
        <p style={styles.kicker}>AKATO GIFT LETTER</p>

        <h1 style={styles.title}>你收到一封來自 Akato 的祝福信</h1>

        <p style={styles.subtitle}>有人為你留下了一份心意。</p>

        <div
          style={{
            ...styles.envelope,
            transform: isOpened ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          <div style={styles.envelopeFlap} />
          <div style={styles.envelopeBody}>
            <span style={styles.envelopeText}>✉️</span>
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
          </div>
        )}

        <Link href="/" style={styles.homeLink}>
          我也想送出一封祝福
        </Link>
      </section>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(110vh) rotate(220deg);
            opacity: 0;
          }
        }

        @media (max-width: 520px) {
          main {
            padding: 28px 16px !important;
          }
        }
      `}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "56px 20px",
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
  },
  petal: {
    position: "absolute",
    top: "-24px",
    width: "14px",
    height: "20px",
    borderRadius: "14px 14px 14px 4px",
    background: "rgba(245, 190, 198, 0.55)",
    animation: "fall 9s linear infinite",
  },
  card: {
    width: "min(720px, 100%)",
    padding: "48px 28px",
    borderRadius: "32px",
    border: "1px solid rgba(210, 170, 145, 0.48)",
    background: "rgba(255, 252, 247, 0.82)",
    boxShadow: "0 24px 80px rgba(120, 80, 54, 0.13)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 1,
  },
  kicker: {
    margin: 0,
    color: "#c85d45",
    fontSize: "13px",
    letterSpacing: "0.22em",
    fontWeight: 700,
  },
  title: {
    margin: "18px auto 0",
    fontSize: "clamp(26px, 4.2vw, 40px)",
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  subtitle: {
    margin: "18px auto 0",
    color: "#6e625c",
    fontSize: "18px",
    lineHeight: 1.8,
  },
  envelope: {
  width: "210px",
 height: "148px",
    margin: "38px auto 28px",
    position: "relative",
    transition: "transform 0.6s ease",
  },
  envelopeFlap: {
    position: "absolute",
    top: 0,
    left: "50%",
  width: "144px",
height: "144px",
    transform: "translateX(-50%) rotate(45deg)",
    background: "#f4cfc4",
    borderRadius: "18px",
    border: "1px solid rgba(197, 137, 119, 0.38)",
  },
  envelopeBody: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "102px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #fff8f0 0%, #f7d9cf 55%, #fff3ea 100%)",
    border: "1px solid rgba(197, 137, 119, 0.45)",
    boxShadow: "0 14px 32px rgba(130, 87, 64, 0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  envelopeText: {
    fontSize: "42px",
  },
  button: {
    appearance: "none",
    border: "none",
    borderRadius: "999px",
    padding: "14px 34px",
    background: "#c85d45",
    color: "#fff",
    fontSize: "17px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(200, 93, 69, 0.24)",
  },
  messageBox: {
    margin: "0 auto",
    maxWidth: "520px",
    padding: "24px 22px",
    borderRadius: "24px",
    background: "rgba(255, 246, 240, 0.95)",
    border: "1px solid rgba(210, 170, 145, 0.4)",
    animation: "fadeIn 0.5s ease",
  },
  message: {
    margin: 0,
    fontSize: "25px",
    lineHeight: 1.7,
    fontWeight: 700,
  },
  messageSmall: {
    margin: "12px 0 0",
    color: "#756860",
    fontSize: "16px",
    lineHeight: 1.8,
  },
  homeLink: {
    display: "inline-block",
    marginTop: "26px",
    color: "#9f4d3d",
    fontSize: "15px",
    textDecoration: "none",
  },
};
