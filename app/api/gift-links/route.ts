import { NextResponse } from "next/server";
import { buildGiftUrl, createGiftRecord, type GiftLocale } from "@/lib/gift-links";
import type { ContentLot } from "@/lib/content";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    from?: string;
    fromName?: string;
    to?: string;
    toName?: string;
    message?: string;
    locale?: GiftLocale;
    cardId?: string | null;
    sceneId?: string | null;
    lotKey?: string | null;
    lotSnapshot?: ContentLot | null;
  };

  const fromName = (body.fromName ?? body.from)?.trim() ?? "";
  const toName = (body.toName ?? body.to)?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const locale: GiftLocale = body.locale === "ja" ? "ja" : "zh";
  const cardId = body.cardId?.trim() || null;
  const sceneId = body.sceneId?.trim() || null;
  const lotKey = body.lotKey?.trim() || body.lotSnapshot?.id || null;

  if (!fromName || !toName || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const id = await createGiftRecord({
      fromName,
      toName,
      message,
      locale,
      cardId,
      sceneId,
      lotKey,
      lotSnapshot: body.lotSnapshot ?? null,
    });

    return NextResponse.json({ id, url: buildGiftUrl(id) });
  } catch {
    return NextResponse.json({ error: "Unable to create gift link." }, { status: 500 });
  }
}
