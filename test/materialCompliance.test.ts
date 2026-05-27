import { getMaterialCompliance, transitionProvisionApplies } from '../src/lib/materialCompliance';
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

describe('engineered-stone material compliance', () => {
  it('marks engineered stone over 1 percent crystalline silica as banned', () => {
    const material = getMaterialCompliance('benchtop', 'engineeredStone');
    expect(material.status).toBe('banned');
    expect(material.silicaLabel).toContain('>1%');
    expect(material.alternatives).toContain('Stainless steel');
  });

  it('does not flag ordinary compliant alternatives as banned', () => {
    expect(getMaterialCompliance('benchtop', 'porcelain').status).toBe('allowed');
    expect(getMaterialCompliance('splashback', 'stainless').status).toBe('allowed');
  });

  it('adds quote compliance flags for banned benchtop selections', () => {
    const result = calculatePricing({ ...baseInput, benchtopType: 'engineeredStone' });
    expect(result.materialCompliance.benchtop.status).toBe('banned');
    expect(result.complianceFlags).toContain('Engineered stone is restricted under the engineered stone restriction');
  });

  it('adds quote compliance flags for banned splashback selections', () => {
    const result = calculatePricing({ ...baseInput, splashbackType: 'engineeredStone' });
    expect(result.materialCompliance.splashback.status).toBe('banned');
    expect(result.complianceFlags).toContain('Engineered stone slab is restricted under the engineered stone restriction');
  });

  it('requires all transition dates before transition provision applies', () => {
    expect(transitionProvisionApplies({
      engineeredStoneTransitionClaimed: true,
      engineeredStoneContractBefore2023End: true,
      engineeredStoneInstallBefore2024End: false,
    })).toBe(false);

    expect(transitionProvisionApplies({
      engineeredStoneTransitionClaimed: true,
      engineeredStoneContractBefore2023End: true,
      engineeredStoneInstallBefore2024End: true,
    })).toBe(true);
  });

  it('flags transition claims for manual documentation review', () => {
    const result = calculatePricing({
      ...baseInput,
      benchtopType: 'engineeredStone',
      engineeredStoneTransitionClaimed: true,
      engineeredStoneContractBefore2023End: true,
      engineeredStoneInstallBefore2024End: true,
    });

    expect(result.materialCompliance.transitionProvisionApplies).toBe(true);
    expect(result.complianceFlags).toContain('Engineered stone transition claim requires manual documentation review');
  });
});
