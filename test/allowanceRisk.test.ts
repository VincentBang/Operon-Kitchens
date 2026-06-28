import { evaluateAllowanceAndQuoteRisk } from '../src/lib/allowanceRisk';
import { defaultKitchenScopeInput } from '../src/lib/kitchenScope';

describe('allowance and quote-risk engine', () => {
  it('creates customer-safe prompts without numeric scoring or pricing internals', () => {
    const result = evaluateAllowanceAndQuoteRisk(defaultKitchenScopeInput);
    const text = JSON.stringify(result).toLowerCase();

    expect(result.overallLabel).toBe('Human review recommended');
    expect(result.flags.length).toBeGreaterThan(0);
    expect(result.missingInclusions).toEqual(expect.arrayContaining([
      expect.stringMatching(/appliance/i),
      expect.stringMatching(/demolition/i),
    ]));
    expect(result.customerQuestions).toEqual(expect.arrayContaining([
      expect.stringMatching(/appliances/i),
      expect.stringMatching(/site measure/i),
    ]));
    expect(result.recommendedPathway.href).toBe('/request-review');
    expect(text).not.toContain('0/100');
    expect(text).not.toContain('supplier cost');
    expect(text).not.toContain('internal rate');
    expect(text).not.toContain('lead score');
    expect(text).not.toContain('admin priority');
  });

  it('routes service and apartment risks toward human review', () => {
    const result = evaluateAllowanceAndQuoteRisk({
      ...defaultKitchenScopeInput,
      layoutType: 'galley',
      roomLengthMm: '3100',
      roomWidthMm: '2300',
      openingNotes: 'Balcony door and window near sink wall.',
      cabinetZones: ['Base cabinets', 'Overheads'],
      appliancePositions: ['Cooktop', 'Dishwasher'],
      benchtopScope: 'new',
      splashbackScope: 'new',
      demolitionAndRemoval: 'yes',
      makeGoodWork: 'yes',
      serviceChanges: {
        ...defaultKitchenScopeInput.serviceChanges,
        plumbing: 'relocationLikely',
      },
      accessConstraints: ['Apartment or strata review'],
      scopeNotes: 'Apartment galley kitchen with plumbing relocation review.',
    });

    expect(result.overallLabel).toBe('Human review recommended');
    expect(result.recommendedPathway.href).toBe('/request-review');
    expect(result.flags.map((flag) => flag.id)).toEqual(expect.arrayContaining([
      'licensed-services',
      'apartment-access',
    ]));
    expect(result.customerQuestions.join(' ')).toMatch(/owners corporation/i);
  });

  it('keeps detailed lower-risk scopes on site-measure preparation', () => {
    const result = evaluateAllowanceAndQuoteRisk({
      ...defaultKitchenScopeInput,
      layoutType: 'lShape',
      roomLengthMm: '3400',
      roomWidthMm: '2600',
      ceilingHeightMm: '2400',
      openingNotes: 'Window above sink and doorway near fridge wall.',
      cabinetZones: ['Base cabinets', 'Overheads', 'Pantry'],
      appliancePositions: ['Cooktop', 'Oven tower', 'Dishwasher', 'Fridge'],
      benchtopScope: 'new',
      splashbackScope: 'new',
      demolitionAndRemoval: 'yes',
      makeGoodWork: 'yes',
      serviceChanges: {
        plumbing: 'sameLocation',
        electrical: 'sameLocation',
        gas: 'sameLocation',
        ventilation: 'sameLocation',
        lighting: 'sameLocation',
      },
      interfaces: {
        walls: 'no',
        floors: 'no',
        painting: 'no',
      },
      scopeNotes: 'Full cabinet replacement with new benchtop and same service locations.',
    });

    expect(result.overallLabel).toBe('Lower review risk');
    expect(result.recommendedPathway.href).toBe('/site-measure');
    expect(result.flags.map((flag) => flag.id)).toEqual(['site-measure-written-scope']);
    expect(result.safetyMessage).toContain('not legal advice');
  });
});
