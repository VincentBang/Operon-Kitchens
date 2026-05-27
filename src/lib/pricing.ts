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
  propertyType: 'house' | 'townhouse' | 'strataApartment';
  measurementsProvided: boolean;
  photosProvided: boolean;
  layoutChange: boolean;
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
  if (input.zones.length > 0) score -= Math.min(12, input.zones.length * 4);
  if (input.propertyType === 'strataApartment') score -= 8;
  if (!input.measurementsProvided) score -= 20;
  if (!input.photosProvided) score -= 10;
  if (input.layoutChange) score -= 10;
  if (input.propertyLevel === 'level2+') score -= 5;
  if (!input.hasLift && input.propertyLevel !== 'ground') score -= 5;
  if (input.parkingAccess === 'limited') score -= 5;
  if (input.highRiskItems) score -= 20;
  if (input.structuralWorks.wallRemoval || input.structuralWorks.beamRequired || input.structuralWorks.windowDoorChanges) score -= 15;
  if (input.strataApprovalRequired || input.basixReviewRequired || input.dbpReviewRequired) score -= 8;
  if (input.asbestosRisk) score -= 10;
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
    propertyType: input.propertyType ?? 'house',
    zones: input.zones ?? [],
    appliances: input.appliances ?? { rangehood: false, cooktop: false, oven: false, dishwasher: false, fridge: false },
    lighting: input.lighting ?? { ledStripsMetres: 0, downlightQty: 0, pendantQty: 0 },
    flooring: input.flooring ?? { included: false, areaSqm: 0, type: 'none' },
    structuralWorks: input.structuralWorks ?? { wallRemoval: false, beamRequired: false, windowDoorChanges: false },
    strataApprovalRequired: Boolean(input.strataApprovalRequired),
    basixReviewRequired: Boolean(input.basixReviewRequired),
    dbpReviewRequired: Boolean(input.dbpReviewRequired),
    asbestosRisk: Boolean(input.asbestosRisk),
    accessConstraints: input.accessConstraints ?? { narrowAccess: false, longCarry: false, occupiedHome: false },
    designPlan: input.designPlan ?? null,
    supportingFiles: input.supportingFiles ?? [],
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
  const depositWarning =
    offeredDepositAmount > recommendedDeposit
      ? `The proposed deposit is ${offeredDepositPercent.toFixed(1)}% of the estimate. NSW home building deposit guidance caps deposits at 10% and should be reviewed before contract issue.`
      : null;
  const hbcWarning =
    hbcRequired && (!input.hbcInsuranceIncluded || !input.hbcCertificateConfirmed)
      ? 'Home Building Compensation cover is flagged for review because this residential project estimate is over $20,000 including GST. Cover should be confirmed before taking money or commencing work.'
      : null;
  const complianceFlags: string[] = [];
  complianceFlags.push('Final site measure required before final quote confirmation');
  complianceFlags.push('NSW deposit guidance: maximum deposit should be 10% of the final home building contract price');
  if (depositWarning) complianceFlags.push('Proposed deposit exceeds 10% guidance');
  if (hbcRequired) complianceFlags.push('HBC likely required if residential work exceeds $20,000 including GST');
  if (hbcWarning) complianceFlags.push('HBC cover not confirmed');
  if (input.strataApprovalRequired || input.propertyType === 'strataApartment') complianceFlags.push('Strata/apartment approval review required');
  if (input.basixReviewRequired || input.structuralWorks.wallRemoval || input.structuralWorks.windowDoorChanges) complianceFlags.push('BASIX review may be required for wider renovation threshold risk');
  if (input.dbpReviewRequired || input.propertyType === 'strataApartment') complianceFlags.push('DBP/class 2 screening required for apartment risk');
  if (input.asbestosRisk) complianceFlags.push('Older-property/asbestos risk review required');
  if (input.trades.plumbing || input.trades.electrical || input.trades.gas) complianceFlags.push('Licensed trade confirmation required for plumbing, gas or electrical work');
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
  assumptions.push('This is an estimate range for planning and quote review, not a final fixed quote.');
  assumptions.push('Final site measure, confirmed selections and licensed trade review are required before written quote confirmation.');
  if (!input.measurementsProvided) assumptions.push('Measurements will be verified during site visit.');
  if (input.supportingFiles.length > 0) assumptions.push(`${input.supportingFiles.length} supporting file(s) supplied for professional review.`);
  if (input.designPlan) assumptions.push(`Customer design plan attached for review: ${summarizeDesignPlan(input.designPlan)}.`);
  if (input.zones.length > 0) assumptions.push(`Estimate includes ${input.zones.length + 1} project zones including kitchen${input.zones.length ? `, ${input.zones.map((zone) => zone.name).join(', ')}` : ''}.`);
  if (selectedApplianceCount(input) > 0) assumptions.push('Appliance allowances are planning placeholders until exact model selections and installation requirements are confirmed.');
  if (input.flooring.included) assumptions.push('Flooring allowance is included for the nominated kitchen area only and should be reconciled with any flooring-specific quote.');
  assumptions.push('Deposit on a final NSW home building contract must not exceed 10%.');
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
  if (input.asbestosRisk) flags.push('Older-property/asbestos risk requires site review');
  if (input.strataApprovalRequired || input.propertyType === 'strataApartment') flags.push('Apartment or strata project requires approval pathway review');
  if (input.basixReviewRequired || input.dbpReviewRequired) flags.push('Building approval pathway requires manual screening');
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
    assumptions,
    exclusions,
    manualReviewFlags,
    flags,
    recommendedNextStep,
  };
}
