import {
  createAdvancedReviewConsolePayload,
  createScopeBuilderReviewPayload,
  getAdvancedReviewCustomerSafetyMessages,
} from '../src/lib/advancedReviewConsole';
import { evaluateAllowanceAndQuoteRisk } from '../src/lib/allowanceRisk';
import { defaultDesignBriefInput, evaluateDesignBrief } from '../src/lib/designBrief';
import { defaultKitchenScopeInput, evaluateKitchenScope } from '../src/lib/kitchenScope';

describe('advanced review console projection helpers', () => {
  const apartmentScopeInput = {
    ...defaultKitchenScopeInput,
    layoutType: 'galley' as const,
    roomLengthMm: '3100',
    roomWidthMm: '2300',
    openingNotes: 'Balcony door and window near sink wall.',
    cabinetZones: ['Base cabinets', 'Overheads'],
    appliancePositions: ['Cooktop', 'Dishwasher'],
    benchtopScope: 'new' as const,
    splashbackScope: 'new' as const,
    demolitionAndRemoval: 'yes' as const,
    makeGoodWork: 'yes' as const,
    serviceChanges: {
      ...defaultKitchenScopeInput.serviceChanges,
      plumbing: 'relocationLikely' as const,
    },
    accessConstraints: ['Apartment or strata review'],
    scopeNotes: 'Apartment galley kitchen with plumbing relocation review.',
  };

  it('projects scope-builder results into a customer-safe review-console payload', () => {
    const kitchenScope = evaluateKitchenScope(apartmentScopeInput);
    const allowanceRisk = evaluateAllowanceAndQuoteRisk(apartmentScopeInput);
    const payload = createScopeBuilderReviewPayload({
      leadId: 'lead-123',
      createdAt: '2026-06-24T08:00:00.000Z',
      kitchenScope,
      allowanceRisk,
    });

    expect(payload).toMatchObject({
      leadId: 'lead-123',
      source: 'scopeBuilder',
      createdAt: '2026-06-24T08:00:00.000Z',
      recommendedOperatorAction: 'review_scope',
    });
    expect(payload.scopeSummary).toEqual(expect.arrayContaining([
      'Layout type: Galley',
      'Room dimensions: 3100mm x 2300mm',
    ]));
    expect(payload.allowanceRiskFlags?.map((flag) => flag.id)).toEqual(expect.arrayContaining([
      'licensed-services',
      'apartment-access',
    ]));
    expect(payload.missingInclusions).toEqual(expect.arrayContaining([
      expect.stringMatching(/licensed plumbing/i),
      expect.stringMatching(/owners corporation/i),
    ]));
    expect(payload.customerQuestions).toEqual(expect.arrayContaining([
      expect.stringMatching(/licensed trades/i),
      expect.stringMatching(/owners corporation/i),
    ]));
    expect(payload.safetyMessage).toContain('not legal advice');
  });

  it('can combine design brief, scope and allowance risk summaries without persistence', () => {
    const designBrief = evaluateDesignBrief({
      ...defaultDesignBriefInput,
      suburbOrPostcode: 'Mosman',
      propertyType: 'strataApartment',
      renovationStage: 'comparingQuotes',
      existingQuoteStatus: 'oneQuote',
      currentKitchenProblems: 'Need to compare a kitchen quote before commitment.',
      propertyAndAccess: {
        ...defaultDesignBriefInput.propertyAndAccess,
        strataOrApartment: 'yes',
        liftAccess: 'yes',
      },
    });
    const kitchenScope = evaluateKitchenScope(apartmentScopeInput);
    const allowanceRisk = evaluateAllowanceAndQuoteRisk(apartmentScopeInput);

    const payload = createAdvancedReviewConsolePayload({
      leadId: 'lead-brief-scope',
      source: 'requestReview',
      createdAt: '2026-06-24T09:00:00.000Z',
      designBrief,
      kitchenScope,
      allowanceRisk,
    });

    expect(payload.designBriefSummary).toEqual(expect.arrayContaining([
      'Suburb or postcode: Mosman',
      'Property type: Strata apartment',
    ]));
    expect(payload.scopeSummary).toEqual(expect.arrayContaining([
      'Layout type: Galley',
    ]));
    expect(payload.recommendedOperatorAction).toBe('review_scope');
  });

  it('routes detailed lower-risk scopes toward site measure preparation', () => {
    const lowerRiskScopeInput = {
      ...defaultKitchenScopeInput,
      layoutType: 'lShape' as const,
      roomLengthMm: '3400',
      roomWidthMm: '2600',
      ceilingHeightMm: '2400',
      openingNotes: 'Window above sink and doorway near fridge wall.',
      cabinetZones: ['Base cabinets', 'Overheads', 'Pantry'],
      appliancePositions: ['Cooktop', 'Oven tower', 'Dishwasher', 'Fridge'],
      benchtopScope: 'new' as const,
      splashbackScope: 'new' as const,
      demolitionAndRemoval: 'yes' as const,
      makeGoodWork: 'yes' as const,
      serviceChanges: {
        plumbing: 'sameLocation' as const,
        electrical: 'sameLocation' as const,
        gas: 'sameLocation' as const,
        ventilation: 'sameLocation' as const,
        lighting: 'sameLocation' as const,
      },
      interfaces: {
        walls: 'no' as const,
        floors: 'no' as const,
        painting: 'no' as const,
      },
      scopeNotes: 'Full cabinet replacement with new benchtop and same service locations.',
    };

    const payload = createScopeBuilderReviewPayload({
      leadId: 'lead-site-measure',
      kitchenScope: evaluateKitchenScope(lowerRiskScopeInput),
      allowanceRisk: evaluateAllowanceAndQuoteRisk(lowerRiskScopeInput),
    });

    expect(payload.recommendedOperatorAction).toBe('offer_site_measure');
    expect(payload.siteMeasurePreparation).toEqual(expect.arrayContaining([
      expect.stringMatching(/final measurements/i),
      expect.stringMatching(/written inclusions/i),
    ]));
  });

  it('does not project unsupported internal or admin-like fields', () => {
    const payload = createAdvancedReviewConsolePayload({
      leadId: 'lead-internal-noise',
      source: 'scopeBuilder',
      kitchenScope: evaluateKitchenScope(apartmentScopeInput),
      allowanceRisk: evaluateAllowanceAndQuoteRisk(apartmentScopeInput),
      supplierCost: 12000,
      internalRate: 88,
      margin: 0.25,
      leadScore: 99,
      adminPriority: 'urgent',
      internalNotes: 'Do not project this field.',
      serviceRoleKey: 'secret',
    } as any);

    const text = JSON.stringify(payload).toLowerCase();

    expect(text).not.toContain('suppliercost');
    expect(text).not.toContain('supplier cost');
    expect(text).not.toContain('internalrate');
    expect(text).not.toContain('internal rate');
    expect(text).not.toContain('margin');
    expect(text).not.toContain('leadscore');
    expect(text).not.toContain('lead score');
    expect(text).not.toContain('adminpriority');
    expect(text).not.toContain('admin priority');
    expect(text).not.toContain('internalnotes');
    expect(text).not.toContain('service role');
    expect(text).not.toContain('secret');
  });

  it('exposes the shared safety messages without adding contract-pricing claims', () => {
    const messages = getAdvancedReviewCustomerSafetyMessages().join(' ');

    expect(messages).toContain('Site measure and written scope confirmation are required before contract pricing');
    expect(messages).toContain('not legal advice');
    expect(messages).not.toMatch(/final fixed quote|guaranteed savings|approved quote|certified quote/i);
  });
});
