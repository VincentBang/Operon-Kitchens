import rateCard from '@/data/rateCard.json';
import { DesignPlan, summarizeDesignPlan } from '@/lib/designPlan';
import { getMaterialCompliance, transitionProvisionApplies } from '@/lib/materialCompliance';

export type RateCard = typeof rateCard;

export type ProjectZoneType = 'kitchen' | 'pantry' | 'laundry' | 'bar' | 'other';

export interface QuoteZone {
  id: string;
  name: string;
  type: ProjectZoneType;
  baseLinearMetres: number;
  overheadLinearMetres: number;
  tallCabinetQty: number;
  drawerQty: number;
  doorQty: number;
  panelQty: number;
  selectedAccessories: (keyof typeof rateCard.accessories)[];
}

export interface QuoteAttachment {
  id: string;
  name: string;
  category: 'photo' | 'plan' | 'currentQuote' | 'other';
  size?: number;
}

/**
 * Types representing the shape of the quote data. These can be extended as needed.
 */
export interface QuoteInput {
  projectType: 'fullRenovation' | 'cabinetryBenchtopRefresh' | 'benchtopOnly' | 'notSure';
  suburb: string;
  roughTiming: 'planning' | 'oneToThreeMonths' | 'readySoon' | 'urgent';
  budgetBand: 'notSpecified' | 'under25k' | '25kTo45k' | '45kTo70k' | '70kPlus';
  hasExistingQuote: boolean;
  propertyType: 'house' | 'townhouse' | 'strataApartment';
  propertyAgeBand: 'unknown' | 'pre1980' | '1980To2000' | 'post2000';
  heritageOrOlderHomeUncertainty: boolean;
  measurementsProvided: boolean;
  photosProvided: boolean;
  layoutChange: boolean;
  layoutType: 'straight' | 'galley' | 'lShape' | 'uShape' | 'island' | 'notSure';
  kitchenSize: 'small' | 'medium' | 'large' | 'notSure';
  propertyLevel: 'ground' | 'level1' | 'level2+' | 'unsure';
  hasLift: boolean;
  parkingAccess: 'good' | 'limited';
  baseLinearMetres: number;
  overheadLinearMetres: number;
  tallCabinetQty: number;
  drawerQty: number;
  doorQty: number;
  panelQty: number;
  drawerRunnerLevel: keyof typeof rateCard.cabinetry.drawerRunnerRate;
  hingeLevel: keyof typeof rateCard.cabinetry.hingeRate;
  doorFinish: keyof typeof rateCard.doorFinishRates;
  panelFinish: keyof typeof rateCard.panelRates;
  selectedAccessories: (keyof typeof rateCard.accessories)[];
  zones: QuoteZone[];
  benchtopType: keyof typeof rateCard.benchtopRates;
  benchtopMetres: number;
  splashbackType: keyof typeof rateCard.splashbackRates;
  splashbackArea: number;
  engineeredStoneTransitionClaimed: boolean;
  engineeredStoneContractBefore2023End: boolean;
  engineeredStoneInstallBefore2024End: boolean;
  trades: {
    plumbing: boolean;
    electrical: boolean;
    gas: boolean;
    tiling: boolean;
    painting: boolean;
  };
  appliances: {
    rangehood: boolean;
    cooktop: boolean;
    oven: boolean;
    dishwasher: boolean;
    fridge: boolean;
  };
  lighting: {
    ledStripsMetres: number;
    downlightQty: number;
    pendantQty: number;
  };
  flooring: {
    included: boolean;
    areaSqm: number;
    type: keyof typeof rateCard.flooringRates;
  };
  plumbingMovement: 'sameLocation' | 'moves' | 'notSure';
  electricalScope: 'similar' | 'upgrades' | 'notSure';
  gasInvolved: 'yes' | 'no' | 'notSure';
  waterproofingChanges: 'yes' | 'no' | 'notSure';
  apartmentClass2Uncertainty: boolean;
  widerRenovationThresholdRisk: 'yes' | 'no' | 'notSure';
  olderPropertyAsbestosConcern: 'yes' | 'no' | 'notSure';
  applianceAllowance: 'excluded' | 'standardPc' | 'premiumPc' | 'exactModelsKnown' | 'notSure';
  structuralWorks: {
    wallRemoval: boolean;
    beamRequired: boolean;
    windowDoorChanges: boolean;
  };
  strataApprovalRequired: boolean;
  basixReviewRequired: boolean;
  dbpReviewRequired: boolean;
  asbestosRisk: boolean;
  accessConstraints: {
    narrowAccess: boolean;
    longCarry: boolean;
    occupiedHome: boolean;
  };
  designPlan: DesignPlan | null;
  supportingFiles: QuoteAttachment[];
  preferredContactMethod: 'phone' | 'email' | 'either';
  addressOptional: string;
  depositOfferedAmount: number;
  depositOfferedPercent: number;
  hbcInsuranceIncluded: boolean;
  hbcCertificateConfirmed: boolean;
  highRiskItems: boolean;
}

export interface PricingResult {
  lineItems: { name: string; cost: number }[];
  subtotal: number;
  margin: number;
  contingency: number;
  gst: number;
  total: number;
  estimateLow: number;
  estimateHigh: number;
  recommendedDeposit: number;
  recommendedDepositPercent: number;
  hbcRequired: boolean;
  depositWarning: string | null;
  hbcWarning: string | null;
  complianceFlags: string[];
  includedScope: string[];
  materialCompliance: {
    benchtop: ReturnType<typeof getMaterialCompliance>;
    splashback: ReturnType<typeof getMaterialCompliance>;
    transitionProvisionApplies: boolean;
    summary: string[];
  };
  confidenceScore: number;
  confidenceLabel: 'high' | 'medium' | 'low';
  confidenceLevel: 'high' | 'medium' | 'low';
  confidenceReasonsPositive: string[];
  confidenceReasonsNegative: string[];
  reviewRiskScore: number;
  reviewRiskLabel: 'low' | 'medium' | 'high';
  riskReasons: string[];
  leadQuality: 'hot' | 'medium' | 'low';
  recommendedFollowUp: string;
  assumptions: string[];
  exclusions: string[];
  manualReviewFlags: string[];
  flags: string[];
  recommendedNextStep: string;
}

/**
 * Calculates a confidence score based on the quote input. The score begins at 100 and
 * deductions are applied based on missing information or complexity factors.
 */
function calculateConfidence(input: QuoteInput): number {
  let score = 100;
  if (input.projectType === 'notSure') score -= 5;
  if (!input.suburb?.trim()) score -= 4;
  if (input.layoutType === 'notSure') score -= 10;
  if (input.kitchenSize === 'notSure' && input.baseLinearMetres <= 0) score -= 10;
  if (input.zones.length > 0) score -= Math.min(12, input.zones.length * 4);
  if (input.propertyType === 'strataApartment') score -= 8;
  if (!input.measurementsProvided) score -= 20;
  if (!input.photosProvided) score -= 10;
  if (!input.supportingFiles.some((file) => file.category === 'photo' || file.category === 'plan')) score -= 6;
  if (input.layoutChange) score -= 10;
  if (input.propertyLevel === 'level2+') score -= 5;
  if (!input.hasLift && input.propertyLevel !== 'ground') score -= 5;
  if (input.parkingAccess === 'limited') score -= 5;
  if (input.highRiskItems) score -= 20;
  if (input.doorFinish === 'melamine' && input.panelFinish === 'melamine' && input.benchtopType === 'laminate' && input.projectType === 'notSure') score -= 5;
  if (input.applianceAllowance === 'notSure') score -= 8;
  if (input.plumbingMovement === 'notSure') score -= 8;
  if (input.electricalScope === 'notSure') score -= 8;
  if (input.gasInvolved === 'notSure') score -= 4;
  if (input.waterproofingChanges === 'yes' || input.waterproofingChanges === 'notSure') score -= 5;
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges) score -= 15;
  if (input.strataApprovalRequired || input.basixReviewRequired || input.dbpReviewRequired || input.apartmentClass2Uncertainty) score -= 8;
  if (input.widerRenovationThresholdRisk === 'yes' || input.widerRenovationThresholdRisk === 'notSure') score -= 5;
  if (input.asbestosRisk || input.olderPropertyAsbestosConcern === 'yes' || (input.olderPropertyAsbestosConcern === 'notSure' && input.propertyAgeBand !== 'post2000')) score -= 10;
  if (input.accessConstraints.narrowAccess || input.accessConstraints.longCarry || input.accessConstraints.occupiedHome) score -= 6;
  return Math.max(0, score);
}

/**
 * Converts a numeric confidence score into a confidence band.
 */
function getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getConfidenceReasons(input: QuoteInput) {
  const positive = [
    input.projectType !== 'notSure' && 'Project type selected',
    Boolean(input.suburb?.trim()) && 'Suburb supplied for Sydney context',
    input.layoutType !== 'notSure' && 'Kitchen layout selected',
    (input.kitchenSize !== 'notSure' || input.baseLinearMetres > 0) && 'Kitchen size or cabinet run supplied',
    input.measurementsProvided && 'Measurements supplied',
    (input.photosProvided || input.supportingFiles.some((file) => file.category === 'photo' || file.category === 'plan')) && 'Photos or plans supplied',
    (input.hasExistingQuote || input.supportingFiles.some((file) => file.category === 'currentQuote')) && 'Existing quote available for review',
    input.applianceAllowance !== 'notSure' && 'Appliance allowance direction selected',
    input.plumbingMovement !== 'notSure' && 'Plumbing movement known',
    input.electricalScope !== 'notSure' && 'Electrical scope known',
    input.gasInvolved !== 'notSure' && 'Gas involvement clarified',
  ].filter(Boolean) as string[];

  const negative = [
    input.projectType === 'notSure' && 'Project type still unclear',
    !input.suburb?.trim() && 'Suburb not supplied',
    input.layoutType === 'notSure' && 'Kitchen layout still unclear',
    input.kitchenSize === 'notSure' && input.baseLinearMetres <= 0 && 'Kitchen size or cabinet run not supplied',
    !input.measurementsProvided && 'Measurements still need confirmation',
    !input.photosProvided && !input.supportingFiles.some((file) => file.category === 'photo' || file.category === 'plan') && 'No photos or plans attached',
    input.applianceAllowance === 'notSure' && 'Appliance selections or allowance level unclear',
    input.plumbingMovement === 'notSure' && 'Plumbing movement unclear',
    input.electricalScope === 'notSure' && 'Electrical scope unclear',
    input.gasInvolved === 'notSure' && 'Gas involvement unclear',
    input.propertyType === 'strataApartment' && 'Apartment or strata conditions need review',
    input.olderPropertyAsbestosConcern !== 'no' && 'Older-property or asbestos item needs review',
    input.structuralWorks.wallRemoval && 'Structural wall change selected',
    input.waterproofingChanges !== 'no' && 'Wet-area or waterproofing scope needs confirmation',
  ].filter(Boolean) as string[];

  return { positive, negative };
}

function calculateReviewRisk(input: QuoteInput) {
  let score = 12;
  const reasons: string[] = [];

  const addRisk = (points: number, reason: string) => {
    score += points;
    reasons.push(reason);
  };

  if (input.propertyType === 'strataApartment' || input.strataApprovalRequired) addRisk(14, 'Apartment or strata approval pathway needs review');
  if (input.propertyLevel === 'level2+' || (!input.hasLift && input.propertyLevel !== 'ground') || input.parkingAccess === 'limited') addRisk(8, 'Access, lift or loading constraints may affect scope');
  if (input.plumbingMovement === 'moves' || input.plumbingMovement === 'notSure') addRisk(10, 'Plumbing relocation or uncertainty needs licensed trade confirmation');
  if (input.electricalScope === 'upgrades' || input.electricalScope === 'notSure') addRisk(10, 'Electrical upgrade or uncertainty needs licensed trade confirmation');
  if (input.gasInvolved !== 'no') addRisk(8, 'Gas involvement requires licensed trade confirmation');
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges) addRisk(18, 'Structural or opening changes require manual review');
  if (input.waterproofingChanges !== 'no') addRisk(8, 'Wet-area or waterproofing changes require confirmation');
  if (input.basixReviewRequired || input.widerRenovationThresholdRisk !== 'no') addRisk(8, 'BASIX or wider renovation threshold may need review');
  if (input.dbpReviewRequired || input.apartmentClass2Uncertainty) addRisk(8, 'DBP/class 2 screening may be relevant');
  if (input.asbestosRisk || input.olderPropertyAsbestosConcern !== 'no' || input.propertyAgeBand === 'pre1980' || input.heritageOrOlderHomeUncertainty) addRisk(12, 'Older-property or asbestos risk should be checked');
  if (input.accessConstraints.narrowAccess || input.accessConstraints.longCarry || input.accessConstraints.occupiedHome) addRisk(6, 'Site access or occupied-home constraints affect delivery and staging');
  if (input.zones.length > 0) addRisk(6, 'Multiple rooms or zones require scope coordination');

  const reviewRiskScore = Math.min(100, score);
  const reviewRiskLabel: PricingResult['reviewRiskLabel'] = reviewRiskScore >= 65 ? 'high' : reviewRiskScore >= 35 ? 'medium' : 'low';

  return {
    reviewRiskScore,
    reviewRiskLabel,
    riskReasons: reasons.length ? reasons : ['No unusual complexity has been identified beyond normal site measure and written scope confirmation.'],
  };
}

function calculateLeadQuality(input: QuoteInput, confidenceScore: number, reviewRiskScore: number) {
  let score = 20;
  if (input.roughTiming === 'urgent' || input.roughTiming === 'readySoon') score += 15;
  if (input.roughTiming === 'oneToThreeMonths') score += 8;
  if (input.hasExistingQuote || input.supportingFiles.some((file) => file.category === 'currentQuote')) score += 12;
  if (input.photosProvided || input.supportingFiles.some((file) => file.category === 'photo' || file.category === 'plan')) score += 8;
  if (['mosman', 'vaucluse', 'double bay', 'bellevue hill', 'woollahra', 'rose bay', 'neutral bay', 'manly', 'wahroonga', 'pymble', 'killara', 'hunters hill'].some((area) => input.suburb.toLowerCase().includes(area))) score += 10;
  if (input.projectType === 'fullRenovation') score += 10;
  if (input.budgetBand === '45kTo70k' || input.budgetBand === '70kPlus') score += 12;
  if (input.budgetBand === '25kTo45k') score += 6;
  if (input.preferredContactMethod !== 'either' || input.addressOptional.trim()) score += 4;
  if (confidenceScore >= 70) score += 6;
  if (reviewRiskScore >= 50) score += 5;

  const normalized = Math.min(100, score);
  const leadQuality: PricingResult['leadQuality'] = normalized >= 70 ? 'hot' : normalized >= 45 ? 'medium' : 'low';
  const recommendedFollowUp =
    leadQuality === 'hot'
      ? 'Prioritise same-day follow-up and request site-measure availability, photos or current quote files.'
      : leadQuality === 'medium'
        ? 'Send a scope clarification follow-up and invite the customer to add photos, plans or quote files.'
        : 'Send planning guidance and prompt the customer to complete more project details before review.';

  return { leadQuality, recommendedFollowUp };
}

function priceCabinetZone(zone: QuoteZone, activeRateCard: RateCard) {
  const costs = [
    zone.baseLinearMetres * activeRateCard.cabinetry.baseRate,
    zone.overheadLinearMetres * activeRateCard.cabinetry.overheadRate,
    zone.tallCabinetQty * activeRateCard.cabinetry.tallCabinetRate,
    zone.drawerQty * activeRateCard.cabinetry.drawerRunnerRate.standard,
    zone.doorQty * activeRateCard.cabinetry.hingeRate.standard,
    zone.doorQty * activeRateCard.doorFinishRates.melamine,
    zone.panelQty * activeRateCard.panelRates.melamine,
    zone.selectedAccessories.reduce((sum, key) => sum + (activeRateCard.accessories[key] ?? 0), 0),
  ];
  return costs.reduce((sum, cost) => sum + cost, 0);
}

function installationScopeMetres(input: QuoteInput) {
  return input.baseLinearMetres + input.overheadLinearMetres + input.zones.reduce((sum, zone) => sum + zone.baseLinearMetres + zone.overheadLinearMetres, 0);
}

function selectedApplianceCount(input: QuoteInput) {
  return Object.values(input.appliances).filter(Boolean).length;
}

function roundCurrency(value: number) {
  return parseFloat(value.toFixed(2));
}

function getRangeFactor(input: QuoteInput, confidenceLevel: PricingResult['confidenceLevel'], activeRateCard: RateCard) {
  const rangeRates = activeRateCard.estimateRange ?? rateCard.estimateRange;
  let factor =
    confidenceLevel === 'high'
      ? rangeRates.highConfidence
      : confidenceLevel === 'medium'
        ? rangeRates.mediumConfidence
        : rangeRates.lowConfidence;

  if (input.strataApprovalRequired || input.basixReviewRequired || input.dbpReviewRequired || input.propertyType === 'strataApartment') {
    factor += rangeRates.complianceReview;
  }
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges || input.asbestosRisk) {
    factor += rangeRates.structuralReview;
  }

  return factor;
}

function getRecommendedNextStep(confidenceLevel: PricingResult['confidenceLevel'], manualReviewFlags: string[], complianceFlags: string[]) {
  if (complianceFlags.some((flag) => flag.toLowerCase().includes('engineered stone'))) {
    return 'Replace or verify restricted material selections before requesting professional quote review.';
  }
  if (complianceFlags.length > 0 || manualReviewFlags.length > 2) {
    return 'Submit the estimate for professional review with photos, measurements, selections and approval documents attached.';
  }
  if (confidenceLevel !== 'high') {
    return 'Add photos, measurements in millimetres and product selections to tighten the estimate range before review.';
  }
  return 'Proceed to professional site measure and written quote confirmation before making contract decisions.';
}

/**
 * Calculates line-item costs and totals based on the provided quote input and rate card.
 */
export function calculatePricing(input: QuoteInput, activeRateCard: RateCard = rateCard): PricingResult {
  input = {
    ...input,
    projectType: input.projectType ?? 'notSure',
    suburb: input.suburb ?? '',
    roughTiming: input.roughTiming ?? 'planning',
    budgetBand: input.budgetBand ?? 'notSpecified',
    hasExistingQuote: Boolean(input.hasExistingQuote),
    propertyType: input.propertyType ?? 'house',
    propertyAgeBand: input.propertyAgeBand ?? 'unknown',
    heritageOrOlderHomeUncertainty: Boolean(input.heritageOrOlderHomeUncertainty),
    layoutType: input.layoutType ?? 'notSure',
    kitchenSize: input.kitchenSize ?? 'notSure',
    zones: input.zones ?? [],
    appliances: input.appliances ?? { rangehood: false, cooktop: false, oven: false, dishwasher: false, fridge: false },
    lighting: input.lighting ?? { ledStripsMetres: 0, downlightQty: 0, pendantQty: 0 },
    flooring: input.flooring ?? { included: false, areaSqm: 0, type: 'none' },
    plumbingMovement: input.plumbingMovement ?? 'notSure',
    electricalScope: input.electricalScope ?? 'notSure',
    gasInvolved: input.gasInvolved ?? 'notSure',
    waterproofingChanges: input.waterproofingChanges ?? 'notSure',
    apartmentClass2Uncertainty: Boolean(input.apartmentClass2Uncertainty),
    widerRenovationThresholdRisk: input.widerRenovationThresholdRisk ?? 'notSure',
    olderPropertyAsbestosConcern: input.olderPropertyAsbestosConcern ?? 'notSure',
    applianceAllowance: input.applianceAllowance ?? 'notSure',
    structuralWorks: input.structuralWorks ?? { wallRemoval: false, beamRequired: false, windowDoorChanges: false },
    strataApprovalRequired: Boolean(input.strataApprovalRequired),
    basixReviewRequired: Boolean(input.basixReviewRequired),
    dbpReviewRequired: Boolean(input.dbpReviewRequired),
    asbestosRisk: Boolean(input.asbestosRisk),
    accessConstraints: input.accessConstraints ?? { narrowAccess: false, longCarry: false, occupiedHome: false },
    designPlan: input.designPlan ?? null,
    supportingFiles: input.supportingFiles ?? [],
    preferredContactMethod: input.preferredContactMethod ?? 'either',
    addressOptional: input.addressOptional ?? '',
  };
  const lineItems: { name: string; cost: number }[] = [];
  // Cabinetry
  const baseCost = input.baseLinearMetres * activeRateCard.cabinetry.baseRate;
  lineItems.push({ name: 'Base cabinets', cost: baseCost });
  const overheadCost = input.overheadLinearMetres * activeRateCard.cabinetry.overheadRate;
  lineItems.push({ name: 'Overhead cabinets', cost: overheadCost });
  const tallCost = input.tallCabinetQty * activeRateCard.cabinetry.tallCabinetRate;
  lineItems.push({ name: 'Tall cabinets', cost: tallCost });
  const drawerRunnerCost = input.drawerQty * activeRateCard.cabinetry.drawerRunnerRate[input.drawerRunnerLevel];
  lineItems.push({ name: 'Drawer runners', cost: drawerRunnerCost });
  const hingeCost = input.doorQty * activeRateCard.cabinetry.hingeRate[input.hingeLevel];
  lineItems.push({ name: 'Hinges', cost: hingeCost });
  const doorCost = input.doorQty * activeRateCard.doorFinishRates[input.doorFinish];
  lineItems.push({ name: 'Doors', cost: doorCost });
  const panelCost = input.panelQty * activeRateCard.panelRates[input.panelFinish];
  lineItems.push({ name: 'Panels', cost: panelCost });
  // Accessories
  const accessoriesCost = input.selectedAccessories.reduce((sum, key) => {
    return sum + activeRateCard.accessories[key];
  }, 0);
  if (accessoriesCost > 0) lineItems.push({ name: 'Accessories', cost: accessoriesCost });
  input.zones.forEach((zone) => {
    const zoneCost = priceCabinetZone(zone, activeRateCard);
    if (zoneCost > 0) lineItems.push({ name: `${zone.name || zone.type} cabinetry zone`, cost: zoneCost });
  });
  // Benchtop
  const benchtopRate = activeRateCard.benchtopRates[input.benchtopType] ?? rateCard.benchtopRates[input.benchtopType] ?? 0;
  const benchtopCost = input.benchtopMetres * benchtopRate;
  lineItems.push({ name: 'Benchtop', cost: benchtopCost });
  // Splashback
  const splashbackRate = activeRateCard.splashbackRates[input.splashbackType] ?? rateCard.splashbackRates[input.splashbackType] ?? 0;
  const splashbackCost = input.splashbackArea * splashbackRate;
  lineItems.push({ name: 'Splashback', cost: splashbackCost });
  // Installation labour
  const installCabinetCost = installationScopeMetres(input) * activeRateCard.installation.cabinet;
  const installBenchCost = input.benchtopMetres * activeRateCard.installation.bench;
  const installSplashCost = input.splashbackArea * activeRateCard.installation.splashback;
  lineItems.push({ name: 'Installation labour', cost: installCabinetCost + installBenchCost + installSplashCost });
  const applianceCost = Object.entries(input.appliances).reduce((sum, [appliance, selected]) => {
    const allowances = activeRateCard.applianceAllowances ?? rateCard.applianceAllowances;
    return selected ? sum + (allowances[appliance as keyof typeof allowances] ?? 0) : sum;
  }, 0);
  if (applianceCost > 0) lineItems.push({ name: 'Appliance allowances', cost: applianceCost });
  const lightingRates = activeRateCard.lighting ?? rateCard.lighting;
  const lightingCost =
    input.lighting.ledStripsMetres * lightingRates.ledStripPerMetre +
    input.lighting.downlightQty * lightingRates.downlightEach +
    input.lighting.pendantQty * lightingRates.pendantEach;
  if (lightingCost > 0) lineItems.push({ name: 'Lighting allowances', cost: lightingCost });
  const flooringRates = activeRateCard.flooringRates ?? rateCard.flooringRates;
  const flooringRate = flooringRates[input.flooring.type] ?? 0;
  const flooringCost = input.flooring.included ? input.flooring.areaSqm * flooringRate : 0;
  if (flooringCost > 0) lineItems.push({ name: 'Kitchen flooring allowance', cost: flooringCost });
  const structuralRates = activeRateCard.structuralWorks ?? rateCard.structuralWorks;
  const structuralCost =
    (input.structuralWorks.wallRemoval ? structuralRates.wallRemoval : 0) +
    (input.structuralWorks.beamRequired ? structuralRates.beamEngineering : 0) +
    (input.structuralWorks.windowDoorChanges ? structuralRates.windowDoorChanges : 0);
  if (structuralCost > 0) lineItems.push({ name: 'Structural works review allowance', cost: structuralCost });
  // Trade allowances
  const tradeCost = Object.entries(input.trades).reduce((sum, [trade, selected]) => {
    if (selected) {
      // @ts-ignore
      return sum + activeRateCard.tradeAllowances[trade];
    }
    return sum;
  }, 0);
  if (tradeCost > 0) lineItems.push({ name: 'Trade allowances', cost: tradeCost });
  // Subtotal
  let subtotal = lineItems.reduce((sum, item) => sum + item.cost, 0);
  // Access loading
  let accessMultiplier = 0;
  if (input.propertyLevel === 'level1') accessMultiplier += activeRateCard.accessLoading.level1;
  if (input.propertyLevel === 'level2+') accessMultiplier += activeRateCard.accessLoading.level2Plus;
  if (!input.hasLift && input.propertyLevel !== 'ground') accessMultiplier += activeRateCard.accessLoading.noLift;
  if (input.parkingAccess === 'limited') accessMultiplier += activeRateCard.accessLoading.limitedParking;
  const riskLoadings = activeRateCard.riskLoadings ?? rateCard.riskLoadings;
  if (input.accessConstraints.narrowAccess) accessMultiplier += riskLoadings.narrowAccess;
  if (input.accessConstraints.longCarry) accessMultiplier += riskLoadings.longCarry;
  if (input.accessConstraints.occupiedHome) accessMultiplier += riskLoadings.occupiedHome;
  const accessCost = subtotal * accessMultiplier;
  if (accessCost > 0) lineItems.push({ name: 'Access loading', cost: accessCost });
  subtotal += accessCost;
  // Margin and contingency
  const margin = subtotal * activeRateCard.margin;
  const confidenceScore = calculateConfidence(input);
  const confidenceLevel = getConfidenceLevel(confidenceScore);
  const { positive: confidenceReasonsPositive, negative: confidenceReasonsNegative } = getConfidenceReasons(input);
  const { reviewRiskScore, reviewRiskLabel, riskReasons } = calculateReviewRisk(input);
  const { leadQuality, recommendedFollowUp } = calculateLeadQuality(input, confidenceScore, reviewRiskScore);
  // Increase contingency when confidence is low
  let contingencyFactor = activeRateCard.contingencyBase;
  if (confidenceLevel === 'medium') contingencyFactor += 0.05;
  if (confidenceLevel === 'low') contingencyFactor += 0.1;
  if (input.propertyType === 'strataApartment') contingencyFactor += riskLoadings.strataApartment;
  if (input.strataApprovalRequired) contingencyFactor += riskLoadings.strataApproval;
  if (input.basixReviewRequired) contingencyFactor += riskLoadings.basixReview;
  if (input.dbpReviewRequired) contingencyFactor += riskLoadings.dbpReview;
  if (input.asbestosRisk) contingencyFactor += riskLoadings.asbestosRisk;
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges) contingencyFactor += riskLoadings.structuralWorks;
  const contingency = subtotal * contingencyFactor;
  subtotal += margin + contingency;
  // GST
  const gst = subtotal * 0.1;
  const total = subtotal + gst;
  const recommendedDepositPercent = 10;
  const recommendedDeposit = total * (recommendedDepositPercent / 100);
  const offeredDepositFromPercent = input.depositOfferedPercent > 0 ? total * (input.depositOfferedPercent / 100) : 0;
  const offeredDepositAmount = Math.max(input.depositOfferedAmount || 0, offeredDepositFromPercent);
  const offeredDepositPercent = total > 0 ? (offeredDepositAmount / total) * 100 : 0;
  const confidenceLabel = confidenceLevel;
  const rangeFactor = getRangeFactor(input, confidenceLevel, activeRateCard);
  const estimateLow = Math.max(0, total * (1 - rangeFactor));
  const estimateHigh = total * (1 + rangeFactor);
  const hbcRequired = estimateHigh > 20000;
  const writtenContractReviewRequired = estimateHigh > 5000;
  const depositWarning =
    offeredDepositAmount > recommendedDeposit
      ? `The proposed deposit is ${offeredDepositPercent.toFixed(1)}% of the estimate. NSW home building deposit guidance caps deposits at 10% and should be reviewed before contract issue.`
      : null;
  const hbcWarning =
    hbcRequired && (!input.hbcInsuranceIncluded || !input.hbcCertificateConfirmed)
      ? 'Home Building Compensation cover is flagged for review because this residential project estimate is over $20,000 including GST. Cover should be confirmed before taking money or commencing work.'
      : null;
  const complianceFlags: string[] = [];
  complianceFlags.push('Final site measure required before price confirmation');
  if (writtenContractReviewRequired) complianceFlags.push('Written contract review may be required for residential building work over $5,000 including GST');
  complianceFlags.push('NSW deposit guidance: maximum deposit should be 10% of the final home building contract price');
  if (depositWarning) complianceFlags.push('Proposed deposit exceeds 10% guidance');
  if (hbcRequired) complianceFlags.push('HBC likely required if residential work exceeds $20,000 including GST');
  if (hbcWarning) complianceFlags.push('HBC cover not confirmed');
  if (input.strataApprovalRequired || input.propertyType === 'strataApartment') complianceFlags.push('Strata/apartment approval review required');
  if (input.basixReviewRequired || input.widerRenovationThresholdRisk !== 'no' || input.structuralWorks.wallRemoval || input.structuralWorks.windowDoorChanges) complianceFlags.push('BASIX/wider renovation review may be required and must be confirmed');
  if (input.dbpReviewRequired || input.apartmentClass2Uncertainty || input.propertyType === 'strataApartment') complianceFlags.push('DBP/class 2 screening may be required for apartment work');
  if (input.asbestosRisk || input.olderPropertyAsbestosConcern !== 'no' || input.heritageOrOlderHomeUncertainty || input.propertyAgeBand === 'pre1980') complianceFlags.push('Older-property/asbestos review likely requires confirmation');
  if (input.trades.plumbing || input.trades.electrical || input.trades.gas || input.plumbingMovement !== 'sameLocation' || input.electricalScope !== 'similar' || input.gasInvolved !== 'no') complianceFlags.push('Licensed trade confirmation required for plumbing, gas or electrical work');
  const benchtopCompliance = getMaterialCompliance('benchtop', input.benchtopType);
  const splashbackCompliance = getMaterialCompliance('splashback', input.splashbackType);
  const transitionApplies = transitionProvisionApplies(input);
  const materialComplianceSummary: string[] = [
    `Benchtop: ${benchtopCompliance.label} (${benchtopCompliance.silicaLabel})`,
    `Splashback: ${splashbackCompliance.label} (${splashbackCompliance.silicaLabel})`,
  ];
  [benchtopCompliance, splashbackCompliance].forEach((material) => {
    if (material.status === 'banned') {
      complianceFlags.push(`${material.label} is restricted under the engineered stone restriction`);
      if (transitionApplies) {
        complianceFlags.push(`${material.label} transition claim requires manual documentation review`);
      }
    }
    if (material.status === 'review') complianceFlags.push(`${material.label} requires supplier compliance confirmation`);
  });
  // Assumptions and exclusions
  const assumptions: string[] = [];
  const exclusions: string[] = [];
  // Example assumptions and exclusions based on input
  assumptions.push('This is a planning estimate range for scope review, not a contract price.');
  assumptions.push('Site measure, confirmed selections and licensed trade review are required before written scope confirmation.');
  if (!input.measurementsProvided) assumptions.push('Measurements will be verified during site visit.');
  if (input.supportingFiles.length > 0) assumptions.push(`${input.supportingFiles.length} supporting file(s) supplied for professional review.`);
  if (input.designPlan) assumptions.push(`Customer design plan attached for review: ${summarizeDesignPlan(input.designPlan)}.`);
  if (input.zones.length > 0) assumptions.push(`Estimate includes ${input.zones.length + 1} project zones including kitchen${input.zones.length ? `, ${input.zones.map((zone) => zone.name).join(', ')}` : ''}.`);
  if (selectedApplianceCount(input) > 0) assumptions.push('Appliance allowances are planning placeholders until exact model selections and installation requirements are confirmed.');
  if (input.applianceAllowance === 'exactModelsKnown') assumptions.push('Exact appliance models have been nominated for review, subject to installation confirmation.');
  if (input.applianceAllowance === 'notSure') assumptions.push('Appliance allowance needs confirmation before the estimate confidence can improve.');
  if (input.flooring.included) assumptions.push('Flooring allowance is included for the nominated kitchen area only and should be reconciled with any flooring-specific quote.');
  assumptions.push('Deposit on a final NSW home building contract must not exceed 10%.');
  if (writtenContractReviewRequired) assumptions.push('Residential building work over $5,000 including GST may require written contract review before proceeding.');
  if (hbcRequired) assumptions.push('Projects over $20,000 including GST need Home Building Compensation insurance reviewed and confirmed before taking money or starting work.');
  assumptions.push(...materialComplianceSummary);
  if (transitionApplies) assumptions.push('Engineered-stone transition provision has been claimed and must be manually verified against contract and installation dates.');
  if (input.highRiskItems) exclusions.push('Structural changes, wall removal, and major service relocations require separate quote.');
  if (!input.flooring.included) exclusions.push('Flooring is excluded unless selected in the advanced scope.');
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges) exclusions.push('Structural engineering, approvals and final building work pricing require manual review.');
  if (input.strataApprovalRequired) exclusions.push('Strata approval, by-law requirements and building management conditions are not confirmed by this estimate.');
  // Flags
  const flags: string[] = [];
  if (confidenceLevel === 'low') flags.push('Low confidence – wide estimate range recommended');
  if (!input.measurementsProvided) flags.push('Final site measure required');
  if (!input.photosProvided) flags.push('Photos or plans needed for tighter review');
  if (input.benchtopType === 'naturalStone') flags.push('Benchtop subject to supplier compliance confirmation');
  if (input.zones.length > 0) flags.push('Multiple zones require manual scope review');
  if (selectedApplianceCount(input) > 0) flags.push('Appliance selections require model and installation confirmation');
  if (input.asbestosRisk || input.olderPropertyAsbestosConcern !== 'no' || input.propertyAgeBand === 'pre1980') flags.push('Older-property/asbestos risk requires site review');
  if (input.strataApprovalRequired || input.propertyType === 'strataApartment' || input.apartmentClass2Uncertainty) flags.push('Apartment or strata project requires approval pathway review');
  if (input.basixReviewRequired || input.dbpReviewRequired || input.widerRenovationThresholdRisk !== 'no') flags.push('Building approval pathway requires manual screening');
  if (input.plumbingMovement === 'notSure' || input.electricalScope === 'notSure' || input.gasInvolved === 'notSure') flags.push('Service relocation details are unclear and need professional confirmation');
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges) flags.push('Structural scope requires manual review');
  const manualReviewFlags = Array.from(new Set(flags));
  const includedScope = lineItems
    .filter((item) => item.cost > 0)
    .map((item) => item.name);
  if (includedScope.length === 0) includedScope.push('Kitchen renovation scope to be confirmed');
  const recommendedNextStep = getRecommendedNextStep(confidenceLevel, manualReviewFlags, complianceFlags);
  return {
    lineItems,
    subtotal: roundCurrency(subtotal),
    margin: roundCurrency(margin),
    contingency: roundCurrency(contingency),
    gst: roundCurrency(gst),
    total: roundCurrency(total),
    estimateLow: roundCurrency(estimateLow),
    estimateHigh: roundCurrency(estimateHigh),
    recommendedDeposit: roundCurrency(recommendedDeposit),
    recommendedDepositPercent,
    hbcRequired,
    depositWarning,
    hbcWarning,
    complianceFlags,
    includedScope,
    materialCompliance: {
      benchtop: benchtopCompliance,
      splashback: splashbackCompliance,
      transitionProvisionApplies: transitionApplies,
      summary: materialComplianceSummary,
    },
    confidenceScore,
    confidenceLabel,
    confidenceLevel,
    confidenceReasonsPositive,
    confidenceReasonsNegative,
    reviewRiskScore,
    reviewRiskLabel,
    riskReasons,
    leadQuality,
    recommendedFollowUp,
    assumptions,
    exclusions,
    manualReviewFlags,
    flags,
    recommendedNextStep,
  };
}
