export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";
export type ProductionStatus = "pending" | "making" | "completed" | "sent";
export type CardStatus = "unorganized" | "confirmed" | "printed";
export type PhotoStatus = "not_taken" | "taken" | "organized";
export type OrderItemType = "蘭花" | "植物" | "永生花" | "落地花籃" | "其他";

export type AdminOrder = {
  id: string;
  orderedAt: string;
  orderNumber: string;
  deliveryDate: string;
  recipientName: string;
  senderName: string;
  deliveryPlace: string;
  contact: string;
  itemType: OrderItemType;
  itemName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
  cardStatus: CardStatus;
  photoStatus: PhotoStatus;
  blessingLink: string;
  note: string;
  updatedAt: string;
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "未付款",
  paid: "已付款",
  refunded: "退款",
  failed: "失敗",
};

export const productionStatusLabels: Record<ProductionStatus, string> = {
  pending: "待處理",
  making: "製作中",
  completed: "已完成",
  sent: "已寄出",
};

export const cardStatusLabels: Record<CardStatus, string> = {
  unorganized: "未整理",
  confirmed: "已確認",
  printed: "已印製",
};

export const photoStatusLabels: Record<PhotoStatus, string> = {
  not_taken: "未拍照",
  taken: "已拍照",
  organized: "已整理",
};

export const itemTypeLabels: Record<OrderItemType, OrderItemType> = {
  蘭花: "蘭花",
  植物: "植物",
  永生花: "永生花",
  落地花籃: "落地花籃",
  其他: "其他",
};

export const MOCK_TODAY = "2026-07-04";

export const adminMockOrders: AdminOrder[] = [
  {
    id: "order-001",
    orderedAt: "2026-07-04T09:18:00+08:00",
    orderNumber: "AKO-20260704-001",
    deliveryDate: "2026-07-04",
    recipientName: "測試收禮人 A",
    senderName: "Mock Bank 測試分行範例同仁",
    deliveryPlace: "測試地址，不可配送 / 測試單位 A",
    contact: "mock-order-a@example.test",
    itemType: "蘭花",
    itemName: "Mock Bank 升遷賀禮 - 白粉雙梗蘭花",
    amount: 6800,
    paymentStatus: "paid",
    productionStatus: "making",
    cardStatus: "confirmed",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-promotion-bank",
    note: "純 mock 訂單。賀卡署名需列多位範例送禮人，不可用於真實配送。",
    updatedAt: "2026-07-04T10:22:00+08:00",
  },
  {
    id: "order-002",
    orderedAt: "2026-07-03T16:42:00+08:00",
    orderNumber: "AKO-20260703-018",
    deliveryDate: "2026-07-05",
    recipientName: "測試收禮人 B",
    senderName: "範例送禮人 B 群組",
    deliveryPlace: "測試地址，不可配送 / 測試單位 B",
    contact: "mock-order-b@example.test",
    itemType: "落地花籃",
    itemName: "開幕落地花籃 - 典雅米白系",
    amount: 5200,
    paymentStatus: "paid",
    productionStatus: "pending",
    cardStatus: "unorganized",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-grand-opening",
    note: "純 mock 訂單。花牌文字為測試用，不可用於真實客戶。",
    updatedAt: "2026-07-03T17:05:00+08:00",
  },
  {
    id: "order-003",
    orderedAt: "2026-07-03T12:08:00+08:00",
    orderNumber: "AKO-20260703-011",
    deliveryDate: "2026-07-04",
    recipientName: "測試收禮人 C",
    senderName: "範例送禮人 C1、C2、C3",
    deliveryPlace: "測試地址，不可配送 / 測試單位 C",
    contact: "mock-order-c@example.test",
    itemType: "永生花",
    itemName: "柔粉永生花桌花",
    amount: 3200,
    paymentStatus: "unpaid",
    productionStatus: "pending",
    cardStatus: "unorganized",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-gentle-care",
    note: "純 mock 訂單。多人送禮測試資料，不代表真實醫療或個人情境。",
    updatedAt: "2026-07-03T12:36:00+08:00",
  },
  {
    id: "order-004",
    orderedAt: "2026-07-02T18:20:00+08:00",
    orderNumber: "AKO-20260702-027",
    deliveryDate: "2026-07-06",
    recipientName: "測試收禮單位 D",
    senderName: "範例送禮人 D",
    deliveryPlace: "測試地址，不可配送 / 測試單位 D",
    contact: "mock-order-d@example.test",
    itemType: "植物",
    itemName: "大型琴葉榕植物盆栽",
    amount: 4600,
    paymentStatus: "paid",
    productionStatus: "completed",
    cardStatus: "printed",
    photoStatus: "taken",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-business",
    note: "純 mock 訂單。需附養護小卡的流程測試，照片狀態為假資料。",
    updatedAt: "2026-07-04T08:54:00+08:00",
  },
  {
    id: "order-005",
    orderedAt: "2026-07-02T11:12:00+08:00",
    orderNumber: "AKO-20260702-009",
    deliveryDate: "2026-07-04",
    recipientName: "測試收禮人 E",
    senderName: "Mock Bank 測試分行範例主管",
    deliveryPlace: "測試地址，不可配送 / 測試單位 E",
    contact: "mock-order-e@example.test",
    itemType: "蘭花",
    itemName: "Mock Bank 升遷賀禮 - 紫粉三梗蘭花",
    amount: 8800,
    paymentStatus: "paid",
    productionStatus: "sent",
    cardStatus: "printed",
    photoStatus: "organized",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-promotion-bank-2",
    note: "純 mock 訂單。已送達與照片已整理皆為測試狀態。",
    updatedAt: "2026-07-04T11:08:00+08:00",
  },
  {
    id: "order-006",
    orderedAt: "2026-07-01T15:33:00+08:00",
    orderNumber: "AKO-20260701-016",
    deliveryDate: "2026-07-07",
    recipientName: "測試收禮人 F",
    senderName: "範例送禮人 F 團隊",
    deliveryPlace: "測試地址，不可配送 / 測試單位 F",
    contact: "mock-order-f@example.test",
    itemType: "其他",
    itemName: "客製白綠系桌花與小卡",
    amount: 3900,
    paymentStatus: "failed",
    productionStatus: "pending",
    cardStatus: "confirmed",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-professional",
    note: "純 mock 訂單。付款失敗狀態為測試用，不代表真實交易。",
    updatedAt: "2026-07-02T09:14:00+08:00",
  },
  {
    id: "order-007",
    orderedAt: "2026-06-30T10:22:00+08:00",
    orderNumber: "AKO-20260630-004",
    deliveryDate: "2026-07-08",
    recipientName: "測試收禮人 G",
    senderName: "範例送禮人 G1 至 G12",
    deliveryPlace: "測試地址，不可配送 / 測試單位 G",
    contact: "mock-order-g@example.test",
    itemType: "永生花",
    itemName: "生日永生花禮盒",
    amount: 2800,
    paymentStatus: "refunded",
    productionStatus: "completed",
    cardStatus: "printed",
    photoStatus: "organized",
    blessingLink: "https://gift.akato.net/letter?cardId=mock-birthday",
    note: "純 mock 訂單。退款與保留紀錄皆為假資料。",
    updatedAt: "2026-07-01T13:48:00+08:00",
  },
];

export type AdminOrderFilters = {
  query?: string;
  paymentStatus?: PaymentStatus | "all";
  productionStatus?: ProductionStatus | "all";
  itemType?: OrderItemType | "all";
  cardStatus?: CardStatus | "all";
  photoStatus?: PhotoStatus | "all";
};

function includesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export function filterAdminOrders(orders: AdminOrder[], filters: AdminOrderFilters) {
  const query = filters.query?.trim() ?? "";

  return orders.filter((order) => {
    const matchesQuery =
      !query ||
      includesText(order.orderNumber, query) ||
      includesText(order.recipientName, query) ||
      includesText(order.senderName, query) ||
      includesText(order.contact, query);

    return (
      matchesQuery &&
      (filters.paymentStatus === "all" || !filters.paymentStatus || order.paymentStatus === filters.paymentStatus) &&
      (filters.productionStatus === "all" || !filters.productionStatus || order.productionStatus === filters.productionStatus) &&
      (filters.itemType === "all" || !filters.itemType || order.itemType === filters.itemType) &&
      (filters.cardStatus === "all" || !filters.cardStatus || order.cardStatus === filters.cardStatus) &&
      (filters.photoStatus === "all" || !filters.photoStatus || order.photoStatus === filters.photoStatus)
    );
  });
}

export function sortAdminOrdersByDeliveryDate(orders: AdminOrder[]) {
  return [...orders].sort((a, b) => {
    const deliveryCompare = a.deliveryDate.localeCompare(b.deliveryDate);

    if (deliveryCompare !== 0) {
      return deliveryCompare;
    }

    return a.orderedAt.localeCompare(b.orderedAt);
  });
}

export function getAdminOrderFocusLabels(order: AdminOrder) {
  const labels: string[] = [];

  if (order.deliveryDate === MOCK_TODAY) {
    labels.push("今日交付");
  }

  if (order.productionStatus === "pending" || order.productionStatus === "making") {
    labels.push(productionStatusLabels[order.productionStatus]);
  }

  if (order.cardStatus === "unorganized") {
    labels.push("賀卡未整理");
  }

  if (order.photoStatus === "not_taken") {
    labels.push("未拍照");
  }

  return labels;
}

export function getTodayActionOrders(orders: AdminOrder[]) {
  return sortAdminOrdersByDeliveryDate(
    orders.filter((order) => getAdminOrderFocusLabels(order).length > 0),
  );
}

export function getUnconfirmedCardOrders(orders: AdminOrder[]) {
  return sortAdminOrdersByDeliveryDate(
    orders.filter((order) => order.cardStatus === "unorganized"),
  );
}

export function getNotTakenPhotoOrders(orders: AdminOrder[]) {
  return sortAdminOrdersByDeliveryDate(
    orders.filter((order) => order.photoStatus === "not_taken"),
  );
}

export function getItemTypeSummary(orders: AdminOrder[]) {
  return Object.keys(itemTypeLabels).map((itemType) => ({
    itemType: itemType as OrderItemType,
    count: orders.filter((order) => order.itemType === itemType).length,
  }));
}

export function getAdminOrderSummary(orders: AdminOrder[]) {
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const weekEnd = "2026-07-10";

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.productionStatus === "pending").length,
    deliveryThisWeek: orders.filter((order) => order.deliveryDate >= MOCK_TODAY && order.deliveryDate <= weekEnd).length,
    unconfirmedCards: orders.filter((order) => order.cardStatus === "unorganized").length,
    notTakenPhotos: orders.filter((order) => order.photoStatus === "not_taken").length,
    totalAmount,
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("zh-TW", {
    currency: "TWD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
