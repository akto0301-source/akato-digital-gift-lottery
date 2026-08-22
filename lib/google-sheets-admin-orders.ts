import { createSign } from "node:crypto";
import type { AdminOrder, OrderItemType } from "@/lib/admin-orders";

type SheetRow = Record<string, string>;

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

async function getAccessToken(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer
    .sign(normalizePrivateKey(privateKey))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth-grant-type:jwt-bearer".replace("oauth-grant", "oauth:grant"),
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google OAuth failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google OAuth returned no access token");
  }

  return data.access_token;
}

function classifyItemType(itemName: string): OrderItemType {
  if (itemName.includes("蘭")) return "蘭花";
  if (itemName.includes("永生")) return "永生花";
  if (itemName.includes("花籃") || itemName.includes("高架")) return "落地花籃";
  if (itemName.includes("植") || itemName.includes("盆栽") || itemName.includes("植物")) return "植物";
  return "其他";
}

function parseAmount(value: string) {
  const amount = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function rowToAdminOrder(row: SheetRow, index: number): AdminOrder | null {
  const orderNumber = row["訂單編號"]?.trim();
  if (!orderNumber) return null;

  const deliveryDate = row["交付日期"]?.trim() || "2026-01-01";
  const itemName = row["品項"]?.trim() || "未填品項";
  const recipient = row["收禮人"]?.trim() || "未填收禮人";
  const title = row["職稱"]?.trim();
  const unit = row["單位"]?.trim();
  const address = row["配送地址"]?.trim();
  const greeting = row["賀詞"]?.trim();
  const signature = row["下款"]?.trim();
  const note = row["備註"]?.trim();

  return {
    id: `sheet-${orderNumber}-${index + 2}`,
    orderedAt: `${deliveryDate}T00:00:00+08:00`,
    orderNumber,
    deliveryDate,
    recipientName: title ? `${recipient}｜${title}` : recipient,
    senderName: row["訂花客戶"]?.trim() || "未填訂花客戶",
    deliveryPlace: [address, unit].filter(Boolean).join(" / ") || "未填配送資訊",
    contact: "Google Sheet 測試資料",
    itemType: classifyItemType(itemName),
    itemName,
    amount: parseAmount(row["金額"] ?? ""),
    paymentStatus: "unpaid",
    productionStatus: "pending",
    cardStatus: greeting || signature ? "confirmed" : "unorganized",
    photoStatus: "not_taken",
    blessingLink: "#",
    note: [greeting ? `賀詞：${greeting}` : "", signature ? `下款：${signature}` : "", note]
      .filter(Boolean)
      .join("；"),
    updatedAt: `${deliveryDate}T00:00:00+08:00`,
  };
}

export async function loadGoogleSheetAdminOrders(): Promise<AdminOrder[]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim();
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!spreadsheetId || !sheetName || !clientEmail || !privateKey) {
    throw new Error("Google Sheets environment variables are incomplete");
  }

  const accessToken = await getAccessToken(clientEmail, privateKey);
  const range = encodeURIComponent(`'${sheetName.replace(/'/g, "''")}'!A1:L500`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`;
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Sheets read failed: ${response.status}`);
  }

  const data = (await response.json()) as { values?: string[][] };
  const values = data.values ?? [];
  if (values.length < 2) return [];

  const headers = values[0].map((value) => value.trim());
  return values
    .slice(1)
    .map((cells, index) => {
      const row = Object.fromEntries(headers.map((header, columnIndex) => [header, cells[columnIndex] ?? ""]));
      return rowToAdminOrder(row, index);
    })
    .filter((order): order is AdminOrder => Boolean(order));
}
