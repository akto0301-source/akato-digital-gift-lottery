"use client";

import { useMemo, useState } from "react";
import styles from "@/app/page.module.css";
import { blessingCards, getLocaleCopy } from "@/lib/i18n";
import type { GiftLocale } from "@/lib/gift-links";

const DEFAULT_ORIGIN = "https://gift.akato.net";

type FormState = {
  from: string;
  to: string;
  message: string;
};

type GiftEntryPanelProps = {
  locale: GiftLocale;
};

type BlessingCardVisual = {
  accent: string;
  petal: string;
  note: Record<GiftLocale, string>;
  motif: "rose" | "leaf" | "daisy" | "forget" | "bloom" | "bundle";
};

const blessingCardVisuals: Record<string, BlessingCardVisual> = {
  "gentle-care": {
    accent: "#c99196",
    petal: "#f2d8d9",
    motif: "rose",
    note: {
      zh: "溫柔、日常、陪伴",
      ja: "やさしさ、日常、寄り添い",
    },
  },
  "calm-days": {
    accent: "#9aa77d",
    petal: "#e5ead6",
    motif: "leaf",
    note: {
      zh: "穩重、敬意、祝福",
      ja: "穏やか、敬意、祝福",
    },
  },
  "thank-you-light": {
    accent: "#c6a15b",
    petal: "#f4e6bd",
    motif: "daisy",
    note: {
      zh: "謝意、照亮、被記得",
      ja: "感謝、灯り、覚えていること",
    },
  },
  "tender-arrival": {
    accent: "#8aa0b8",
    petal: "#dbe7ef",
    motif: "forget",
    note: {
      zh: "補上心意、不讓祝福缺席",
      ja: "遅れても、気持ちは届ける",
    },
  },
  "birthday-bloom": {
    accent: "#c98a73",
    petal: "#f4d5c6",
    motif: "bloom",
    note: {
      zh: "今天被好好珍惜",
      ja: "今日を大切に祝う",
    },
  },
  "shared-blessing": {
    accent: "#9a8fbd",
    petal: "#e0dced",
    motif: "bundle",
    note: {
      zh: "把大家的心意收在一起",
      ja: "みんなの気持ちを束ねる",
    },
  },
};

function getCardVisual(cardId: string) {
  return blessingCardVisuals[cardId] ?? blessingCardVisuals["gentle-care"];
}

function BlessingMotif({ visual }: { visual: BlessingCardVisual }) {
  const common = {
    fill: visual.petal,
    stroke: visual.accent,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg className={styles.templateMotif} viewBox="0 0 88 88" aria-hidden="true">
      <path d="M20 70c17 6 34 6 51-1" fill="none" stroke="#e5d2bd" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M43 70c-2-15 0-28 7-42" fill="none" stroke={visual.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.82" />
      <path d="M43 56c-9-6-18-6-27-1 8 5 17 6 27 1Z" fill="#a9b58d" opacity="0.42" />
      <path d="M49 58c9-8 18-10 28-5-8 6-17 8-28 5Z" fill="#a9b58d" opacity="0.38" />

      {visual.motif === "rose" ? (
        <g>
          <path d="M39 25c8-11 23-8 27 2 5 12-5 23-20 25-12-6-14-17-7-27Z" {...common} opacity="0.7" />
          <path d="M43 30c6-7 15-6 18 0 3 7-3 15-13 17-8-4-9-11-5-17Z" fill="#fff7ed" stroke={visual.accent} strokeWidth="1" opacity="0.72" />
          <path d="M44 38c5-4 10-5 15-2M47 44c5 0 9-2 12-6" fill="none" stroke={visual.accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
        </g>
      ) : null}

      {visual.motif === "leaf" ? (
        <g>
          <path d="M39 30c7-7 14-10 23-8-2 10-10 17-23 18Z" {...common} opacity="0.64" />
          <path d="M48 43c8-7 17-9 27-5-5 9-15 13-27 12Z" {...common} opacity="0.52" />
          <path d="M40 39c7-5 14-10 21-16M49 49c8-4 16-8 24-11" fill="none" stroke={visual.accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.58" />
        </g>
      ) : null}

      {visual.motif === "daisy" ? (
        <g transform="translate(52 34)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse key={angle} cx="0" cy="-10" rx="4" ry="10" fill={visual.petal} opacity="0.8" transform={`rotate(${angle})`} />
          ))}
          <circle r="6" fill="#f3d68b" stroke={visual.accent} strokeWidth="0.9" />
        </g>
      ) : null}

      {visual.motif === "forget" ? (
        <g>
          {[[41, 31], [55, 28], [63, 40], [48, 45]].map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse key={angle} cx="0" cy="-5" rx="2.8" ry="5.8" fill={visual.petal} opacity="0.78" transform={`rotate(${angle})`} />
              ))}
              <circle r="1.8" fill={visual.accent} opacity="0.72" />
            </g>
          ))}
        </g>
      ) : null}

      {visual.motif === "bloom" ? (
        <g transform="translate(53 35)">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path key={angle} d="M0 2c-6-7-5-18 0-25 6 7 6 18 0 25Z" fill={visual.petal} stroke={visual.accent} strokeWidth="0.8" opacity="0.76" transform={`rotate(${angle})`} />
          ))}
          <circle r="4" fill="#f0cda4" opacity="0.8" />
        </g>
      ) : null}

      {visual.motif === "bundle" ? (
        <g>
          {[[43, 30], [55, 29], [64, 41], [48, 43], [58, 52]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="7.4" fill={visual.petal} stroke={visual.accent} strokeWidth="0.75" opacity="0.68" />
          ))}
          <path d="M44 62c8 5 17 5 26 0" fill="none" stroke={visual.accent} strokeWidth="2.4" strokeLinecap="round" opacity="0.38" />
        </g>
      ) : null}
    </svg>
  );
}

function getOrigin() {
  return typeof window === "undefined" ? DEFAULT_ORIGIN : window.location.origin;
}

function getCardById(cardId: string) {
  return blessingCards.find((item) => item.id === cardId) ?? null;
}

function getCardMessages(locale: GiftLocale, cardId: string) {
  const card = getCardById(cardId);

  if (!card) {
    return [];
  }

  return locale === "ja" ? card.ja.messages : card.zh.messages;
}

function pickInitialMessage(locale: GiftLocale, cardId: string) {
  return getCardMessages(locale, cardId)[0] ?? "";
}

function pickAnotherMessage(messages: string[], currentMessage: string) {
  if (messages.length <= 1) {
    return currentMessage;
  }

  const candidates = messages.filter((message) => message !== currentMessage);
  if (candidates.length === 0) {
    return currentMessage;
  }

  return candidates[Math.floor(Math.random() * candidates.length)] ?? currentMessage;
}

export function GiftEntryPanel({ locale }: GiftEntryPanelProps) {
  const copy = getLocaleCopy(locale);
  const [form, setForm] = useState<FormState>({ from: "", to: "", message: "" });
  const [giftLink, setGiftLink] = useState("");
  const [copyLabel, setCopyLabel] = useState(copy.entry.copyButton);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [needsRegeneration, setNeedsRegeneration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canGenerate = !isGenerating && !!form.from.trim() && !!form.to.trim() && !!form.message.trim();
  const canShuffleTemplateMessage = !!selectedTemplateId && getCardMessages(locale, selectedTemplateId).length > 1;
  const selectedTemplate = selectedTemplateId ? getCardById(selectedTemplateId) : null;
  const selectedTemplateCopy = selectedTemplate ? (locale === "ja" ? selectedTemplate.ja : selectedTemplate.zh) : null;
  const previewMessage = form.message.trim() || (locale === "ja" ? "ここに、あなたの祝福が少しずつ育っていきます。" : "這裡會慢慢長出你的祝福。");
  const previewTo = form.to.trim() || (locale === "ja" ? "受け取る人" : "收禮人");
  const previewFrom = form.from.trim() || (locale === "ja" ? "贈る人" : "送禮人");
  const previewCategory = selectedTemplateCopy?.title ?? (locale === "ja" ? "まだ花箋を選んでいません" : "尚未選擇花箋");
  const resultTitle = locale === "ja" ? "祝福の手紙ができました" : "祝福信已經準備好了";
  const resultLead = locale === "ja" ? "リンクをコピーするか、LINE でそのまま届けられます。" : "可以複製連結，或直接用 LINE 送出。";

  const summary = useMemo(() => {
    if (!form.from.trim() || !form.to.trim()) {
      return copy.entry.summaryFallback;
    }

    return `${form.from.trim()} ➜ ${form.to.trim()}`;
  }, [copy.entry.summaryFallback, form.from, form.to]);

  function buildGiftLink(from: string, to: string, message: string, localeValue: GiftLocale, cardId?: string | null) {
    const params = new URLSearchParams({ from, to, message, locale: localeValue });
    if (cardId) {
      params.set("cardId", cardId);
    }

    return `${getOrigin()}/letter?${params.toString()}`;
  }

  function invalidateGiftLink() {
    setGiftLink((current) => {
      if (!current) {
        return current;
      }

      setNeedsRegeneration(true);
      return "";
    });
    setCopyLabel(copy.entry.copyButton);
    setErrorMessage("");
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    invalidateGiftLink();
  }

  function chooseTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
    setForm((current) => ({ ...current, message: pickInitialMessage(locale, templateId) }));
    invalidateGiftLink();
  }

  function shuffleTemplateMessage() {
    if (!selectedTemplateId) {
      return;
    }

    const messages = getCardMessages(locale, selectedTemplateId);
    if (messages.length === 0) {
      return;
    }

    setForm((current) => ({
      ...current,
      message: pickAnotherMessage(messages, current.message),
    }));
    invalidateGiftLink();
  }

  async function generateGiftLink() {
    const from = form.from.trim();
    const to = form.to.trim();
    const message = form.message.trim();

    if (!from || !to || !message) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      const nextLink = buildGiftLink(from, to, message, locale, selectedTemplateId);
      setGiftLink(nextLink);
      setNeedsRegeneration(false);
      setCopyLabel(copy.entry.copyButton);
    } catch {
      setGiftLink("");
      setErrorMessage(copy.entry.errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyGiftLink() {
    if (!giftLink) {
      return;
    }

    await navigator.clipboard.writeText(giftLink);
    setCopyLabel(copy.entry.copiedButton);
  }

  function shareToLine() {
    if (!giftLink) {
      return;
    }

    const shareText = copy.entry.shareText(form.from.trim(), form.to.trim(), giftLink);
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`, "_blank");
  }

  function previewGiftPage() {
    if (!giftLink) {
      return;
    }

    window.open(giftLink, "_blank");
  }

  return (
    <section className={styles.giftModule} id="gift-form">
      <div className={styles.moduleHeader}>
        <p className={styles.moduleEyebrow}>{copy.entry.eyebrow}</p>
        <h2>{copy.entry.title}</h2>
        <p className={styles.moduleLead}>{copy.entry.lead}</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>{copy.entry.fromLabel}</span>
          <input
            type="text"
            value={form.from}
            onChange={(event) => updateField("from", event.target.value)}
            placeholder={copy.entry.fromPlaceholder}
          />
        </label>

        <label className={styles.field}>
          <span>{copy.entry.toLabel}</span>
          <input
            type="text"
            value={form.to}
            onChange={(event) => updateField("to", event.target.value)}
            placeholder={copy.entry.toPlaceholder}
          />
        </label>
      </div>

      <div className={styles.templateSection}>
        <div className={styles.templateHeader}>
          <p className={styles.templateEyebrow}>{copy.entry.templateEyebrow}</p>
          <p className={styles.templateLead}>{copy.entry.templateLead}</p>
        </div>

        <div className={styles.templateGrid}>
          {blessingCards.map((card) => {
            const localized = locale === "ja" ? card.ja : card.zh;
            const isSelected = card.id === selectedTemplateId;
            const visual = getCardVisual(card.id);

            return (
              <button
                key={card.id}
                type="button"
                className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ""}`}
                onClick={() => chooseTemplate(card.id)}
                style={{
                  ["--template-accent" as string]: visual.accent,
                  ["--template-petal" as string]: visual.petal,
                }}
              >
                <div className={styles.templateVisual}>
                  <BlessingMotif visual={visual} />
                </div>
                <div className={styles.templateCardTop}>
                  <span className={styles.templateCategory}>{localized.label}</span>
                  {isSelected ? <span className={styles.templateSelected}>{localized.selectedText}</span> : null}
                </div>
                <strong className={styles.templateTitle}>{localized.title}</strong>
                <span className={styles.templateMood}>{visual.note[locale]}</span>
                <span className={styles.templateDescription}>{localized.description}</span>
                <span className={styles.templateMessage}>{localized.messages[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.formGrid}>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>{copy.entry.messageLabel}</span>
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder={copy.entry.messagePlaceholder}
            rows={5}
          />
        </label>
      </div>

      <div className={styles.letterPreviewCard} aria-live="polite">
        <div className={styles.previewHeader}>
          <span>{previewCategory}</span>
          <span>AKATO LETTER</span>
        </div>
        <div className={styles.previewBody}>
          <p className={styles.previewTo}>{locale === "ja" ? `宛先 ${previewTo}` : `給 ${previewTo}`}</p>
          <p className={styles.previewMessage}>{previewMessage}</p>
          <p className={styles.previewFrom}>{locale === "ja" ? `${previewFrom} からの祝福` : `來自 ${previewFrom} 的祝福`}</p>
        </div>
      </div>

      {canShuffleTemplateMessage ? (
        <div className={styles.primaryActionRow}>
          <button type="button" className={styles.secondaryButton} onClick={shuffleTemplateMessage}>
            {copy.entry.shuffleButton}
          </button>
        </div>
      ) : null}

      <div className={styles.primaryActionRow}>
        <button type="button" className={styles.primaryGiftButton} onClick={generateGiftLink} disabled={!canGenerate}>
          {isGenerating ? copy.entry.generatingButton : copy.entry.primaryButton}
        </button>
      </div>

      {!canGenerate ? <p className={styles.refreshHint}>{copy.entry.formHint}</p> : needsRegeneration ? <p className={styles.refreshHint}>{copy.entry.refreshHint}</p> : null}
      {errorMessage ? <p className={styles.refreshHint}>{errorMessage}</p> : null}

      {giftLink ? (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <span>AKATO GIFT LETTER</span>
            <strong>{resultTitle}</strong>
            <p>{resultLead}</p>
          </div>
          <p className={styles.resultNames}>{summary}</p>
          <p className={styles.resultLink}>{giftLink}</p>
          <div className={styles.resultActions}>
            <button type="button" className={styles.secondaryButton} onClick={copyGiftLink}>
              {copyLabel}
            </button>
            <button type="button" className={styles.lineButton} onClick={shareToLine}>
              {copy.entry.shareButton}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={previewGiftPage}>
              {copy.entry.previewButton}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
