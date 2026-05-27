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

describe('NSW deposit and HBC compliance guidance', () => {
  it('calculates the recommended maximum deposit as 10 percent of total', () => {
    const result = calculatePricing(baseInput);
    expect(result.recommendedDepositPercent).toBe(10);
    expect(result.recommendedDeposit).toBeCloseTo(result.total * 0.1, 2);
    expect(result.depositWarning).toBeNull();
  });

  it('warns when the proposed deposit percentage exceeds 10 percent', () => {
    const result = calculatePricing({ ...baseInput, depositOfferedPercent: 15 });
    expect(result.depositWarning).toContain('15.0%');
    expect(result.complianceFlags).toContain('Proposed deposit exceeds 10% guidance');
  });

  it('warns when the proposed deposit amount exceeds 10 percent of the estimate', () => {
    const baseline = calculatePricing(baseInput);
    const result = calculatePricing({ ...baseInput, depositOfferedAmount: baseline.recommendedDeposit + 100 });
    expect(result.depositWarning).toContain('NSW home building deposit guidance');
  });

  it('flags HBC insurance when the estimate exceeds $20,000 including GST', () => {
    const result = calculatePricing({
      ...baseInput,
      baseLinearMetres: 10,
      overheadLinearMetres: 8,
      tallCabinetQty: 4,
      benchtopMetres: 8,
      trades: { plumbing: true, electrical: true, gas: true, tiling: true, painting: true },
    });

    expect(result.total).toBeGreaterThan(20000);
    expect(result.hbcRequired).toBe(true);
    expect(result.hbcWarning).toContain('Home Building Compensation');
    expect(result.complianceFlags).toContain('HBC likely required if residential work exceeds $20,000 including GST');
  });

  it('clears the HBC warning when required cover is marked included and confirmed', () => {
    const result = calculatePricing({
      ...baseInput,
      baseLinearMetres: 10,
      overheadLinearMetres: 8,
      tallCabinetQty: 4,
      benchtopMetres: 8,
      hbcInsuranceIncluded: true,
      hbcCertificateConfirmed: true,
      trades: { plumbing: true, electrical: true, gas: true, tiling: true, painting: true },
    });

    expect(result.hbcRequired).toBe(true);
    expect(result.hbcWarning).toBeNull();
    expect(result.complianceFlags).not.toContain('HBC cover not confirmed');
  });
});
