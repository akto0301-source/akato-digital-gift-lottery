import type { CSSProperties } from "react";
import type { GiftLocale } from "@/lib/gift-links";

export type BlessingCardVisual = {
  accent: string;
  petal: string;
  backgroundImage: string;
  note: Record<GiftLocale, string>;
  motif: "rose" | "leaf" | "daisy" | "forget" | "bloom" | "bundle";
};

const blessingCardVisuals: Record<string, BlessingCardVisual> = {
  "gentle-care": {
    accent: "#c99196",
    petal: "#f2d8d9",
    backgroundImage: "/blessing-backgrounds/soft-floral-rose-corners.png",
    motif: "rose",
    note: {
      zh: "溫柔、日常、陪伴",
      ja: "やさしさ、日常、寄り添い",
    },
  },
  "calm-days": {
    accent: "#9aa77d",
    petal: "#e5ead6",
    backgroundImage: "/blessing-backgrounds/soft-floral-blue-sprigs.png",
    motif: "leaf",
    note: {
      zh: "穩重、敬意、祝福",
      ja: "穏やか、敬意、祝福",
    },
  },
  "thank-you-light": {
    accent: "#c6a15b",
    petal: "#f4e6bd",
    backgroundImage: "/blessing-backgrounds/soft-floral-peach-frame.png",
    motif: "daisy",
    note: {
      zh: "謝意、照亮、被記得",
      ja: "感謝、灯り、覚えていること",
    },
  },
  "tender-arrival": {
    accent: "#8aa0b8",
    petal: "#dbe7ef",
    backgroundImage: "/blessing-backgrounds/soft-floral-lavender-blue.png",
    motif: "forget",
    note: {
      zh: "補上心意、不讓祝福缺席",
      ja: "遅れても、気持ちは届ける",
    },
  },
  "birthday-bloom": {
    accent: "#c98a73",
    petal: "#f4d5c6",
    backgroundImage: "/blessing-backgrounds/soft-floral-cream-lilies.png",
    motif: "bloom",
    note: {
      zh: "今天被好好珍惜",
      ja: "今日を大切に祝う",
    },
  },
  "shared-blessing": {
    accent: "#9a8fbd",
    petal: "#e0dced",
    backgroundImage: "/blessing-backgrounds/soft-floral-pink-leaves.png",
    motif: "bundle",
    note: {
      zh: "把大家的心意收在一起",
      ja: "みんなの気持ちを束ねる",
    },
  },
};

export function getBlessingCardVisual(cardId: string | null | undefined) {
  return blessingCardVisuals[cardId ?? ""] ?? blessingCardVisuals["gentle-care"];
}

type BlessingMotifProps = {
  visual: BlessingCardVisual;
  className?: string;
  style?: CSSProperties;
};

export function BlessingMotif({ visual, className, style }: BlessingMotifProps) {
  const common = {
    fill: visual.petal,
    stroke: visual.accent,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg className={className} style={style} viewBox="0 0 88 88" aria-hidden="true">
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
