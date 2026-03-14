export type CustomerSource = "account" | "guest" | "offline";

export interface CustomerAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerRecord {
  id: string;
  source: CustomerSource;
  linkedUserId?: string;
  name: string;
  email?: string;
  phone?: string;
  shippingAddress?: CustomerAddress;
  billingAddress?: CustomerAddress;
  orderIds: string[];
  orderCount: number;
  totalSpend: number;
  lastOrderId?: string;
  lastOrderAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerUpsertInput {
  source: CustomerSource;
  linkedUserId?: string;
  name?: string;
  email?: string;
  phone?: string;
  shippingAddress?: CustomerAddress;
  billingAddress?: CustomerAddress;
  orderId?: string;
  orderTotal?: number;
  orderCreatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const SOURCE_PRIORITY: Record<CustomerSource, number> = {
  offline: 1,
  guest: 2,
  account: 3,
};

function normalizeEmail(email?: string) {
  const normalized = email?.trim().toLowerCase();
  return normalized || undefined;
}

function normalizePhone(phone?: string) {
  const normalized = phone?.replace(/\D/g, "");
  return normalized || undefined;
}

function toFiniteNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function makeCustomerId(source: CustomerSource, timestamp: string) {
  const date = timestamp.slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CUS-${source.slice(0, 3).toUpperCase()}-${date}-${suffix}`;
}

function matchesCustomer(record: CustomerRecord, input: CustomerUpsertInput) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  return (
    Boolean(input.linkedUserId && record.linkedUserId === input.linkedUserId) ||
    Boolean(email && normalizeEmail(record.email) === email) ||
    Boolean(phone && normalizePhone(record.phone) === phone)
  );
}

function buildCustomerRecord(input: CustomerUpsertInput) {
  const timestamp =
    input.updatedAt ?? input.orderCreatedAt ?? input.createdAt ?? new Date().toISOString();
  const orderIds = input.orderId ? [input.orderId] : [];

  return {
    id: makeCustomerId(input.source, timestamp),
    source: input.source,
    linkedUserId: input.linkedUserId,
    name: input.name?.trim() || "Customer",
    email: normalizeEmail(input.email),
    phone: normalizePhone(input.phone),
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
    orderIds,
    orderCount: orderIds.length,
    totalSpend: orderIds.length ? toFiniteNumber(input.orderTotal) : 0,
    lastOrderId: input.orderId,
    lastOrderAt: input.orderCreatedAt,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: timestamp,
  } satisfies CustomerRecord;
}

function mergeCustomerRecord(
  existing: CustomerRecord,
  input: CustomerUpsertInput
): CustomerRecord {
  const timestamp =
    input.updatedAt ?? input.orderCreatedAt ?? new Date().toISOString();
  const orderIds = new Set(existing.orderIds ?? []);
  let totalSpend = toFiniteNumber(existing.totalSpend);

  if (input.orderId && !orderIds.has(input.orderId)) {
    orderIds.add(input.orderId);
    totalSpend += toFiniteNumber(input.orderTotal);
  }

  return {
    ...existing,
    source:
      SOURCE_PRIORITY[input.source] > SOURCE_PRIORITY[existing.source]
        ? input.source
        : existing.source,
    linkedUserId: existing.linkedUserId ?? input.linkedUserId,
    name: input.name?.trim() || existing.name,
    email: normalizeEmail(input.email) ?? normalizeEmail(existing.email),
    phone: normalizePhone(input.phone) ?? normalizePhone(existing.phone),
    shippingAddress: input.shippingAddress ?? existing.shippingAddress,
    billingAddress: input.billingAddress ?? existing.billingAddress,
    orderIds: Array.from(orderIds),
    orderCount: orderIds.size,
    totalSpend,
    lastOrderId: input.orderId ?? existing.lastOrderId,
    lastOrderAt: input.orderCreatedAt ?? existing.lastOrderAt,
    createdAt: existing.createdAt,
    updatedAt: timestamp,
  };
}

export function upsertCustomerRecord(
  customers: CustomerRecord[],
  input: CustomerUpsertInput
) {
  const existingIndex = customers.findIndex((record) =>
    matchesCustomer(record, input)
  );

  if (existingIndex === -1) {
    const customer = buildCustomerRecord(input);
    return {
      customer,
      customers: [...customers, customer],
    };
  }

  const customer = mergeCustomerRecord(customers[existingIndex], input);
  return {
    customer,
    customers: customers.map((record, index) =>
      index === existingIndex ? customer : record
    ),
  };
}
