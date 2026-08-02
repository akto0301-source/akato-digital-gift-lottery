export type IntakeItemType = "蘭花" | "植物" | "永生花" | "落地花籃" | "其他";

export type SubstitutionPolicy = "由花藝師調整" | "替換前詢問客戶" | "不可替換";

export type AdminOrderIntakeDraft = {
  amount: string;
  building: string;
  cardText: string;
  customerName: string;
  deliveryAddress: string;
  deliveryDate: string;
  floor: string;
  itemType: IntakeItemType;
  mustKeep: string;
  plantRequest: string;
  quantity: string;
  rawSourceText: string;
  recipientName: string;
  recipientOrganization: string;
  recipientTitle: string;
  referenceFocus: string;
  senderText: string;
  specialRequirements: string;
  substitutionPolicy: SubstitutionPolicy;
};

export type AdminOrderIntakePreview = {
  amount: number;
  cardTask: {
    assignee: "珊珊";
    cardText: string;
    recipient: string;
    senderText: string;
    status: "待打卡";
  };
  deliveryLabel: string;
  quantity: number;
  workCards: Array<{
    id: string;
    itemLabel: string;
    requirements: string[];
  }>;
};

export function createEmptyAdminOrderIntakeDraft(): AdminOrderIntakeDraft {
  return {
    amount: "",
    building: "",
    cardText: "",
    customerName: "",
    deliveryAddress: "",
    deliveryDate: "",
    floor: "",
    itemType: "植物",
    mustKeep: "",
    plantRequest: "",
    quantity: "1",
    rawSourceText: "",
    recipientName: "",
    recipientOrganization: "",
    recipientTitle: "",
    referenceFocus: "",
    senderText: "",
    specialRequirements: "",
    substitutionPolicy: "替換前詢問客戶",
  };
}

function parsePositiveInteger(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeAmount(value: string) {
  const parsed = Number(value.replace(/[，,]/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function validateAdminOrderIntake(draft: AdminOrderIntakeDraft) {
  const warnings: string[] = [];

  if (!draft.rawSourceText.trim()) warnings.push("尚未保留 LINE 原始訊息");
  if (!draft.deliveryDate.trim()) warnings.push("缺少交付日期");
  if (!draft.recipientName.trim()) warnings.push("缺少收禮人");
  if (!draft.recipientTitle.trim()) warnings.push("缺少收禮人職稱");
  if (!draft.cardText.trim()) warnings.push("缺少賀卡內容");
  if (!draft.senderText.trim()) warnings.push("缺少下款／送禮人");
  if (!draft.deliveryAddress.trim()) warnings.push("缺少配送地址");
  if (!draft.plantRequest.trim()) warnings.push("尚未說明作品需求");
  if (parsePositiveInteger(draft.quantity) === null) warnings.push("數量必須是大於 0 的整數");
  if (parseNonNegativeAmount(draft.amount) === null) warnings.push("價位必須是 0 或正數");

  return warnings;
}

function joinNonEmpty(parts: string[], separator: string) {
  return parts.map((part) => part.trim()).filter(Boolean).join(separator);
}

export function createAdminOrderIntakePreview(draft: AdminOrderIntakeDraft): AdminOrderIntakePreview | null {
  const quantity = parsePositiveInteger(draft.quantity);
  const amount = parseNonNegativeAmount(draft.amount);

  if (quantity === null || amount === null) {
    return null;
  }

  const recipient = joinNonEmpty(
    [draft.recipientName, draft.recipientTitle, draft.recipientOrganization],
    "｜",
  );
  const deliveryLabel = joinNonEmpty(
    [
      draft.recipientName,
      draft.recipientTitle,
      draft.recipientOrganization,
      draft.deliveryAddress,
      draft.building,
      draft.floor,
    ],
    "｜",
  );
  const requirements = [
    `指定／期待：${draft.plantRequest.trim() || "請人工確認"}`,
    `參考照片重點：${draft.referenceFocus.trim() || "請人工確認"}`,
    `不可更動：${draft.mustKeep.trim() || "無／請人工確認"}`,
    `缺貨處理：${draft.substitutionPolicy}`,
    `特殊需求：${draft.specialRequirements.trim() || "無"}`,
  ];

  return {
    amount,
    cardTask: {
      assignee: "珊珊",
      cardText: draft.cardText.trim(),
      recipient,
      senderText: draft.senderText.trim(),
      status: "待打卡",
    },
    deliveryLabel,
    quantity,
    workCards: Array.from({ length: quantity }, (_, index) => ({
      id: `intake-work-card-${index + 1}`,
      itemLabel: `第 ${index + 1} 盆｜${draft.itemType}｜NT$${amount.toLocaleString("zh-TW")}`,
      requirements,
    })),
  };
}
