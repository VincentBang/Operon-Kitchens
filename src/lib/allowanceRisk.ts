import { KitchenScopeInput } from './kitchenScope';

export type AllowanceRiskCategory =
  | 'scope'
  | 'allowance'
  | 'exclusion'
  | 'service'
  | 'access'
  | 'strata'
  | 'contract'
  | 'material'
  | 'siteCondition';

export type AllowanceRiskSeverity = 'helpful' | 'important' | 'humanReviewRecommended';

export interface AllowanceRiskFlag {
  id: string;
  category: AllowanceRiskCategory;
  label: string;
  reason: string;
  customerSafePrompt: string;
  severity: AllowanceRiskSeverity;
  requiresHumanReview: boolean;
}

export interface AllowanceRiskResult {
  overallLabel: 'Lower review risk' | 'Moderate review risk' | 'Human review recommended';
  explanation: string;
  flags: AllowanceRiskFlag[];
  missingInclusions: string[];
  customerQuestions: string[];
  recommendedPathway: {
    href: '/quote/review' | '/request-review' | '/site-measure';
    label: string;
    reason: string;
    humanReviewRecommended: boolean;
  };
  safetyMessage: 'Planning guidance only. Site measure and written scope confirmation are required before contract pricing. This is not legal advice.';
}

export const allowanceRiskSafetyMessage = 'Planning guidance only. Site measure and written scope confirmation are required before contract pricing. This is not legal advice.' as const;

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function serviceChangeEntries(input: KitchenScopeInput) {
  return Object.entries(input.serviceChanges).filter(([, value]) => value !== 'sameLocation');
}

function hasServiceReviewRisk(input: KitchenScopeInput) {
  return serviceChangeEntries(input).some(([, value]) => value === 'relocationLikely' || value === 'upgradeLikely' || value === 'unknown');
}

function hasApartmentOrStrataRisk(input: KitchenScopeInput) {
  return input.accessConstraints.some((item) => /apartment|strata|lift|restricted work hours/i.test(item));
}

function createFlag(flag: AllowanceRiskFlag): AllowanceRiskFlag {
  return flag;
}

export function evaluateAllowanceAndQuoteRisk(input: KitchenScopeInput): AllowanceRiskResult {
  const flags: AllowanceRiskFlag[] = [];
  const missingInclusions: string[] = [];
  const customerQuestions: string[] = [];

  if (input.appliancePositions.length === 0) {
    flags.push(createFlag({
      id: 'appliance-allowance',
      category: 'allowance',
      label: 'Appliance allowance unclear',
      reason: 'Appliance positions, model sizes and installation responsibilities can affect quote comparison.',
      customerSafePrompt: 'Ask whether appliances are excluded, included as allowances, or listed by exact model and connection requirement.',
      severity: 'important',
      requiresHumanReview: false,
    }));
    missingInclusions.push('Appliance supply, model sizes, installation and connection responsibilities');
    customerQuestions.push('Are appliances excluded, included as allowances, or listed by exact model and installation requirement?');
  }

  if (input.benchtopScope === 'notSure' || input.splashbackScope === 'notSure') {
    flags.push(createFlag({
      id: 'surface-allowance',
      category: 'material',
      label: 'Benchtop or splashback assumption unclear',
      reason: 'Surface materials, cut-outs, joins, edge details and restrictions should be checked before comparing totals.',
      customerSafePrompt: 'Ask for benchtop and splashback material, cut-out, join, edge and restriction review details in writing.',
      severity: 'important',
      requiresHumanReview: false,
    }));
    missingInclusions.push('Benchtop material, cut-outs, joins, edge details and splashback scope');
    customerQuestions.push('Does the quote state benchtop and splashback material, cut-outs, joins, edge details and material restriction review items?');
  }

  if (input.demolitionAndRemoval !== 'yes') {
    flags.push(createFlag({
      id: 'demolition-waste',
      category: 'exclusion',
      label: 'Demolition and waste removal need confirmation',
      reason: 'Removal, disposal, protection and clean-up are common quote-comparison gaps.',
      customerSafePrompt: 'Ask whether demolition, rubbish removal, protection and clean-up are included or excluded.',
      severity: 'humanReviewRecommended',
      requiresHumanReview: true,
    }));
    missingInclusions.push('Demolition, rubbish removal, protection and disposal');
    customerQuestions.push('Is demolition, rubbish removal, protection and final clean included or excluded?');
  }

  if (input.makeGoodWork !== 'yes' || input.interfaces.walls !== 'no' || input.interfaces.floors !== 'no' || input.interfaces.painting !== 'no') {
    flags.push(createFlag({
      id: 'make-good',
      category: 'scope',
      label: 'Make-good responsibilities may need review',
      reason: 'Wall, floor and painting interfaces can become unclear if they are not written into scope.',
      customerSafePrompt: 'Ask who is responsible for patching, floor interfaces, painting and make-good after removal or installation.',
      severity: 'important',
      requiresHumanReview: false,
    }));
    missingInclusions.push('Wall patching, floor interfaces, painting and make-good responsibilities');
    customerQuestions.push('Who is responsible for wall patching, floor interfaces, painting and make-good work?');
  }

  if (hasServiceReviewRisk(input)) {
    flags.push(createFlag({
      id: 'licensed-services',
      category: 'service',
      label: 'Licensed trade review may be needed',
      reason: 'Plumbing, electrical, gas, ventilation or lighting changes may require licensed trade confirmation.',
      customerSafePrompt: 'Ask whether licensed trades have reviewed the service scope before relying on the total.',
      severity: 'humanReviewRecommended',
      requiresHumanReview: true,
    }));
    missingInclusions.push('Licensed plumbing, electrical, gas, ventilation or lighting scope');
    customerQuestions.push('Is plumbing, electrical, gas, ventilation or lighting being moved, upgraded or reconnected by licensed trades?');
  }

  if (hasApartmentOrStrataRisk(input)) {
    flags.push(createFlag({
      id: 'apartment-access',
      category: 'strata',
      label: 'Apartment, strata or access review may be needed',
      reason: 'Apartment works can involve owners corporation review, lift booking, access protection, work-hour limits and class 2 screening.',
      customerSafePrompt: 'Ask what owners corporation, access, lift, parking and work-hour review items are allowed for.',
      severity: 'humanReviewRecommended',
      requiresHumanReview: true,
    }));
    missingInclusions.push('Owners corporation review, lift booking, parking, access protection and work-hour constraints');
    customerQuestions.push('Does the quote allow for owners corporation review, lift booking, access protection, parking and building work-hour rules?');
  }

  if (!input.roomLengthMm || !input.roomWidthMm || !input.openingNotes.trim()) {
    flags.push(createFlag({
      id: 'site-condition',
      category: 'siteCondition',
      label: 'Site-condition detail incomplete',
      reason: 'Rough dimensions and fixed openings help identify scope gaps before site measure.',
      customerSafePrompt: 'Prepare rough measurements, opening notes and photos before quote review or site measure.',
      severity: 'helpful',
      requiresHumanReview: false,
    }));
    missingInclusions.push('Rough dimensions, fixed openings and site-condition notes');
    customerQuestions.push('What dimensions, windows, doors, nib walls or fixed openings could affect the kitchen scope?');
  }

  flags.push(createFlag({
    id: 'site-measure-written-scope',
    category: 'contract',
    label: 'Site measure and written scope still required',
    reason: 'Project-specific pricing should follow site measure, selections and written scope confirmation.',
    customerSafePrompt: 'Ask for site measure, selections and written inclusions/exclusions before contract pricing.',
    severity: 'important',
    requiresHumanReview: false,
  }));
  customerQuestions.push('Does the provider require site measure, selections and written inclusions/exclusions before contract pricing?');

  const humanReviewFlagCount = flags.filter((flag) => flag.requiresHumanReview).length;
  const importantFlagCount = flags.filter((flag) => flag.severity === 'important').length;
  const overallLabel =
    humanReviewFlagCount > 0
      ? 'Human review recommended'
      : importantFlagCount >= 2
        ? 'Moderate review risk'
        : 'Lower review risk';

  const recommendedPathway =
    humanReviewFlagCount > 0
      ? {
          href: '/request-review' as const,
          label: 'Request review',
          reason: 'One or more allowance, service, access or exclusion prompts should be checked before relying on the scope.',
          humanReviewRecommended: true,
        }
      : importantFlagCount >= 2
        ? {
            href: '/quote/review' as const,
            label: 'Review quote details',
            reason: 'Use the customer questions to check inclusions, exclusions and allowance assumptions before comparing totals.',
            humanReviewRecommended: false,
          }
        : {
            href: '/site-measure' as const,
            label: 'Prepare for site measure',
            reason: 'The current risk prompts are limited, but project-specific pricing still needs site measure and written scope confirmation.',
            humanReviewRecommended: false,
          };

  return {
    overallLabel,
    explanation:
      overallLabel === 'Human review recommended'
        ? 'The scope includes items that commonly need human review before quote comparison or site-measure preparation.'
        : overallLabel === 'Moderate review risk'
          ? 'The scope has useful detail, but allowance, exclusion or site-condition questions should be clarified before relying on a quote total.'
          : 'The scope has fewer visible review prompts, subject to site measure and written scope confirmation.',
    flags,
    missingInclusions: unique(missingInclusions),
    customerQuestions: unique(customerQuestions),
    recommendedPathway,
    safetyMessage: allowanceRiskSafetyMessage,
  };
}
