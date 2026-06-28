import { DesignBriefYesNoUnsure } from './designBrief';

export type KitchenScopeLayoutType = 'straight' | 'lShape' | 'uShape' | 'galley' | 'island' | 'peninsula' | 'notSure';
export type KitchenScopeSurfaceScope = 'none' | 'replace' | 'new' | 'notSure';
export type KitchenScopeServiceChange = 'sameLocation' | 'relocationLikely' | 'upgradeLikely' | 'unknown';
export type KitchenScopeReadinessState = 'scopeStartingPoint' | 'coreScopeCaptured' | 'measureReadyDetailNeeded' | 'readyForSiteMeasurePrep';

export interface KitchenScopeInput {
  layoutType: KitchenScopeLayoutType;
  roomLengthMm: string;
  roomWidthMm: string;
  ceilingHeightMm: string;
  wallRunNotes: string;
  openingNotes: string;
  cabinetZones: string[];
  appliancePositions: string[];
  benchtopScope: KitchenScopeSurfaceScope;
  splashbackScope: KitchenScopeSurfaceScope;
  demolitionAndRemoval: DesignBriefYesNoUnsure;
  makeGoodWork: DesignBriefYesNoUnsure;
  serviceChanges: {
    plumbing: KitchenScopeServiceChange;
    electrical: KitchenScopeServiceChange;
    gas: KitchenScopeServiceChange;
    ventilation: KitchenScopeServiceChange;
    lighting: KitchenScopeServiceChange;
  };
  interfaces: {
    walls: DesignBriefYesNoUnsure;
    floors: DesignBriefYesNoUnsure;
    painting: DesignBriefYesNoUnsure;
  };
  accessConstraints: string[];
  scopeNotes: string;
}

export interface KitchenScopeSummaryItem {
  label: string;
  value: string;
}

export interface KitchenScopeChecklistItem {
  id: string;
  group: 'measurements' | 'cabinetry' | 'appliancesAndSurfaces' | 'worksAndServices' | 'accessAndSiteMeasure';
  label: string;
  reason: string;
  severity: 'helpful' | 'important' | 'reviewRecommended';
}

export interface KitchenScopeResult {
  summary: KitchenScopeSummaryItem[];
  missingScope: KitchenScopeChecklistItem[];
  measurementPreparation: string[];
  siteMeasurePreparation: string[];
  readiness: {
    state: KitchenScopeReadinessState;
    label: string;
    explanation: string;
  };
  recommendedNextStep: {
    href: '/request-review' | '/site-measure' | '/quote/review';
    label: string;
    reason: string;
    humanReviewRecommended: boolean;
  };
  safetyMessage: 'Site measure and written scope confirmation are required before contract pricing.';
}

export const kitchenScopeSafetyMessage = 'Site measure and written scope confirmation are required before contract pricing.' as const;
export const kitchenScopeLegalMessage = 'Planning guidance only. This is not legal advice.';

export const defaultKitchenScopeInput: KitchenScopeInput = {
  layoutType: 'notSure',
  roomLengthMm: '',
  roomWidthMm: '',
  ceilingHeightMm: '',
  wallRunNotes: '',
  openingNotes: '',
  cabinetZones: [],
  appliancePositions: [],
  benchtopScope: 'notSure',
  splashbackScope: 'notSure',
  demolitionAndRemoval: 'notSure',
  makeGoodWork: 'notSure',
  serviceChanges: {
    plumbing: 'unknown',
    electrical: 'unknown',
    gas: 'unknown',
    ventilation: 'unknown',
    lighting: 'unknown',
  },
  interfaces: {
    walls: 'notSure',
    floors: 'notSure',
    painting: 'notSure',
  },
  accessConstraints: [],
  scopeNotes: '',
};

const layoutLabels: Record<KitchenScopeLayoutType, string> = {
  straight: 'Straight run',
  lShape: 'L-shape',
  uShape: 'U-shape',
  galley: 'Galley',
  island: 'Island kitchen',
  peninsula: 'Peninsula kitchen',
  notSure: 'Not sure',
};

const surfaceLabels: Record<KitchenScopeSurfaceScope, string> = {
  none: 'Not included',
  replace: 'Replace existing',
  new: 'New surface included',
  notSure: 'Not sure',
};

const serviceLabels: Record<KitchenScopeServiceChange, string> = {
  sameLocation: 'Same location',
  relocationLikely: 'Relocation may be needed',
  upgradeLikely: 'Upgrade may be needed',
  unknown: 'Not sure',
};

function cleanText(value: string, maxLength = 220) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanNumber(value: string) {
  const match = value.replace(/,/g, '').match(/\d+/);
  return match ? match[0].slice(0, 5) : '';
}

function listValue(values: string[]) {
  return values.length ? values.join(', ') : '';
}

function isKnownYesNo(value: DesignBriefYesNoUnsure) {
  return value === 'yes' || value === 'no';
}

function hasDimensionPair(input: KitchenScopeInput) {
  return Boolean(cleanNumber(input.roomLengthMm) && cleanNumber(input.roomWidthMm));
}

function hasAnyServiceRisk(input: KitchenScopeInput) {
  return Object.values(input.serviceChanges).some((value) => value === 'relocationLikely' || value === 'upgradeLikely');
}

export function validateKitchenScopeRequiredFields(input: KitchenScopeInput) {
  const errors: Partial<Record<'layoutType' | 'cabinetZones' | 'scopeNotes', string>> = {};
  if (input.layoutType === 'notSure') errors.layoutType = 'Choose the closest kitchen layout, even if it may change after site measure.';
  if (!input.cabinetZones.length) errors.cabinetZones = 'Choose at least one cabinet or storage zone to describe the intended scope.';
  if (!cleanText(input.scopeNotes, 280)) errors.scopeNotes = 'Add a short scope note so the checklist has useful context.';
  return errors;
}

export function createKitchenScopeSummary(input: KitchenScopeInput): KitchenScopeSummaryItem[] {
  const serviceSummary = Object.entries(input.serviceChanges)
    .filter(([, value]) => value !== 'unknown')
    .map(([service, value]) => `${service}: ${serviceLabels[value]}`)
    .join(', ');

  return [
    ['Layout type', layoutLabels[input.layoutType]],
    ['Room dimensions', hasDimensionPair(input) ? `${cleanNumber(input.roomLengthMm)}mm x ${cleanNumber(input.roomWidthMm)}mm` : ''],
    ['Ceiling height', cleanNumber(input.ceilingHeightMm) ? `${cleanNumber(input.ceilingHeightMm)}mm` : ''],
    ['Wall run notes', cleanText(input.wallRunNotes)],
    ['Openings and constraints', cleanText(input.openingNotes)],
    ['Cabinet zones', listValue(input.cabinetZones)],
    ['Appliance positions', listValue(input.appliancePositions)],
    ['Benchtop scope', surfaceLabels[input.benchtopScope]],
    ['Splashback scope', surfaceLabels[input.splashbackScope]],
    ['Demolition and removal', input.demolitionAndRemoval === 'notSure' ? '' : input.demolitionAndRemoval],
    ['Make-good work', input.makeGoodWork === 'notSure' ? '' : input.makeGoodWork],
    ['Service changes', serviceSummary],
    ['Access constraints', listValue(input.accessConstraints)],
    ['Scope notes', cleanText(input.scopeNotes, 280)],
  ]
    .filter(([, value]) => Boolean(value && value !== 'Not sure'))
    .map(([label, value]) => ({ label, value }));
}

export function calculateMissingKitchenScopeItems(input: KitchenScopeInput): KitchenScopeChecklistItem[] {
  const missing: KitchenScopeChecklistItem[] = [];

  if (!hasDimensionPair(input)) {
    missing.push({
      id: 'room-dimensions',
      group: 'measurements',
      label: 'Room length and width',
      reason: 'Approximate dimensions help prepare a site-measure checklist, but site measure is still required.',
      severity: 'important',
    });
  }

  if (!cleanNumber(input.ceilingHeightMm)) {
    missing.push({
      id: 'ceiling-height',
      group: 'measurements',
      label: 'Ceiling height',
      reason: 'Ceiling height can affect tall cabinetry, overheads, bulkheads and installation review.',
      severity: 'helpful',
    });
  }

  if (!cleanText(input.openingNotes)) {
    missing.push({
      id: 'openings',
      group: 'measurements',
      label: 'Windows, doors and fixed openings',
      reason: 'Openings affect cabinet runs, benchtop joins and appliance positions.',
      severity: 'important',
    });
  }

  if (!input.cabinetZones.length) {
    missing.push({
      id: 'cabinet-zones',
      group: 'cabinetry',
      label: 'Cabinet and storage zones',
      reason: 'Cabinet zones make the scope easier to review before quote comparison or site measure.',
      severity: 'important',
    });
  }

  if (!input.appliancePositions.length) {
    missing.push({
      id: 'appliance-positions',
      group: 'appliancesAndSurfaces',
      label: 'Appliance position intentions',
      reason: 'Cooktop, oven, dishwasher, fridge and rangehood positions can affect trade review.',
      severity: 'important',
    });
  }

  if (input.benchtopScope === 'notSure' || input.splashbackScope === 'notSure') {
    missing.push({
      id: 'surfaces',
      group: 'appliancesAndSurfaces',
      label: 'Benchtop and splashback scope',
      reason: 'Surface scope should be clear before comparing inclusions, allowances or exclusions.',
      severity: 'important',
    });
  }

  if (!isKnownYesNo(input.demolitionAndRemoval) || !isKnownYesNo(input.makeGoodWork)) {
    missing.push({
      id: 'demolition-make-good',
      group: 'worksAndServices',
      label: 'Demolition, removal and make-good',
      reason: 'Removal, patching and make-good are common quote-comparison gaps.',
      severity: 'reviewRecommended',
    });
  }

  if (Object.values(input.serviceChanges).some((value) => value === 'unknown')) {
    missing.push({
      id: 'service-changes',
      group: 'worksAndServices',
      label: 'Plumbing, electrical, gas, ventilation and lighting status',
      reason: 'Licensed trade review may be required when services move or need upgrades.',
      severity: 'reviewRecommended',
    });
  }

  if (!input.accessConstraints.length) {
    missing.push({
      id: 'access-constraints',
      group: 'accessAndSiteMeasure',
      label: 'Access and site conditions',
      reason: 'Parking, stairs, lifts, strata rules and work hours can affect site-measure preparation.',
      severity: 'helpful',
    });
  }

  return missing;
}

export function createMeasurementPreparationChecklist(input: KitchenScopeInput): string[] {
  const checklist = [
    'Measure approximate room length and width in millimetres.',
    'Note ceiling height, bulkheads and any low points.',
    'Mark windows, doors, nib walls and fixed openings on a rough sketch.',
    'Take clear photos of each wall run and existing services.',
  ];

  if (!hasDimensionPair(input)) checklist.unshift('Prepare rough dimensions before relying on the scope summary.');
  if (input.layoutType === 'island' || input.layoutType === 'peninsula') checklist.push('Check walkway clearance around island or peninsula areas during site measure.');
  if (input.accessConstraints.length) checklist.push('Record access constraints so they can be checked before site attendance.');
  return checklist;
}

export function createSiteMeasurePreparationChecklist(input: KitchenScopeInput): string[] {
  const checklist = [
    'Confirm final measurements on site before project-specific pricing.',
    'Confirm appliance model sizes or allowance assumptions.',
    'Confirm benchtop, splashback, cut-out and join assumptions.',
    'Confirm written inclusions, exclusions and make-good responsibilities.',
  ];

  if (hasAnyServiceRisk(input)) checklist.push('Arrange licensed plumbing, electrical, gas, ventilation or lighting review where services may move or upgrade.');
  if (input.accessConstraints.length) checklist.push('Confirm access, parking, lift booking, work-hour or strata review prompts before scheduling.');
  if (input.demolitionAndRemoval !== 'yes') checklist.push('Clarify who handles demolition, rubbish removal and disposal.');
  return checklist;
}

export function getKitchenScopeReadiness(input: KitchenScopeInput): KitchenScopeResult['readiness'] {
  const missing = calculateMissingKitchenScopeItems(input);
  const summary = createKitchenScopeSummary(input);
  const reviewRecommendedCount = missing.filter((item) => item.severity === 'reviewRecommended').length;

  if (summary.length <= 2) {
    return {
      state: 'scopeStartingPoint',
      label: 'Scope starting point',
      explanation: 'The scope builder has enough structure to begin, but key measurements, cabinet zones and trade prompts still need detail.',
    };
  }

  if (missing.length >= 5 || reviewRecommendedCount >= 2) {
    return {
      state: 'measureReadyDetailNeeded',
      label: 'Measure-ready detail needed',
      explanation: 'The scope has useful context, but several items should be clarified before relying on it for quote review or site measure.',
    };
  }

  if (missing.length <= 2 && hasDimensionPair(input) && input.cabinetZones.length && input.appliancePositions.length) {
    return {
      state: 'readyForSiteMeasurePrep',
      label: 'Ready for site-measure prep',
      explanation: 'The scope is structured enough to prepare a site-measure conversation, subject to site review and written scope confirmation.',
    };
  }

  return {
    state: 'coreScopeCaptured',
    label: 'Core scope captured',
    explanation: 'The main scope direction is captured. A few measurement, surface, service or access items may still need confirmation.',
  };
}

export function recommendKitchenScopeNextStep(input: KitchenScopeInput): KitchenScopeResult['recommendedNextStep'] {
  if (hasAnyServiceRisk(input) || input.accessConstraints.includes('Apartment or strata review') || input.accessConstraints.includes('Lift booking or restricted work hours')) {
    return {
      href: '/request-review',
      label: 'Request review',
      reason: 'Service, access or apartment-related prompts should be reviewed before relying on the scope.',
      humanReviewRecommended: true,
    };
  }

  const readiness = getKitchenScopeReadiness(input);
  if (readiness.state === 'readyForSiteMeasurePrep') {
    return {
      href: '/site-measure',
      label: 'Prepare for site measure',
      reason: 'The scope is detailed enough to prepare a site-measure conversation.',
      humanReviewRecommended: false,
    };
  }

  return {
    href: '/quote/review',
    label: 'Review quote details',
    reason: 'Use this scope to compare inclusions, exclusions, allowances and trade assumptions before relying on a quote total.',
    humanReviewRecommended: false,
  };
}

export function evaluateKitchenScope(input: KitchenScopeInput): KitchenScopeResult {
  return {
    summary: createKitchenScopeSummary(input),
    missingScope: calculateMissingKitchenScopeItems(input),
    measurementPreparation: createMeasurementPreparationChecklist(input),
    siteMeasurePreparation: createSiteMeasurePreparationChecklist(input),
    readiness: getKitchenScopeReadiness(input),
    recommendedNextStep: recommendKitchenScopeNextStep(input),
    safetyMessage: kitchenScopeSafetyMessage,
  };
}

export function isScopeBuilderEnabled() {
  return process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER === 'true';
}
