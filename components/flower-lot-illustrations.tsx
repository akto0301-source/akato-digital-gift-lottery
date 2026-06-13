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
      <path d="M58 35c11-16 29-11 31 3 2 15-11 27-29 29-15-10-14-22-2-32Z" fill={flower.bloomSoft} opacity="0.72" />
      <path d="M62 38c9-10 20-8 22 2 2 11-7 19-21 22-10-7-10-16-1-24Z" fill={flower.bloom} opacity="0.9" />
      <path d="M65 42c5-6 13-5 15 1 1 7-5 12-14 14-6-5-6-10-1-15Z" fill="none" stroke={flower.accent} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M58 45c9 3 19 2 29-2M62 53c8 2 15 1 22-3" fill="none" stroke={flower.line} strokeWidth="1.1" strokeLinecap="round" opacity="0.42" />
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
    [61, 34, 10],
    [76, 31, 12],
    [89, 41, 11],
    [68, 50, 12],
    [84, 56, 10],
    [54, 48, 8],
  ];

  return (
    <g>
      {blooms.map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill={flower.bloomSoft} opacity="0.78" />
          <path d={`M${cx} ${cy - r + 2}c4 6 4 10 0 16M${cx - r + 2} ${cy}c6-4 10-4 16 0`} stroke={flower.accent} strokeWidth="1" strokeLinecap="round" opacity="0.72" />
          <circle cx={cx} cy={cy} r="2" fill={flower.accent} opacity="0.62" />
        </g>
      ))}
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
      <path d="M61 63c-4-24 3-39 17-43 12 12 11 31-4 48-6 2-10 0-13-5Z" fill={flower.bloom} opacity="0.9" />
      <path d="M77 23c-8 14-9 27-4 40" fill="none" stroke={flower.accent} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M75 49c7-6 11-14 10-24" fill="none" stroke={flower.line} strokeWidth="1" strokeLinecap="round" opacity="0.38" />
      <path d="M70 45c6-2 9-5 11-10" fill="none" stroke={flower.accent} strokeWidth="1.2" strokeLinecap="round" />
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
      {[30, 42, 54, 66].map((cy, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const cx = 75 + side * 10;
        return (
          <path key={cy} d={`M${cx - 8} ${cy}c1-8 15-8 16 0 0 8-4 13-8 13s-8-5-8-13Z`} fill={flower.bloom} stroke={flower.accent} strokeWidth="1" opacity="0.9" />
        );
      })}
    </g>
  );
}

function WaterBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g transform="translate(73 54)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse key={angle} cx="0" cy="-14" rx="7" ry="18" fill={flower.bloomSoft} opacity="0.84" transform={`rotate(${angle})`} />
      ))}
      {[22, 82, 142, 202, 262, 322].map((angle) => (
        <ellipse key={angle} cx="0" cy="-10" rx="5" ry="13" fill={flower.bloom} opacity="0.9" transform={`rotate(${angle})`} />
      ))}
      <circle r="4" fill={flower.accent} opacity="0.64" />
    </g>
  );
}

function BouquetBloom({ flower }: { flower: FlowerStyle }) {
  return (
    <g>
      <RoseBloom flower={flower} />
      <g transform="translate(-19 4) scale(0.62)">
        <DaisyBloom flower={{ ...flower, bloom: "#f3d39b", bloomSoft: "#fff1c8", accent: "#c6934a" }} />
      </g>
      <g transform="translate(23 1) scale(0.56)">
        <ClusterBloom flower={{ ...flower, bloom: "#c6b6d8", bloomSoft: "#e7dfee", accent: "#9380ae" }} />
      </g>
    </g>
  );
}

function FlowerBloom({ flower }: { flower: FlowerStyle }) {
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
        <path d="M28 111c17 7 45 8 65-2" stroke="#d8c4a8" strokeWidth="1.2" strokeLinecap="round" opacity="0.58" />
        <path d="M70 111c-2-21 0-44 7-68" stroke={flower.line} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M70 78c-14-9-25-9-34 0 12 4 23 4 34 0Z" fill={flower.leaf} opacity="0.64" />
        <path d="M73 86c13-11 25-13 35-6-11 7-22 9-35 6Z" fill={flower.leaf} opacity="0.56" />
        <path d="M70 78c-10-1-20-1-30 0M74 86c10-3 20-5 30-6" stroke={flower.line} strokeWidth="1" strokeLinecap="round" opacity="0.42" />
        <FlowerBloom flower={flower} />
        <path d="M23 107c24 8 55 8 78 0" stroke="#f3e6d8" strokeWidth="8" strokeLinecap="round" opacity="0.34" />
      </svg>
      <figcaption style={{ fontSize: 12, letterSpacing: "0.12em", color: "#a08a7a" }}>
        {resolvedFlowerName}
      </figcaption>
    </figure>
  );
}
