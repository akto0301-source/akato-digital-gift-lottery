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

export const adminMockOrders: AdminOrder[] = [
  {
    id: "order-001",
    orderedAt: "2026-07-04T09:18:00+08:00",
    orderNumber: "AKO-20260704-001",
    deliveryDate: "2026-07-04",
    recipientName: "林雅婷",
    senderName: "永豐銀行信義分行同仁",
    deliveryPlace: "永豐銀行信義分行 / 經理室",
    contact: "line: yating-lin",
    itemType: "蘭花",
    itemName: "銀行升遷賀禮 - 白粉雙梗蘭花",
    amount: 6800,
    paymentStatus: "paid",
    productionStatus: "making",
    cardStatus: "confirmed",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=promotion-bank",
    note: "賀卡署名需列 8 位同仁，送達前 30 分鐘電話通知櫃台。",
    updatedAt: "2026-07-04T10:22:00+08:00",
  },
  {
    id: "order-002",
    orderedAt: "2026-07-03T16:42:00+08:00",
    orderNumber: "AKO-20260703-018",
    deliveryDate: "2026-07-05",
    recipientName: "陳副總",
    senderName: "宏宇科技業務一部",
    deliveryPlace: "台北市信義區松仁路 / 18F 前台",
    contact: "amy@hongyu.example",
    itemType: "落地花籃",
    itemName: "開幕落地花籃 - 典雅米白系",
    amount: 5200,
    paymentStatus: "paid",
    productionStatus: "pending",
    cardStatus: "unorganized",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=grand-opening",
    note: "花牌文字要正式，避免太可愛。現場可 10:30 後進場。",
    updatedAt: "2026-07-03T17:05:00+08:00",
  },
  {
    id: "order-003",
    orderedAt: "2026-07-03T12:08:00+08:00",
    orderNumber: "AKO-20260703-011",
    deliveryDate: "2026-07-04",
    recipientName: "王品萱",
    senderName: "Mia、Nora、Joanne",
    deliveryPlace: "台大醫院兒醫大樓 / 護理站代收",
    contact: "0912-345-882",
    itemType: "永生花",
    itemName: "柔粉永生花桌花",
    amount: 3200,
    paymentStatus: "unpaid",
    productionStatus: "pending",
    cardStatus: "unorganized",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=gentle-care",
    note: "多位送禮人，賀卡語氣要溫柔，不要提病情。",
    updatedAt: "2026-07-03T12:36:00+08:00",
  },
  {
    id: "order-004",
    orderedAt: "2026-07-02T18:20:00+08:00",
    orderNumber: "AKO-20260702-027",
    deliveryDate: "2026-07-06",
    recipientName: "鼎盛建設接待中心",
    senderName: "周先生",
    deliveryPlace: "新北市板橋區文化路 / 接待中心大廳",
    contact: "line: chou-office",
    itemType: "植物",
    itemName: "大型琴葉榕植物盆栽",
    amount: 4600,
    paymentStatus: "paid",
    productionStatus: "completed",
    cardStatus: "printed",
    photoStatus: "taken",
    blessingLink: "https://gift.akato.net/letter?cardId=business",
    note: "需附養護小卡。照片已拍，待整理上傳。",
    updatedAt: "2026-07-04T08:54:00+08:00",
  },
  {
    id: "order-005",
    orderedAt: "2026-07-02T11:12:00+08:00",
    orderNumber: "AKO-20260702-009",
    deliveryDate: "2026-07-04",
    recipientName: "黃主任",
    senderName: "第一商銀松山分行",
    deliveryPlace: "第一商銀松山分行 / 主管辦公室",
    contact: "branch-admin@example.com",
    itemType: "蘭花",
    itemName: "銀行升遷賀禮 - 紫粉三梗蘭花",
    amount: 8800,
    paymentStatus: "paid",
    productionStatus: "sent",
    cardStatus: "printed",
    photoStatus: "organized",
    blessingLink: "https://gift.akato.net/letter?cardId=promotion-bank-2",
    note: "已送達，照片已整理。收禮人秘書代收。",
    updatedAt: "2026-07-04T11:08:00+08:00",
  },
  {
    id: "order-006",
    orderedAt: "2026-07-01T15:33:00+08:00",
    orderNumber: "AKO-20260701-016",
    deliveryDate: "2026-07-07",
    recipientName: "李律師",
    senderName: "承安法律事務所合夥人",
    deliveryPlace: "台北市大安區敦化南路 / 會議室",
    contact: "02-2700-8899",
    itemType: "其他",
    itemName: "客製白綠系桌花與小卡",
    amount: 3900,
    paymentStatus: "failed",
    productionStatus: "pending",
    cardStatus: "confirmed",
    photoStatus: "not_taken",
    blessingLink: "https://gift.akato.net/letter?cardId=professional",
    note: "付款失敗待確認，客人希望低調正式。",
    updatedAt: "2026-07-02T09:14:00+08:00",
  },
  {
    id: "order-007",
    orderedAt: "2026-06-30T10:22:00+08:00",
    orderNumber: "AKO-20260630-004",
    deliveryDate: "2026-07-08",
    recipientName: "張家瑜",
    senderName: "高中同學會 12 人",
    deliveryPlace: "桃園市中壢區 / 社區管理室冷氣房代收",
    contact: "line: reunion-flowers",
    itemType: "永生花",
    itemName: "生日永生花禮盒",
    amount: 2800,
    paymentStatus: "refunded",
    productionStatus: "completed",
    cardStatus: "printed",
    photoStatus: "organized",
    blessingLink: "https://gift.akato.net/letter?cardId=birthday",
    note: "客人改送別款，已退款，保留紀錄。",
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

export function getAdminOrderSummary(orders: AdminOrder[]) {
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const today = "2026-07-04";
  const weekEnd = "2026-07-10";

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.productionStatus === "pending").length,
    deliveryThisWeek: orders.filter((order) => order.deliveryDate >= today && order.deliveryDate <= weekEnd).length,
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
