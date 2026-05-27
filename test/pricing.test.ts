import { calculatePricing, QuoteInput } from '../src/lib/pricing';

describe('pricing engine', () => {
  it('calculates a simple straight-line kitchen correctly', () => {
    const input: QuoteInput = {
      measurementsProvided: true,
      photosProvided: true,
      layoutChange: false,
      propertyLevel: 'ground',
      hasLift: true,
      parkingAccess: 'good',
      baseLinearMetres: 3,
      overheadLinearMetres: 2,
      tallCabinetQty: 0,
      drawerQty: 2,
      doorQty: 6,
      panelQty: 4,
      drawerRunnerLevel: 'standard',
      hingeLevel: 'standard',
      doorFinish: 'melamine',
      panelFinish: 'melamine',
      selectedAccessories: [],
      benchtopType: 'laminate',
      benchtopMetres: 3,
      splashbackType: 'tile',
      splashbackArea: 2,
      trades: { plumbing: false, electrical: false, gas: false, tiling: false, painting: false },
      highRiskItems: false,
    };
    const result = calculatePricing(input);
    expect(result.total).toBeGreaterThan(0);
    expect(result.confidenceLevel).toBe('high');
  });
});