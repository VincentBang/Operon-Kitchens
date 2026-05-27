import { calculatePricing, QuoteInput } from '../src/lib/pricing';
import { defaultQuoteInput } from '../src/lib/quoteDefaults';

describe('pricing engine', () => {
  it('calculates a simple straight-line kitchen correctly', () => {
    const input: QuoteInput = {
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
    const result = calculatePricing(input);
    expect(result.total).toBeGreaterThan(0);
    expect(result.estimateLow).toBeGreaterThan(0);
    expect(result.estimateHigh).toBeGreaterThan(result.estimateLow);
    expect(result.confidenceLevel).toBe('high');
    expect(result.confidenceLabel).toBe('high');
    expect(result.includedScope).toContain('Base cabinets');
    expect(result.assumptions).toContain('This is an estimate range for planning and quote review, not a final fixed quote.');
    expect(result.complianceFlags).toContain('Final site measure required before final quote confirmation');
    expect(result.complianceFlags).toContain('NSW deposit guidance: maximum deposit should be 10% of the final home building contract price');
    expect(result.recommendedNextStep).toContain('professional');
  });

  it('prices multiple zones, appliances, lighting, flooring and structural allowances', () => {
    const input: QuoteInput = {
      ...defaultQuoteInput,
      measurementsProvided: true,
      photosProvided: true,
      baseLinearMetres: 4,
      overheadLinearMetres: 2,
      doorQty: 8,
      panelQty: 5,
      zones: [
        {
          id: 'pantry-1',
          name: 'Walk-in pantry',
          type: 'pantry',
          baseLinearMetres: 2,
          overheadLinearMetres: 1,
          tallCabinetQty: 1,
          drawerQty: 2,
          doorQty: 4,
          panelQty: 2,
          selectedAccessories: ['pullOutPantry'],
        },
      ],
      appliances: { ...defaultQuoteInput.appliances, rangehood: true, oven: true, dishwasher: true },
      lighting: { ledStripsMetres: 4, downlightQty: 6, pendantQty: 2 },
      flooring: { included: true, areaSqm: 14, type: 'hybrid' },
      structuralWorks: { wallRemoval: true, beamRequired: true, windowDoorChanges: false },
    };

    const result = calculatePricing(input);
    expect(result.lineItems.some((item) => item.name === 'Walk-in pantry cabinetry zone')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Appliance allowances')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Lighting allowances')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Kitchen flooring allowance')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Structural works review allowance')).toBe(true);
    expect(result.manualReviewFlags).toContain('Multiple zones require manual scope review');
    expect(result.exclusions).toContain('Structural engineering, approvals and final building work pricing require manual review.');
  });

  it('reduces confidence and increases contingency for apartment and approval risks', () => {
    const simple = calculatePricing({ ...defaultQuoteInput, measurementsProvided: true, photosProvided: true, baseLinearMetres: 3 });
    const complex = calculatePricing({
      ...defaultQuoteInput,
      propertyType: 'strataApartment',
      propertyLevel: 'level2+',
      hasLift: false,
      parkingAccess: 'limited',
      baseLinearMetres: 3,
      strataApprovalRequired: true,
      basixReviewRequired: true,
      dbpReviewRequired: true,
      asbestosRisk: true,
      accessConstraints: { narrowAccess: true, longCarry: true, occupiedHome: true },
    });

    expect(complex.confidenceScore).toBeLessThan(simple.confidenceScore);
    expect(complex.estimateHigh - complex.estimateLow).toBeGreaterThan(simple.estimateHigh - simple.estimateLow);
    expect(complex.contingency).toBeGreaterThan(simple.contingency);
    expect(complex.complianceFlags).toContain('Strata/apartment approval review required');
    expect(complex.complianceFlags).toContain('Older-property/asbestos risk review required');
    expect(complex.complianceFlags).toContain('DBP/class 2 screening required for apartment risk');
  });
});
