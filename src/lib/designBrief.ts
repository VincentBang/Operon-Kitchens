export type DesignBriefPropertyType = 'house' | 'townhouse' | 'apartment' | 'strataApartment' | 'notSure';
export type DesignBriefRenovationStage = 'earlyPlanning' | 'preparingForQuotes' | 'quoteInHand' | 'comparingQuotes' | 'readyForMeasure' | 'notSure';
export type DesignBriefYesNoUnsure = 'yes' | 'no' | 'notSure';
export type DesignBriefQuoteStatus = 'none' | 'oneQuote' | 'multipleQuotes' | 'notSure';
export type DesignBriefPathwayType = 'quote' | 'quoteReview' | 'requestReview' | 'siteMeasure';
export type DesignBriefReadinessState = 'gettingStarted' | 'coreContextAdded' | 'moreScopeDetailWouldHelp' | 'readyForNextPlanningStep';

export interface DesignBriefInput {
  suburbOrPostcode: string;
  propertyType: DesignBriefPropertyType;
  occupantRole: 'ownerOccupier' | 'investor' | 'representative' | 'notSure';
  renovationStage: DesignBriefRenovationStage;
  timingRange: 'researching' | 'oneToThreeMonths' | 'readySoon' | 'urgent' | 'notSure';
  existingQuoteStatus: DesignBriefQuoteStatus;
  currentKitchenProblems: string;
  mustHaveOutcomes: string[];
  preferredLayoutDirection: 'sameLayout' | 'openToChange' | 'needsAdvice' | 'notSure';
  styleDirection: string;
  storagePriorities: string[];
  applianceIntentions: string[];
  roughBudgetRange: string;
  informationAvailable: {
    measurements: DesignBriefYesNoUnsure;
    roughPlan: DesignBriefYesNoUnsure;
    photos: DesignBriefYesNoUnsure;
    writtenQuote: DesignBriefYesNoUnsure;
    applianceSpecs: DesignBriefYesNoUnsure;
  };
  propertyAndAccess: {
    strataOrApartment: DesignBriefYesNoUnsure;
    liftAccess: DesignBriefYesNoUnsure;
    parkingConcern: DesignBriefYesNoUnsure;
    restrictedWorkHours: DesignBriefYesNoUnsure;
    knownApprovalRequirement: DesignBriefYesNoUnsure;
    knownStructuralChange: DesignBriefYesNoUnsure;
    knownServiceRelocation: DesignBriefYesNoUnsure;
  };
}

export interface MissingInformationItem {
  id: string;
  group: 'propertyAndAccess' | 'measurementsAndPlans' | 'appliancesAndServices' | 'scopeAndFinishes' | 'quoteAndSiteMeasureReadiness';
  label: string;
  reason: string;
  requiredFor: DesignBriefPathwayType[];
  severity: 'helpful' | 'important' | 'reviewRecommended';
}

export interface DesignBriefSummaryItem {
  label: string;
  value: string;
}

export interface RecommendedDesignBriefPathway {
  primary: {
    type: DesignBriefPathwayType;
    href: '/quote' | '/quote/review' | '/request-review' | '/site-measure';
    label: string;
    reason: string;
  };
  secondary: Array<{
    type: DesignBriefPathwayType;
    href: '/quote' | '/quote/review' | '/request-review' | '/site-measure';
    label: string;
    reason: string;
  }>;
  humanReviewRecommended: boolean;
  safetyMessage: 'Site measure and written scope confirmation are required before contract pricing.';
}

export interface DesignBriefResult {
  summary: DesignBriefSummaryItem[];
  missingInformation: MissingInformationItem[];
  readiness: {
    state: DesignBriefReadinessState;
    label: string;
    explanation: string;
  };
  pathway: RecommendedDesignBriefPathway;
}

export const defaultDesignBriefInput: DesignBriefInput = {
  suburbOrPostcode: '',
  propertyType: 'notSure',
  occupantRole: 'notSure',
  renovationStage: 'earlyPlanning',
  timingRange: 'notSure',
  existingQuoteStatus: 'none',
  currentKitchenProblems: '',
  mustHaveOutcomes: [],
  preferredLayoutDirection: 'notSure',
  styleDirection: '',
  storagePriorities: [],
  applianceIntentions: [],
  roughBudgetRange: '',
  informationAvailable: {
    measurements: 'notSure',
    roughPlan: 'notSure',
    photos: 'notSure',
    writtenQuote: 'notSure',
    applianceSpecs: 'notSure',
  },
  propertyAndAccess: {
    strataOrApartment: 'notSure',
    liftAccess: 'notSure',
    parkingConcern: 'notSure',
    restrictedWorkHours: 'notSure',
    knownApprovalRequirement: 'notSure',
    knownStructuralChange: 'notSure',
    knownServiceRelocation: 'notSure',
  },
};

export const designBriefSafetyMessage = 'Site measure and written scope confirmation are required before contract pricing.' as const;
export const designBriefLegalMessage = 'Planning guidance only. This is not legal advice.';

const propertyTypeLabels: Record<DesignBriefPropertyType, string> = {
  house: 'House',
  townhouse: 'Townhouse',
  apartment: 'Apartment',
  strataApartment: 'Strata apartment',
  notSure: 'Not sure',
};

const renovationStageLabels: Record<DesignBriefRenovationStage, string> = {
  earlyPlanning: 'Early planning',
  preparingForQuotes: 'Preparing for quotes',
  quoteInHand: 'Quote in hand',
  comparingQuotes: 'Comparing quotes',
  readyForMeasure: 'Ready for site measure',
  notSure: 'Not sure',
};

const quoteStatusLabels: Record<DesignBriefQuoteStatus, string> = {
  none: 'No written quote yet',
  oneQuote: 'One written quote',
  multipleQuotes: 'Comparing multiple quotes',
  notSure: 'Not sure',
};

function cleanText(value: string, maxLength = 180) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function listValue(values: string[]) {
  return values.length ? values.join(', ') : '';
}

function isYes(value: DesignBriefYesNoUnsure) {
  return value === 'yes';
}

function isRiskyOrComplex(input: DesignBriefInput) {
  return (
    input.propertyType === 'strataApartment' ||
    input.propertyType === 'apartment' ||
    isYes(input.propertyAndAccess.strataOrApartment) ||
    isYes(input.propertyAndAccess.liftAccess) ||
    isYes(input.propertyAndAccess.parkingConcern) ||
    isYes(input.propertyAndAccess.restrictedWorkHours) ||
    isYes(input.propertyAndAccess.knownApprovalRequirement) ||
    isYes(input.propertyAndAccess.knownStructuralChange) ||
    isYes(input.propertyAndAccess.knownServiceRelocation)
  );
}

function hasWrittenQuote(input: DesignBriefInput) {
  return input.existingQuoteStatus === 'oneQuote' || input.existingQuoteStatus === 'multipleQuotes' || isYes(input.informationAvailable.writtenQuote);
}

function hasMeasureReadyInfo(input: DesignBriefInput) {
  return (
    input.renovationStage === 'readyForMeasure' &&
    isYes(input.informationAvailable.measurements) &&
    (isYes(input.informationAvailable.roughPlan) || isYes(input.informationAvailable.photos)) &&
    cleanText(input.currentKitchenProblems, 20).length > 0
  );
}

export function validateDesignBriefRequiredFields(input: DesignBriefInput) {
  const errors: Partial<Record<'suburbOrPostcode' | 'propertyType' | 'renovationStage' | 'existingQuoteStatus' | 'currentKitchenProblems', string>> = {};
  if (!cleanText(input.suburbOrPostcode, 80)) errors.suburbOrPostcode = 'Add a suburb or postcode so the brief can account for Sydney access context.';
  if (input.propertyType === 'notSure') errors.propertyType = 'Choose the closest property type, or keep not sure and add access notes later.';
  if (input.renovationStage === 'notSure') errors.renovationStage = 'Choose the closest project stage.';
  if (input.existingQuoteStatus === 'notSure') errors.existingQuoteStatus = 'Choose whether you already have a written quote.';
  if (!cleanText(input.currentKitchenProblems, 280)) errors.currentKitchenProblems = 'Describe the main kitchen problem or reason for renovating.';
  return errors;
}

export function createDesignBriefSummary(input: DesignBriefInput): DesignBriefSummaryItem[] {
  return [
    ['Suburb or postcode', cleanText(input.suburbOrPostcode, 80)],
    ['Property type', propertyTypeLabels[input.propertyType]],
    ['Project stage', renovationStageLabels[input.renovationStage]],
    ['Existing quote status', quoteStatusLabels[input.existingQuoteStatus]],
    ['Current kitchen problem', cleanText(input.currentKitchenProblems, 280)],
    ['Must-have outcomes', listValue(input.mustHaveOutcomes)],
    ['Style direction', cleanText(input.styleDirection, 120)],
    ['Storage priorities', listValue(input.storagePriorities)],
    ['Appliance intentions', listValue(input.applianceIntentions)],
    ['Budget range', cleanText(input.roughBudgetRange, 80)],
  ]
    .filter(([, value]) => Boolean(value && value !== 'Not sure'))
    .map(([label, value]) => ({ label, value }));
}

export function calculateMissingDesignBriefInformation(input: DesignBriefInput): MissingInformationItem[] {
  const missing: MissingInformationItem[] = [];
  if (!cleanText(input.suburbOrPostcode, 80) || input.propertyType === 'notSure') {
    missing.push({
      id: 'property-context',
      group: 'propertyAndAccess',
      label: 'Property and suburb context',
      reason: 'Suburb and property type help screen access, apartment and site-measure needs.',
      requiredFor: ['quote', 'requestReview', 'siteMeasure'],
      severity: 'important',
    });
  }
  if (input.propertyAndAccess.strataOrApartment === 'notSure' || input.propertyAndAccess.parkingConcern === 'notSure') {
    missing.push({
      id: 'access-constraints',
      group: 'propertyAndAccess',
      label: 'Access, parking and building constraints',
      reason: 'These can affect site measure preparation and whether human review is safer.',
      requiredFor: ['requestReview', 'siteMeasure'],
      severity: 'reviewRecommended',
    });
  }
  if (!isYes(input.informationAvailable.measurements)) {
    missing.push({
      id: 'measurements',
      group: 'measurementsAndPlans',
      label: 'Approximate measurements',
      reason: 'Room or wall measurements help prepare the next estimate or site-measure conversation.',
      requiredFor: ['quote', 'siteMeasure'],
      severity: 'important',
    });
  }
  if (!isYes(input.informationAvailable.roughPlan) && !isYes(input.informationAvailable.photos)) {
    missing.push({
      id: 'plans-or-photos',
      group: 'measurementsAndPlans',
      label: 'Photos or a rough plan',
      reason: 'Visual context improves review confidence, but file upload is not required for this planning step.',
      requiredFor: ['requestReview', 'siteMeasure'],
      severity: 'helpful',
    });
  }
  if (input.applianceIntentions.length === 0 || input.informationAvailable.applianceSpecs === 'notSure') {
    missing.push({
      id: 'appliance-intentions',
      group: 'appliancesAndServices',
      label: 'Appliance and service intentions',
      reason: 'Appliance sizes, connection needs and service relocation can change review risk.',
      requiredFor: ['requestReview', 'siteMeasure'],
      severity: 'important',
    });
  }
  if (input.propertyAndAccess.knownServiceRelocation === 'notSure') {
    missing.push({
      id: 'service-relocation',
      group: 'appliancesAndServices',
      label: 'Service relocation uncertainty',
      reason: 'Plumbing, electrical and gas movement may require licensed trade review.',
      requiredFor: ['requestReview', 'siteMeasure'],
      severity: 'reviewRecommended',
    });
  }
  if (!cleanText(input.currentKitchenProblems, 280) || input.mustHaveOutcomes.length === 0) {
    missing.push({
      id: 'goals-and-outcomes',
      group: 'scopeAndFinishes',
      label: 'Kitchen goals and must-have outcomes',
      reason: 'Clear goals help separate a refresh, full renovation or apartment kitchen pathway.',
      requiredFor: ['quote', 'requestReview'],
      severity: 'important',
    });
  }
  if (!cleanText(input.styleDirection, 120) || input.preferredLayoutDirection === 'notSure') {
    missing.push({
      id: 'style-and-layout',
      group: 'scopeAndFinishes',
      label: 'Style and layout direction',
      reason: 'This helps prepare selection and written-scope conversations later.',
      requiredFor: ['quote', 'siteMeasure'],
      severity: 'helpful',
    });
  }
  if (input.existingQuoteStatus === 'notSure' || (hasWrittenQuote(input) && !isYes(input.informationAvailable.writtenQuote))) {
    missing.push({
      id: 'quote-readiness',
      group: 'quoteAndSiteMeasureReadiness',
      label: 'Written quote details',
      reason: 'Written quote details help decide whether quote review or request review is the better next step.',
      requiredFor: ['quoteReview', 'requestReview'],
      severity: 'important',
    });
  }
  if (input.renovationStage !== 'readyForMeasure' && !hasWrittenQuote(input)) {
    missing.push({
      id: 'site-measure-readiness',
      group: 'quoteAndSiteMeasureReadiness',
      label: 'Site-measure readiness',
      reason: 'The brief can route you better when timing, measurements and available information are clearer.',
      requiredFor: ['siteMeasure'],
      severity: 'helpful',
    });
  }
  return missing;
}

export function getDesignBriefReadinessState(input: DesignBriefInput, missing = calculateMissingDesignBriefInformation(input)) {
  const coreFields = [
    cleanText(input.suburbOrPostcode, 80),
    input.propertyType !== 'notSure' ? input.propertyType : '',
    input.renovationStage !== 'notSure' ? input.renovationStage : '',
    input.existingQuoteStatus !== 'notSure' ? input.existingQuoteStatus : '',
    cleanText(input.currentKitchenProblems, 280),
  ].filter(Boolean).length;

  if (coreFields <= 2) {
    return {
      state: 'gettingStarted' as const,
      label: 'Getting started',
      explanation: 'Add the core property, project stage and kitchen goal details before choosing a pathway.',
    };
  }
  if (coreFields < 5) {
    return {
      state: 'coreContextAdded' as const,
      label: 'Core context added',
      explanation: 'The brief has useful context, but a few core answers still need clarification.',
    };
  }
  if (missing.some((item) => item.severity === 'reviewRecommended' || item.severity === 'important')) {
    return {
      state: 'moreScopeDetailWouldHelp' as const,
      label: 'More scope detail would help',
      explanation: 'The brief can suggest a pathway, but access, measurements, services or quote details would improve review confidence.',
    };
  }
  return {
    state: 'readyForNextPlanningStep' as const,
    label: 'Ready for the next planning step',
    explanation: 'The brief has enough detail to choose a practical next step while still requiring site measure and written scope confirmation.',
  };
}

export function recommendDesignBriefPathway(input: DesignBriefInput): RecommendedDesignBriefPathway {
  const complex = isRiskyOrComplex(input);
  const quoteSupplied = hasWrittenQuote(input);
  const measureReady = hasMeasureReadyInfo(input);

  if (complex) {
    return {
      primary: {
        type: 'requestReview',
        href: '/request-review',
        label: 'Request review',
        reason: 'Apartment, strata, access, structural or service-relocation details are better checked by a person before relying on an automated pathway.',
      },
      secondary: quoteSupplied
        ? [{ type: 'quoteReview', href: '/quote/review', label: 'Review existing quote', reason: 'Use quote review if you already have written quote details to compare.' }]
        : [{ type: 'quote', href: '/quote', label: 'Start kitchen estimate', reason: 'Use the estimate when you want a planning range before review.' }],
      humanReviewRecommended: true,
      safetyMessage: designBriefSafetyMessage,
    };
  }

  if (quoteSupplied) {
    return {
      primary: {
        type: 'quoteReview',
        href: '/quote/review',
        label: 'Review existing quote',
        reason: 'A written quote should be checked for inclusions, exclusions, PC sums, provisional sums and site-measure assumptions before comparing totals.',
      },
      secondary: [{ type: 'requestReview', href: '/request-review', label: 'Request review', reason: 'Request review if you want Operon Kitchens to check the scope pathway.' }],
      humanReviewRecommended: false,
      safetyMessage: designBriefSafetyMessage,
    };
  }

  if (measureReady) {
    return {
      primary: {
        type: 'siteMeasure',
        href: '/site-measure',
        label: 'Prepare for site measure',
        reason: 'Your brief indicates measurements, visual context and project intent are ready for site-specific review.',
      },
      secondary: [{ type: 'requestReview', href: '/request-review', label: 'Request review', reason: 'Request review if you want the next step checked before booking site measure.' }],
      humanReviewRecommended: false,
      safetyMessage: designBriefSafetyMessage,
    };
  }

  return {
    primary: {
      type: 'quote',
      href: '/quote',
      label: 'Start kitchen estimate',
      reason: 'You are still in planning mode, so a planning estimate can help frame range, assumptions and review flags.',
    },
    secondary: [{ type: 'requestReview', href: '/request-review', label: 'Request review', reason: 'Request review if you want help deciding what information to prepare next.' }],
    humanReviewRecommended: false,
    safetyMessage: designBriefSafetyMessage,
  };
}

export function evaluateDesignBrief(input: DesignBriefInput): DesignBriefResult {
  const missingInformation = calculateMissingDesignBriefInformation(input);
  return {
    summary: createDesignBriefSummary(input),
    missingInformation,
    readiness: getDesignBriefReadinessState(input, missingInformation),
    pathway: recommendDesignBriefPathway(input),
  };
}

export function isDesignBriefEnabled() {
  return process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF === 'true';
}
