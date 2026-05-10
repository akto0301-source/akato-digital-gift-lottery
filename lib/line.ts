import crypto from "node:crypto";

const LINE_SIGNATURE_HEADER = "x-line-signature";
const DRAW_COMMANDS = new Set(["抽籤", "我要抽籤", "抽一支籤"]);

type RawLineMessage = {
  type?: string;
  text?: string;
};

export type RawLineEvent = {
  type?: string;
  replyToken?: string;
  message?: RawLineMessage;
  source?: {
    userId?: string;
    groupId?: string;
    roomId?: string;
    type?: string;
  };
};

type RawLinePayload = {
  destination?: string;
  events?: RawLineEvent[];
};

export function getLineSignature(headers: Headers): string | null {
  return headers.get(LINE_SIGNATURE_HEADER);
}

export function verifyLineSignature(body: string, signature: string | null): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const digest = crypto.createHmac("SHA256", secret).update(body).digest("base64");
  const digestBuffer = Buffer.from(digest);
  const signatureBuffer = Buffer.from(signature);

  if (digestBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
}

export function normalizeLinePayload(payload: RawLinePayload) {
  const events = payload.events ?? [];
  const eventTypes = [...new Set(events.map((event) => event.type).filter(Boolean))] as string[];
  const userIds = [
    ...new Set(events.map((event) => event.source?.userId).filter(Boolean)),
  ] as string[];

  return {
    source: "line" as const,
    receivedAt: new Date().toISOString(),
    destination: payload.destination ?? null,
    events,
    summary: {
      eventCount: events.length,
      eventTypes,
      userIds,
    },
    raw: payload,
  };
}

export function isDrawCommand(text: string): boolean {
  return DRAW_COMMANDS.has(text.trim());
}

export function getTextMessageFromEvent(event: RawLineEvent): string {
  if (event.type !== "message" || event.message?.type !== "text") {
    return "";
  }

  return event.message.text?.trim() ?? "";
}
