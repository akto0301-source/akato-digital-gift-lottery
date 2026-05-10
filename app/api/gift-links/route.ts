import { NextResponse } from "next/server";
import { createGiftRecord, type GiftLocale } from "@/lib/gift-links";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    from?: string;
    to?: string;
    message?: string;
    locale?: GiftLocale;
  };

  const from = body.from?.trim() ?? "";
  const to = body.to?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const locale: GiftLocale = body.locale === "ja" ? "ja" : "zh";

  if (!from || !to || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const id = await createGiftRecord({ from, to, message, locale });

  return NextResponse.json({ id });
}
