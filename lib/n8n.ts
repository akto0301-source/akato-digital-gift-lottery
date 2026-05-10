export type NormalizedLineEventPayload = {
  source: "line";
  receivedAt: string;
  destination: string | null;
  events: unknown[];
  summary: {
    eventCount: number;
    eventTypes: string[];
    userIds: string[];
  };
  raw: unknown;
  replyResults?: unknown[];
};

export async function forwardLineEventToN8n(payload: NormalizedLineEventPayload) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("N8N_WEBHOOK_URL is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-openclaw-source": "line-gift-lottery",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`n8n webhook failed: ${response.status} ${body}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
