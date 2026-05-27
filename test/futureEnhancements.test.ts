import { answerKitchenPlanningQuestion } from '../src/lib/planningAssistant';
import { createKitchenRecommendations } from '../src/lib/recommendations';
import { getSupplierIntegrationPolicy, supplierConnectors } from '../src/lib/supplierIntegrations';
import { getLocalizedMessage, isRtlLocale } from '../src/lib/i18n';
import { calculatePricing, QuoteInput } from '../src/lib/pricing';
import { defaultQuoteInput } from '../src/lib/quoteDefaults';

const baseInput: QuoteInput = {
  ...defaultQuoteInput,
  measurementsProvided: true,
  photosProvided: true,
  baseLinearMetres: 3,
  overheadLinearMetres: 2,
  drawerQty: 2,
  doorQty: 6,
  panelQty: 4,
  benchtopMetres: 3,
  splashbackArea: 2,
};

describe('future enhancement foundations', () => {
  it('suggests material alternatives when restricted engineered stone is selected', () => {
    const input: QuoteInput = { ...baseInput, benchtopType: 'engineeredStone' };
    const result = calculatePricing(input);
    const recommendations = createKitchenRecommendations(input, result);

    expect(recommendations.map((item) => item.id)).toContain('replace-engineered-stone');
    expect(recommendations.find((item) => item.id === 'replace-engineered-stone')?.action).toContain('porcelain');
  });

  it('suggests evidence collection for low confidence scopes', () => {
    const input: QuoteInput = {
      ...defaultQuoteInput,
      measurementsProvided: false,
      photosProvided: false,
      highRiskItems: true,
      strataApprovalRequired: true,
    };
    const result = calculatePricing(input);
    const recommendations = createKitchenRecommendations(input, result);

    expect(result.confidenceScore).toBeLessThan(70);
    expect(recommendations.map((item) => item.id)).toContain('confidence-more-evidence');
  });

  it('answers planning questions with bounded guidance and review prompts', () => {
    const answer = answerKitchenPlanningQuestion('Can I pay a 20% deposit before HBC insurance is ready?');

    expect(answer.topic).toBe('compliance');
    expect(answer.requiresProfessionalReview).toBe(true);
    expect(answer.answer).toContain('not legal advice');
  });

  it('keeps supplier API connectors disabled until approval', () => {
    const policy = getSupplierIntegrationPolicy();

    expect(policy.liveApiCallsEnabled).toBe(false);
    expect(policy.exposesSupplierCosts).toBe(false);
    expect(supplierConnectors.every((connector) => connector.approvalRequired)).toBe(true);
  });

  it('provides multilingual message readiness including RTL detection', () => {
    expect(getLocalizedMessage('vi', 'startQuote')).toContain('bếp');
    expect(isRtlLocale('ar')).toBe(true);
    expect(isRtlLocale('en-AU')).toBe(false);
  });
});
