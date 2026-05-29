import { PricingResult, QuoteInput } from '@/lib/pricing';

export type KitchenLeadScoreLabel = 'hot' | 'medium' | 'low';

export interface KitchenLeadScore {
  score: number;
  label: KitchenLeadScoreLabel;
  reasons: string[];
  recommendedFollowUp: string;
}

const premiumSuburbs = ['mosman', 'vaucluse', 'double bay', 'bellevue hill', 'woollahra', 'rose bay', 'neutral bay', 'manly', 'wahroonga', 'pymble', 'killara', 'hunters hill'];

export function scoreKitchenLead(input: QuoteInput, pricing?: Pick<PricingResult, 'confidenceScore' | 'manualReviewFlags' | 'complianceFlags'>): KitchenLeadScore {
  let score = 20;
  const reasons: string[] = [];
  const suburb = input.suburb.trim().toLowerCase();

  if (premiumSuburbs.some((area) => suburb.includes(area))) {
    score += 12;
    reasons.push('Priority Sydney suburb.');
  }
  if (input.projectType === 'fullRenovation') {
    score += 12;
    reasons.push('Full renovation scope.');
  }
  if (input.roughTiming === 'readySoon' || input.roughTiming === 'urgent') {
    score += 14;
    reasons.push('Near-term project timing.');
  }
  if (input.budgetBand === '45kTo70k' || input.budgetBand === '70kPlus') {
    score += 14;
    reasons.push('Higher stated budget band.');
  }
  if (input.hasExistingQuote || input.supportingFiles.some((file) => file.category === 'currentQuote')) {
    score += 10;
    reasons.push('Existing quote available for review.');
  }
  if (input.photosProvided || input.supportingFiles.some((file) => file.category === 'photo' || file.category === 'plan')) {
    score += 8;
    reasons.push('Photos or plans supplied.');
  }
  if (pricing && pricing.confidenceScore >= 70) {
    score += 8;
    reasons.push('Estimate information is reasonably complete.');
  }
  if (input.propertyType === 'strataApartment' || input.strataApprovalRequired) {
    score += 5;
    reasons.push('Apartment or strata review need.');
  }
  if (input.preferredContactMethod && input.preferredContactMethod !== 'either') {
    score += 3;
    reasons.push('Preferred contact method supplied.');
  }
  if (pricing && pricing.manualReviewFlags.length + pricing.complianceFlags.length > 5) {
    score += 4;
    reasons.push('Clear professional review need.');
  }

  const normalizedScore = Math.min(100, score);
  const label: KitchenLeadScoreLabel = normalizedScore >= 70 ? 'hot' : normalizedScore >= 45 ? 'medium' : 'low';
  const recommendedFollowUp =
    label === 'hot'
      ? 'Prioritise same-day follow-up and request photos, quote files or site-measure availability.'
      : label === 'medium'
        ? 'Follow up with a scope clarification email and invite the customer to add photos or quote files.'
        : 'Send education content and prompt the customer to complete more project details.';

  return {
    score: normalizedScore,
    label,
    reasons: reasons.length ? reasons : ['Early-stage lead with limited project detail.'],
    recommendedFollowUp,
  };
}
