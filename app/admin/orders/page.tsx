import {
  adminMockOrders,
  cardStatusLabels,
  filterAdminOrders,
  formatCurrency,
  formatDateTime,
  getAdminOrderSummary,
  getAdminOrderFocusLabels,
  getItemTypeSummary,
  getNotTakenPhotoOrders,
  getTodayActionOrders,
  getUnconfirmedCardOrders,
  itemTypeLabels,
  MOCK_TODAY,
  paymentStatusLabels,
  photoStatusLabels,
  productionStatusLabels,
  sortAdminOrdersByDeliveryDate,
  type AdminOrder,
  type AdminOrderFilters,
  type CardStatus,
  type OrderItemType,
  type PaymentStatus,
  type PhotoStatus,
  type ProductionStatus,
} from "@/lib/admin-orders";
import { AdminOrdersPastePreview } from "@/components/admin-orders-paste-preview";
import { notFound } from "next/navigation";
import styles from "./admin-orders.module.css";

type AdminOrdersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function asFilterValue<T extends string>(value: string, allowed: readonly T[]): T | "all" {
  return allowed.includes(value as T) ? (value as T) : "all";
}

function buildFilters(params: Record<string, string | string[] | undefined>): AdminOrderFilters {
  return {
    query: pickValue(params.q),
    paymentStatus: asFilterValue<PaymentStatus>(pickValue(params.payment), Object.keys(paymentStatusLabels) as PaymentStatus[]),
    productionStatus: asFilterValue<ProductionStatus>(pickValue(params.production), Object.keys(productionStatusLabels) as ProductionStatus[]),
    itemType: asFilterValue<OrderItemType>(pickValue(params.item), Object.keys(itemTypeLabels) as OrderItemType[]),
    cardStatus: asFilterValue<CardStatus>(pickValue(params.card), Object.keys(cardStatusLabels) as CardStatus[]),
    photoStatus: asFilterValue<PhotoStatus>(pickValue(params.photo), Object.keys(photoStatusLabels) as PhotoStatus[]),
  };
}

function StatusBadge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className={`${styles.badge} ${styles[tone] ?? ""}`}>
      {children}
    </span>
  );
}

function CompactOrderList({
  emptyText,
  orders,
  showFocus = false,
}: {
  emptyText: string;
  orders: AdminOrder[];
  showFocus?: boolean;
}) {
  if (orders.length === 0) {
    return <p className={styles.compactEmpty}>{emptyText}</p>;
  }

  return (
    <ul className={styles.compactList}>
      {orders.map((order) => {
        const focusLabels = showFocus ? getAdminOrderFocusLabels(order) : [];

        return (
          <li className={styles.compactItem} key={order.id}>
            <div>
              <strong>{order.orderNumber}</strong>
              <span>{order.deliveryDate}</span>
            </div>
            <p>
              {order.recipientName}
              <small>{order.itemType}</small>
            </p>
            {focusLabels.length > 0 ? (
              <div className={styles.focusList}>
                {focusLabels.map((label) => (
                  <span className={styles.focusChip} key={label}>{label}</span>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function FilterSelect({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: Record<string, string>;
  value: string | undefined;
}) {
  return (
    <label className={styles.filterField}>
      <span>{label}</span>
      <select name={name} defaultValue={value ?? "all"}>
        <option value="all">全部</option>
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = searchParams ? await searchParams : {};
  const configuredKey = process.env.ADMIN_ORDERS_ACCESS_KEY;
  const requestKey = pickValue(params.key);

  if (!configuredKey || !requestKey || requestKey !== configuredKey) {
    notFound();
  }

  const filters = buildFilters(params);
  const filteredOrders = sortAdminOrdersByDeliveryDate(filterAdminOrders(adminMockOrders, filters));
  const summary = getAdminOrderSummary(filteredOrders);
  const todayActionOrders = getTodayActionOrders(adminMockOrders);
  const unconfirmedCardOrders = getUnconfirmedCardOrders(adminMockOrders);
  const notTakenPhotoOrders = getNotTakenPhotoOrders(adminMockOrders);
  const itemTypeSummary = getItemTypeSummary(adminMockOrders);
  const accessKeyField = <input type="hidden" name="key" value={requestKey} />;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Akato Internal Mock</p>
          <h1>訂單整理頁</h1>
          <p className={styles.lede}>Mock / 內部測試資料。此頁不接資料庫、不寫入資料、不代表真實付款狀態。</p>
          <p className={styles.safetyNotice}>Mock data only. Do not store real customer/order data here.</p>
        </div>
        <div className={styles.mockPill}>Protected mock</div>
      </header>

      <section className={styles.summaryGrid} aria-label="訂單統計摘要">
        <article><span>總訂單數</span><strong>{summary.totalOrders}</strong></article>
        <article><span>待處理數</span><strong>{summary.pendingOrders}</strong></article>
        <article><span>本週交付數</span><strong>{summary.deliveryThisWeek}</strong></article>
        <article><span>未確認賀卡</span><strong>{summary.unconfirmedCards}</strong></article>
        <article><span>未拍照</span><strong>{summary.notTakenPhotos}</strong></article>
        <article><span>總金額</span><strong>{formatCurrency(summary.totalAmount)}</strong></article>
      </section>

      <section className={styles.workflowGrid} aria-label="訂單工作流程摘要">
        <article className={styles.workflowPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span>Mock today: {MOCK_TODAY}</span>
              <h2>今日要處理</h2>
            </div>
            <strong>{todayActionOrders.length}</strong>
          </div>
          <CompactOrderList
            emptyText="目前沒有需要處理的 mock 訂單。"
            orders={todayActionOrders}
            showFocus
          />
        </article>

        <article className={styles.workflowPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span>Card workflow</span>
              <h2>未確認賀卡</h2>
            </div>
            <strong>{unconfirmedCardOrders.length}</strong>
          </div>
          <CompactOrderList
            emptyText="目前沒有未確認賀卡。"
            orders={unconfirmedCardOrders}
          />
        </article>

        <article className={styles.workflowPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span>Photo workflow</span>
              <h2>未拍照</h2>
            </div>
            <strong>{notTakenPhotoOrders.length}</strong>
          </div>
          <CompactOrderList
            emptyText="目前沒有未拍照訂單。"
            orders={notTakenPhotoOrders}
          />
        </article>
      </section>

      <section className={styles.itemStats} aria-label="品項統計">
        <div className={styles.itemStatsHeader}>
          <span>品項統計</span>
          <strong>{adminMockOrders.length}</strong>
        </div>
        <div className={styles.itemStatsGrid}>
          {itemTypeSummary.map((item) => (
            <article key={item.itemType}>
              <span>{itemTypeLabels[item.itemType]}</span>
              <strong>{item.count}</strong>
            </article>
          ))}
        </div>
      </section>

      <AdminOrdersPastePreview />

      <form className={styles.filters} action="/admin/orders">
        {accessKeyField}
        <label className={styles.searchField}>
          <span>搜尋</span>
          <input
            name="q"
            type="search"
            placeholder="訂單編號 / 收禮人 / 送禮人 / 聯絡方式"
            defaultValue={filters.query}
          />
        </label>
        <FilterSelect label="付款狀態" name="payment" options={paymentStatusLabels} value={filters.paymentStatus} />
        <FilterSelect label="製作狀態" name="production" options={productionStatusLabels} value={filters.productionStatus} />
        <FilterSelect label="品項" name="item" options={itemTypeLabels} value={filters.itemType} />
        <FilterSelect label="賀卡狀態" name="card" options={cardStatusLabels} value={filters.cardStatus} />
        <FilterSelect label="照片狀態" name="photo" options={photoStatusLabels} value={filters.photoStatus} />
        <div className={styles.filterActions}>
          <button type="submit">套用</button>
          <a href={`/admin/orders?key=${encodeURIComponent(requestKey)}`}>清除</a>
        </div>
      </form>

      <section className={styles.orderList} aria-label="訂單列表">
        <div className={styles.tableHeader}>
          <span>訂單</span>
          <span>交付</span>
          <span>收禮 / 送禮</span>
          <span>品項</span>
          <span>狀態</span>
          <span>金額</span>
        </div>

        {filteredOrders.map((order) => (
          <details className={styles.orderRow} key={order.id}>
            <summary>
              <span className={styles.orderMain}>
                <strong>{order.orderNumber}</strong>
                <small>{formatDateTime(order.orderedAt)}</small>
              </span>
              <span>{order.deliveryDate}</span>
              <span>
                {order.recipientName}
                <small>由 {order.senderName}</small>
              </span>
              <span>
                {order.itemType}
                <small>{order.itemName}</small>
              </span>
              <span className={styles.badgeStack}>
                <StatusBadge tone={`payment-${order.paymentStatus}`}>{paymentStatusLabels[order.paymentStatus]}</StatusBadge>
                <StatusBadge tone={`production-${order.productionStatus}`}>{productionStatusLabels[order.productionStatus]}</StatusBadge>
              </span>
              <span className={styles.amount}>{formatCurrency(order.amount)}</span>
            </summary>
            <div className={styles.orderDetail}>
              <dl>
                <div><dt>送達地點 / 單位</dt><dd>{order.deliveryPlace}</dd></div>
                <div><dt>聯絡方式</dt><dd>{order.contact}</dd></div>
                <div><dt>賀卡狀態</dt><dd><StatusBadge tone={`card-${order.cardStatus}`}>{cardStatusLabels[order.cardStatus]}</StatusBadge></dd></div>
                <div><dt>照片狀態</dt><dd><StatusBadge tone={`photo-${order.photoStatus}`}>{photoStatusLabels[order.photoStatus]}</StatusBadge></dd></div>
                <div><dt>祝福信連結</dt><dd><a href={order.blessingLink}>{order.blessingLink}</a></dd></div>
                <div><dt>備註</dt><dd>{order.note}</dd></div>
                <div><dt>最後更新時間</dt><dd>{formatDateTime(order.updatedAt)}</dd></div>
              </dl>
            </div>
          </details>
        ))}

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>沒有符合條件的 mock 訂單。</div>
        ) : null}
      </section>
    </main>
  );
}
