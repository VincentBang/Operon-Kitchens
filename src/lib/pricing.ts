import rateCard from '@/data/rateCard.json';

/**
 * Types representing the shape of the quote data. These can be extended as needed.
 */
export interface QuoteInput {
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
  benchtopType: keyof typeof rateCard.benchtopRates;
  benchtopMetres: number;
  splashbackType: keyof typeof rateCard.splashbackRates;
  splashbackArea: number;
  trades: {
    plumbing: boolean;
    electrical: boolean;
    gas: boolean;
    tiling: boolean;
    painting: boolean;
  };
  highRiskItems: boolean;
}

export interface PricingResult {
  lineItems: { name: string; cost: number }[];
  subtotal: number;
  margin: number;
  contingency: number;
  gst: number;
  total: number;
  confidenceScore: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  assumptions: string[];
  exclusions: string[];
  flags: string[];
}

/**
 * Calculates a confidence score based on the quote input. The score begins at 100 and
 * deductions are applied based on missing information or complexity factors.
 */
function calculateConfidence(input: QuoteInput): number {
  let score = 100;
  if (!input.measurementsProvided) score -= 20;
  if (!input.photosProvided) score -= 10;
  if (input.layoutChange) score -= 10;
  if (input.propertyLevel === 'level2+') score -= 5;
  if (!input.hasLift && input.propertyLevel !== 'ground') score -= 5;
  if (input.parkingAccess === 'limited') score -= 5;
  if (input.highRiskItems) score -= 20;
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

/**
 * Calculates line-item costs and totals based on the provided quote input and rate card.
 */
export function calculatePricing(input: QuoteInput): PricingResult {
  const lineItems: { name: string; cost: number }[] = [];
  // Cabinetry
  const baseCost = input.baseLinearMetres * rateCard.cabinetry.baseRate;
  lineItems.push({ name: 'Base cabinets', cost: baseCost });
  const overheadCost = input.overheadLinearMetres * rateCard.cabinetry.overheadRate;
  lineItems.push({ name: 'Overhead cabinets', cost: overheadCost });
  const tallCost = input.tallCabinetQty * rateCard.cabinetry.tallCabinetRate;
  lineItems.push({ name: 'Tall cabinets', cost: tallCost });
  const drawerRunnerCost = input.drawerQty * rateCard.cabinetry.drawerRunnerRate[input.drawerRunnerLevel];
  lineItems.push({ name: 'Drawer runners', cost: drawerRunnerCost });
  const hingeCost = input.doorQty * rateCard.cabinetry.hingeRate[input.hingeLevel];
  lineItems.push({ name: 'Hinges', cost: hingeCost });
  const doorCost = input.doorQty * rateCard.doorFinishRates[input.doorFinish];
  lineItems.push({ name: 'Doors', cost: doorCost });
  const panelCost = input.panelQty * rateCard.panelRates[input.panelFinish];
  lineItems.push({ name: 'Panels', cost: panelCost });
  // Accessories
  const accessoriesCost = input.selectedAccessories.reduce((sum, key) => {
    return sum + rateCard.accessories[key];
  }, 0);
  if (accessoriesCost > 0) lineItems.push({ name: 'Accessories', cost: accessoriesCost });
  // Benchtop
  const benchtopCost = input.benchtopMetres * rateCard.benchtopRates[input.benchtopType];
  lineItems.push({ name: 'Benchtop', cost: benchtopCost });
  // Splashback
  const splashbackCost = input.splashbackArea * rateCard.splashbackRates[input.splashbackType];
  lineItems.push({ name: 'Splashback', cost: splashbackCost });
  // Installation labour
  const installCabinetCost = (input.baseLinearMetres + input.overheadLinearMetres) * rateCard.installation.cabinet;
  const installBenchCost = input.benchtopMetres * rateCard.installation.bench;
  const installSplashCost = input.splashbackArea * rateCard.installation.splashback;
  lineItems.push({ name: 'Installation labour', cost: installCabinetCost + installBenchCost + installSplashCost });
  // Trade allowances
  const tradeCost = Object.entries(input.trades).reduce((sum, [trade, selected]) => {
    if (selected) {
      // @ts-ignore
      return sum + rateCard.tradeAllowances[trade];
    }
    return sum;
  }, 0);
  if (tradeCost > 0) lineItems.push({ name: 'Trade allowances', cost: tradeCost });
  // Subtotal
  let subtotal = lineItems.reduce((sum, item) => sum + item.cost, 0);
  // Access loading
  let accessMultiplier = 0;
  if (input.propertyLevel === 'level1') accessMultiplier += rateCard.accessLoading.level1;
  if (input.propertyLevel === 'level2+') accessMultiplier += rateCard.accessLoading.level2Plus;
  if (!input.hasLift && input.propertyLevel !== 'ground') accessMultiplier += rateCard.accessLoading.noLift;
  if (input.parkingAccess === 'limited') accessMultiplier += rateCard.accessLoading.limitedParking;
  const accessCost = subtotal * accessMultiplier;
  if (accessCost > 0) lineItems.push({ name: 'Access loading', cost: accessCost });
  subtotal += accessCost;
  // Margin and contingency
  const margin = subtotal * rateCard.margin;
  const confidenceScore = calculateConfidence(input);
  const confidenceLevel = getConfidenceLevel(confidenceScore);
  // Increase contingency when confidence is low
  let contingencyFactor = rateCard.contingencyBase;
  if (confidenceLevel === 'medium') contingencyFactor += 0.05;
  if (confidenceLevel === 'low') contingencyFactor += 0.1;
  const contingency = subtotal * contingencyFactor;
  subtotal += margin + contingency;
  // GST
  const gst = subtotal * 0.1;
  const total = subtotal + gst;
  // Assumptions and exclusions
  const assumptions: string[] = [];
  const exclusions: string[] = [];
  // Example assumptions and exclusions based on input
  if (!input.measurementsProvided) assumptions.push('Measurements will be verified during site visit.');
  assumptions.push('Deposit on a final NSW home building contract must not exceed 10%.');
  if (total > 20000) assumptions.push('Projects over $20,000 including GST need Home Building Compensation insurance before taking a deposit or starting work.');
  if (input.highRiskItems) exclusions.push('Structural changes, wall removal, and major service relocations require separate quote.');
  // Flags
  const flags: string[] = [];
  if (confidenceLevel === 'low') flags.push('Low confidence – wide estimate range recommended');
  if (input.benchtopType === 'naturalStone') flags.push('Benchtop subject to supplier compliance confirmation');
  return {
    lineItems,
    subtotal: parseFloat((subtotal).toFixed(2)),
    margin: parseFloat(margin.toFixed(2)),
    contingency: parseFloat(contingency.toFixed(2)),
    gst: parseFloat(gst.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    confidenceScore,
    confidenceLevel,
    assumptions,
    exclusions,
    flags
  };
}
