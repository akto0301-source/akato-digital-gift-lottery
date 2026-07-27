"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ExtraMessagePanel } from "@/app/confirm/extra-message-panel";
import { BlessingMotif, getBlessingCardVisual } from "@/components/blessing-card-visuals";
import { FlowerCardImage } from "@/components/flower-card-image";
import type { ContentLot } from "@/lib/content";
import type { GiftLocale } from "@/lib/gift-links";
import { blessingCards } from "@/lib/i18n";
import { defaultSceneId, resolveSceneId, sceneMap, type SceneId } from "@/lib/scene-map";

type SharedFlowerLot = Pick<ContentLot, "flowerIllustration" | "flowerName" | "flowerAlt" | "title"> &
  Partial<Pick<ContentLot, "label" | "fortune" | "blessing">>;

type GiftLetterExperienceProps = {
  locale: GiftLocale;
  fromName: string | null;
  toName: string | null;
  giftMessage: string | null;
  categoryId: string | null;
  sceneId: string | null;
  sharedFlowerLot?: SharedFlowerLot | null;
};

const PetalsBackground = () => {
  const petalConfigs = [
    { id: 1, left: "5%", delay: "0s", duration: "22s", scale: 1.2, opacity: 0.5, type: "a" },
    { id: 2, left: "15%", delay: "-5s", duration: "26s", scale: 0.8, opacity: 0.3, type: "b" },
    { id: 3, left: "25%", delay: "-2s", duration: "18s", scale: 1.0, opacity: 0.4, type: "a" },
    { id: 4, left: "35%", delay: "-8s", duration: "24s", scale: 0.6, opacity: 0.2, type: "b" },
    { id: 5, left: "45%", delay: "-1s", duration: "28s", scale: 1.5, opacity: 0.15, type: "a" },
    { id: 6, left: "55%", delay: "-12s", duration: "20s", scale: 0.9, opacity: 0.4, type: "b" },
    { id: 7, left: "65%", delay: "-4s", duration: "25s", scale: 1.1, opacity: 0.3, type: "a" },
    { id: 8, left: "75%", delay: "-9s", duration: "21s", scale: 0.7, opacity: 0.5, type: "b" },
    { id: 9, left: "85%", delay: "-3s", duration: "27s", scale: 1.3, opacity: 0.2, type: "a" },
    { id: 10, left: "92%", delay: "-7s", duration: "19s", scale: 0.8, opacity: 0.4, type: "b" },
    { id: 11, left: "20%", delay: "-15s", duration: "23s", scale: 1.0, opacity: 0.3, type: "a" },
    { id: 12, left: "40%", delay: "-6s", duration: "29s", scale: 1.4, opacity: 0.15, type: "b" },
    { id: 13, left: "70%", delay: "-14s", duration: "30s", scale: 1.2, opacity: 0.2, type: "b" },
    { id: 14, left: "88%", delay: "-11s", duration: "21s", scale: 0.9, opacity: 0.4, type: "a" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatDownA {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); }
          100% { transform: translateY(110vh) rotate(360deg) translateX(40px); }
        }
        @keyframes floatDownB {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); }
          100% { transform: translateY(110vh) rotate(-360deg) translateX(-40px); }
        }
      ` }} />
      {petalConfigs.map((petal) => (
        <div
          key={petal.id}
          style={{
            position: "absolute",
            top: 0,
            width: "24px",
            height: "24px",
            left: petal.left,
            opacity: petal.opacity,
            animation: `${petal.type === "a" ? "floatDownA" : "floatDownB"} ${petal.duration} infinite linear ${petal.delay}`,
          }}
        >
          <svg style={{ transform: `scale(${petal.scale})`, width: "100%", height: "100%" }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
          </svg>
        </div>
      ))}
    </div>
  );
};

function getSharedFlowerFortunePoem(fortune: string | undefined) {
  if (!fortune) {
    return "";
  }

  return fortune
    .replace(/^小籤詩：/, "")
    .split("溫柔解讀：")[0]
    ?.trim() ?? "";
}

function getSharedFlowerFortuneInterpretation(fortune: string | undefined) {
  if (!fortune || !fortune.includes("溫柔解讀：")) {
    return "";
  }

  return fortune.split("溫柔解讀：")[1]?.trim() ?? "";
}

function getSharedFlowerLetterContent(lot: SharedFlowerLot) {
  return {
    label: lot.label ?? "",
    title: lot.title,
    poem: getSharedFlowerFortunePoem(lot.fortune),
    interpretation: getSharedFlowerFortuneInterpretation(lot.fortune),
    blessing: lot.blessing ?? "",
    flowerName: lot.flowerName,
  };
}

function isGeneratedFlowerLotMessage(giftMessage: string | null, lot: SharedFlowerLot | null) {
  if (!giftMessage || !lot) {
    return false;
  }

  const message = giftMessage.trim();

  return Boolean(
    lot.label &&
      message.includes(`${lot.label}｜${lot.title}`) &&
      message.includes("小籤詩") &&
      message.includes("今日花語"),
  );
}

export function GiftLetterExperience({
  locale,
  fromName,
  toName,
  giftMessage,
  categoryId,
  sceneId,
  sharedFlowerLot: providedSharedFlowerLot = null,
}: GiftLetterExperienceProps) {
  const hasScene = Boolean(sceneId);
  const resolvedSceneId = sceneId ? resolveSceneId(sceneId) : defaultSceneId;
  const scene = sceneMap[resolvedSceneId];
  const [isOpened, setIsOpened] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const categoryCard = useMemo(
    () => (!hasScene ? blessingCards.find((card) => card.id === categoryId) ?? null : null),
    [categoryId, hasScene],
  );
  const categoryCopy = !hasScene && categoryCard ? (locale === "ja" ? categoryCard.ja : categoryCard.zh) : null;
  const isSharedFlowerLotLetter = Boolean(providedSharedFlowerLot);
  const canRenderDecorativeVisuals = !hasScene;
  const sharedFlowerLot = useMemo(
    () => (isSharedFlowerLotLetter && canRenderDecorativeVisuals ? providedSharedFlowerLot : null),
    [canRenderDecorativeVisuals, isSharedFlowerLotLetter, providedSharedFlowerLot],
  );
  const sharedFlowerLetterContent = useMemo(
    () => (sharedFlowerLot ? getSharedFlowerLetterContent(sharedFlowerLot) : null),
    [sharedFlowerLot],
  );
  const primaryGiftMessage =
    sharedFlowerLot && isGeneratedFlowerLotMessage(giftMessage, sharedFlowerLot)
      ? null
      : giftMessage;
  const categoryVisual = canRenderDecorativeVisuals && categoryCard && !isSharedFlowerLotLetter ? getBlessingCardVisual(categoryCard.id) : null;

  const handleOpenEnvelope = () => {
    setIsClicking(true);
    setTimeout(() => setIsOpened(true), 150);
  };

  return (
    <main
      style={{
        minHeight: "100svh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: hasScene ? "flex-start" : "center",
        padding: hasScene ? "32px 0 max(128px, calc(env(safe-area-inset-bottom) + 96px))" : "0",
        background: hasScene
          ? `linear-gradient(rgba(255, 246, 232, 0.04), rgba(255, 246, 232, 0.06)), url(${scene.image}) center / cover no-repeat`
          : "linear-gradient(to bottom, #F7E9E7, #F6F0E8)",
        color: "#8B8580",
        fontFamily: "sans-serif",
        overflowX: "hidden",
        overflowY: hasScene ? "auto" : "hidden",
      }}
    >
      <PetalsBackground />
      {isSharedFlowerLotLetter ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .giftSharedFlowerCard {
                position: relative;
                width: 100%;
                max-width: 430px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                margin: -2px auto 0;
                padding: 0 0 4px;
              }

              .giftSharedFlowerButterfly {
                --gift-shared-wing-1: url("/lot-butterfly/butterfly-kai-open.png");
                --gift-shared-wing-2: url("/lot-butterfly/butterfly-kai-mid.png");
                --gift-shared-wing-3: url("/lot-butterfly/butterfly-kai-closed.png");
                --gift-shared-resting: url("/lot-butterfly/butterfly-kai-closed.png");
                position: absolute;
                top: clamp(52px, 14vw, 78px);
                right: clamp(0px, 3vw, 20px);
                z-index: 4;
                display: block;
                width: clamp(36px, 9vw, 46px);
                aspect-ratio: 1;
                opacity: 1;
                pointer-events: none;
                user-select: none;
                transform-origin: 50% 58%;
                transform-style: preserve-3d;
                perspective: 220px;
                filter:
                  saturate(1.12)
                  contrast(1.1)
                  brightness(0.96)
                  drop-shadow(0 5px 12px rgba(82, 52, 34, 0.22));
                animation: giftSharedFlowerButterflyPath 8.8s linear infinite;
                will-change: opacity, transform;
              }

              .giftSharedFlowerButterflyFlight,
              .giftSharedFlowerButterflyFlyingPose,
              .giftSharedFlowerButterflyRestingPose {
                position: absolute;
                inset: 0;
                display: block;
                transform-origin: 50% 58%;
                will-change: opacity, transform;
              }

              .giftSharedFlowerButterflyFlight {
                animation: giftSharedFlowerButterflyPosture 8.8s ease-in-out infinite;
              }

              .giftSharedFlowerButterflyFlyingPose,
              .giftSharedFlowerButterflyRestingPose {
                background: center / contain no-repeat;
              }

              .giftSharedFlowerButterflyFlyingPose {
                background-image: var(--gift-shared-wing-1);
                opacity: 1;
                animation:
                  giftSharedFlowerButterflyFlyingVisibility 8.8s linear infinite,
                  giftSharedFlowerButterflyFlyingPose 0.38s step-end infinite;
              }

              .giftSharedFlowerButterflyRestingPose {
                background-image: var(--gift-shared-resting);
                opacity: 0;
                animation: giftSharedFlowerButterflyRestingPose 8.8s linear infinite;
              }

              .giftSharedFlowerImage {
                background: #f7e9e7;
                isolation: isolate;
                overflow: hidden;
                border-radius: 42% 42% 38% 38%;
              }

              .giftSharedFlowerImage::before {
                content: "";
                position: absolute;
                inset: -14% -13% -18%;
                z-index: -1;
                border-radius: 48% 48% 44% 44%;
                background:
                  radial-gradient(ellipse at 50% 48%, rgba(255, 247, 239, 0.38) 0%, rgba(248, 237, 231, 0.32) 42%, rgba(247, 233, 229, 0) 72%);
                filter: blur(14px);
              }

              .giftSharedFlowerImage::after {
                content: "";
                position: absolute;
                inset: 0;
                z-index: 2;
                pointer-events: none;
                border-radius: inherit;
                background:
                  radial-gradient(ellipse 54% 61% at 50% 47%, rgba(247, 233, 229, 0) 0%, rgba(247, 233, 229, 0) 48%, rgba(247, 233, 229, 0.2) 66%, rgba(247, 233, 229, 0.64) 86%, rgba(247, 233, 229, 0.95) 100%),
                  linear-gradient(to bottom, rgba(247, 233, 229, 0) 0%, rgba(247, 233, 229, 0) 68%, rgba(247, 233, 229, 0.52) 87%, rgba(247, 233, 229, 0.96) 100%),
                  linear-gradient(to right, rgba(247, 233, 229, 0.78) 0%, rgba(247, 233, 229, 0.16) 16%, rgba(247, 233, 229, 0) 30%, rgba(247, 233, 229, 0) 70%, rgba(247, 233, 229, 0.16) 84%, rgba(247, 233, 229, 0.78) 100%);
              }

              .giftSharedFlowerImageElement {
                border-radius: inherit;
                opacity: 0.93;
                mix-blend-mode: multiply;
                filter: brightness(1.055) contrast(0.965) saturate(1.08);
                -webkit-mask-image: radial-gradient(ellipse 47% 56% at 50% 47%, #000 44%, rgba(0, 0, 0, 0.9) 57%, rgba(0, 0, 0, 0.62) 70%, rgba(0, 0, 0, 0.24) 84%, transparent 100%);
                mask-image: radial-gradient(ellipse 47% 56% at 50% 47%, #000 44%, rgba(0, 0, 0, 0.9) 57%, rgba(0, 0, 0, 0.62) 70%, rgba(0, 0, 0, 0.24) 84%, transparent 100%);
              }

              @keyframes giftSharedFlowerButterflyPath {
                0% {
                  opacity: 1;
                  transform: translate3d(18px, -12px, 0) rotate(-18deg) scale(0.98);
                }

                7% {
                  opacity: 1;
                  transform: translate3d(7px, -21px, 0) rotate(-23deg) scale(1);
                }

                15% {
                  opacity: 1;
                  transform: translate3d(-16px, -10px, 0) rotate(-10deg) scale(1.02);
                }

                26% {
                  opacity: 1;
                  transform: translate3d(-42px, 18px, 0) rotate(6deg) scale(1.02);
                }

                36% {
                  opacity: 1;
                  transform: translate3d(-52px, 48px, 0) rotate(8deg) scale(1.01);
                }

                43% {
                  opacity: 1;
                  transform: translate3d(-52px, 58px, 0) rotate(4deg) scale(1);
                }

                47%,
                62% {
                  opacity: 1;
                  transform: translate3d(-52px, 58px, 0) rotate(4deg) scale(1);
                }

                67% {
                  opacity: 1;
                  transform: translate3d(-46px, 38px, 0) rotate(-15deg) scale(1.02);
                }

                78% {
                  opacity: 1;
                  transform: translate3d(-28px, 10px, 0) rotate(-19deg) scale(1);
                }

                90% {
                  opacity: 1;
                  transform: translate3d(2px, -18px, 0) rotate(-7deg) scale(0.98);
                }

                100% {
                  opacity: 1;
                  transform: translate3d(18px, -12px, 0) rotate(8deg) scale(0.98);
                }
              }

              @keyframes giftSharedFlowerButterflyPosture {
                0% {
                  transform: translate3d(0, 0, 0) rotateX(0deg);
                }

                8% {
                  transform: translate3d(0, -3px, 0) rotateX(8deg);
                }

                15% {
                  transform: translate3d(0, 1px, 0) rotateX(2deg);
                }

                26% {
                  transform: translate3d(0, -3px, 0) rotateX(7deg);
                }

                36% {
                  transform: translate3d(0, 1px, 0) rotateX(2deg);
                }

                43%,
                64% {
                  transform: translate3d(0, 0, 0) rotateX(0deg);
                }

                67% {
                  transform: translate3d(0, -4px, 0) rotateX(8deg);
                }

                78% {
                  transform: translate3d(0, -1px, 0) rotateX(3deg);
                }

                100% {
                  transform: translate3d(0, 0, 0) rotateX(0deg);
                }
              }

              @keyframes giftSharedFlowerButterflyFlyingVisibility {
                0%,
                41% {
                  opacity: 1;
                }

                44.5% {
                  opacity: 0.82;
                }

                46.5% {
                  opacity: 0.38;
                }

                48%,
                63.5% {
                  opacity: 0;
                }

                64.5% {
                  opacity: 0.35;
                }

                66.5% {
                  opacity: 0.86;
                }

                68%,
                100% {
                  opacity: 1;
                }
              }

              @keyframes giftSharedFlowerButterflyFlyingPose {
                0% {
                  background-image: var(--gift-shared-wing-1);
                }

                2% {
                  background-image: var(--gift-shared-wing-2);
                }

                4% {
                  background-image: var(--gift-shared-wing-3);
                }

                6% {
                  background-image: var(--gift-shared-wing-2);
                }

                8%,
                15% {
                  background-image: var(--gift-shared-wing-1);
                }

                19% {
                  background-image: var(--gift-shared-wing-2);
                }

                22% {
                  background-image: var(--gift-shared-wing-3);
                }

                25% {
                  background-image: var(--gift-shared-wing-2);
                }

                29% {
                  background-image: var(--gift-shared-wing-1);
                }

                33% {
                  background-image: var(--gift-shared-wing-3);
                }

                37%,
                41% {
                  background-image: var(--gift-shared-wing-1);
                }

                65% {
                  background-image: var(--gift-shared-wing-2);
                }

                67% {
                  background-image: var(--gift-shared-wing-3);
                }

                69% {
                  background-image: var(--gift-shared-wing-2);
                }

                72%,
                80% {
                  background-image: var(--gift-shared-wing-1);
                }

                85% {
                  background-image: var(--gift-shared-wing-2);
                }

                90%,
                100% {
                  background-image: var(--gift-shared-wing-1);
                }
              }

              @keyframes giftSharedFlowerButterflyRestingPose {
                0%,
                43.5%,
                67.5%,
                100% {
                  opacity: 0;
                  transform: rotate(-1deg) scale(1);
                }

                45% {
                  opacity: 0.42;
                  transform: rotate(-1deg) scale(1);
                }

                46.5% {
                  opacity: 0.82;
                  transform: rotate(0deg) scale(1);
                }

                48%,
                62.5% {
                  opacity: 1;
                  transform: rotate(0deg) scale(1);
                }

                64.5% {
                  opacity: 0.55;
                  transform: rotate(-1deg) scale(1);
                }

                66% {
                  opacity: 0.18;
                  transform: rotate(-1deg) scale(1);
                }
              }

              @media (max-width: 420px) {
                .giftSharedFlowerCard {
                  max-width: 356px;
                }

                .giftSharedFlowerButterfly {
                  right: 8px;
                  width: 36px;
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .giftSharedFlowerButterfly,
                .giftSharedFlowerButterflyFlight,
                .giftSharedFlowerButterflyFlyingPose,
                .giftSharedFlowerButterflyRestingPose {
                  animation: none;
                }

                .giftSharedFlowerButterfly {
                  transform: translate3d(-48px, 42px, 0) rotate(-6deg) scale(1);
                }

                .giftSharedFlowerButterflyFlyingPose {
                  opacity: 1;
                  background-image: var(--gift-shared-wing-1);
                }

                .giftSharedFlowerButterflyRestingPose {
                  opacity: 0;
                }
              }
            `,
          }}
        />
      ) : null}
      {hasScene ? (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .giftLetterButterfly {
                  position: fixed;
                  top: clamp(92px, 13svh, 132px);
                  right: clamp(16px, 7vw, 72px);
                  z-index: 2;
                  width: clamp(48px, 13vw, 72px);
                  aspect-ratio: 1;
                  opacity: 0;
                  pointer-events: none;
                  user-select: none;
                  transform-origin: 50% 58%;
                  animation: giftLetterButterflyFloat 12s ease-in-out infinite;
                }

                .giftLetterButterfly img {
                  display: block;
                  width: 100%;
                  height: auto;
                  filter: drop-shadow(0 4px 10px rgba(114, 93, 55, 0.16));
                  transform-origin: 50% 58%;
                  animation: giftLetterButterflyBreathe 5.8s ease-in-out infinite;
                }

                @keyframes giftLetterButterflyFloat {
                  0% {
                    opacity: 0;
                    transform: translate3d(0, 8px, 0) rotate(-8deg) scale(0.96);
                  }
                  16% {
                    opacity: 0.78;
                  }
                  42% {
                    opacity: 0.84;
                    transform: translate3d(-8px, -4px, 0) rotate(-3deg) scale(1);
                  }
                  72% {
                    opacity: 0.8;
                    transform: translate3d(5px, 5px, 0) rotate(-10deg) scale(0.98);
                  }
                  100% {
                    opacity: 0;
                    transform: translate3d(0, 8px, 0) rotate(-8deg) scale(0.96);
                  }
                }

                @keyframes giftLetterButterflyBreathe {
                  0%, 100% {
                    transform: rotate(0deg) scale(0.985);
                  }
                  50% {
                    transform: rotate(2deg) scale(1.035);
                  }
                }

                @media (max-width: 420px) {
                  .giftLetterButterfly {
                    top: 104px;
                    right: 14px;
                    width: 52px;
                  }
                }

                @media (prefers-reduced-motion: reduce) {
                  .giftLetterButterfly,
                  .giftLetterButterfly img {
                    animation: none;
                  }

                  .giftLetterButterfly {
                    opacity: 0.78;
                    transform: rotate(-6deg);
                  }
                }
              `,
            }}
          />
          <span className="giftLetterButterfly" aria-hidden="true">
            <img src="/gift/butterfly-watercolor-yellow-white.png" alt="" draggable={false} />
          </span>
        </>
      ) : null}
      <div style={{ position: "relative", zIndex: 10, width: "min(560px, calc(100% - 32px))", padding: hasScene ? "32px 24px 108px" : "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderRadius: "0", background: "transparent", border: "0", boxShadow: "none", backdropFilter: "none" }}>
        <p style={{ fontSize: "12px", letterSpacing: "0.25em", fontWeight: 300, marginBottom: "16px", transition: "opacity 0.7s ease", opacity: isOpened ? 0.46 : 0.62, color: hasScene ? "rgba(72, 62, 58, 0.78)" : undefined, textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.92), 0 8px 28px rgba(255, 250, 240, 0.48)" : undefined }}>
          AKATO GIFT LETTER
        </p>

        <div style={{ height: "32px", width: "100%", display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em", color: hasScene ? "rgba(72, 62, 58, 0.86)" : "#8B8580", transition: "all 0.6s ease-out", opacity: isOpened ? 0 : 1, transform: isOpened ? "translateY(-8px)" : "translateY(0)", pointerEvents: isOpened ? "none" : "auto", textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.92), 0 8px 28px rgba(255, 250, 240, 0.48)" : undefined }}>
            {toName ? (locale === "ja" ? `宛先 ${toName}` : `給 ${toName}`) : ""}
          </p>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", position: "relative", width: "100%", maxWidth: "380px", margin: "8px auto 16px auto", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.4, fontWeight: 500, color: hasScene ? "rgba(72, 62, 58, 0.94)" : "#7A736E", minHeight: "5.5rem", textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.92), 0 8px 28px rgba(255, 250, 240, 0.48)" : undefined }}>
          <span style={{ position: "absolute", width: "100%", whiteSpace: "normal", wordBreak: "keep-all", transition: "all 0.6s ease-out", opacity: isOpened ? 0 : 1, transform: isOpened ? "translateY(-8px)" : "translateY(0)", pointerEvents: isOpened ? "none" : "auto" }}>
            {locale === "ja" ? <>Akato からの<br />祝福の手紙が届きました</> : <>你收到一封來自<br />Akato 的祝福信</>}
          </span>
          <span style={{ position: "absolute", width: "100%", whiteSpace: "normal", wordBreak: "keep-all", fontSize: isSharedFlowerLotLetter ? "clamp(15px, 3.6vw, 20px)" : "clamp(18px, 3.8vw, 24px)", fontWeight: 400, lineHeight: isSharedFlowerLotLetter ? 1.58 : 1.5, color: hasScene ? "rgba(72, 62, 58, 0.9)" : "#8B8580", letterSpacing: "0.08em", transition: "all 0.8s ease-out 0.45s", opacity: isOpened ? 1 : 0, transform: isOpened ? "translateY(0)" : "translateY(16px)", pointerEvents: "none" }}>
            {locale === "ja" ? <>今日のあなたが、<br />やさしさにそっと包まれますように。</> : <>願今天的你，<br />被溫柔地接住。</>}
          </span>
        </h1>

        {isOpened ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: sharedFlowerLot ? "18px" : hasScene ? "18px" : "14px", transition: "all 0.8s ease-out", marginTop: sharedFlowerLot ? "6px" : "18px", marginBottom: hasScene ? "44px" : sharedFlowerLot ? "24px" : "28px", padding: hasScene ? "24px 18px 30px" : undefined, background: hasScene ? "transparent" : undefined }}>
            {canRenderDecorativeVisuals && categoryCopy && !isSharedFlowerLotLetter ? (
              <p style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.16em", color: hasScene ? "rgba(72, 62, 58, 0.7)" : "#A39B95", margin: "0 0 2px", position: "relative", zIndex: 3, textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.92), 0 8px 28px rgba(255, 250, 240, 0.48)" : undefined }}>
                {categoryCopy.label} · {categoryCopy.title}
              </p>
            ) : null}
            {canRenderDecorativeVisuals && categoryVisual ? (
              <div
                style={{
                  position: "relative",
                  width: "128px",
                  height: "104px",
                  margin: "-4px auto 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
                aria-hidden="true"
              >
                <span
                  style={{
                    position: "absolute",
                    width: "132px",
                    height: "72px",
                    borderRadius: "999px",
                    background: `linear-gradient(135deg, ${categoryVisual.petal}, rgba(255, 248, 241, 0.42))`,
                    opacity: 0.58,
                    transform: "rotate(-7deg)",
                  }}
                />
                <BlessingMotif
                  visual={categoryVisual}
                  style={{
                    position: "relative",
                    width: "116px",
                    height: "116px",
                    filter: "drop-shadow(0 14px 22px rgba(120, 90, 60, 0.1))",
                    opacity: 0.92,
                  }}
                />
              </div>
            ) : null}
            <p style={{ fontSize: sharedFlowerLot ? "clamp(18px, 4.5vw, 24px)" : "clamp(23px, 4.8vw, 30px)", fontWeight: sharedFlowerLot ? 500 : 600, lineHeight: sharedFlowerLot ? 1.72 : 1.65, maxWidth: sharedFlowerLot ? "390px" : "440px", color: hasScene ? "rgba(72, 62, 58, 0.94)" : "#7A736E", letterSpacing: sharedFlowerLot ? "0.06em" : "0.08em", textAlign: "center", margin: "0 auto", width: "100%", position: "relative", zIndex: 3, overflowWrap: "anywhere", whiteSpace: "pre-wrap", textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.92), 0 8px 28px rgba(255, 250, 240, 0.48)" : undefined }}>
              {primaryGiftMessage || (locale === "ja" ? "ゆっくりで大丈夫。この祝福が少しだけ寄り添えますように。" : "慢慢來也沒關係，這份祝福會陪你一下。")}
            </p>
            <p style={{ fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em", color: hasScene ? "rgba(72, 62, 58, 0.72)" : "#A39B95", margin: sharedFlowerLot ? "0 0 4px" : "18px 0 0", position: "relative", zIndex: 2, textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.92), 0 8px 28px rgba(255, 250, 240, 0.48)" : undefined }}>
              {fromName ? (locale === "ja" ? `${fromName} からの祝福` : `來自 ${fromName} 的祝福`) : ""}
            </p>
            {sharedFlowerLot && sharedFlowerLetterContent ? (
              <div className="giftSharedFlowerCard">
                <span className="giftSharedFlowerButterfly" aria-hidden="true">
                  <span className="giftSharedFlowerButterflyFlight">
                    <span className="giftSharedFlowerButterflyFlyingPose" />
                    <span className="giftSharedFlowerButterflyRestingPose" />
                  </span>
                </span>
                <FlowerCardImage
                  lot={sharedFlowerLot}
                  className="giftSharedFlowerImage"
                  imageClassName="giftSharedFlowerImageElement"
                  size={192}
                  style={{
                    margin: "0 auto -2px",
                    width: "min(250px, 66vw)",
                    opacity: 0.99,
                    filter: "drop-shadow(0 10px 18px rgba(120, 90, 60, 0.035))",
                    position: "relative",
                    zIndex: 3,
                  }}
                  imageStyle={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 3, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "12px", lineHeight: 1.45, fontWeight: 500, letterSpacing: "0.18em", color: "#A67972" }}>
                    今日小花籤
                  </p>
                  {sharedFlowerLetterContent.flowerName ? (
                    <p style={{ margin: "0", fontSize: "12px", lineHeight: 1.45, fontWeight: 400, letterSpacing: "0.14em", color: "#A08D83" }}>
                      {sharedFlowerLetterContent.flowerName}
                    </p>
                  ) : null}
                  {sharedFlowerLetterContent.label ? (
                    <p style={{ margin: "0", fontSize: "12px", lineHeight: 1.45, fontWeight: 400, letterSpacing: "0.16em", color: "#A08D83" }}>
                      {sharedFlowerLetterContent.label}
                    </p>
                  ) : null}
                  <h2 style={{ margin: "0", fontSize: "clamp(21px, 5.4vw, 26px)", lineHeight: 1.35, fontWeight: 600, letterSpacing: "0.08em", color: "#6F625D", textWrap: "balance" }}>
                    {sharedFlowerLetterContent.title}
                  </h2>
                  {sharedFlowerLetterContent.poem ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                      <p style={{ margin: "0", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", color: "#A08D83" }}>小籤詩</p>
                      <p style={{ margin: "0", maxWidth: "330px", fontSize: "clamp(14px, 3.7vw, 16px)", lineHeight: 1.82, fontWeight: 400, letterSpacing: "0.04em", color: "#7B706B", overflowWrap: "anywhere" }}>
                        {sharedFlowerLetterContent.poem}
                      </p>
                    </div>
                  ) : null}
                  {sharedFlowerLetterContent.interpretation ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                      <p style={{ margin: "0", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", color: "#A08D83" }}>溫柔解讀</p>
                      <p style={{ margin: "0", maxWidth: "330px", fontSize: "clamp(13px, 3.5vw, 15px)", lineHeight: 1.84, fontWeight: 400, letterSpacing: "0.04em", color: "#877973", overflowWrap: "anywhere" }}>
                        {sharedFlowerLetterContent.interpretation}
                      </p>
                    </div>
                  ) : null}
                  {sharedFlowerLetterContent.blessing ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                      <p style={{ margin: "0", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", color: "#A08D83" }}>今日花語</p>
                      <p style={{ margin: "0", maxWidth: "330px", fontSize: "clamp(13px, 3.5vw, 15px)", lineHeight: 1.84, fontWeight: 400, letterSpacing: "0.04em", color: "#877973", overflowWrap: "anywhere" }}>
                        {sharedFlowerLetterContent.blessing}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {!isSharedFlowerLotLetter ? <ExtraMessagePanel locale={locale} /> : null}
          </div>
        ) : null}

        {!isOpened ? (
          <div style={{ position: "relative", width: "224px", height: "160px", marginTop: "36px", marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "default" }}>
            <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", overflow: "visible", filter: "drop-shadow(0px 18px 36px rgba(120, 90, 60, 0.12))" }}>
            <defs>
              <linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8dcca" /><stop offset="100%" stopColor="#d5c3af" /></linearGradient>
              <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#fdfbf8" /></linearGradient>
              <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fffaf3" /><stop offset="100%" stopColor="#f6ecde" /></linearGradient>
              <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8efe4" /><stop offset="100%" stopColor="#f3e4d5" /></linearGradient>
              <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fffaf3" /><stop offset="100%" stopColor="#f3e4d5" /></linearGradient>
              <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#FDF0ED" /><stop offset="100%" stopColor="#DFBEB8" /></radialGradient>
              <clipPath id="env-clip"><rect x="10" y="30" width="180" height="100" rx="6" /></clipPath>
            </defs>
            <rect x="10" y="30" width="180" height="100" rx="6" fill="url(#backGrad)" />
            <rect x="10" y="30" width="180" height="100" rx="6" fill="none" stroke="rgba(120,90,60,0.15)" strokeWidth="1.5" />
            <g style={{ opacity: isOpened ? 1 : 0, transition: "opacity 0.75s ease-in-out 0.1s" }}>
              <path d="M10 30 L100 -20 L190 30 Z" fill="url(#flapGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M13 31 L100 -17 L187 31" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </g>
            <g style={{ transform: isOpened ? "translateY(-28px)" : "translateY(5px)", opacity: isOpened ? 1 : 0, transition: "all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s" }}>
              <rect x="20" y="36" width="160" height="85" rx="3" fill="rgba(120,90,60,0.05)" />
              <rect x="20" y="35" width="160" height="85" rx="3" fill="url(#paperGrad)" stroke="rgba(210,185,155,0.3)" strokeWidth="0.5" />
              <line x1="35" y1="48" x2="165" y2="48" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
              <line x1="35" y1="58" x2="145" y2="58" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
              <line x1="35" y1="68" x2="155" y2="68" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
            </g>
            <g clipPath="url(#env-clip)">
              <polygon points="-10,10 105,80 -10,150" fill="url(#sideGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
              <polygon points="210,10 95,80 210,150" fill="url(#sideGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
              <polygon points="-10,140 100,74 210,140" fill="url(#bottomGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M 12 128 L 100 78 L 188 128" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <rect x="10" y="30" width="180" height="100" rx="6" fill="none" stroke="rgba(210,185,155,0.4)" strokeWidth="1" />
            <g style={{ transformOrigin: "100px 30px", transform: isOpened ? "rotateX(180deg)" : "rotateX(0deg)", opacity: isOpened ? 0 : 1, transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <path d="M10 30 L100 86 L190 30 Z" fill="url(#flapGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M13 31 L100 84 L187 31" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </g>
            <g style={{ transformOrigin: "100px 85px", transform: isOpened ? "scale(0.85)" : "scale(1)", opacity: isOpened ? 0 : 1, transition: "all 0.3s ease-out" }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(120,90,60,0.12)" transform="translate(100, 86.5) scale(0.95) translate(-12, -12)" />
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" transform="translate(100, 85) scale(0.95) translate(-12, -12)" />
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.0" transform="translate(100, 85) scale(0.95) translate(-12, -12)" />
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="rgba(210,185,155,0.5)" strokeWidth="0.8" transform="translate(100, 85) scale(0.7) translate(-12, -12)" />
            </g>
            </svg>
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: hasScene ? "36px" : "20px", width: "100%", paddingBottom: hasScene ? "88px" : "0" }}>
          <div style={{ width: "100%", maxWidth: "240px", transition: "all 0.7s ease-in-out", opacity: isOpened ? 0 : 1, height: isOpened ? 0 : "64px", overflow: "hidden", pointerEvents: isOpened ? "none" : "auto" }}>
            <button onClick={handleOpenEnvelope} disabled={isClicking} style={{ width: "100%", height: "100%", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid #D9C9B6", color: "#7A736E", fontSize: "16px", letterSpacing: "0.2em", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.3s", backdropFilter: "blur(4px)" }}>
              {locale === "ja" ? "封筒を開く" : "打開信封"}
            </button>
          </div>
          <div style={{ transition: "all 0.9s ease-out 0.7s", transform: isOpened ? "translateY(0)" : "translateY(-20px)", opacity: 1, marginTop: hasScene ? "16px" : "0", marginBottom: hasScene ? "64px" : "0" }}>
            <Link href={locale === "ja" ? "/ja" : "/"} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: hasScene ? "40px" : "auto", padding: hasScene ? "9px 16px 8px" : "0 0 4px", borderRadius: hasScene ? "999px" : "0", background: hasScene ? "rgba(255, 250, 240, 0.34)" : "transparent", border: hasScene ? "1px solid rgba(255, 250, 240, 0.34)" : "0", boxShadow: hasScene ? "0 8px 22px rgba(64, 48, 38, 0.1)" : "none", backdropFilter: hasScene ? "blur(2px)" : "none", fontSize: "14px", letterSpacing: "0.1em", color: hasScene ? "rgba(72, 62, 58, 0.9)" : "#A39B95", textDecoration: "none", borderBottom: hasScene ? "0" : "1px solid rgba(163,155,149,0.3)", textShadow: hasScene ? "0 1px 2px rgba(255, 250, 240, 0.82), 0 6px 18px rgba(255, 250, 240, 0.36)" : "none", transition: "color 0.3s, border-color 0.3s, background 0.3s" }}>
              {locale === "ja" ? "わたしも祝福を届けたい" : "我也想送出一封祝福"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
