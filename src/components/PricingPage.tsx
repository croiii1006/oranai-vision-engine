import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { getToken } from '@/lib/utils/auth-storage';
import {
  createCreditPackCheckout,
  createSubscriptionCheckout,
  createUpgradeCheckout,
  getBillingSummary,
  isActivePaidSubscription,
  membershipPlanToRank,
  membershipPlanUsesMonthlyMode,
  subscriptionItemCodeForPlan,
  topUpPackIdToCreditPackItemCode,
  type BillingSummary,
} from '@/lib/api/billing';
import { PLAN_ORDER, type PlanId } from '@/lib/pricing';
import FeatureQuotaTable, { PLAN_QUOTAS } from '@/components/pricing/FeatureQuotaTable';

/* ================================================================
   DATA CONFIG
   ================================================================ */

const FEATURE_IDS = [
  'brandInsight',
  'strategyPlan',
  'imageGen',
  'videoGen',
  'viralMatch',
  'videoRemix',
  'tkSolution',
] as const;

interface PlanConfig {
  id: string;
  price: string;
  priceSub?: boolean;
  credits: string;
  creditsNote?: boolean;
  isFree?: boolean;
  popular?: boolean;
  isEnterprise?: boolean;
}

const plans: PlanConfig[] = [
  {
    id: 'free',
    price: '$0',
    credits: '5 Credit',
    isFree: true,
  },
  {
    id: 'basic',
    price: '$9.9',
    priceSub: true,
    credits: '400 Credit',
    creditsNote: true,
  },
  {
    id: 'pro',
    price: '$39.9',
    priceSub: true,
    credits: '1600 Credit',
    creditsNote: true,
    popular: true,
  },
  {
    id: 'enterprise',
    price: '',
    credits: '',
    isEnterprise: true,
  },
];

interface TopUpPack {
  id: string;
  price: string;
  credits: string;
  originalCredits?: string;
  badge?: boolean;
  featured?: boolean;
}

const topUpPacks: TopUpPack[] = [
  {
    id: 'starter',
    price: '$5',
    credits: '170 Credit',
  },
  {
    id: 'base',
    price: '$10',
    credits: '360 Credit',
    originalCredits: '340',
  },
  {
    id: 'value',
    price: '$50',
    credits: '1800 Credit',
    originalCredits: '1700',
    badge: true,
    featured: true,
  },
];

const FAQ_INDICES = [0, 1, 2, 3, 4] as const;

// --- helpers ---
const buildMailto = (t: (key: string) => string) => {
  const subject = t('pricing.mailto.subject');
  const body = t('pricing.mailto.body');
  return `mailto:hey@photog.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/* ================================================================
   COMPONENT
   ================================================================ */

interface PricingPageProps {
  currentPlanId: PlanId;
  setCurrentPlanId: React.Dispatch<React.SetStateAction<PlanId>>;
  /** 未登录时由 Header 打开登录弹窗 */
  onRequestLogin?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({
  currentPlanId,
  setCurrentPlanId,
  onRequestLogin,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const planKeys = ['free', 'basic', 'pro', 'enterprise'] as const;
  const planRank = useMemo(
    () => new Map(PLAN_ORDER.map((id, index) => [id, index])),
    [],
  );
  const plansSectionRef = useRef<HTMLElement | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [isTopUpAccessDialogOpen, setIsTopUpAccessDialogOpen] = useState(false);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [selectedTopUpPack, setSelectedTopUpPack] = useState<TopUpPack | null>(null);
  const [autoRenewByPlan, setAutoRenewByPlan] = useState<Record<string, boolean>>({
    basic: true,
    pro: true,
  });
  const [pendingAutoRenewChange, setPendingAutoRenewChange] = useState<{
    planId: PlanId;
    nextValue: boolean;
  } | null>(null);
  const [checkoutLoadingPlanId, setCheckoutLoadingPlanId] = useState<string | null>(null);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [billingSummaryLoading, setBillingSummaryLoading] = useState(false);
  const [topUpCheckoutLoading, setTopUpCheckoutLoading] = useState(false);

  const effectivePlanRank = useMemo(() => {
    if (billingSummary?.subscriptionStatus === 'ACTIVE') {
      const r = membershipPlanToRank(billingSummary.membershipPlan);
      if (r !== null) return r;
    }
    return planRank.get(currentPlanId) ?? 0;
  }, [billingSummary, currentPlanId, planRank]);

  const resolvedCurrentPlanId = useMemo((): PlanId => {
    if (billingSummary?.subscriptionStatus === 'ACTIVE') {
      const r = membershipPlanToRank(billingSummary.membershipPlan);
      if (r === 2) return 'pro';
      if (r === 1) return 'basic';
    }
    return currentPlanId;
  }, [billingSummary, currentPlanId]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setBillingSummary(null);
      return;
    }
    let cancelled = false;
    getBillingSummary()
      .then((s) => {
        if (!cancelled) setBillingSummary(s);
      })
      .catch(() => {
        if (!cancelled) setBillingSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = async (plan: PlanConfig) => {
    const currentRank = effectivePlanRank;
    const nextRank = planRank.get(plan.id as PlanId) ?? 0;

    if (plan.isEnterprise) {
      window.location.href = buildMailto(t);
      return;
    }
    if (plan.id === resolvedCurrentPlanId || nextRank < currentRank) {
      return;
    }
    const token = getToken();
    if (!token) {
      onRequestLogin?.();
      return;
    }
    if (plan.isFree) {
      window.open('https://toolbox.photog.art', '_blank');
      setCurrentPlanId(plan.id as PlanId);
      return;
    }

    if (plan.id === 'basic' || plan.id === 'pro') {
      setCheckoutLoadingPlanId(plan.id);
      let summary = billingSummary;
      try {
        summary = await getBillingSummary();
        setBillingSummary(summary);
      } catch {
        /* 使用本地摘要继续，避免阻断结账 */
      }

      const memberRank =
        summary?.subscriptionStatus === 'ACTIVE'
          ? (membershipPlanToRank(summary.membershipPlan) ?? currentRank)
          : 0;
      const isActiveMember = isActivePaidSubscription(summary);
      const isUpgrade = isActiveMember && nextRank > memberRank;
      const preferAutoRenew = autoRenewByPlan[plan.id] ?? true;
      const sameModeMonthly = membershipPlanUsesMonthlyMode(summary?.membershipPlan);
      const itemCode = isUpgrade
        ? subscriptionItemCodeForPlan(plan.id, sameModeMonthly)
        : subscriptionItemCodeForPlan(plan.id, preferAutoRenew);

      if (isActiveMember && nextRank <= memberRank) {
        setCheckoutLoadingPlanId(null);
        toast.error(t('pricing.checkout.sameOrHigherTier'));
        return;
      }

      try {
        const data = isUpgrade
          ? await createUpgradeCheckout(itemCode)
          : await createSubscriptionCheckout(itemCode);
        if (data.checkoutUrl) {
          try {
            sessionStorage.setItem('billing_lastOrderId', String(data.orderId));
          } catch {
            /* ignore */
          }
          window.location.assign(data.checkoutUrl);
        } else {
          toast.error(data.message?.trim() || t('pricing.checkout.noUrl'));
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t('pricing.checkout.failed'));
      } finally {
        setCheckoutLoadingPlanId(null);
      }
      return;
    }
  };

  const handleContactSales = () => {
    window.location.href = buildMailto(t);
  };

  const handleScrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleTopUpDialogOpen = async () => {
    const token = getToken();
    if (!token) {
      onRequestLogin?.();
      return;
    }
    setBillingSummaryLoading(true);
    try {
      const s = await getBillingSummary();
      setBillingSummary(s);
      if (!isActivePaidSubscription(s)) {
        setIsTopUpAccessDialogOpen(true);
        return;
      }
      setSelectedTopUpPack(null);
      setIsTopUpDialogOpen(true);
    } catch {
      toast.error(t('pricing.checkout.failed'));
    } finally {
      setBillingSummaryLoading(false);
    }
  };

  const handleTopUpSelect = (pack: TopUpPack) => {
    setSelectedTopUpPack(pack);
  };

  const handleTopUpCheckout = async () => {
    if (!selectedTopUpPack) {
      return;
    }
    const token = getToken();
    if (!token) {
      onRequestLogin?.();
      return;
    }
    if (!isActivePaidSubscription(billingSummary)) {
      toast.error(t('pricing.topUp.memberRequired'));
      return;
    }
    setTopUpCheckoutLoading(true);
    try {
      const itemCode = topUpPackIdToCreditPackItemCode(selectedTopUpPack.id);
      const data = await createCreditPackCheckout(itemCode);
      if (data.checkoutUrl) {
        try {
          sessionStorage.setItem('billing_lastOrderId', String(data.orderId));
        } catch {
          /* ignore */
        }
        window.location.assign(data.checkoutUrl);
      } else {
        toast.error(data.message?.trim() || t('pricing.checkout.noUrl'));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('pricing.checkout.failed'));
    } finally {
      setTopUpCheckoutLoading(false);
    }
  };

  const handleAutoRenewToggle = (planId: PlanId) => {
    const currentValue = autoRenewByPlan[planId] ?? true;

    setPendingAutoRenewChange({
      planId,
      nextValue: !currentValue,
    });
  };

  const handleAutoRenewDialogChange = (open: boolean) => {
    if (!open) {
      setPendingAutoRenewChange(null);
    }
  };

  const handleConfirmAutoRenewChange = () => {
    if (!pendingAutoRenewChange) {
      return;
    }

    setAutoRenewByPlan((current) => ({
      ...current,
      [pendingAutoRenewChange.planId]: pendingAutoRenewChange.nextValue,
    }));
    setPendingAutoRenewChange(null);
  };

  const getPlanActionLabel = (
    plan: PlanConfig,
    isCurrent: boolean,
    isHigher: boolean,
    isLower: boolean,
  ) => {
    const planName = t(`pricing.plans.${plan.id}.name`);
    if (plan.isEnterprise) {
      return t('pricing.action.contactSales');
    }

    if (isCurrent) {
      return t('pricing.action.currentPlan');
    }

    if (isHigher) {
      return t('pricing.action.upgradeTo').replace('{{plan}}', planName);
    }

    if (isLower) {
      return t('pricing.action.switchTo').replace('{{plan}}', planName);
    }

    return t('pricing.action.switchTo').replace('{{plan}}', planName);
  };

  const pendingAutoRenewPlan = pendingAutoRenewChange
    ? plans.find((plan) => plan.id === pendingAutoRenewChange.planId)
    : null;

  return (
    <>
      <div className="min-h-screen pt-24 pb-16">
        <div className="w-full px-6 sm:px-10 lg:px-16">

        {/* ========== A) Hero ========== */}
        <section className="text-center py-20 max-w-3xl mx-auto">
          <h1 className="heading-lg mb-4">
            {t('pricing.hero.title')}
          </h1>
          <p className="body-lg">
            {t('pricing.hero.subtitle')}
          </p>
        </section>

        {/* ========== B) Plan Cards ========== */}
        <section
          ref={plansSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20 scroll-mt-28"
        >
          {plans.map((plan) => {
            // Determine comparison quota for hover highlight
            const compareQuota = hoveredPlan && hoveredPlan !== plan.id
              ? null
              : hoveredPlan === plan.id && plan.id === 'pro'
                ? PLAN_QUOTAS['basic']
                : hoveredPlan === plan.id && plan.id === 'basic'
                  ? PLAN_QUOTAS['free']
                  : null;
            const currentRank = effectivePlanRank;
            const thisRank = planRank.get(plan.id as PlanId) ?? 0;
            const isCurrent = plan.id === resolvedCurrentPlanId;
            const isLower = thisRank < currentRank;
            const isHigher = thisRank > currentRank;
            const isActiveMember = isActivePaidSubscription(billingSummary);
            const showAutoRenewToggle =
              isHigher && !plan.isEnterprise && !isActiveMember;
            const isAutoRenewEnabled = autoRenewByPlan[plan.id] ?? true;

            return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover-lift ${
                plan.popular
                  ? 'border-foreground/30 bg-foreground/5 shadow-lg'
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium bg-foreground text-background">
                  {t('pricing.badge.popular')}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-normal mb-1">
                    {t(`pricing.plans.${plan.id}.name`)}
                  </h3>
                  <p className="text-xs text-muted-foreground min-h-[3.75rem] lg:min-h-[2.25rem]">
                    {t(`pricing.plans.${plan.id}.desc`)}
                  </p>
                </div>

                {/* Price */}
                {!plan.isEnterprise ? (
                  <div className="relative space-y-2 pr-28">
                    <div className="flex items-end">
                      <div className="flex shrink-0 items-end whitespace-nowrap">
                        <span className="text-3xl font-medium">{plan.price}</span>
                        {plan.priceSub && (
                          <span className="text-sm text-muted-foreground ml-1">
                            {t(`pricing.plans.${plan.id}.priceSub`)}
                          </span>
                        )}
                      </div>
                      {showAutoRenewToggle && (
                        <button
                          type="button"
                          onClick={() => handleAutoRenewToggle(plan.id as PlanId)}
                          className="absolute bottom-0 right-0 inline-flex items-center gap-1.5 rounded-full px-0.5 py-0.5 text-[11px] leading-none text-muted-foreground transition-colors hover:text-foreground"
                          role="checkbox"
                          aria-checked={isAutoRenewEnabled}
                        >
                          <span
                            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                              isAutoRenewEnabled
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-background text-transparent'
                            }`}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          <span>{t('pricing.autoRenew.label')}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>{plan.credits}</span>
                      {!plan.isFree && plan.creditsNote && t(`pricing.plans.${plan.id}.creditsNote`).trim() !== '' && (
                        <span className="ml-0.5">
                          ({t(`pricing.plans.${plan.id}.creditsNote`)})
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <span className="text-3xl font-medium">{t('pricing.enterprise.customPrice')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>{t('pricing.enterprise.customCredits')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              {!isLower && (
                <div className="space-y-2 mt-3">
                  <Button
                    onClick={() => void handleSubscribe(plan)}
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full rounded-full"
                    disabled={isCurrent || checkoutLoadingPlanId === plan.id}
                  >
                    {checkoutLoadingPlanId === plan.id
                      ? t('pricing.checkout.inProgress')
                      : getPlanActionLabel(plan, isCurrent, isHigher, isLower)}
                  </Button>
                </div>
              )}

              <div className="h-px bg-border mt-4 mb-4" />

              {/* What you can generate */}
              <FeatureQuotaTable
                planId={plan.id}
                isEnterprise={plan.isEnterprise}
                highlightDiffFrom={compareQuota}
              />

              <div className="flex-1" />
            </div>
            );
          })}
        </section>

        <section className="max-w-6xl mx-auto mb-20 text-center">
          <button
            type="button"
            onClick={() => void handleTopUpDialogOpen()}
            disabled={billingSummaryLoading}
            className="inline-flex items-center gap-1 text-base text-muted-foreground transition-colors duration-200 hover:text-foreground disabled:opacity-50"
          >
            <span>{t('pricing.cta.needMore')}</span>
            <span className="font-medium text-orange-600 ">
              {t('pricing.cta.buyTopUp')}
            </span>
            <span aria-hidden="true" className="text-orange-600">&gt;</span>
          </button>
        </section>

        {/* ========== D) Comparison Table ========== */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="heading-md text-center mb-10">
            {t('pricing.section.comparison')}
          </h2>

          {isMobile ? (
            <div className="space-y-3">
              {FEATURE_IDS.map((fid) => (
                <div key={fid} className="border border-border rounded-xl p-4">
                  <h4 className="text-sm font-medium mb-2">{t(`pricing.feature.${fid}`)}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {planKeys.map((key) => {
                      const quota = PLAN_QUOTAS[key];
                      const featureKey = fid as keyof import('@/components/pricing/FeatureQuotaTable').FeatureQuota;
                      const val = key === 'enterprise' ? -1 : (quota?.[featureKey] ?? 0);
                      return (
                        <div key={key} className="text-xs p-2 rounded-lg border border-border">
                          <div className="font-medium text-muted-foreground mb-0.5">
                            {t(`pricing.plans.${key}.name`)}
                          </div>
                          <span className={`font-medium tabular-nums ${val === -1 ? 'text-primary' : val === 0 ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                            {val === -1 ? t('pricing.comparison.infinity') : val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground w-[220px]">
                      {t('pricing.comparison.featureCol')}
                    </th>
                    {plans.map((p) => (
                      <th key={p.id} className="p-4 text-center font-medium">
                        {t(`pricing.plans.${p.id}.name`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_IDS.map((fid) => {
                    const featureKey = fid as keyof import('@/components/pricing/FeatureQuotaTable').FeatureQuota;
                    return (
                      <tr key={fid} className="border-b border-border last:border-b-0">
                        <td className="p-4 font-medium">{t(`pricing.feature.${fid}`)}</td>
                        {planKeys.map((key) => {
                          const quota = PLAN_QUOTAS[key];
                          const val = key === 'enterprise' ? -1 : (quota?.[featureKey] ?? 0);
                          return (
                            <td key={key} className="p-4 text-center">
                              <span className={`font-semibold tabular-nums ${val === -1 ? 'text-primary' : val === 0 ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                                {val === -1 ? t('pricing.comparison.infinity') : val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ========== E) FAQ ========== */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="heading-md text-center mb-10">
            {t('pricing.section.faq')}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_INDICES.map((idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border border-border rounded-xl overflow-hidden px-4">
                <AccordionTrigger className="text-left text-sm font-medium">
                  {t(`pricing.faq.${idx}.q`)}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {t(`pricing.faq.${idx}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ========== F) Bottom CTA ========== */}
        <section className="text-center py-16 border-t border-border">
          <h2 className="heading-md mb-4">
            {t('pricing.bottom.title')}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={handleScrollToPlans}
              className="rounded-full px-8"
            >
              {t('pricing.bottom.subscribe')}
            </Button>
            <Button
              variant="outline"
              onClick={handleContactSales}
              className="rounded-full px-8"
            >
              <Mail className="w-4 h-4 mr-1" />
              {t('pricing.action.contactSales')}
            </Button>
          </div>
        </section>
        </div>
      </div>
      <Dialog open={!!pendingAutoRenewChange} onOpenChange={handleAutoRenewDialogChange}>
        <DialogContent className="!border-black/5 !bg-white/92 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:!border-border dark:!bg-[hsl(var(--background)/0.95)] dark:backdrop-blur-sm sm:max-w-md">
          <DialogHeader className="pr-8">
            <DialogTitle>
              {pendingAutoRenewChange?.nextValue
                ? t('pricing.autoRenew.resumeTitle')
                : t('pricing.autoRenew.cancelTitle')}
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-3">
              {pendingAutoRenewChange?.nextValue
                ? t('pricing.autoRenew.resumeDesc').replace(
                    '{{plan}}',
                    pendingAutoRenewPlan
                      ? t(`pricing.plans.${pendingAutoRenewPlan.id}.name`)
                      : t('pricing.autoRenew.planFallback'),
                  )
                : t('pricing.autoRenew.cancelDesc').replace(
                    '{{plan}}',
                    pendingAutoRenewPlan
                      ? t(`pricing.plans.${pendingAutoRenewPlan.id}.name`)
                      : t('pricing.autoRenew.planFallback'),
                  )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setPendingAutoRenewChange(null)}
            >
              {t('pricing.autoRenew.keep')}
            </Button>
            <Button
              className="rounded-full px-6"
              onClick={handleConfirmAutoRenewChange}
            >
              {pendingAutoRenewChange?.nextValue
                ? t('pricing.autoRenew.resumeConfirm')
                : t('pricing.autoRenew.cancelConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isTopUpAccessDialogOpen} onOpenChange={setIsTopUpAccessDialogOpen}>
        <DialogContent className="!border-black/5 !bg-white/92 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:!border-border dark:!bg-[hsl(var(--background)/0.95)] dark:backdrop-blur-sm sm:max-w-md">
          <DialogHeader className="pr-8">
            <DialogTitle>
              {t('pricing.topUp.accessTitle')}
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-3">
              {t('pricing.topUp.accessDesc')}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsTopUpAccessDialogOpen(false)}
            >
              {t('pricing.topUp.gotIt')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isTopUpDialogOpen}
        onOpenChange={(open) => {
          setIsTopUpDialogOpen(open);
          if (!open) {
            setSelectedTopUpPack(null);
          }
        }}
      >
        <DialogContent className="!border-black/5 !bg-white/92 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:!border-border dark:!bg-[hsl(var(--background)/0.95)] dark:backdrop-blur-sm sm:max-w-4xl">
          <DialogHeader className="pr-8">
            <DialogTitle>
              {t('pricing.topUp.dialogTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('pricing.topUp.dialogDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {topUpPacks.map((pack) => {
              const isSelected = selectedTopUpPack?.id === pack.id;

              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => handleTopUpSelect(pack)}
                  aria-pressed={isSelected}
                  className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/[0.05] shadow-sm'
                      : 'border-border bg-background/70 hover:border-foreground/20 hover:bg-foreground/[0.04]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3 pr-8">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xl font-semibold text-foreground">
                          {t(`pricing.topup.${pack.id}.name`)}
                        </span>
                        {pack.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              pack.featured
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {t('pricing.topup.value.badge')}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {t('pricing.topUp.oneOffLabel')}
                      </p>
                    </div>
                    <span className="shrink-0 text-2xl font-semibold tabular-nums text-foreground">
                      {pack.price}
                    </span>
                  </div>

                  <div className="mt-4 rounded-lg bg-muted/50 px-3 py-3">
                    <div className="text-[11px] text-muted-foreground">
                      {t('pricing.topUp.youReceive')}
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      {pack.originalCredits && (
                        <span className="text-lg tabular-nums text-muted-foreground line-through">
                          {pack.originalCredits}
                        </span>
                      )}
                      <span className="text-xl font-semibold tabular-nums text-foreground">
                        {pack.credits}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{t(`pricing.topup.${pack.id}.note`)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsTopUpDialogOpen(false)}
            >
              {t('pricing.topUp.cancel')}
            </Button>
            <Button
              className="rounded-full px-6"
              disabled={!selectedTopUpPack || topUpCheckoutLoading}
              onClick={() => void handleTopUpCheckout()}
            >
              {topUpCheckoutLoading ? t('pricing.checkout.inProgress') : t('pricing.topUp.purchase')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingPage;
