import { logger } from '@/lib/logger';
import type { PlanId } from '@/lib/pricing';
import { handleApiResponse } from '@/lib/utils/api-response-handler';
import { billingApiClient } from './client';

export interface SubscriptionCheckoutPayload {
  itemCode: string;
}

/** 文档 4.1 / 4.2 / 4.3 响应 data */
export interface SubscriptionCheckoutData {
  orderId: string | number;
  orderNo: string;
  orderType: string;
  orderStatus: string;
  checkoutId: string;
  checkoutUrl: string | null;
  message: string;
}

/** 文档 4.5 GET /billing/orders/{orderId} 响应 data */
export interface BillingOrderDetail {
  id: string | number;
  orderNo: string;
  orderType: string;
  status: string;
  itemCode: string;
  itemName: string | null;
  planCode: string | null;
  checkoutId: string | null;
  paymentProvider: string | null;
  paymentStatus: string | null;
  snapshotJson: object | null;
  paymentRawJson: object | null;
  paidTime: string | null;
  createTime: string | null;
}

function readPayUrlFromJsonBlob(blob: object | null): string | null {
  if (!blob || typeof blob !== 'object') return null;
  const url = (blob as Record<string, unknown>).url;
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return null;
}

/**
 * 从订单详情的 paymentRawJson / snapshotJson 解析渠道收银台 URL（文档 4.5：快照结构可能变化，仅读取常见 url 字段）
 */
export function getBillingOrderCheckoutPayUrl(order: BillingOrderDetail): string | null {
  return (
    readPayUrlFromJsonBlob(order.paymentRawJson) ??
    readPayUrlFromJsonBlob(order.snapshotJson)
  );
}

/** 结账已创建、仍待支付且存在渠道支付链接时可引导用户回到收银台 */
export function orderShouldResumeGatewayCheckout(order: BillingOrderDetail): boolean {
  const payUrl = getBillingOrderCheckoutPayUrl(order);
  if (!payUrl) return false;
  const checkoutPending = order.status === 'CHECKOUT_CREATED' || order.status === 'CREATED';
  const paymentPending =
    order.paymentStatus === 'PENDING' ||
    order.paymentStatus === null ||
    order.paymentStatus === undefined;
  return checkoutPending && paymentPending;
}

/** sessionStorage：标记即将跳往渠道收银台，用于从支付页返回后避免 webhook 延迟导致再次自动跳出 */
export function billingCheckoutRedirectMarkerKey(orderId: string): string {
  return `billing_ck_redirect_${String(orderId).trim()}`;
}

/** 文档 4.6 billing/me/summary */
export interface BillingSummary {
  subscriptionCredits: number;
  giftCredits: number;
  packCredits: number;
  totalCredits: number;
  membershipPlan: string;
  subscriptionStatus: string;
  autoRenew: boolean;
  subscriptionEndTime: string | null;
}

/**
 * GET /billing/me/summary
 */
export async function getBillingSummary(): Promise<BillingSummary> {
  const res = await billingApiClient.get<BillingSummary>('/billing/me/summary');
  const data = handleApiResponse(res);
  return data;
}

/**
 * GET /billing/orders/{orderId} — 当前用户订单详情（文档 4.5）
 */
export async function getBillingOrder(orderId: string): Promise<BillingOrderDetail> {
  const id = String(orderId).trim();
  const res = await billingApiClient.get<BillingOrderDetail>(`/billing/orders/${encodeURIComponent(id)}`);
  return handleApiResponse(res);
}

/**
 * POST /billing/checkouts/subscription — 会员新购（订阅或一次性）
 */
export async function createSubscriptionCheckout(
  itemCode: string,
): Promise<SubscriptionCheckoutData> {
  const res = await billingApiClient.post<SubscriptionCheckoutData>(
    '/billing/checkouts/subscription',
    { itemCode } satisfies SubscriptionCheckoutPayload,
  );
  const data = handleApiResponse(res);
  logger.info('Subscription checkout created', { orderNo: data.orderNo });
  return data;
}

/**
 * POST /billing/checkouts/upgrade — 会员升级（同模式：订阅↔订阅、一次性↔一次性）
 */
export async function createUpgradeCheckout(
  itemCode: string,
): Promise<SubscriptionCheckoutData> {
  const res = await billingApiClient.post<SubscriptionCheckoutData>(
    '/billing/checkouts/upgrade',
    { itemCode } satisfies SubscriptionCheckoutPayload,
  );
  const data = handleApiResponse(res);
  logger.info('Upgrade checkout created', { orderNo: data.orderNo });
  return data;
}

/**
 * POST /billing/checkouts/credit-pack — 加油包
 */
export async function createCreditPackCheckout(
  itemCode: string,
): Promise<SubscriptionCheckoutData> {
  const res = await billingApiClient.post<SubscriptionCheckoutData>(
    '/billing/checkouts/credit-pack',
    { itemCode } satisfies SubscriptionCheckoutPayload,
  );
  const data = handleApiResponse(res);
  logger.info('Credit pack checkout created', { orderNo: data.orderNo });
  return data;
}

/** 有效订阅会员（加油包等仅对 ACTIVE 开放，与产品规则一致） */
export function isActivePaidSubscription(summary: BillingSummary | null | undefined): boolean {
  return summary?.subscriptionStatus === 'ACTIVE';
}

/** 从 membershipPlan 解析档位用于与定价卡片对齐；无法识别时返回 null */
export function membershipPlanToRank(
  membershipPlan: string | null | undefined,
): number | null {
  if (!membershipPlan || membershipPlan === 'free') return null;
  const m = membershipPlan.toLowerCase();
  if (m.startsWith('pro')) return 2;
  if (m.startsWith('starter')) return 1;
  return null;
}

/** 将 billing 的 membershipPlan 映射到定价页 PlanId（用于导航栏等展示） */
export function membershipPlanToPlanId(membershipPlan: string | null | undefined): PlanId {
  if (!membershipPlan || membershipPlan === 'free') return 'free';
  const m = membershipPlan.toLowerCase();
  if (m.includes('enterprise')) return 'enterprise';
  if (m.startsWith('pro')) return 'pro';
  if (m.startsWith('starter')) return 'basic';
  return 'free';
}

/** 当前会员是否为「月订阅」模式 SKU（与一次性相对），升级目标须同模式 */
export function membershipPlanUsesMonthlyMode(
  membershipPlan: string | null | undefined,
): boolean {
  if (!membershipPlan || membershipPlan === 'free') return true;
  return !membershipPlan.toLowerCase().includes('one_time');
}

/** 定价页「基础版」对应 Starter SKU，「专业版」对应 Pro SKU；autoRenew=true 为月订 SKU */
export function subscriptionItemCodeForPlan(
  planId: 'basic' | 'pro'
): string {
  if (planId === 'basic') {
    return 'subscription-starter-one-time';
  }
  return 'subscription-pro-one-time';
}

/**
 * 定价页加油包卡片 id → 商品编码（文档 2.7 默认仅有 small / large；多档 UI 映射到二者）
 */
export function topUpPackIdToCreditPackItemCode(packId: string): string {
  if (packId === 'starter') return 'credit-pack-small';
  return 'credit-pack-large';
}
