export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderChannel = "online" | "offline";

type OrderLike = {
  id?: string;
  type?: string;
  status?: string;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  items?: Array<{
    price?: number;
    quantity?: number;
  }>;
};

const ONLINE_REVENUE_STATUSES = new Set<OrderStatus>(["delivered"]);
const OPEN_ONLINE_STATUSES = new Set<OrderStatus>([
  "pending",
  "confirmed",
  "processing",
  "shipped",
]);

function toFiniteNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toStatus(value: unknown): OrderStatus {
  const normalized = String(value ?? "pending").toLowerCase();
  switch (normalized) {
    case "confirmed":
    case "processing":
    case "shipped":
    case "delivered":
    case "cancelled":
      return normalized;
    default:
      return "pending";
  }
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function isOfflineOrder(order: OrderLike) {
  return order.type === "offline";
}

export function isCancelledOrder(order: OrderLike) {
  return toStatus(order.status) === "cancelled";
}

export function getOrderSubtotal(order: OrderLike) {
  const storedSubtotal = toFiniteNumber(order.subtotal, Number.NaN);
  if (Number.isFinite(storedSubtotal)) {
    return storedSubtotal;
  }

  return (order.items ?? []).reduce((sum, item) => {
    return sum + toFiniteNumber(item.price) * toFiniteNumber(item.quantity, 1);
  }, 0);
}

export function getOrderShipping(order: OrderLike) {
  return toFiniteNumber(order.shipping);
}

export function getOrderDiscount(order: OrderLike) {
  return toFiniteNumber(order.discount);
}

export function getOrderTotal(order: OrderLike) {
  const storedTotal = toFiniteNumber(order.total, Number.NaN);
  if (Number.isFinite(storedTotal)) {
    return Math.max(0, storedTotal);
  }

  return Math.max(
    0,
    getOrderSubtotal(order) + getOrderShipping(order) - getOrderDiscount(order)
  );
}

export function countsTowardRevenue(order: OrderLike) {
  if (isCancelledOrder(order)) {
    return false;
  }

  if (isOfflineOrder(order)) {
    return true;
  }

  return ONLINE_REVENUE_STATUSES.has(toStatus(order.status));
}

export function countsTowardOpenSales(order: OrderLike) {
  if (isCancelledOrder(order) || isOfflineOrder(order)) {
    return false;
  }

  return OPEN_ONLINE_STATUSES.has(toStatus(order.status));
}

export function summarizeOrderMetrics<T extends OrderLike>(orders: T[]) {
  return orders.reduce(
    (summary, order) => {
      const orderTotal = getOrderTotal(order);

      if (isCancelledOrder(order)) {
        summary.cancelledOrders += 1;
        summary.cancelledValue += orderTotal;
        return summary;
      }

      if (countsTowardRevenue(order)) {
        summary.recognizedRevenue += orderTotal;
      }

      if (countsTowardOpenSales(order)) {
        summary.openSalesCount += 1;
        summary.openSalesValue += orderTotal;
      }

      return summary;
    },
    {
      recognizedRevenue: 0,
      openSalesValue: 0,
      openSalesCount: 0,
      cancelledValue: 0,
      cancelledOrders: 0,
    }
  );
}

export function generateReadableOrderId<T extends Pick<OrderLike, "id">>(
  orders: T[],
  channel: OrderChannel,
  createdAt = new Date()
) {
  const prefix = `JKC-${channel === "offline" ? "POS" : "WEB"}-${formatDateKey(
    createdAt
  )}`;

  let maxSequence = 0;

  for (const order of orders) {
    if (typeof order.id !== "string" || !order.id.startsWith(prefix)) {
      continue;
    }

    const suffix = Number(order.id.split("-").at(-1));
    if (Number.isInteger(suffix)) {
      maxSequence = Math.max(maxSequence, suffix);
    }
  }

  return `${prefix}-${String(maxSequence + 1).padStart(3, "0")}`;
}
