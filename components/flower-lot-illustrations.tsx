import type { CSSProperties } from "react";
import type { ContentLot } from "@/lib/content";

type FlowerLotIllustrationProps = {
  lot?: Pick<ContentLot, "flowerIllustration" | "flowerName" | "flowerAlt" | "title"> | null;
  illustration?: string | null;
  flowerName?: string | null;
  alt?: string | null;
  className?: string;
  style?: CSSProperties;
  size?: number;
};

type FlowerStyle = {
  line: string;
  leaf: string;
  bloom: string;
  bloomSoft: string;
  accent: string;
  shape: "rose" | "daisy" | "cluster" | "spike" | "tulip" | "calla" | "star" | "round" | "bell" | "water" | "bouquet";
};

const flowerStyles: Record<string, FlowerStyle> = {
  "white-rose": { line: "#8f7766", leaf: "#a8b78d", bloom: "#f8f2e9", bloomSoft: "#ead5cb", accent: "#cba9a6", shape: "rose" },
  daisy: { line: "#8f7766", leaf: "#a6b984", bloom: "#fff7df", bloomSoft: "#f4d06d", accent: "#d7a848", shape: "daisy" },
  gypsophila: { line: "#8d806f", leaf: "#a8b78d", bloom: "#fff9f0", bloomSoft: "#ece4d6", accent: "#d6c8b8", shape: "cluster" },
  carnation: { line: "#9a746c", leaf: "#a6b58c", bloom: "#e8b5bd", bloomSoft: "#f5d9db", accent: "#c98692", shape: "round" },
  lavender: { line: "#817469", leaf: "#9bad86", bloom: "#b5a1c9", bloomSoft: "#d7cce4", accent: "#8971aa", shape: "spike" },
  freesia: { line: "#89786a", leaf: "#a9b98d", bloom: "#f0d78d", bloomSoft: "#fff0b8", accent: "#d5ae54", shape: "star" },
  camellia: { line: "#8d6f66", leaf: "#8fa574", bloom: "#e8b2ae", bloomSoft: "#f3d3cf", accent: "#c67f7a", shape: "rose" },
  tulip: { line: "#8d7668", leaf: "#9cac79", bloom: "#d9a47d", bloomSoft: "#f3cbb3", accent: "#b87961", shape: "tulip" },
  lisianthus: { line: "#857568", leaf: "#9eaf82", bloom: "#c8b7d4", bloomSoft: "#eadfeb", accent: "#947da9", shape: "rose" },
  chrysanthemum: { line: "#8d7668", leaf: "#9dad7f", bloom: "#f1d18a", bloomSoft: "#f8e5b8", accent: "#c99a44", shape: "daisy" },
  calla: { line: "#7f756c", leaf: "#9caf7c", bloom: "#f8f1dd", bloomSoft: "#e5d8b6", accent: "#c7aa5b", shape: "calla" },
  hyacinth: { line: "#857568", leaf: "#9caf80", bloom: "#aab4da", bloomSoft: "#d6dcf0", accent: "#7d8ec0", shape: "spike" },
  "pink-rose": { line: "#8d6f66", leaf: "#9cab7d", bloom: "#e5aeb6", bloomSoft: "#f4d4d9", accent: "#be7d8b", shape: "rose" },
  "forget-me-not": { line: "#7d766c", leaf: "#9caf82", bloom: "#a9c2dc", bloomSoft: "#dce9f2", accent: "#7797b9", shape: "cluster" },
  peony: { line: "#8e6d64", leaf: "#92a574", bloom: "#df9da9", bloomSoft: "#f2ccd1", accent: "#b97483", shape: "round" },
  hydrangea: { line: "#7f746a", leaf: "#96aa78", bloom: "#aebbdc", bloomSoft: "#d7def0", accent: "#8093c1", shape: "cluster" },
  calendula: { line: "#8d7668", leaf: "#9dab76", bloom: "#e4b45a", bloomSoft: "#f4d696", accent: "#c68436", shape: "daisy" },
  jasmine: { line: "#81766b", leaf: "#92aa76", bloom: "#fff4df", bloomSoft: "#eadfc8", accent: "#c9b37a", shape: "star" },
  lily: { line: "#80766b", leaf: "#9caf7c", bloom: "#f7ead8", bloomSoft: "#ead3c4", accent: "#c48c76", shape: "calla" },
  iris: { line: "#7f746a", leaf: "#8fa778", bloom: "#a99ac8", bloomSoft: "#d4cce6", accent: "#7866a6", shape: "tulip" },
  "lily-of-the-valley": { line: "#7f756a", leaf: "#96aa78", bloom: "#fff8ea", bloomSoft: "#e8decc", accent: "#c8b99b", shape: "bell" },
  "water-lily": { line: "#7d766c", leaf: "#9ba77b", bloom: "#f1cbd8", bloomSoft: "#f8e3e9", accent: "#c897a9", shape: "water" },
  "cherry-blossom": { line: "#8d6f66", leaf: "#a0aa7c", bloom: "#f0bfca", bloomSoft: "#f8dce3", accent: "#c98b9b", shape: "star" },
  sunflower: { line: "#8b7466", leaf: "#99aa72", bloom: "#e9bd4f", bloomSoft: "#f7db86", accent: "#8e6840", shape: "daisy" },
  bouquet: { line: "#8b7466", leaf: "#9aaa78", bloom: "#d7a5ad", bloomSoft: "#f1d7d7", accent: "#b68870", shape: "bouquet" },
};

function getFlowerStyle(key?: string | null) {
  return flowerStyles[key ?? ""] ?? flowerStyles.bouquet;
}

function RoseBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <path d="M53 43c3-17 18-28 33-22 15 6 19 24 10 38-8 13-28 17-44 8-8-9-7-18 1-24Z" fill={flower.bloomSoft} opacity="0.58" />
      <path d="M58 37c10-13 25-11 32-1 8 12 1 26-15 33-14 0-24-8-24-19 0-5 2-9 7-13Z" fill={flower.bloom} opacity="0.82" />
      <path d="M67 32c7-6 16-3 18 5 3 9-4 19-16 22-9-5-11-15-2-27Z" fill={flower.bloomSoft} opacity="0.82" />
      <path d="M61 45c5-10 16-15 24-10M58 54c8-4 16-6 29-3M67 61c8-1 15-5 18-12" fill="none" stroke={flower.line} strokeWidth="1.05" strokeLinecap="round" opacity="0.42" />
      <path d="M69 42c4-5 11-5 14-1 3 5-1 12-9 15-7-2-9-8-5-14Z" fill="none" stroke={flower.accent} strokeWidth="1.35" strokeLinecap="round" opacity="0.78" />
      <path d="M73 45c3-2 7-2 9 1M71 51c4 1 8 0 11-3" fill="none" stroke={flower.accent} strokeWidth="0.95" strokeLinecap="round" opacity="0.62" />
    </g>
  );
}

function DaisyBloom({ flower }: { flower: FlowerStyle }) {
  const petals = Array.from({ length: 10 }, (_, index) => index * 36);

  return (
    <g transform="translate(72 44)">
      {petals.map((angle) => (
        <ellipse key={angle} cx="0" cy="-15" rx="5.8" ry="14" fill={flower.bloom} opacity="0.86" transform={`rotate(${angle})`} />
      ))}
      <circle r="9" fill={flower.bloomSoft} stroke={flower.accent} strokeWidth="1.2" />
      <circle r="3.2" fill={flower.accent} opacity="0.68" />
    </g>
  );
}

function ClusterBloom({ flower }: { flower: FlowerStyle }) {
  const blooms = [
    [56, 37, 8],
    [68, 29, 9],
    [82, 32, 10],
    [94, 43, 9],
    [73, 45, 11],
    [59, 53, 9],
    [87, 58, 8],
    [70, 63, 7],
  ];

  return (
    <g>
      {blooms.map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill={flower.bloomSoft} opacity="0.62" />
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse key={angle} cx={cx} cy={cy - r * 0.45} rx={r * 0.32} ry={r * 0.58} fill={flower.bloom} opacity="0.72" transform={`rotate(${angle} ${cx} ${cy})`} />
          ))}
          <path d={`M${cx} ${cy - r + 2}c3 5 3 9 0 14M${cx - r + 2} ${cy}c5-3 9-3 14 0`} stroke={flower.accent} strokeWidth="0.8" strokeLinecap="round" opacity="0.54" />
          <circle cx={cx} cy={cy} r="2" fill={flower.accent} opacity="0.62" />
        </g>
      ))}
      <path d="M56 63c11 8 26 8 39-1" stroke={flower.line} strokeWidth="0.9" strokeLinecap="round" opacity="0.32" />
    </g>
  );
}

function SpikeBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, index) => {
        const cy = 22 + index * 7;
        const side = index % 2 === 0 ? -1 : 1;
        return (
          <ellipse
            key={cy}
            cx={73 + side * 7}
            cy={cy}
            rx="6"
            ry="10"
            fill={index % 3 === 0 ? flower.bloomSoft : flower.bloom}
            opacity="0.84"
            transform={`rotate(${side * 28} ${73 + side * 7} ${cy})`}
          />
        );
      })}
    </g>
  );
}

function TulipBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <path d="M57 58c2-23 8-34 16-34 9 0 16 11 18 34-8 9-25 10-34 0Z" fill={flower.bloomSoft} />
      <path d="M63 57c2-21 8-29 10-32 3 3 9 11 11 32-6 6-15 7-21 0Z" fill={flower.bloom} opacity="0.9" />
      <path d="M57 57c8-10 8-20 7-29M90 57c-8-11-8-21-7-29M73 25c-2 12-2 23 0 35" fill="none" stroke={flower.accent} strokeWidth="1.25" strokeLinecap="round" opacity="0.72" />
    </g>
  );
}

function CallaBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <path d="M58 64c-5-25 5-42 22-46 13 13 12 34-5 52-8 3-14 1-17-6Z" fill={flower.bloomSoft} opacity="0.72" />
      <path d="M64 64c-2-22 4-35 16-43 8 14 6 30-7 45-4 2-7 1-9-2Z" fill={flower.bloom} opacity="0.88" />
      <path d="M80 22c-8 14-10 29-5 43" fill="none" stroke={flower.accent} strokeWidth="1.45" strokeLinecap="round" />
      <path d="M74 45c5-4 8-8 10-15" fill="none" stroke={flower.line} strokeWidth="0.95" strokeLinecap="round" opacity="0.38" />
      <path d="M68 47c6-2 10-6 13-12" fill="none" stroke={flower.accent} strokeWidth="1.15" strokeLinecap="round" />
    </g>
  );
}

function LilyBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g transform="translate(74 48)">
      {[0, 60, 120, 180, 240, 300].map((angle, index) => (
        <path
          key={angle}
          d="M0 2c-8-8-7-24 0-33 8 9 8 25 0 33Z"
          fill={index % 2 === 0 ? flower.bloom : flower.bloomSoft}
          opacity="0.78"
          stroke={flower.accent}
          strokeWidth="0.75"
          transform={`rotate(${angle})`}
        />
      ))}
      <path d="M0-1c-7-11-4-22 0-29M0-1c8-10 7-21 2-29M0-1c0-10 0-18 0-28" stroke={flower.line} strokeWidth="0.75" strokeLinecap="round" opacity="0.36" />
      {[0, 55, 110, 250, 305].map((angle) => (
        <path key={angle} d="M0 0c1-7 2-13 4-18" stroke={flower.accent} strokeWidth="0.85" strokeLinecap="round" transform={`rotate(${angle})`} />
      ))}
      <circle r="3.4" fill={flower.accent} opacity="0.68" />
    </g>
  );
}

function IrisBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <path d="M74 62c-12-8-18-20-14-32 10 1 17 10 17 26" fill={flower.bloomSoft} opacity="0.78" />
      <path d="M76 60c10-11 16-22 11-35-10 4-15 14-13 31" fill={flower.bloom} opacity="0.82" />
      <path d="M73 55c-7-18-3-31 5-40 8 10 9 25-2 40" fill={flower.bloomSoft} opacity="0.9" />
      <path d="M63 58c-9-2-17-9-18-20 10-3 19 3 24 15" fill={flower.bloom} opacity="0.62" />
      <path d="M85 58c9-3 17-10 17-20-10-3-19 4-24 15" fill={flower.bloomSoft} opacity="0.66" />
      <path d="M77 16c-1 14-2 27-2 40M60 33c5 7 9 14 13 22M91 32c-5 8-10 16-15 24" stroke={flower.accent} strokeWidth="1.05" strokeLinecap="round" opacity="0.62" />
      <path d="M69 56c3 3 8 3 12 0" stroke={flower.line} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </g>
  );
}

function StarBloom({ flower }: { flower: FlowerStyle }) {
  const blooms = [
    [64, 40],
    [80, 35],
    [88, 51],
    [70, 57],
  ];

  return (
    <g>
      {blooms.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse key={angle} cx="0" cy="-8" rx="4" ry="8.5" fill={flower.bloom} opacity="0.86" transform={`rotate(${angle})`} />
          ))}
          <circle r="2.6" fill={flower.accent} opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

function RoundBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      {Array.from({ length: 14 }, (_, index) => {
        const angle = index * 25.7;
        const radius = index % 2 === 0 ? 19 : 12;
        const x = 73 + Math.cos((angle * Math.PI) / 180) * radius;
        const y = 44 + Math.sin((angle * Math.PI) / 180) * radius * 0.72;
        return (
          <ellipse key={angle} cx={x} cy={y} rx="7" ry="12" fill={index % 3 === 0 ? flower.bloomSoft : flower.bloom} opacity="0.86" transform={`rotate(${angle} ${x} ${y})`} />
        );
      })}
      <circle cx="73" cy="44" r="11" fill={flower.bloom} opacity="0.9" />
      <path d="M63 44c8-5 15-5 23 0M66 51c6-3 12-3 18 0" stroke={flower.accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

function BellBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <path d="M75 21c-5 18-4 31 1 52" stroke={flower.line} strokeWidth="1.15" strokeLinecap="round" />
      {[30, 42, 54, 66, 76].map((cy, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const cx = 76 + side * (8 + index * 1.5);
        return (
          <g key={cy}>
            <path d={`M${76} ${cy - 9}c${side * 4} 3 ${side * 7} 5 ${side * 11} 7`} stroke={flower.line} strokeWidth="0.85" strokeLinecap="round" opacity="0.5" />
            <path d={`M${cx - 7} ${cy}c1-8 13-8 14 0 0 8-3 12-7 12s-7-4-7-12Z`} fill={flower.bloom} stroke={flower.accent} strokeWidth="0.85" opacity="0.88" />
            <path d={`M${cx - 4} ${cy + 9}c3 2 6 2 8 0`} stroke={flower.line} strokeWidth="0.65" strokeLinecap="round" opacity="0.34" />
          </g>
        );
      })}
    </g>
  );
}

function WaterBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <ellipse cx="74" cy="74" rx="34" ry="9" fill={flower.leaf} opacity="0.2" />
      <path d="M42 76c18-4 43-4 64 0M51 82c14-2 31-2 46 0" stroke={flower.line} strokeWidth="0.85" strokeLinecap="round" opacity="0.22" />
      <g transform="translate(74 56)">
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle) => (
          <ellipse key={angle} cx="0" cy="-15" rx="7" ry="19" fill={flower.bloomSoft} opacity="0.8" stroke={flower.accent} strokeWidth="0.45" transform={`rotate(${angle})`} />
        ))}
        {[20, 70, 120, 170, 220, 270, 320].map((angle) => (
          <ellipse key={angle} cx="0" cy="-10" rx="5" ry="14" fill={flower.bloom} opacity="0.88" transform={`rotate(${angle})`} />
        ))}
        <circle r="4.5" fill={flower.accent} opacity="0.64" />
      </g>
    </g>
  );
}

function CherryBranchBloom({ flower }: { flower: FlowerStyle }) {
  const blossoms = [
    [55, 39, 0.85],
    [75, 30, 1],
    [93, 45, 0.82],
    [66, 58, 0.74],
  ];

  return (
    <g>
      <path d="M43 70c15-22 38-35 66-42" stroke={flower.line} strokeWidth="2" strokeLinecap="round" />
      <path d="M67 52c-4-7-9-11-17-13M79 41c4-7 10-12 20-15" stroke={flower.line} strokeWidth="1.1" strokeLinecap="round" opacity="0.62" />
      {blossoms.map(([x, y, scale]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${scale})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <path key={angle} d="M0 0c-4-5-3-11 1-14 5 3 6 9 1 14Z" fill={flower.bloom} opacity="0.82" stroke={flower.accent} strokeWidth="0.55" transform={`rotate(${angle})`} />
          ))}
          <circle r="2.3" fill={flower.accent} opacity="0.72" />
        </g>
      ))}
    </g>
  );
}

function BouquetBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <path d="M55 99c6-21 10-39 15-55M73 100c-1-20 0-38 1-57M89 98c-8-19-12-36-14-52" stroke={flower.line} strokeWidth="1" strokeLinecap="round" opacity="0.52" />
      <path d="M53 92c12 9 26 10 42 1" fill="none" stroke={flower.accent} strokeWidth="3.4" strokeLinecap="round" opacity="0.42" />
      <g transform="translate(-3 -2) scale(0.82)">
        <RoseBloom flower={flower} />
      </g>
      <g transform="translate(-22 9) scale(0.58)">
        <DaisyBloom flower={{ ...flower, bloom: "#f3d39b", bloomSoft: "#fff1c8", accent: "#c6934a" }} />
      </g>
      <g transform="translate(24 7) scale(0.56)">
        <ClusterBloom flower={{ ...flower, bloom: "#c6b6d8", bloomSoft: "#e7dfee", accent: "#9380ae" }} />
      </g>
      <path d="M54 86c-7-7-16-10-27-8 9 7 18 10 27 8ZM87 86c8-8 17-12 29-9-9 8-19 11-29 9Z" fill={flower.leaf} opacity="0.48" />
    </g>
  );
}

function FlowerBloom({ flower, flowerKey }: { flower: FlowerStyle; flowerKey?: string | null }) {
  if (flowerKey === "iris") return <IrisBloom flower={flower} />;
  if (flowerKey === "lily") return <LilyBloom flower={flower} />;
  if (flowerKey === "cherry-blossom") return <CherryBranchBloom flower={flower} />;
  if (flower.shape === "daisy") return <DaisyBloom flower={flower} />;
  if (flower.shape === "cluster") return <ClusterBloom flower={flower} />;
  if (flower.shape === "spike") return <SpikeBloom flower={flower} />;
  if (flower.shape === "tulip") return <TulipBloom flower={flower} />;
  if (flower.shape === "calla") return <CallaBloom flower={flower} />;
  if (flower.shape === "star") return <StarBloom flower={flower} />;
  if (flower.shape === "round") return <RoundBloom flower={flower} />;
  if (flower.shape === "bell") return <BellBloom flower={flower} />;
  if (flower.shape === "water") return <WaterBloom flower={flower} />;
  if (flower.shape === "bouquet") return <BouquetBloom flower={flower} />;

  return <RoseBloom flower={flower} />;
}

export function FlowerLotIllustration({
  lot,
  illustration,
  flowerName,
  alt,
  className,
  style,
  size = 104,
}: FlowerLotIllustrationProps) {
  const key = illustration ?? lot?.flowerIllustration;
  const resolvedFlowerName = flowerName ?? lot?.flowerName ?? lot?.title ?? "今日小花籤";
  const resolvedAlt = alt ?? lot?.flowerAlt ?? `${resolvedFlowerName}小插畫`;
  const flower = getFlowerStyle(key);

  return (
    <figure
      className={className}
      style={{
        width: size,
        maxWidth: "32vw",
        margin: 0,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        color: flower.line,
        ...style,
      }}
      aria-label={resolvedAlt}
    >
      <svg
        role="img"
        aria-label={resolvedAlt}
        viewBox="0 0 120 130"
        width="100%"
        height="auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M27 111c18 7 47 8 67-2" stroke="#d8c4a8" strokeWidth="1.2" strokeLinecap="round" opacity="0.52" />
        <path d="M66 111c-3-19 0-39 8-60 2-5 3-9 3-13" stroke={flower.line} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M64 92c-12-11-25-14-39-8 12 9 25 12 39 8Z" fill={flower.leaf} opacity="0.46" />
        <path d="M72 89c13-13 27-17 42-11-12 11-26 14-42 11Z" fill={flower.leaf} opacity="0.42" />
        <path d="M65 75c-9-8-19-9-31-3 9 6 20 7 31 3Z" fill={flower.leaf} opacity="0.35" />
        <path d="M72 75c10-8 20-11 31-7-8 7-18 10-31 7Z" fill={flower.leaf} opacity="0.32" />
        <path d="M64 92c-11-3-22-6-33-8M72 89c12-5 24-9 36-11M65 75c-9-2-18-3-27-3M72 75c9-3 18-5 27-7" stroke={flower.line} strokeWidth="0.82" strokeLinecap="round" opacity="0.32" />
        <path d="M43 102c20 7 44 7 66 0" stroke="#f1e1d0" strokeWidth="10" strokeLinecap="round" opacity="0.2" />
        <FlowerBloom flower={flower} flowerKey={key} />
        <path d="M23 108c24 9 55 9 78 0" stroke="#f3e6d8" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
      </svg>
      <figcaption style={{ fontSize: 12, letterSpacing: "0.12em", color: "#a08a7a" }}>
        {resolvedFlowerName}
      </figcaption>
    </figure>
  );
}
