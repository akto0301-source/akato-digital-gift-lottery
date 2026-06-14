"use client";

import { useState } from "react";

export const ORCHID_ILLUSTRATIONS = {
  default: "/flowers/orchid-sheet.png",
  pink: "/flowers/orchid-pink.png",
  orange: "/flowers/orchid-orange.png",
  white: "/flowers/orchid-white.png",
  vein: "/flowers/orchid-vein.png",
  romantic: "/flowers/orchid-romantic.png",
} as const;

export type OrchidIllustrationKey = keyof typeof ORCHID_ILLUSTRATIONS;

type OrchidIllustrationProps = {
  className?: string;
  imageClassName?: string;
  glowClassName?: string;
  orchidKey?: OrchidIllustrationKey;
};

export function OrchidIllustration({ className, imageClassName, glowClassName, orchidKey = "default" }: OrchidIllustrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [imageSrc, setImageSrc] = useState(ORCHID_ILLUSTRATIONS[orchidKey] ?? ORCHID_ILLUSTRATIONS.default);

  if (!isVisible) {
    return null;
  }

  function handleImageError() {
    if (imageSrc !== ORCHID_ILLUSTRATIONS.default) {
      setImageSrc(ORCHID_ILLUSTRATIONS.default);
      return;
    }

    setIsVisible(false);
  }

  return (
    <div className={className} aria-hidden="true">
      <span className={glowClassName} />
      <img
        className={imageClassName}
        src={imageSrc}
        alt=""
        width={720}
        height={520}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={handleImageError}
      />
    </div>
  );
}
