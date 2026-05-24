import { NextResponse } from "next/server";
import { formatLotReply, getContentLibrary, getRandomLot } from "@/lib/content";
import {
  getLineSignature,
  getTextMessageFromEvent,
  isDrawCommand,
  normalizeLinePayload,
  type RawLineEvent,
} from "@/lib/line";
import { replyLineTextMessage } from "@/lib/line-messaging";
import { verifyLineSignature } from "@/lib/line";
import { forwardLineEventToN8n } from "@/lib/n8n";

export const runtime = "nodejs";

type LineEventPayload = {
  destination?: string;
  events?: RawLineEvent[];
};

async function handleReplyForEvent(event: RawLineEvent) {
  const text = getTextMessageFromEvent(event);
  const replyToken = event.replyToken;
  const library = getContentLibrary();

  if (!replyToken || !text) {
    return { replied: false, reason: "No reply token or non-text message" };
  }

  if (isDrawCommand(text)) {
    const lot = getRandomLot();

    if (!lot) {
      await replyLineTextMessage(replyToken, library.fallbackMessages.empty);
      return { replied: true, type: "empty" };
    }

    await replyLineTextMessage(replyToken, formatLotReply(lot));
    return { replied: true, type: "draw", lotId: lot.id };
  }

  await replyLineTextMessage(replyToken, library.fallbackMessages.defaultReply);
  return { replied: true, type: "default" };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = getLineSignature(request.headers);

  if (!verifyLineSignature(rawBody, signature)) {
    return NextResponse.json(
      { ok: false, error: "Invalid LINE signature" },
      { status: 401 },
    );
  }

  let parsedBody: LineEventPayload;

  try {
    parsedBody = JSON.parse(rawBody) as LineEventPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const payload = normalizeLinePayload(parsedBody);
  const events = parsedBody.events ?? [];
  const replyResults = [];

  for (const event of events) {
    try {
      const result = await handleReplyForEvent(event);
      replyResults.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown reply error";
      replyResults.push({ replied: false, error: message });
    }
  }

  let n8nForwarded = false;
  let n8nError: string | null = null;

  try {
    await forwardLineEventToN8n({
      ...payload,
      replyResults,
    });
    n8nForwarded = true;
  } catch (error) {
    n8nError = error instanceof Error ? error.message : "Unknown forwarding error";
  }

  return NextResponse.json({
    ok: true,
    replied: replyResults,
    forwarded: n8nForwarded,
    n8nError,
    summary: payload.summary,
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "LINE webhook ready" });
}
