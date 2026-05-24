type LineTextMessage = {
  type: "text";
  text: string;
};

type ReplyMessageBody = {
  replyToken: string;
  messages: LineTextMessage[];
};

type PushMessageBody = {
  to: string;
  messages: LineTextMessage[];
};

async function callLineMessagingApi(path: string, body: ReplyMessageBody | PushMessageBody) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not configured");
  }

  const response = await fetch(`https://api.line.me/v2/bot/message/${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`LINE ${path} failed: ${response.status} ${responseBody}`);
  }
}

export async function replyLineTextMessage(replyToken: string, text: string) {
  const payload: ReplyMessageBody = {
    replyToken,
    messages: [{ type: "text", text }],
  };

  await callLineMessagingApi("reply", payload);
}

export async function pushLineTextMessage(to: string, text: string) {
  const payload: PushMessageBody = {
    to,
    messages: [{ type: "text", text }],
  };

  await callLineMessagingApi("push", payload);
}
