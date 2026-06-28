import {
  calculateMissingDesignBriefInformation,
  createDesignBriefSummary,
  defaultDesignBriefInput,
  evaluateDesignBrief,
  recommendDesignBriefPathway,
  validateDesignBriefRequiredFields,
} from '../src/lib/designBrief';

describe('design brief logic', () => {
  it('validates required fields without showing numeric empty-state scoring', () => {
    const errors = validateDesignBriefRequiredFields(defaultDesignBriefInput);
    const result = evaluateDesignBrief(defaultDesignBriefInput);

    expect(errors.suburbOrPostcode).toMatch(/suburb or postcode/i);
    expect(errors.propertyType).toMatch(/property type/i);
    expect(errors.currentKitchenProblems).toMatch(/main kitchen problem/i);
    expect(result.readiness.label).toBe('Getting started');
    expect(JSON.stringify(result)).not.toContain('0/100');
  });

  it('summarises only customer-entered facts', () => {
    const input = {
      ...defaultDesignBriefInput,
      suburbOrPostcode: 'Mosman',
      propertyType: 'house' as const,
      renovationStage: 'earlyPlanning' as const,
      existingQuoteStatus: 'none' as const,
      currentKitchenProblems: 'Small storage and worn benchtop',
      mustHaveOutcomes: ['More storage'],
    };

    const summary = createDesignBriefSummary(input);

    expect(summary).toEqual(expect.arrayContaining([
      { label: 'Suburb or postcode', value: 'Mosman' },
      { label: 'Property type', value: 'House' },
      { label: 'Current kitchen problem', value: 'Small storage and worn benchtop' },
      { label: 'Must-have outcomes', value: 'More storage' },
    ]));
    expect(summary.map((item) => item.value).join(' ')).not.toContain('apartment');
    expect(summary.map((item) => item.value).join(' ')).not.toContain('service relocation');
  });

  it('routes existing written quotes toward quote review', () => {
    const pathway = recommendDesignBriefPathway({
      ...defaultDesignBriefInput,
      suburbOrPostcode: 'Ryde',
      propertyType: 'house',
      existingQuoteStatus: 'oneQuote',
      informationAvailable: {
        ...defaultDesignBriefInput.informationAvailable,
        writtenQuote: 'yes',
      },
      currentKitchenProblems: 'Need to compare a quote scope',
    });

    expect(pathway.primary.href).toBe('/quote/review');
    expect(pathway.primary.label).toBe('Review existing quote');
    expect(pathway.humanReviewRecommended).toBe(false);
  });

  it('routes early planning without a quote toward the estimate', () => {
    const pathway = recommendDesignBriefPathway({
      ...defaultDesignBriefInput,
      suburbOrPostcode: 'Chatswood',
      propertyType: 'house',
      existingQuoteStatus: 'none',
      currentKitchenProblems: 'Need a better planning range',
    });

    expect(pathway.primary.href).toBe('/quote');
    expect(pathway.primary.label).toBe('Start kitchen estimate');
  });

  it('routes complex apartment, strata or access risk toward request review', () => {
    const pathway = recommendDesignBriefPathway({
      ...defaultDesignBriefInput,
      suburbOrPostcode: 'Double Bay',
      propertyType: 'strataApartment',
      existingQuoteStatus: 'multipleQuotes',
      informationAvailable: {
        ...defaultDesignBriefInput.informationAvailable,
        writtenQuote: 'yes',
      },
      currentKitchenProblems: 'Need strata-aware review before comparing totals',
      propertyAndAccess: {
        ...defaultDesignBriefInput.propertyAndAccess,
        strataOrApartment: 'yes',
        liftAccess: 'yes',
      },
    });

    expect(pathway.primary.href).toBe('/request-review');
    expect(pathway.humanReviewRecommended).toBe(true);
    expect(pathway.secondary[0].href).toBe('/quote/review');
  });

  it('routes prepared scope toward site measure', () => {
    const pathway = recommendDesignBriefPathway({
      ...defaultDesignBriefInput,
      suburbOrPostcode: 'Lane Cove',
      propertyType: 'house',
      renovationStage: 'readyForMeasure',
      existingQuoteStatus: 'none',
      currentKitchenProblems: 'Ready to confirm measurements and scope',
      informationAvailable: {
        ...defaultDesignBriefInput.informationAvailable,
        measurements: 'yes',
        roughPlan: 'yes',
        photos: 'yes',
      },
    });

    expect(pathway.primary.href).toBe('/site-measure');
    expect(pathway.primary.label).toBe('Prepare for site measure');
  });

  it('groups missing information for operator and customer review', () => {
    const missing = calculateMissingDesignBriefInformation(defaultDesignBriefInput);
    const groups = new Set(missing.map((item) => item.group));

    expect(Array.from(groups)).toEqual(expect.arrayContaining([
      'propertyAndAccess',
      'measurementsAndPlans',
      'appliancesAndServices',
      'scopeAndFinishes',
      'quoteAndSiteMeasureReadiness',
    ]));
    expect(missing.some((item) => item.severity === 'reviewRecommended')).toBe(true);
  });
});
