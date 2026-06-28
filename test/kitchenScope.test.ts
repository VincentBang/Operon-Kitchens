import {
  calculateMissingKitchenScopeItems,
  createKitchenScopeSummary,
  defaultKitchenScopeInput,
  evaluateKitchenScope,
  recommendKitchenScopeNextStep,
  validateKitchenScopeRequiredFields,
} from '../src/lib/kitchenScope';

describe('kitchen scope builder logic', () => {
  it('validates required layout, cabinet zone and scope note without numeric scoring', () => {
    const errors = validateKitchenScopeRequiredFields(defaultKitchenScopeInput);
    const result = evaluateKitchenScope(defaultKitchenScopeInput);

    expect(errors.layoutType).toMatch(/layout/i);
    expect(errors.cabinetZones).toMatch(/cabinet/i);
    expect(errors.scopeNotes).toMatch(/scope note/i);
    expect(result.readiness.label).toBe('Scope starting point');
    expect(JSON.stringify(result)).not.toContain('0/100');
  });

  it('summarises only entered scope facts', () => {
    const summary = createKitchenScopeSummary({
      ...defaultKitchenScopeInput,
      layoutType: 'lShape',
      roomLengthMm: '3200',
      roomWidthMm: '2400',
      cabinetZones: ['Base cabinets', 'Pantry'],
      appliancePositions: ['Cooktop'],
      benchtopScope: 'new',
      scopeNotes: 'New cabinets and benchtop with appliance position review.',
    });

    expect(summary).toEqual(expect.arrayContaining([
      { label: 'Layout type', value: 'L-shape' },
      { label: 'Room dimensions', value: '3200mm x 2400mm' },
      { label: 'Cabinet zones', value: 'Base cabinets, Pantry' },
      { label: 'Benchtop scope', value: 'New surface included' },
    ]));
    expect(summary.map((item) => item.value).join(' ')).not.toContain('supplier');
  });

  it('groups missing scope items for measurement, services and site measure preparation', () => {
    const missing = calculateMissingKitchenScopeItems(defaultKitchenScopeInput);
    const groups = new Set(missing.map((item) => item.group));

    expect(Array.from(groups)).toEqual(expect.arrayContaining([
      'measurements',
      'cabinetry',
      'appliancesAndSurfaces',
      'worksAndServices',
      'accessAndSiteMeasure',
    ]));
    expect(missing.some((item) => item.severity === 'reviewRecommended')).toBe(true);
  });

  it('recommends human review when service relocation or access risk is present', () => {
    const nextStep = recommendKitchenScopeNextStep({
      ...defaultKitchenScopeInput,
      layoutType: 'galley',
      cabinetZones: ['Base cabinets'],
      appliancePositions: ['Cooktop'],
      benchtopScope: 'new',
      splashbackScope: 'new',
      demolitionAndRemoval: 'yes',
      makeGoodWork: 'yes',
      serviceChanges: {
        ...defaultKitchenScopeInput.serviceChanges,
        plumbing: 'relocationLikely',
      },
      scopeNotes: 'Galley kitchen with sink relocation review.',
    });

    expect(nextStep.href).toBe('/request-review');
    expect(nextStep.humanReviewRecommended).toBe(true);
  });

  it('recommends human review when apartment or strata review is selected', () => {
    const nextStep = recommendKitchenScopeNextStep({
      ...defaultKitchenScopeInput,
      layoutType: 'galley',
      cabinetZones: ['Base cabinets'],
      appliancePositions: ['Cooktop'],
      benchtopScope: 'new',
      splashbackScope: 'new',
      demolitionAndRemoval: 'yes',
      makeGoodWork: 'yes',
      accessConstraints: ['Apartment or strata review'],
      scopeNotes: 'Apartment kitchen with access and strata review prompts.',
    });

    expect(nextStep.href).toBe('/request-review');
    expect(nextStep.humanReviewRecommended).toBe(true);
  });

  it('recommends site measure when scope is detailed enough', () => {
    const result = evaluateKitchenScope({
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
      accessConstraints: ['Parking or loading concern'],
      scopeNotes: 'Full cabinet replacement with new benchtop and same service locations.',
    });

    expect(result.readiness.label).toBe('Ready for site-measure prep');
    expect(result.recommendedNextStep.href).toBe('/site-measure');
    expect(result.siteMeasurePreparation.join(' ')).toMatch(/written inclusions/i);
  });
});
