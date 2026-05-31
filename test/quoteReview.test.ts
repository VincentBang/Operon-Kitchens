import {
  createDefaultReviewJobDetails,
  evaluateKitchenQuoteReview,
  reviewChecks,
  ReviewCheckKey,
} from '../src/lib/quoteReview';

function allChecksComplete(): Record<ReviewCheckKey, boolean> {
  return reviewChecks.reduce(
    (checks, check) => ({ ...checks, [check.key]: true }),
    {} as Record<ReviewCheckKey, boolean>,
  );
}

describe('kitchen quote review intake', () => {
  it('explains the required quote review checks', () => {
    expect(reviewChecks.map((check) => check.label)).toEqual(
      expect.arrayContaining([
        'Missing inclusions',
        'Unclear PC sums',
        'Unclear provisional sums',
        'Deposit / HBC flags',
        'Exclusions',
        'Service relocation',
        'Appliance assumptions',
        'Benchtop/splashback clarity',
        'Strata/apartment risks',
        'Demolition and waste scope',
        'Site measure requirement',
      ]),
    );
  });

  it('returns a not-ready placeholder result when required context is missing', () => {
    const result = evaluateKitchenQuoteReview({
      checkedItems: {},
      files: [],
      jobDetails: createDefaultReviewJobDetails(),
    });

    expect(result.status).toBe('notReady');
    expect(result.disclaimer).toContain('does not replace full document review');
    expect(result.reviewScores.reviewReadiness).toBe(result.confidenceScore);
    expect(result.reviewScores.missingInformation).toBeGreaterThan(0);
    expect(result.unclearItems).toEqual(expect.arrayContaining(['Quote document', 'Photos or plans']));
    expect(result.customerQuestions).toEqual(expect.arrayContaining(['Are deposit terms, HBC review items and written contract requirements clearly stated?']));
    expect(result.manualReviewFlags).toEqual(
      expect.arrayContaining([
        'Existing quote document still needs to be supplied or described',
        'Photos or plans would improve review confidence',
      ]),
    );
    expect(result.complianceFlags).toEqual(
      expect.arrayContaining([
        'Site measure required before project-specific pricing confirmation',
        'Deposit and HBC terms need confirmation, including 10% maximum deposit guidance and HBC review over $20,000 including GST',
      ]),
    );
    expect(result.compliancePrompts).toEqual(result.complianceFlags);
  });

  it('marks the intake review-ready when quote, visuals and clarity checks are supplied', () => {
    const result = evaluateKitchenQuoteReview({
      checkedItems: allChecksComplete(),
      files: [
        { id: 'quote-file', name: 'builder-quote.pdf', category: 'existingQuote' },
        { id: 'photo-file', name: 'kitchen-photo.jpg', category: 'photo' },
      ],
      jobDetails: {
        ...createDefaultReviewJobDetails(),
        propertyType: 'house',
        projectType: 'fullRenovation',
        demolitionIncluded: true,
        wasteIncluded: true,
        benchtopKnown: true,
        splashbackKnown: true,
        appliancesSpecified: true,
      },
    });

    expect(result.status).toBe('reviewReady');
    expect(result.confidenceScore).toBe(100);
    expect(result.reviewScores.scopeClarity).toBe(85);
    expect(result.reviewScores.allowanceRisk).toBe(0);
    expect(result.missingItems).toHaveLength(0);
    expect(result.manualReviewFlags).not.toContain('Existing quote document still needs to be supplied or described');
  });

  it('flags strata, service relocation and material clarity risks for manual review', () => {
    const result = evaluateKitchenQuoteReview({
      checkedItems: {
        missingInclusions: true,
        pcSums: true,
        provisionalSums: true,
        exclusions: true,
      },
      files: [
        { id: 'quote-file', name: 'builder-quote.pdf', category: 'existingQuote' },
        { id: 'plan-file', name: 'existing-plan.pdf', category: 'plan' },
      ],
      jobDetails: {
        ...createDefaultReviewJobDetails(),
        propertyType: 'strataApartment',
        servicesRelocated: true,
        strataOrApartment: true,
      },
    });

    expect(result.status).toBe('partial');
    expect(result.reviewScores.allowanceRisk).toBeGreaterThan(0);
    expect(result.complianceFlags).toEqual(
      expect.arrayContaining([
        'Licensed electrical, plumbing or gas trade confirmation may be required',
        'Strata/apartment approval and DBP/class 2 screening may require review',
        'Benchtop/splashback material and engineered-stone restriction needs confirmation',
      ]),
    );
    expect(result.customerQuestions).toEqual(expect.arrayContaining(['Does the quote allow for strata approval, lift booking, access protection and building rules?']));
    expect(result.missingItems).toEqual(
      expect.arrayContaining(['Deposit / HBC flags', 'Benchtop/splashback clarity', 'Site measure requirement']),
    );
  });
});
