import baseRateCard from '../src/data/rateCard.json';
import { calculatePricing, QuoteInput } from '../src/lib/pricing';
import { defaultQuoteInput } from '../src/lib/quoteDefaults';
import { activateRateCard, createRateCard, getActiveRateCard, getActiveRateCardData } from '../src/lib/rateCards';

const quoteInput: QuoteInput = {
  ...defaultQuoteInput,
  measurementsProvided: true,
  photosProvided: true,
  baseLinearMetres: 3,
};

describe('rate card management', () => {
  it('uses the active rate card for new pricing calculations', () => {
    const previousActive = getActiveRateCard();
    const editedRateCard = {
      ...baseRateCard,
      cabinetry: {
        ...baseRateCard.cabinetry,
        baseRate: baseRateCard.cabinetry.baseRate + 250,
      },
    };

    const created = createRateCard({
      name: `test-rate-card-${Date.now()}`,
      version: `test-${Date.now()}`,
      data: editedRateCard,
      isActive: true,
    });

    expect(created?.isActive).toBe(true);
    expect(getActiveRateCardData().cabinetry.baseRate).toBe(editedRateCard.cabinetry.baseRate);

    const originalResult = calculatePricing(quoteInput, baseRateCard);
    const activeResult = calculatePricing(quoteInput, getActiveRateCardData());
    expect(activeResult.total).toBeGreaterThan(originalResult.total);

    activateRateCard(previousActive.id);
  });
});
