import { logger } from '@/lib/logger';
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

/** 当前会员是否为「月订阅」模式 SKU（与一次性相对），升级目标须同模式 */
export function membershipPlanUsesMonthlyMode(
  membershipPlan: string | null | undefined,
): boolean {
  if (!membershipPlan || membershipPlan === 'free') return true;
  return !membershipPlan.toLowerCase().includes('one_time');
}

/** 定价页「基础版」对应 Starter SKU，「专业版」对应 Pro SKU；autoRenew=true 为月订 SKU */
export function subscriptionItemCodeForPlan(
  planId: 'basic' | 'pro',
  autoRenew: boolean,
): string {
  if (planId === 'basic') {
    return autoRenew ? 'subscription-starter-monthly' : 'subscription-starter-one-time';
  }
  return autoRenew ? 'subscription-pro-monthly' : 'subscription-pro-one-time';
}

/**
 * 定价页加油包卡片 id → 商品编码（文档 2.7 默认仅有 small / large；多档 UI 映射到二者）
 */
export function topUpPackIdToCreditPackItemCode(packId: string): string {
  if (packId === 'starter') return 'credit-pack-small';
  return 'credit-pack-large';
}
