"use client";

import { useMemo, useState } from "react";
import styles from "@/app/page.module.css";
import { getBlessingCardVisual } from "@/components/blessing-card-visuals";
import { blessingCards, getLocaleCopy } from "@/lib/i18n";
import type { GiftLocale } from "@/lib/gift-links";
import { defaultSceneId, sceneItems, type SceneId } from "@/lib/scene-map";

const DEFAULT_ORIGIN = "https://gift.akato.net";

type FormState = {
  from: string;
  to: string;
  message: string;
};

type GiftEntryPanelProps = {
  locale: GiftLocale;
};

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
  const [selectedSceneId, setSelectedSceneId] = useState<SceneId>(defaultSceneId);
  const [hasCustomMessage, setHasCustomMessage] = useState(false);
  const [needsRegeneration, setNeedsRegeneration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canGenerate = !isGenerating && !!form.from.trim() && !!form.to.trim() && !!form.message.trim();
  const selectedTemplateMessages = selectedTemplateId ? getCardMessages(locale, selectedTemplateId) : [];
  const isSystemTemplateMessage = !form.message.trim() || selectedTemplateMessages.includes(form.message);
  const canShuffleTemplateMessage = !!selectedTemplateId && !hasCustomMessage && isSystemTemplateMessage && selectedTemplateMessages.length > 1;
  const selectedTemplate = selectedTemplateId ? getCardById(selectedTemplateId) : null;
  const selectedTemplateCopy = selectedTemplate ? (locale === "ja" ? selectedTemplate.ja : selectedTemplate.zh) : null;
  const previewMessage = form.message.trim() || (locale === "ja" ? "ここに、あなたの祝福が少しずつ育っていきます。" : "這裡會慢慢長出你的祝福。");
  const previewTo = form.to.trim() || (locale === "ja" ? "受け取る人" : "收禮人");
  const previewFrom = form.from.trim() || (locale === "ja" ? "贈る人" : "送禮人");
  const previewCategory = selectedTemplateCopy?.title ?? (locale === "ja" ? "まだ花箋を選んでいません" : "尚未選擇花箋");
  const selectedScene = sceneItems.find((scene) => scene.id === selectedSceneId) ?? sceneItems[0];
  const resultTitle = locale === "ja" ? "祝福の手紙ができました" : "祝福信已經準備好了";
  const resultLead = locale === "ja" ? "リンクをコピーするか、LINE でそのまま届けられます。" : "可以複製連結，或直接用 LINE 送出。";

  const summary = useMemo(() => {
    if (!form.from.trim() || !form.to.trim()) {
      return copy.entry.summaryFallback;
    }

    return `${form.from.trim()} ➜ ${form.to.trim()}`;
  }, [copy.entry.summaryFallback, form.from, form.to]);

  function buildGiftLink(from: string, to: string, message: string, localeValue: GiftLocale, cardId?: string | null, sceneId?: SceneId) {
    const params = new URLSearchParams({ from, to, message, locale: localeValue });
    if (cardId) {
      params.set("cardId", cardId);
    }
    if (sceneId) {
      params.set("sceneId", sceneId);
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

  function updateMessage(value: string) {
    const templateMessages = selectedTemplateId ? getCardMessages(locale, selectedTemplateId) : [];
    setHasCustomMessage(value.trim() !== "" && !templateMessages.includes(value));
    updateField("message", value);
  }

  function chooseTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
    setForm((current) => ({
      ...current,
      message: hasCustomMessage && current.message.trim() ? current.message : pickInitialMessage(locale, templateId),
    }));
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
    setHasCustomMessage(false);
    invalidateGiftLink();
  }

  function chooseScene(sceneId: SceneId) {
    setSelectedSceneId(sceneId);
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
      const nextLink = buildGiftLink(from, to, message, locale, selectedTemplateId, selectedSceneId);
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
            const visual = getBlessingCardVisual(card.id);

            return (
              <button
                key={card.id}
                type="button"
                className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ""}`}
                onClick={() => chooseTemplate(card.id)}
                style={{
                  ["--template-accent" as string]: visual.accent,
                  ["--template-petal" as string]: visual.petal,
                  ["--template-bg" as string]: `url(${visual.backgroundImage})`,
                }}
              >
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
            onChange={(event) => updateMessage(event.target.value)}
            placeholder={copy.entry.messagePlaceholder}
            rows={5}
          />
        </label>
      </div>

      <div className={styles.sceneSection}>
        <div className={styles.templateHeader}>
          <p className={styles.templateEyebrow}>{locale === "ja" ? "小さな世界を選ぶ" : "選擇小世界場景"}</p>
          <p className={styles.templateLead}>
            {locale === "ja" ? "手紙を開いたときに、そっと背景になる小さな景色です。" : "收禮人打開信時，會看見這片小小的故事背景。"}
          </p>
        </div>
        <div className={styles.sceneGrid}>
          {sceneItems.map((scene) => {
            const isSelected = scene.id === selectedSceneId;

            return (
              <button
                key={scene.id}
                type="button"
                className={`${styles.sceneCard} ${isSelected ? styles.sceneCardSelected : ""}`}
                onClick={() => chooseScene(scene.id)}
              >
                <span
                  className={styles.sceneThumb}
                  style={{ ["--scene-thumb" as string]: `url(${scene.image})` }}
                  aria-hidden="true"
                />
                <span>{scene.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.letterPreviewCard} aria-live="polite">
        <div className={styles.previewHeader}>
          <span>{previewCategory}</span>
          <span>AKATO LETTER</span>
        </div>
        <p className={styles.previewScene}>{selectedScene.title}</p>
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
