"use client";

import { useMemo, useState } from "react";
import type { ContentLibrary, ContentLot } from "@/lib/content";

type LotteryPanelProps = {
  library: ContentLibrary;
  initialLot: ContentLot | null;
};

type SafeLot = {
  id: string;
  title: string;
  poem: string;
  blessing: string;
  love: string;
  career: string;
  wealth: string;
  reminder: string;
};

const fallbackLots: SafeLot[] = [
  {
    id: "第1籤",
    title: "風順雨潤穀豐盈",
    poem: "有些好事不急著開花，正在土裡慢慢長根。",
    blessing: "願新的一歲，有花、有光，也有剛剛好的好運。",
    love: "心如大地般踏實，真摯的感情正在默默滋長，無須急躁。",
    career: "眼前的停滯只是在累積養分，當下的努力正在為未來奠定深厚基石。",
    wealth: "細水長流，穩健的儲蓄與規劃將為你帶來豐碩的成果。",
    reminder: "放慢腳步，去感受那些正在悄悄發生的美好轉變。",
  },
  {
    id: "第2籤",
    title: "日出雲開天地明",
    poem: "心中惦念皆有應，溫暖常隨步履輕。",
    blessing: "謝謝你的惦念，讓平凡日子也有光。",
    love: "迷霧漸散，單身者請留意身邊最真誠、最溫柔的陪伴。",
    career: "方向完全正確，過去的累積即將迎來明朗的收穫期。",
    wealth: "穩定中帶有驚喜，你付出的心力將迎來等值的回報。",
    reminder: "多給自己一些肯定，你遠比自己想像的還要優秀。",
  },
  {
    id: "第3籤",
    title: "春風吹拂綠柳新",
    poem: "徐步徐行無須急，自有貴人到門庭。",
    blessing: "慢慢來也沒關係，這份祝福會陪你一下。",
    love: "順其自然，溫和柔軟的交流能讓彼此的心更加貼近。",
    career: "不急於一時的成敗，穩紮穩打能帶你走向更遠的遠方。",
    wealth: "財運小有收穫，適合挑選一份精緻的小禮物慰勞自己。",
    reminder: "慢慢來也沒關係，路途上的風景一樣美麗。",
  },
];

function toText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join("，");
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function normalizeLot(lot: unknown, index = 0): SafeLot | null {
  if (!lot || typeof lot !== "object") return null;

  const item = lot as Record<string, unknown>;

  const idText =
    toText(item.name) ||
    toText(item.id) ||
    `第${index + 1}籤`;

  const title =
    toText(item.fortune) ||
    toText(item.title) ||
    toText(item.name) ||
    fallbackLots[index % fallbackLots.length].title;

  const poem =
    toText(item.poem) ||
    toText(item.description) ||
    toText(item.summary) ||
    fallbackLots[index % fallbackLots.length].poem;

  const blessing =
    toText(item.blessing) ||
    toText(item.wish) ||
    fallbackLots[index % fallbackLots.length].blessing;

  return {
    id: idText.startsWith("第") ? idText : `第${idText}籤`,
    title,
    poem,
    blessing,
    love: toText(item.love) || fallbackLots[index % fallbackLots.length].love,
    career: toText(item.career) || fallbackLots[index % fallbackLots.length].career,
    wealth: toText(item.wealth) || fallbackLots[index % fallbackLots.length].wealth,
    reminder: toText(item.reminder) || fallbackLots[index % fallbackLots.length].reminder,
  };
}

function extractLots(library: ContentLibrary): SafeLot[] {
  const source = library as unknown as Record<string, unknown>;

  const rawLots =
    Array.isArray(source)
      ? source
      : Array.isArray(source?.lots)
        ? source.lots
        : Array.isArray(source?.items)
          ? source.items
          : Array.isArray(source?.data)
            ? source.data
            : [];

  const normalized = rawLots
    .map((lot, index) => normalizeLot(lot, index))
    .filter((lot): lot is SafeLot => lot !== null);

  return normalized.length > 0 ? normalized : fallbackLots;
}

export function LotteryPanel({ library, initialLot }: LotteryPanelProps) {
  const lots = useMemo(() => extractLots(library), [library]);

  const initialSafeLot =
    normalizeLot(initialLot, 0) ?? lots[0] ?? fallbackLots[0];

  const [currentLot, setCurrentLot] = useState<SafeLot>(initialSafeLot);
  const [showExplain, setShowExplain] = useState(false);

  function drawLot() {
    const nextLot = lots[Math.floor(Math.random() * lots.length)] ?? fallbackLots[0];
    setCurrentLot(nextLot);
    setShowExplain(false);
  }

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid rgba(213, 190, 169, 0.8)",
        borderRadius: "28px",
        padding: "clamp(28px, 5vw, 48px)",
        background:
          "linear-gradient(135deg, rgba(255, 253, 249, 0.96), rgba(255, 247, 241, 0.92))",
        boxShadow: "0 24px 60px rgba(120, 93, 76, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#8B8580",
            letterSpacing: "0.08em",
          }}
        >
          抽籤結果
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#8B8580",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          {currentLot.id}
        </p>
      </div>

      <h3
        style={{
          margin: "0 0 20px",
          fontSize: "clamp(34px, 5vw, 56px)",
          lineHeight: 1.25,
          fontWeight: 500,
          color: "#2F2A27",
          letterSpacing: "0.02em",
        }}
      >
        {currentLot.title}
      </h3>

      <p
        style={{
          margin: "0 0 34px",
          fontSize: "clamp(18px, 2.2vw, 24px)",
          lineHeight: 1.8,
          color: "#514944",
        }}
      >
        {currentLot.poem}
      </p>

      <div
        style={{
          borderTop: "1px solid rgba(213, 190, 169, 0.65)",
          paddingTop: "28px",
          marginTop: "10px",
        }}
      >
        <p
          style={{
            margin: "0 0 18px",
            color: "#B87973",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          祝賀語
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "clamp(18px, 2.1vw, 23px)",
            lineHeight: 1.8,
            color: "#3F3834",
          }}
        >
          {currentLot.blessing}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "40px",
        }}
      >
        <button
          type="button"
          onClick={drawLot}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "16px 42px",
            background: "#B59186",
            color: "#FFFFFF",
            fontSize: "18px",
            letterSpacing: "0.12em",
            cursor: "pointer",
            boxShadow: "0 12px 24px rgba(124, 91, 80, 0.16)",
          }}
        >
          抽一支今日好籤
        </button>

        <button
          type="button"
          onClick={() => setShowExplain((current) => !current)}
          style={{
            border: "none",
            background: "transparent",
            color: "#8B8580",
            fontSize: "16px",
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          {showExplain ? "收合解籤 ↑" : "詳細解籤 ↓"}
        </button>
      </div>

      {showExplain && (
        <div
          style={{
            marginTop: "36px",
            paddingTop: "28px",
            borderTop: "1px solid rgba(213, 190, 169, 0.45)",
            display: "grid",
            gap: "22px",
          }}
        >
          <div>
            <h4 style={explainTitleStyle}>感情</h4>
            <p style={explainTextStyle}>{currentLot.love}</p>
          </div>

          <div>
            <h4 style={explainTitleStyle}>事業</h4>
            <p style={explainTextStyle}>{currentLot.career}</p>
          </div>

          <div>
            <h4 style={explainTitleStyle}>財運</h4>
            <p style={explainTextStyle}>{currentLot.wealth}</p>
          </div>

          <div>
            <h4 style={explainTitleStyle}>今日提醒</h4>
            <p style={explainTextStyle}>{currentLot.reminder}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const explainTitleStyle = {
  margin: "0 0 8px",
  color: "#B87973",
  fontSize: "15px",
  fontWeight: 600,
  letterSpacing: "0.08em",
};

const explainTextStyle = {
  margin: 0,
  color: "#7A736E",
  fontSize: "17px",
  lineHeight: 1.9,
};

export default LotteryPanel;
