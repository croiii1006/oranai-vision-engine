import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/* ----------------------------------------------------------------
   Types & Data
   ---------------------------------------------------------------- */

export type FeatureQuota = {
  brandInsight: number;
  strategyPlan: number;
  imageGen: number;
  videoGen: number;
  viralMatch: number;
  videoRemix: number;
  tkSolution: number;
};

export const FEATURE_KEYS: (keyof FeatureQuota)[] = [
  'brandInsight',
  'strategyPlan',
  'imageGen',
  'videoGen',
  'viralMatch',
  'videoRemix',
  'tkSolution',
];


export const PLAN_QUOTAS: Record<string, FeatureQuota> = {
  free: {
    brandInsight: 0,
    strategyPlan: 0,
    imageGen: 1,
    videoGen: 0,
    viralMatch: 0,
    videoRemix: 0,
    tkSolution: 0,
  },
  basic: {
    brandInsight: 10,
    strategyPlan: 5,
    imageGen: 40,
    videoGen: 5,
    viralMatch: 10,
    videoRemix: 5,
    tkSolution: 5,
  },
  pro: {
    brandInsight: 40,
    strategyPlan: 20,
    imageGen: 160,
    videoGen: 20,
    viralMatch: 40,
    videoRemix: 20,
    tkSolution: 20,
  },
};

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */

interface Props {
  planId: string;
  isEnterprise?: boolean;
  highlightDiffFrom?: FeatureQuota | null;
}

const FeatureQuotaTable: React.FC<Props> = ({ planId, isEnterprise }) => {
  const { t } = useLanguage();
  const quota = PLAN_QUOTAS[planId];

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        {t('pricing.featureQuota.title')}
      </h4>

      <ul className="space-y-0.5">
        {FEATURE_KEYS.map((key) => {
          const value = isEnterprise ? -1 : (quota?.[key] ?? 0);
          const isUnlimited = value === -1;
          const isZero = value === 0;

          return (
            <li
              key={key}
              className="flex items-center justify-between py-1 px-2 rounded-md text-xs"
            >
              <span className={isZero ? 'text-muted-foreground/50' : ''}>
                {t(`pricing.feature.${key}`)}
              </span>

              <span
                className={`font-semibold tabular-nums ${
                  isUnlimited
                    ? 'text-primary'
                    : isZero
                      ? 'text-muted-foreground/40'
                      : 'text-foreground'
                }`}
              >
                {isUnlimited
                  ? t('pricing.quota.unlimited')
                  : value}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="text-[11px] text-muted-foreground/60 pt-2">
        {t('pricing.featureQuota.footerNote')}
      </p>
    </div>
  );
};

export default FeatureQuotaTable;