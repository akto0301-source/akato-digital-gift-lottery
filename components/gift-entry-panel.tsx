"use client";

import { useMemo, useState } from "react";
import styles from "@/app/page.module.css";

const DEFAULT_ORIGIN = "https://akato-gift.vercel.app";

const blessingTemplates = [
  {
    id: "gentle-healing",
    title: "溫柔療癒",
    category: "Gentle Care",
    message: "願你今天被溫柔對待，\n所有美好都剛好發生。",
  },
  {
    id: "peaceful-days",
    title: "平安順心",
    category: "Calm Wishes",
    message: "願你心有安定，\n所遇皆是溫柔的風景。",
  },
  {
    id: "thank-you",
    title: "感謝有你",
    category: "Grateful Light",
    message: "謝謝你成為某些日子裡，\n讓人安心的光。",
  },
  {
    id: "late-gift",
    title: "晚到的心意",
    category: "Tender Arrival",
    message: "雖然祝福晚了一點，\n但心意剛好抵達你身邊。",
  },
  {
    id: "birthday",
    title: "生日祝福",
    category: "Birthday Bloom",
    message: "願新的一歲，\n有花、有光、有剛剛好的好運。",
  },
  {
    id: "shared-love",
    title: "合送祝福",
    category: "Shared Blessing",
    message: "這份心意由我們一起送上，\n願你被滿滿的祝福包圍。",
  },
] as const;

const extraMessages = [
  "願你在平凡的日子裡，也總能遇見剛剛好的溫柔。",
  "希望這份心意，替你把今天多留下一點柔軟和光。",
  "願你被在乎、被惦記，也被世界輕輕善待。",
  "如果最近有點累，願這一句話剛好替你擋住一點風。",
  "願你抬頭時有光，低頭時有安心，回頭時有溫暖的人。",
  "希望你送出的不只是祝福，還有被好好放在心上的感覺。",
] as const;

type FormState = {
  from: string;
  to: string;
  message: string;
};

function buildGiftLink({ from, to, message }: FormState) {
  const params = new URLSearchParams({ from, to, message });
  const origin = typeof window === "undefined" ? DEFAULT_ORIGIN : window.location.origin;

  return `${origin}/confirm?${params.toString()}`;
}

function buildShareText(fromName: string, toName: string, url: string) {
  return `🥕 ${fromName} → ${toName}\n\n我準備了一份祝福給你。\n\n點開信封：\n${url}`;
}

function pickNextMessage(currentMessage: string) {
  if (extraMessages.length <= 1) {
    return currentMessage || extraMessages[0];
  }

  let nextMessage = currentMessage;

  while (nextMessage === currentMessage) {
    nextMessage = extraMessages[Math.floor(Math.random() * extraMessages.length)] ?? extraMessages[0];
  }

  return nextMessage;
}

export function GiftEntryPanel() {
  const [form, setForm] = useState<FormState>({ from: "", to: "", message: "" });
  const [giftLink, setGiftLink] = useState("");
  const [copyLabel, setCopyLabel] = useState("複製祝福連結");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [needsRegeneration, setNeedsRegeneration] = useState(false);

  const summary = useMemo(() => {
    if (!form.from.trim() || !form.to.trim()) {
      return "送禮人 ➜ 收禮人";
    }

    return `${form.from.trim()} ➜ ${form.to.trim()}`;
  }, [form.from, form.to]);

  function invalidateGiftLink() {
    setGiftLink((current) => {
      if (!current) {
        return current;
      }

      setNeedsRegeneration(true);
      return "";
    });
    setCopyLabel("複製祝福連結");
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    invalidateGiftLink();
  }

  function chooseTemplate(templateId: string) {
    const template = blessingTemplates.find((item) => item.id === templateId);

    if (!template) {
      return;
    }

    setSelectedTemplateId(template.id);
    setForm((current) => ({ ...current, message: template.message }));
    invalidateGiftLink();
  }

  function shuffleMessage() {
    const nextMessage = pickNextMessage(form.message.trim());
    setForm((current) => ({ ...current, message: nextMessage }));
    invalidateGiftLink();
  }

  function generateGiftLink() {
    setGiftLink(buildGiftLink({
      from: form.from.trim(),
      to: form.to.trim(),
      message: form.message.trim(),
    }));
    setNeedsRegeneration(false);
  }

  async function copyGiftLink() {
    if (!giftLink) {
      return;
    }

    const fromName = form.from.trim() || "送禮人";
    const toName = form.to.trim() || "收禮人";
    const shareText = buildShareText(fromName, toName, giftLink);

    await navigator.clipboard.writeText(shareText);
    setCopyLabel("已複製連結");
  }

  function shareToLine() {
    if (!giftLink) {
      return;
    }

    const fromName = form.from.trim() || "送禮人";
    const toName = form.to.trim() || "收禮人";
    const shareText = buildShareText(fromName, toName, giftLink);
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`, "_blank");
  }

  function previewGiftPage() {
    if (!giftLink) {
      return;
    }

    window.open(giftLink, "_blank");
  }

  return (
    <section className={styles.giftModule}>
      <div className={styles.moduleHeader}>
        <p className={styles.moduleEyebrow}>送禮入口</p>
        <h2>為重要的人準備一頁專屬祝福</h2>
        <p className={styles.moduleLead}>
          填入送禮人、收禮人與祝福內容後，就能快速生成可分享的 Akato 祝福連結。
        </p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>送禮人 from</span>
          <input
            type="text"
            value={form.from}
            onChange={(event) => updateField("from", event.target.value)}
            placeholder="例如：嫥慧"
          />
        </label>

        <label className={styles.field}>
          <span>收禮人 to</span>
          <input
            type="text"
            value={form.to}
            onChange={(event) => updateField("to", event.target.value)}
            placeholder="例如：鄭羽喬"
          />
        </label>
      </div>

      <div className={styles.templateSection}>
        <div className={styles.templateHeader}>
          <p className={styles.templateEyebrow}>選擇祝福籤詩</p>
          <p className={styles.templateLead}>先挑一張溫柔的籤詩，再依照心意微調內容。</p>
        </div>

        <div className={styles.templateGrid}>
          {blessingTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <button
                key={template.id}
                type="button"
                className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ""}`}
                onClick={() => chooseTemplate(template.id)}
              >
                {isSelected ? <span className={styles.templateSeal}>已選</span> : null}
                <span className={styles.templateCategory}>{template.category}</span>
                <strong className={styles.templateTitle}>{template.title}</strong>
                <span className={styles.templateDivider} aria-hidden="true" />
                <span className={styles.templateMessage}>{template.message}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.formGrid}>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>祝福文字 message</span>
          <div className={styles.messageComposer}>
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="寫下一段溫柔祝福，讓收禮頁面直接帶著你的心意。"
              rows={5}
            />
            <div className={styles.shufflePanel}>
              <p className={styles.shuffleLead}>這份心意還想對你說⋯</p>
              <button type="button" className={styles.shuffleButton} onClick={shuffleMessage}>
                換一句看看
              </button>
            </div>
          </div>
        </label>
      </div>

      <div className={styles.primaryActionRow}>
        <button type="button" className={styles.primaryGiftButton} onClick={generateGiftLink}>
          產生專屬祝福連結
        </button>
      </div>

      {needsRegeneration ? (
        <p className={styles.refreshHint}>內容已更新，請重新產生祝福連結 🌸</p>
      ) : null}

      {giftLink ? (
        <div className={styles.resultCard}>
          <p className={styles.resultNames}>{summary}</p>
          <p className={styles.resultStatus}>祝福連結已產生</p>
          <div className={styles.resultActions}>
            <button type="button" className={styles.secondaryButton} onClick={copyGiftLink}>
              {copyLabel}
            </button>
            <button type="button" className={styles.lineButton} onClick={shareToLine}>
              分享到 LINE
            </button>
            <button type="button" className={styles.secondaryButton} onClick={previewGiftPage}>
              預覽收禮頁面
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
