import fs from 'node:fs';
import path from 'node:path';
import { calculatePricing } from '../src/lib/pricing';
import { createCustomerQuoteSummary, toCustomerQuoteSummary } from '../src/lib/quotePresentation';
import { defaultQuoteInput } from '../src/lib/quoteDefaults';
import { saveQuoteRecord } from '../src/lib/quoteRecords';

describe('customer-safe quote presentation', () => {
  it('projects raw pricing into the approved customer summary shape', () => {
    const raw = calculatePricing({
      ...defaultQuoteInput,
      projectType: 'fullRenovation',
      suburb: 'Mosman',
      baseLinearMetres: 4,
      measurementsProvided: true,
      photosProvided: true,
      applianceAllowance: 'exactModelsKnown',
      plumbingMovement: 'sameLocation',
      electricalScope: 'similar',
      gasInvolved: 'no',
      widerRenovationThresholdRisk: 'no',
      olderPropertyAsbestosConcern: 'no',
    });
    const summary = toCustomerQuoteSummary(raw);

    expect(summary).toEqual({
      estimateLow: expect.any(Number),
      estimateHigh: expect.any(Number),
      confidenceScore: expect.any(Number),
      confidenceLabel: expect.stringMatching(/low|medium|high/),
      confidenceReasonsPositive: expect.any(Array),
      confidenceReasonsNegative: expect.any(Array),
      reviewRiskScore: expect.any(Number),
      reviewRiskLabel: expect.stringMatching(/low|medium|high/),
      riskReasons: expect.any(Array),
      includedScope: expect.any(Array),
      assumptions: expect.any(Array),
      exclusions: expect.any(Array),
      manualReviewFlags: expect.any(Array),
      compliancePrompts: expect.any(Array),
      recommendedNextStep: expect.any(String),
    });
    expect(Object.keys(summary)).not.toEqual(expect.arrayContaining(['lineItems', 'margin', 'total', 'leadQuality', 'recommendedFollowUp']));
  });

  it('keeps customer-facing summary components off raw pricing and lead score helpers', () => {
    const estimateSummary = fs.readFileSync(path.join(process.cwd(), 'src/components/steps/EstimateSummaryStep.tsx'), 'utf8');
    expect(estimateSummary).toContain('createCustomerQuoteSummary');
    expect(estimateSummary).not.toContain('calculatePricing');
    expect(estimateSummary).not.toContain('scoreKitchenLead');
    expect(estimateSummary).not.toContain('Lead priority');
  });

  it('creates a summary directly from quote input without internal pricing fields', () => {
    const summary = createCustomerQuoteSummary(defaultQuoteInput);
    expect(summary.estimateHigh).toBeGreaterThanOrEqual(summary.estimateLow);
    expect(JSON.stringify(summary).toLowerCase()).not.toContain('margin');
  });

  it('serializes saved quotes with customer-safe pricing only', async () => {
    const quote = await saveQuoteRecord({
      quoteInput: {
        ...defaultQuoteInput,
        projectType: 'fullRenovation',
        suburb: 'Mosman',
        measurementsProvided: true,
        photosProvided: true,
      },
      contact: {
        name: 'Boundary Test',
        email: `boundary-${Date.now()}@example.com`,
        phone: '0400000000',
      },
    });

    expect(quote?.pricing).toEqual(expect.objectContaining({
      estimateLow: expect.any(Number),
      estimateHigh: expect.any(Number),
      confidenceScore: expect.any(Number),
      reviewRiskScore: expect.any(Number),
      recommendedNextStep: expect.any(String),
    }));
    expect(JSON.stringify(quote?.pricing).toLowerCase()).not.toContain('margin');
    expect(JSON.stringify(quote?.pricing).toLowerCase()).not.toContain('leadquality');
    expect(JSON.stringify(quote?.pricing).toLowerCase()).not.toContain('recommendedfollowup');
    expect(quote?.items.every((item: any) => !('cost' in item))).toBe(true);
  });
});
