import { QuoteInput, PricingResult } from '@/lib/pricing';

export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationType = 'budget' | 'design' | 'compliance' | 'confidence' | 'material';

export interface RecommendationPreferences {
  maxBudget?: number;
  preferredStyle?: 'classic' | 'modern' | 'warm' | 'minimal' | 'unsure';
  durabilityPriority?: 'standard' | 'family' | 'rental' | 'premium';
}

export interface KitchenRecommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  reason: string;
  action: string;
}

function pushUnique(items: KitchenRecommendation[], item: KitchenRecommendation) {
  if (!items.some((existing) => existing.id === item.id)) {
    items.push(item);
  }
}

export function createKitchenRecommendations(
  input: QuoteInput,
  result: PricingResult,
  preferences: RecommendationPreferences = {},
): KitchenRecommendation[] {
  const recommendations: KitchenRecommendation[] = [];

  if (preferences.maxBudget && result.estimateHigh > preferences.maxBudget) {
    pushUnique(recommendations, {
      id: 'budget-stage-scope',
      type: 'budget',
      priority: 'high',
      title: 'Stage the scope before requesting price confirmation',
      reason: 'The current estimate range sits above the budget preference supplied for planning.',
      action: 'Keep the base kitchen scope visible, then separate optional upgrades such as extra zones, lighting, accessories or flooring for manual review.',
    });
  }

  if (result.confidenceScore < 70) {
    pushUnique(recommendations, {
      id: 'confidence-more-evidence',
      type: 'confidence',
      priority: result.confidenceScore < 40 ? 'high' : 'medium',
      title: 'Improve estimate confidence with photos, measurements and plans',
      reason: 'The current scope has missing information or risk items that widen the estimate range.',
      action: 'Add wall-to-wall measurements in millimetres, appliance locations, photos of services and any strata or building documentation before professional review.',
    });
  }

  if (input.propertyType === 'strataApartment' || input.strataApprovalRequired || input.dbpReviewRequired) {
    pushUnique(recommendations, {
      id: 'strata-approval-path',
      type: 'compliance',
      priority: 'high',
      title: 'Prepare strata and apartment approval checks early',
      reason: 'Apartment kitchens can require strata, access, noise, waterproofing and class 2 building review before work starts.',
      action: 'Collect strata rules, renovation by-laws, lift booking requirements and any DBP/BASIX documents for confirmation.',
    });
  }

  if (result.hbcRequired || result.depositWarning) {
    pushUnique(recommendations, {
      id: 'contract-compliance-review',
      type: 'compliance',
      priority: 'high',
      title: 'Keep deposit and HBC checks in the review workflow',
      reason: 'NSW residential work over relevant thresholds needs contract and insurance confirmation before money is taken or work commences.',
      action: 'Use the estimate as a planning guide only and confirm contract terms, deposit and HBC documents before proceeding.',
    });
  }

  if (
    result.materialCompliance.benchtop.status === 'banned' ||
    result.materialCompliance.splashback.status === 'banned'
  ) {
    pushUnique(recommendations, {
      id: 'replace-engineered-stone',
      type: 'material',
      priority: 'high',
      title: 'Replace restricted engineered stone with supplier-confirmed alternatives',
      reason: 'The selected material needs review under engineered-stone restrictions.',
      action: 'Shortlist porcelain, stainless steel, laminate, timber or supplier-confirmed low-silica composite options before quote review.',
    });
  }

  if (preferences.durabilityPriority === 'family' || preferences.durabilityPriority === 'rental') {
    pushUnique(recommendations, {
      id: 'durable-finishes',
      type: 'material',
      priority: 'medium',
      title: 'Prioritise durable, easy-service finishes',
      reason: 'High-use kitchens benefit from hard-wearing surfaces, replaceable hardware and simpler maintenance.',
      action: 'Compare laminate or porcelain benchtops, soft-close hardware and replaceable door/panel finishes during selection review.',
    });
  }

  if (preferences.preferredStyle === 'warm') {
    pushUnique(recommendations, {
      id: 'warm-palette-balance',
      type: 'design',
      priority: 'low',
      title: 'Balance warm finishes with durable work surfaces',
      reason: 'Warm kitchens can feel premium without relying on high-risk or hard-to-maintain materials.',
      action: 'Pair timber-look cabinetry or handles with supplier-confirmed stone-look porcelain, stainless accents or a restrained splashback.',
    });
  }

  if (input.designPlan === null) {
    pushUnique(recommendations, {
      id: 'attach-design-plan',
      type: 'design',
      priority: 'medium',
      title: 'Attach a design sketch for a tighter review',
      reason: 'A simple room sketch helps identify cabinetry lengths, appliance positions and access constraints.',
      action: 'Use the design planner or upload drawings/photos before the quote is reviewed.',
    });
  }

  return recommendations.sort((a, b) => {
    const rank: Record<RecommendationPriority, number> = { high: 0, medium: 1, low: 2 };
    return rank[a.priority] - rank[b.priority];
  });
}
