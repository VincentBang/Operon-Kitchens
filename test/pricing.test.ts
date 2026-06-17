import { calculatePricing, QuoteInput } from '../src/lib/pricing';
import { defaultQuoteInput } from '../src/lib/quoteDefaults';

describe('pricing engine', () => {
  it('calculates a simple straight-line kitchen correctly', () => {
    const input: QuoteInput = {
      ...defaultQuoteInput,
      projectType: 'fullRenovation',
      suburb: 'Randwick',
      layoutType: 'lShape',
      kitchenSize: 'medium',
      measurementsProvided: true,
      photosProvided: true,
      supportingFiles: [{ id: 'photo-1', name: 'kitchen-photo.jpg', category: 'photo' }],
      baseLinearMetres: 3,
      overheadLinearMetres: 2,
      drawerQty: 2,
      doorQty: 6,
      panelQty: 4,
      benchtopMetres: 3,
      splashbackArea: 2,
      applianceAllowance: 'exactModelsKnown',
      plumbingMovement: 'sameLocation',
      electricalScope: 'similar',
      gasInvolved: 'no',
      waterproofingChanges: 'no',
      widerRenovationThresholdRisk: 'no',
      olderPropertyAsbestosConcern: 'no',
    };
    const result = calculatePricing(input);
    expect(result.total).toBeGreaterThan(0);
    expect(result.estimateLow).toBeGreaterThan(0);
    expect(result.estimateHigh).toBeGreaterThan(result.estimateLow);
    expect(result.confidenceLevel).toBe('high');
    expect(result.confidenceLabel).toBe('high');
    expect(result.confidenceReasonsPositive).toContain('Kitchen layout selected');
    expect(result.reviewRiskLabel).toBe('low');
    expect(result.riskReasons).toContain('No unusual complexity has been identified beyond normal site measure and written scope confirmation.');
    expect(result.leadQuality).toMatch(/hot|medium|low/);
    expect(result.recommendedFollowUp).toMatch(/follow-up|guidance|same-day/i);
    expect(result.includedScope).toContain('Base cabinets');
    expect(result.assumptions).toContain('This is a planning estimate range for scope review, not a contract price.');
    expect(result.complianceFlags).toContain('Site measure required before project-specific pricing confirmation');
    expect(result.complianceFlags).toContain('Written contract review may be required for residential building work over $5,000 including GST');
    expect(result.complianceFlags).toContain('NSW deposit guidance: maximum deposit should be 10% of the confirmed home building contract price');
    expect(result.recommendedNextStep).toContain('professional');
  });

  it('prices multiple zones, appliances, lighting, flooring and structural allowances', () => {
    const input: QuoteInput = {
      ...defaultQuoteInput,
      projectType: 'fullRenovation',
      suburb: 'Manly',
      layoutType: 'island',
      kitchenSize: 'large',
      measurementsProvided: true,
      photosProvided: true,
      supportingFiles: [{ id: 'photo-1', name: 'kitchen-photo.jpg', category: 'photo' }],
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
      applianceAllowance: 'premiumPc',
      plumbingMovement: 'sameLocation',
      electricalScope: 'similar',
      gasInvolved: 'no',
      waterproofingChanges: 'no',
      widerRenovationThresholdRisk: 'no',
      olderPropertyAsbestosConcern: 'no',
    };

    const result = calculatePricing(input);
    expect(result.lineItems.some((item) => item.name === 'Walk-in pantry cabinetry zone')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Appliance allowances')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Lighting allowances')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Kitchen flooring allowance')).toBe(true);
    expect(result.lineItems.some((item) => item.name === 'Structural works review allowance')).toBe(true);
    expect(result.manualReviewFlags).toContain('Multiple zones require manual scope review');
    expect(result.exclusions).toContain('Structural engineering, approvals and project-specific building work pricing require manual review.');
  });

  it('reduces confidence and increases contingency for apartment and approval risks', () => {
    const simple = calculatePricing({
      ...defaultQuoteInput,
      projectType: 'fullRenovation',
      suburb: 'Parramatta',
      layoutType: 'straight',
      kitchenSize: 'medium',
      measurementsProvided: true,
      photosProvided: true,
      supportingFiles: [{ id: 'photo-1', name: 'kitchen-photo.jpg', category: 'photo' }],
      baseLinearMetres: 3,
      applianceAllowance: 'exactModelsKnown',
      plumbingMovement: 'sameLocation',
      electricalScope: 'similar',
      gasInvolved: 'no',
      waterproofingChanges: 'no',
      widerRenovationThresholdRisk: 'no',
      olderPropertyAsbestosConcern: 'no',
    });
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
    expect(complex.complianceFlags).toContain('Older-property/asbestos review likely requires confirmation');
    expect(complex.complianceFlags).toContain('DBP/class 2 screening may be required for apartment work');
    expect(complex.reviewRiskScore).toBeGreaterThan(simple.reviewRiskScore);
    expect(complex.reviewRiskLabel).toBe('high');
    expect(complex.riskReasons).toEqual(expect.arrayContaining(['Apartment or strata approval or notification review pathway needs review']));
  });

  it('rewards clearer scope details with higher confidence', () => {
    const unclear = calculatePricing({
      ...defaultQuoteInput,
      projectType: 'notSure',
      layoutType: 'notSure',
      kitchenSize: 'notSure',
      photosProvided: false,
      measurementsProvided: false,
      plumbingMovement: 'notSure',
      electricalScope: 'notSure',
      gasInvolved: 'notSure',
      olderPropertyAsbestosConcern: 'notSure',
    });
    const clear = calculatePricing({
      ...defaultQuoteInput,
      projectType: 'fullRenovation',
      suburb: 'Surry Hills',
      layoutType: 'galley',
      kitchenSize: 'medium',
      baseLinearMetres: 3,
      measurementsProvided: true,
      photosProvided: true,
      supportingFiles: [{ id: 'plan-1', name: 'floorplan.pdf', category: 'plan' }],
      applianceAllowance: 'exactModelsKnown',
      plumbingMovement: 'sameLocation',
      electricalScope: 'similar',
      gasInvolved: 'no',
      waterproofingChanges: 'no',
      widerRenovationThresholdRisk: 'no',
      olderPropertyAsbestosConcern: 'no',
    });

    expect(unclear.confidenceLabel).toBe('low');
    expect(clear.confidenceScore).toBeGreaterThan(unclear.confidenceScore);
    expect(clear.confidenceReasonsPositive).toContain('Photos or plans supplied');
    expect(unclear.confidenceReasonsNegative).toContain('No photos or plans attached');
    expect(unclear.confidenceReasonsNegative).toContain('Appliance selections or allowance level unclear');
  });

  it('tightens estimate ranges as confidence improves', () => {
    const unclear = calculatePricing({
      ...defaultQuoteInput,
      projectType: 'notSure',
      layoutType: 'notSure',
      kitchenSize: 'notSure',
      baseLinearMetres: 4,
      overheadLinearMetres: 2,
      doorQty: 8,
      panelQty: 4,
      benchtopMetres: 3,
      splashbackArea: 2,
      measurementsProvided: false,
      photosProvided: false,
      applianceAllowance: 'notSure',
      plumbingMovement: 'notSure',
      electricalScope: 'notSure',
    });
    const clear = calculatePricing({
      ...defaultQuoteInput,
      projectType: 'fullRenovation',
      suburb: 'Mosman',
      roughTiming: 'readySoon',
      budgetBand: '45kTo70k',
      layoutType: 'lShape',
      kitchenSize: 'medium',
      baseLinearMetres: 4,
      overheadLinearMetres: 2,
      doorQty: 8,
      panelQty: 4,
      benchtopMetres: 3,
      splashbackArea: 2,
      measurementsProvided: true,
      photosProvided: true,
      supportingFiles: [{ id: 'quote-1', name: 'quote.pdf', category: 'currentQuote' }],
      hasExistingQuote: true,
      applianceAllowance: 'exactModelsKnown',
      plumbingMovement: 'sameLocation',
      electricalScope: 'similar',
      gasInvolved: 'no',
      waterproofingChanges: 'no',
      widerRenovationThresholdRisk: 'no',
      olderPropertyAsbestosConcern: 'no',
      preferredContactMethod: 'phone',
    });

    const unclearRatio = (unclear.estimateHigh - unclear.estimateLow) / Math.max(unclear.total, 1);
    const clearRatio = (clear.estimateHigh - clear.estimateLow) / Math.max(clear.total, 1);
    expect(clearRatio).toBeLessThan(unclearRatio);
    expect(clear.leadQuality).toBe('hot');
  });
});
