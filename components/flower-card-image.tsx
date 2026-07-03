"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import { FlowerLotIllustration } from "@/components/flower-lot-illustrations";
import type { ContentLot } from "@/lib/content";

export const FLOWER_CARD_IMAGES = {
  "勿忘我": "/flowers/forget-me-not.png",
  "小蒼蘭": "/flowers/freesia.png",
  "海芋": "/flowers/calla-lily.png",
  "茉莉": "/flowers/jasmine.png",
  "鬱金香": "/flowers/tulip.png",
  "繡球": "/flowers/hydrangea.png",
  "繡球花": "/flowers/hydrangea.png",
  "花束": "/flowers/bouquet.png",
  "風信子": "/flowers/hyacinth.png",
  "小菊花": "/flowers/small-chrysanthemum.png",
  "山茶花": "/flowers/camellia.png",
  "粉色康乃馨": "/flowers/pink-carnation.png",
  "白玫瑰": "/flowers/white-rose.png",
  "薰衣草": "/flowers/lavender.png",
  "滿天星": "/flowers/babys-breath.png",
  "睡蓮": "/flowers/water-lily.png",
  "粉玫瑰": "/flowers/pink-rose.png",
  "牡丹": "/flowers/peony.png",
  "金盞花": "/flowers/calendula.png",
  "百合": "/flowers/lily.png",
  "櫻花": "/flowers/sakura.png",
  "鈴蘭": "/flowers/lily-of-the-valley.png",
  "洋桔梗": "/flowers/lisianthus.png",
  "鳶尾花": "/flowers/iris.png",
  "向日葵": "/flowers/sunflower.png",
  "小雛菊": "/flowers/daisy.png",
} as const;

const FLOWER_CARD_IMAGES_BY_KEY: Record<string, string> = {
  "forget-me-not": FLOWER_CARD_IMAGES["勿忘我"],
  freesia: FLOWER_CARD_IMAGES["小蒼蘭"],
  calla: FLOWER_CARD_IMAGES["海芋"],
  jasmine: FLOWER_CARD_IMAGES["茉莉"],
  tulip: FLOWER_CARD_IMAGES["鬱金香"],
  hydrangea: FLOWER_CARD_IMAGES["繡球"],
  bouquet: FLOWER_CARD_IMAGES["花束"],
  hyacinth: FLOWER_CARD_IMAGES["風信子"],
  chrysanthemum: FLOWER_CARD_IMAGES["小菊花"],
  camellia: FLOWER_CARD_IMAGES["山茶花"],
  carnation: FLOWER_CARD_IMAGES["粉色康乃馨"],
  "white-rose": FLOWER_CARD_IMAGES["白玫瑰"],
  lavender: FLOWER_CARD_IMAGES["薰衣草"],
  gypsophila: FLOWER_CARD_IMAGES["滿天星"],
  "water-lily": FLOWER_CARD_IMAGES["睡蓮"],
  "pink-rose": FLOWER_CARD_IMAGES["粉玫瑰"],
  peony: FLOWER_CARD_IMAGES["牡丹"],
  calendula: FLOWER_CARD_IMAGES["金盞花"],
  lily: FLOWER_CARD_IMAGES["百合"],
  "cherry-blossom": FLOWER_CARD_IMAGES["櫻花"],
  "lily-of-the-valley": FLOWER_CARD_IMAGES["鈴蘭"],
  lisianthus: FLOWER_CARD_IMAGES["洋桔梗"],
  iris: FLOWER_CARD_IMAGES["鳶尾花"],
  sunflower: FLOWER_CARD_IMAGES["向日葵"],
  daisy: FLOWER_CARD_IMAGES["小雛菊"],
};

type FlowerCardImageProps = {
  lot: Pick<ContentLot, "flowerIllustration" | "flowerName" | "flowerAlt" | "title">;
  className?: string;
  imageClassName?: string;
  imageStyle?: CSSProperties;
  size?: number;
  style?: CSSProperties;
};

function resolveFlowerCardImage(lot: FlowerCardImageProps["lot"]) {
  return FLOWER_CARD_IMAGES_BY_KEY[lot.flowerIllustration ?? ""] ?? FLOWER_CARD_IMAGES[lot.flowerName as keyof typeof FLOWER_CARD_IMAGES] ?? null;
}

export function FlowerCardImage({ lot, className, imageClassName, imageStyle, size = 144, style }: FlowerCardImageProps) {
  const imageSrc = resolveFlowerCardImage(lot);
  const [hasImageError, setHasImageError] = useState(false);

  if (!imageSrc || hasImageError) {
    return <FlowerLotIllustration lot={lot} className={className} size={size} style={style} />;
  }

  const flowerName = lot.flowerName ?? lot.title;
  const alt = lot.flowerAlt ?? `${flowerName}小插畫`;

  return (
    <figure className={className} style={style} aria-label={alt}>
      <img
        className={imageClassName}
        style={imageStyle}
        src={imageSrc}
        alt={alt}
        width={1024}
        height={1024}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={() => setHasImageError(true)}
      />
    </figure>
  );
}
