"use client";

import { useEffect, useState } from "react";
import { GiftLetterExperience } from "@/components/gift-letter-experience";
import type { GiftLocale } from "@/lib/gift-links";
import { resolveSceneId } from "@/lib/scene-map";

function getQueryValue(searchParams: URLSearchParams, name: string) {
  const value = searchParams.get(name);
  return value && value.trim() !== "" ? value.trim() : null;
}

type LetterQuery = {
  locale: GiftLocale;
  fromName: string | null;
  toName: string | null;
  giftMessage: string | null;
  categoryId: string | null;
  sceneId: string | null;
};

export default function LetterPage() {
  const [letterQuery, setLetterQuery] = useState<LetterQuery>({
    locale: "zh",
    fromName: null,
    toName: null,
    giftMessage: null,
    categoryId: null,
    sceneId: null,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const localeParam = getQueryValue(searchParams, "locale");
      const sceneIdParam = getQueryValue(searchParams, "sceneId");

      setLetterQuery({
        locale: localeParam === "ja" ? "ja" : "zh",
        fromName: getQueryValue(searchParams, "from"),
        toName: getQueryValue(searchParams, "to"),
        giftMessage: getQueryValue(searchParams, "message"),
        categoryId: getQueryValue(searchParams, "cardId") ?? getQueryValue(searchParams, "category"),
        sceneId: sceneIdParam ? resolveSceneId(sceneIdParam) : null,
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <GiftLetterExperience
      locale={letterQuery.locale}
      fromName={letterQuery.fromName}
      toName={letterQuery.toName}
      giftMessage={letterQuery.giftMessage}
      categoryId={letterQuery.categoryId}
      sceneId={letterQuery.sceneId}
    />
  );
}
