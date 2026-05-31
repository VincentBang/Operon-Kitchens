export type ReviewFileCategory = 'existingQuote' | 'photo' | 'plan' | 'other';

export interface ReviewFileSummary {
  id: string;
  name: string;
  category: ReviewFileCategory;
  size?: number;
}

export interface KitchenQuoteReviewJobDetails {
  propertyType: 'house' | 'townhouse' | 'strataApartment' | 'unsure';
  projectType: 'fullRenovation' | 'cabinetryRefresh' | 'benchtopSplashback' | 'unsure';
  hasLayoutChange: boolean;
  servicesRelocated: boolean;
  demolitionIncluded: boolean;
  wasteIncluded: boolean;
  strataOrApartment: boolean;
  benchtopKnown: boolean;
  splashbackKnown: boolean;
  appliancesSpecified: boolean;
}

export type ReviewCheckKey =
  | 'missingInclusions'
  | 'pcSums'
  | 'provisionalSums'
  | 'depositHbc'
  | 'exclusions'
  | 'serviceRelocation'
  | 'applianceAssumptions'
  | 'benchtopSplashback'
  | 'strataApartment'
  | 'demolitionWaste'
  | 'siteMeasure';

export interface KitchenQuoteReviewIntake {
  checkedItems: Partial<Record<ReviewCheckKey, boolean>>;
  files: ReviewFileSummary[];
  jobDetails: KitchenQuoteReviewJobDetails;
}

export interface KitchenQuoteReviewResult {
  status: 'notReady' | 'partial' | 'reviewReady';
  confidenceScore: number;
  reviewScores: {
    scopeClarity: number;
    allowanceRisk: number;
    missingInformation: number;
    reviewReadiness: number;
  };
  checksExplained: { key: ReviewCheckKey; label: string; explanation: string; checked: boolean }[];
  missingItems: string[];
  unclearItems: string[];
  customerQuestions: string[];
  manualReviewFlags: string[];
  compliancePrompts: string[];
  complianceFlags: string[];
  recommendedNextStep: string;
  disclaimer: string;
}

export const reviewChecks: { key: ReviewCheckKey; label: string; explanation: string }[] = [
  { key: 'missingInclusions', label: 'Missing inclusions', explanation: 'Checks whether cabinetry, hardware, labour, trades, GST and site work are clearly included.' },
  { key: 'pcSums', label: 'Unclear PC sums', explanation: 'Prime cost allowances should identify what is provisional and what later selections may change.' },
  { key: 'provisionalSums', label: 'Unclear provisional sums', explanation: 'Provisional sums should explain uncertain work such as services, demolition or preparation.' },
  { key: 'depositHbc', label: 'Deposit / HBC flags', explanation: 'Looks for deposit terms and whether HBC review may be needed for residential work over $20,000 including GST.' },
  { key: 'exclusions', label: 'Exclusions', explanation: 'Confirms what is excluded so the quote is not compared on headline total alone.' },
  { key: 'serviceRelocation', label: 'Service relocation', explanation: 'Plumbing, electrical and gas relocation require licensed trade confirmation.' },
  { key: 'applianceAssumptions', label: 'Appliance assumptions', explanation: 'Appliance model, size, connection and installation assumptions should be visible.' },
  { key: 'benchtopSplashback', label: 'Benchtop/splashback clarity', explanation: 'Material, thickness, restrictions and fabrication assumptions should be clear.' },
  { key: 'strataApartment', label: 'Strata/apartment risks', explanation: 'Apartment work may need strata approval, access booking and class 2 screening.' },
  { key: 'demolitionWaste', label: 'Demolition and waste scope', explanation: 'Removal, disposal, protection and make-good work should not be assumed.' },
  { key: 'siteMeasure', label: 'Site measure requirement', explanation: 'Project-specific pricing should follow site measure and confirmed selections.' },
];

export function createDefaultReviewJobDetails(): KitchenQuoteReviewJobDetails {
  return {
    propertyType: 'unsure',
    projectType: 'unsure',
    hasLayoutChange: false,
    servicesRelocated: false,
    demolitionIncluded: false,
    wasteIncluded: false,
    strataOrApartment: false,
    benchtopKnown: false,
    splashbackKnown: false,
    appliancesSpecified: false,
  };
}

export function evaluateKitchenQuoteReview(intake: KitchenQuoteReviewIntake): KitchenQuoteReviewResult {
  const checksExplained = reviewChecks.map((check) => ({
    ...check,
    checked: Boolean(intake.checkedItems[check.key]),
  }));
  const missingItems = checksExplained.filter((check) => !check.checked).map((check) => check.label);
  const unclearItems: string[] = [];
  const customerQuestions: string[] = [];
  const manualReviewFlags: string[] = [];
  const compliancePrompts: string[] = [
    'Site measure required before project-specific pricing confirmation',
    'This review is planning guidance only and is not legal advice',
  ];
  const quoteFileSupplied = intake.files.some((file) => file.category === 'existingQuote');
  const supportingVisualsSupplied = intake.files.some((file) => file.category === 'photo' || file.category === 'plan');

  if (!quoteFileSupplied) {
    manualReviewFlags.push('Existing quote document still needs to be supplied or described');
    unclearItems.push('Quote document');
  }
  if (!supportingVisualsSupplied) {
    manualReviewFlags.push('Photos or plans would improve review confidence');
    unclearItems.push('Photos or plans');
  }
  if (intake.jobDetails.servicesRelocated || !intake.checkedItems.serviceRelocation) {
    compliancePrompts.push('Licensed electrical, plumbing or gas trade confirmation may be required');
    customerQuestions.push('Is plumbing, electrical or gas being moved, upgraded or reconnected by licensed trades?');
  }
  if (intake.jobDetails.strataOrApartment || intake.jobDetails.propertyType === 'strataApartment' || !intake.checkedItems.strataApartment) {
    compliancePrompts.push('Strata/apartment approval and DBP/class 2 screening may require review');
    customerQuestions.push('Does the quote allow for strata approval, lift booking, access protection and building rules?');
  }
  if (!intake.checkedItems.depositHbc) {
    compliancePrompts.push('Deposit and HBC terms need confirmation, including 10% maximum deposit guidance and HBC review over $20,000 including GST');
    customerQuestions.push('Are deposit terms, HBC review items and written contract requirements clearly stated?');
  }
  if (!intake.checkedItems.benchtopSplashback || !intake.jobDetails.benchtopKnown || !intake.jobDetails.splashbackKnown) {
    compliancePrompts.push('Benchtop/splashback material and engineered-stone restriction needs confirmation');
    unclearItems.push('Benchtop or splashback material');
    customerQuestions.push('Does the quote state benchtop and splashback material, cut-outs, joins, edge details and material restriction review items?');
  }
  if (!intake.jobDetails.demolitionIncluded || !intake.jobDetails.wasteIncluded || !intake.checkedItems.demolitionWaste) {
    manualReviewFlags.push('Demolition, protection and waste removal scope needs confirmation');
    unclearItems.push('Demolition, protection or waste removal');
    customerQuestions.push('Is demolition, rubbish removal, protection and final clean included or excluded?');
  }
  if (!intake.jobDetails.appliancesSpecified || !intake.checkedItems.applianceAssumptions) {
    manualReviewFlags.push('Appliance assumptions need confirmation');
    unclearItems.push('Appliance allowance or exact models');
    customerQuestions.push('Are appliances excluded, included as PC sums, or listed by exact model and installation requirement?');
  }
  if (!intake.checkedItems.pcSums) customerQuestions.push('Are all PC sums clearly described with realistic allowance amounts and selection responsibilities?');
  if (!intake.checkedItems.provisionalSums) customerQuestions.push('Are provisional sums limited to genuinely uncertain work and explained clearly?');
  if (!intake.checkedItems.exclusions) customerQuestions.push('What exclusions could become variations after work starts?');
  if (!intake.checkedItems.siteMeasure) customerQuestions.push('Does the quote state that site measure and written scope confirmation are required before commitment?');

  const completedCount = checksExplained.filter((check) => check.checked).length;
  const hasScopeChecks = Boolean(intake.checkedItems.missingInclusions && intake.checkedItems.exclusions && intake.checkedItems.demolitionWaste && intake.checkedItems.siteMeasure);
  const allowanceRisk = Math.max(
    0,
    100 -
      [
        intake.checkedItems.pcSums,
        intake.checkedItems.provisionalSums,
        intake.checkedItems.applianceAssumptions,
        intake.checkedItems.benchtopSplashback,
      ].filter(Boolean).length * 25,
  );
  const fileScore = quoteFileSupplied ? 15 : 0;
  const visualScore = supportingVisualsSupplied ? 10 : 0;
  const detailScore = Math.round((completedCount / reviewChecks.length) * 75);
  const confidenceScore = Math.min(100, detailScore + fileScore + visualScore);
  const status = confidenceScore >= 80 ? 'reviewReady' : confidenceScore >= 45 ? 'partial' : 'notReady';
  const recommendedNextStep =
    status === 'reviewReady'
      ? 'Submit this review intake for professional scope review before comparing totals or making contract decisions.'
      : 'Add the missing quote details, photos/plans and unclear allowance information before professional review.';

  return {
    status,
    confidenceScore,
    reviewScores: {
      scopeClarity: hasScopeChecks ? 85 : Math.round((completedCount / reviewChecks.length) * 80),
      allowanceRisk,
      missingInformation: Math.max(0, Math.round((missingItems.length / reviewChecks.length) * 100)),
      reviewReadiness: confidenceScore,
    },
    checksExplained,
    missingItems,
    unclearItems: Array.from(new Set(unclearItems.length ? unclearItems : missingItems)),
    customerQuestions: Array.from(new Set(customerQuestions)),
    manualReviewFlags: Array.from(new Set(manualReviewFlags)),
    compliancePrompts: Array.from(new Set(compliancePrompts)),
    complianceFlags: Array.from(new Set(compliancePrompts)),
    recommendedNextStep,
    disclaimer: 'This intake does not replace full document review, legal advice, site inspection or written quote confirmation.',
  };
}
