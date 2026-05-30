import { calculatePricing, PricingResult, QuoteInput, RateCard } from '@/lib/pricing';

export interface CustomerQuoteSummary {
  estimateLow: number;
  estimateHigh: number;
  confidenceScore: number;
  confidenceLabel: 'low' | 'medium' | 'high';
  confidenceReasonsPositive: string[];
  confidenceReasonsNegative: string[];
  reviewRiskScore: number;
  reviewRiskLabel: 'low' | 'medium' | 'high';
  riskReasons: string[];
  includedScope: string[];
  assumptions: string[];
  exclusions: string[];
  manualReviewFlags: string[];
  compliancePrompts: string[];
  recommendedNextStep: string;
}

export function toCustomerQuoteSummary(result: PricingResult): CustomerQuoteSummary {
  const compliancePrompts = [
    ...result.complianceFlags,
    result.depositWarning,
    result.hbcWarning,
  ].filter(Boolean) as string[];

  return {
    estimateLow: result.estimateLow,
    estimateHigh: result.estimateHigh,
    confidenceScore: result.confidenceScore,
    confidenceLabel: result.confidenceLabel,
    confidenceReasonsPositive: result.confidenceReasonsPositive,
    confidenceReasonsNegative: result.confidenceReasonsNegative,
    reviewRiskScore: result.reviewRiskScore,
    reviewRiskLabel: result.reviewRiskLabel,
    riskReasons: result.riskReasons,
    includedScope: result.includedScope,
    assumptions: result.assumptions,
    exclusions: result.exclusions,
    manualReviewFlags: result.manualReviewFlags,
    compliancePrompts: Array.from(new Set(compliancePrompts)),
    recommendedNextStep: result.recommendedNextStep,
  };
}

export function createCustomerQuoteSummary(input: QuoteInput, rateCard?: RateCard): CustomerQuoteSummary {
  return toCustomerQuoteSummary(calculatePricing(input, rateCard));
}
