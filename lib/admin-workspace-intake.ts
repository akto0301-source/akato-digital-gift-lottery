export type IntakeItemType = "蘭花" | "植物" | "永生花" | "落地花籃" | "其他";

export type SubstitutionPolicy = "由花藝師調整" | "替換前詢問客戶" | "不可替換";

export type AdminOrderIntakeItemDraft = {
  id: string;
  amount: string;
  itemType: IntakeItemType;
  mustKeep: string;
  plantRequest: string;
  quantity: string;
  referenceFocus: string;
  specialRequirements: string;
  substitutionPolicy: SubstitutionPolicy;
};

export type AdminOrderIntakeDraft = {
  building: string;
  cardText: string;
  customerName: string;
  deliveryAddress: string;
  deliveryDate: string;
  floor: string;
  items: AdminOrderIntakeItemDraft[];
  rawSourceText: string;
  recipientName: string;
  recipientOrganization: string;
  recipientTitle: string;
  senderText: string;
};

export type AdminOrderIntakePreview = {
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

export function createEmptyAdminOrderIntakeItem(id: string): AdminOrderIntakeItemDraft {
  return {
    id,
    amount: "",
    itemType: "植物",
    mustKeep: "",
    plantRequest: "",
    quantity: "1",
    referenceFocus: "",
    specialRequirements: "",
    substitutionPolicy: "替換前詢問客戶",
  };
}

export function createEmptyAdminOrderIntakeDraft(): AdminOrderIntakeDraft {
  return {
    building: "",
    cardText: "",
    customerName: "",
    deliveryAddress: "",
    deliveryDate: "",
    floor: "",
    items: [createEmptyAdminOrderIntakeItem("intake-item-1")],
    rawSourceText: "",
    recipientName: "",
    recipientOrganization: "",
    recipientTitle: "",
    senderText: "",
  };
}

function parsePositiveInteger(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeAmount(value: string) {
  const normalized = value.replace(/[，,]/g, "").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
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
  if (draft.items.length === 0) warnings.push("至少需要一項作品明細");

  draft.items.forEach((item, index) => {
    const label = `作品 ${index + 1}`;
    if (!item.plantRequest.trim()) warnings.push(`${label}：尚未說明作品需求`);
    if (parsePositiveInteger(item.quantity) === null) warnings.push(`${label}：數量必須是大於 0 的整數`);
    if (parseNonNegativeAmount(item.amount) === null) warnings.push(`${label}：價位必須是 0 或正數`);
  });

  return warnings;
}

function joinNonEmpty(parts: string[], separator: string) {
  return parts.map((part) => part.trim()).filter(Boolean).join(separator);
}

export function createAdminOrderIntakePreview(draft: AdminOrderIntakeDraft): AdminOrderIntakePreview | null {
  const parsedItems = draft.items.map((item) => ({
    draft: item,
    amount: parseNonNegativeAmount(item.amount),
    quantity: parsePositiveInteger(item.quantity),
  }));

  if (parsedItems.length === 0 || parsedItems.some((item) => item.amount === null || item.quantity === null)) {
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
  let workCardNumber = 0;
  const workCards = parsedItems.flatMap(({ draft: item, amount, quantity }) => {
    if (amount === null || quantity === null) return [];

    const requirements = [
      `指定／期待：${item.plantRequest.trim() || "請人工確認"}`,
      `參考照片重點：${item.referenceFocus.trim() || "請人工確認"}`,
      `不可更動：${item.mustKeep.trim() || "無／請人工確認"}`,
      `缺貨處理：${item.substitutionPolicy}`,
      `特殊需求：${item.specialRequirements.trim() || "無"}`,
    ];

    return Array.from({ length: quantity }, (_, itemIndex) => {
      workCardNumber += 1;
      return {
        id: `intake-work-card-${item.id}-${itemIndex + 1}`,
        itemLabel: `第 ${workCardNumber} 盆｜${item.itemType}｜NT$${amount.toLocaleString("zh-TW")}`,
        requirements,
      };
    });
  });

  return {
    cardTask: {
      assignee: "珊珊",
      cardText: draft.cardText.trim(),
      recipient,
      senderText: draft.senderText.trim(),
      status: "待打卡",
    },
    deliveryLabel,
    quantity: workCards.length,
    workCards,
  };
}
