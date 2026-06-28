import { DesignBriefResult, designBriefLegalMessage, designBriefSafetyMessage } from './designBrief';
import { AllowanceRiskFlag, AllowanceRiskResult, allowanceRiskSafetyMessage } from './allowanceRisk';
import { KitchenScopeResult } from './kitchenScope';

export type AdvancedReviewConsoleSource = 'requestReview' | 'designBrief' | 'scopeBuilder' | 'quoteReview';

export type RecommendedOperatorAction =
  | 'review_scope'
  | 'request_missing_information'
  | 'offer_site_measure'
  | 'prepare_quote_review'
  | 'mark_not_ready';

export interface AdvancedReviewConsolePayload {
  leadId: string;
  source: AdvancedReviewConsoleSource;
  createdAt: string;
  designBriefSummary?: string[];
  scopeSummary?: string[];
  allowanceRiskFlags?: Array<{
    id: string;
    category: AllowanceRiskFlag['category'];
    label: string;
    customerSafePrompt: string;
    requiresHumanReview: boolean;
  }>;
  missingInclusions?: string[];
  customerQuestions?: string[];
  siteMeasurePreparation?: string[];
  recommendedOperatorAction: RecommendedOperatorAction;
  safetyMessage: typeof allowanceRiskSafetyMessage;
}

export interface AdvancedReviewPayloadInput {
  leadId: string;
  source: AdvancedReviewConsoleSource;
  createdAt?: string;
  designBrief?: DesignBriefResult;
  kitchenScope?: KitchenScopeResult;
  allowanceRisk?: AllowanceRiskResult;
}

export interface ScopeBuilderReviewPayloadInput {
  leadId: string;
  createdAt?: string;
  kitchenScope: KitchenScopeResult;
  allowanceRisk: AllowanceRiskResult;
}

function cleanText(value: string, maxLength = 240) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanList(values: Array<string | undefined>, maxLength = 240) {
  return Array.from(new Set(values.map((value) => cleanText(value ?? '', maxLength)).filter(Boolean)));
}

function summaryToStrings(summary?: Array<{ label: string; value: string }>) {
  if (!summary?.length) return undefined;
  const items = cleanList(summary.map((item) => `${item.label}: ${item.value}`));
  return items.length ? items : undefined;
}

function riskFlagsToCustomerSafeFlags(flags?: AllowanceRiskFlag[]) {
  if (!flags?.length) return undefined;
  return flags.map((flag) => ({
    id: cleanText(flag.id, 80),
    category: flag.category,
    label: cleanText(flag.label, 120),
    customerSafePrompt: cleanText(flag.customerSafePrompt, 260),
    requiresHumanReview: flag.requiresHumanReview,
  }));
}

function missingDesignBriefItems(designBrief?: DesignBriefResult) {
  return designBrief?.missingInformation.map((item) => `${item.label}: ${item.reason}`) ?? [];
}

function missingKitchenScopeItems(kitchenScope?: KitchenScopeResult) {
  return kitchenScope?.missingScope.map((item) => `${item.label}: ${item.reason}`) ?? [];
}

function chooseRecommendedOperatorAction(input: AdvancedReviewPayloadInput): RecommendedOperatorAction {
  const { designBrief, kitchenScope, allowanceRisk } = input;

  if (allowanceRisk?.recommendedPathway.humanReviewRecommended || allowanceRisk?.flags.some((flag) => flag.requiresHumanReview)) {
    return 'review_scope';
  }

  if (designBrief?.pathway.humanReviewRecommended || kitchenScope?.recommendedNextStep.humanReviewRecommended) {
    return 'review_scope';
  }

  if ((designBrief?.missingInformation.length ?? 0) + (kitchenScope?.missingScope.length ?? 0) >= 4) {
    return 'request_missing_information';
  }

  if (kitchenScope?.recommendedNextStep.href === '/site-measure' || designBrief?.pathway.primary.href === '/site-measure') {
    return 'offer_site_measure';
  }

  if (allowanceRisk?.recommendedPathway.href === '/quote/review' || kitchenScope?.recommendedNextStep.href === '/quote/review' || designBrief?.pathway.primary.href === '/quote/review') {
    return 'prepare_quote_review';
  }

  return 'request_missing_information';
}

export function createAdvancedReviewConsolePayload(input: AdvancedReviewPayloadInput): AdvancedReviewConsolePayload {
  const designBriefSummary = summaryToStrings(input.designBrief?.summary);
  const scopeSummary = summaryToStrings(input.kitchenScope?.summary);
  const allowanceRiskFlags = riskFlagsToCustomerSafeFlags(input.allowanceRisk?.flags);
  const missingInclusions = cleanList([
    ...missingDesignBriefItems(input.designBrief),
    ...missingKitchenScopeItems(input.kitchenScope),
    ...(input.allowanceRisk?.missingInclusions ?? []),
  ]);
  const customerQuestions = cleanList(input.allowanceRisk?.customerQuestions ?? [], 280);
  const siteMeasurePreparation = cleanList(input.kitchenScope?.siteMeasurePreparation ?? [], 280);

  const payload: AdvancedReviewConsolePayload = {
    leadId: cleanText(input.leadId, 80),
    source: input.source,
    createdAt: input.createdAt ? cleanText(input.createdAt, 40) : new Date().toISOString(),
    recommendedOperatorAction: chooseRecommendedOperatorAction(input),
    safetyMessage: allowanceRiskSafetyMessage,
  };

  if (designBriefSummary) payload.designBriefSummary = designBriefSummary;
  if (scopeSummary) payload.scopeSummary = scopeSummary;
  if (allowanceRiskFlags?.length) payload.allowanceRiskFlags = allowanceRiskFlags;
  if (missingInclusions.length) payload.missingInclusions = missingInclusions;
  if (customerQuestions.length) payload.customerQuestions = customerQuestions;
  if (siteMeasurePreparation.length) payload.siteMeasurePreparation = siteMeasurePreparation;

  return payload;
}

export function createScopeBuilderReviewPayload(input: ScopeBuilderReviewPayloadInput): AdvancedReviewConsolePayload {
  return createAdvancedReviewConsolePayload({
    leadId: input.leadId,
    source: 'scopeBuilder',
    createdAt: input.createdAt,
    kitchenScope: input.kitchenScope,
    allowanceRisk: input.allowanceRisk,
  });
}

export function getAdvancedReviewCustomerSafetyMessages() {
  return [designBriefSafetyMessage, designBriefLegalMessage, allowanceRiskSafetyMessage];
}
