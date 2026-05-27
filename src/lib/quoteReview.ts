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
  checksExplained: { key: ReviewCheckKey; label: string; explanation: string; checked: boolean }[];
  missingItems: string[];
  manualReviewFlags: string[];
  complianceFlags: string[];
  recommendedNextStep: string;
  disclaimer: string;
}

export const reviewChecks: { key: ReviewCheckKey; label: string; explanation: string }[] = [
  { key: 'missingInclusions', label: 'Missing inclusions', explanation: 'Checks whether cabinetry, hardware, labour, trades, GST and site work are clearly included.' },
  { key: 'pcSums', label: 'Unclear PC sums', explanation: 'Prime cost allowances should identify what is provisional and what final selections may change.' },
  { key: 'provisionalSums', label: 'Unclear provisional sums', explanation: 'Provisional sums should explain uncertain work such as services, demolition or preparation.' },
  { key: 'depositHbc', label: 'Deposit / HBC flags', explanation: 'Looks for deposit terms and whether HBC review may be needed for residential work over $20,000 including GST.' },
  { key: 'exclusions', label: 'Exclusions', explanation: 'Confirms what is excluded so the quote is not compared on headline total alone.' },
  { key: 'serviceRelocation', label: 'Service relocation', explanation: 'Plumbing, electrical and gas relocation require licensed trade confirmation.' },
  { key: 'applianceAssumptions', label: 'Appliance assumptions', explanation: 'Appliance model, size, connection and installation assumptions should be visible.' },
  { key: 'benchtopSplashback', label: 'Benchtop/splashback clarity', explanation: 'Material, thickness, compliance and fabrication assumptions should be clear.' },
  { key: 'strataApartment', label: 'Strata/apartment risks', explanation: 'Apartment work may need strata approval, access booking and class 2 screening.' },
  { key: 'demolitionWaste', label: 'Demolition and waste scope', explanation: 'Removal, disposal, protection and make-good work should not be assumed.' },
  { key: 'siteMeasure', label: 'Final site measure requirement', explanation: 'A final fixed quote should follow site measure and confirmed selections.' },
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
  const manualReviewFlags: string[] = [];
  const complianceFlags: string[] = ['Final site measure required before any final fixed quote can be confirmed'];
  const quoteFileSupplied = intake.files.some((file) => file.category === 'existingQuote');
  const supportingVisualsSupplied = intake.files.some((file) => file.category === 'photo' || file.category === 'plan');

  if (!quoteFileSupplied) manualReviewFlags.push('Existing quote document still needs to be supplied or described');
  if (!supportingVisualsSupplied) manualReviewFlags.push('Photos or plans would improve review confidence');
  if (intake.jobDetails.servicesRelocated || !intake.checkedItems.serviceRelocation) {
    complianceFlags.push('Licensed electrical, plumbing or gas trade confirmation may be required');
  }
  if (intake.jobDetails.strataOrApartment || intake.jobDetails.propertyType === 'strataApartment' || !intake.checkedItems.strataApartment) {
    complianceFlags.push('Strata/apartment approval and DBP/class 2 screening may require review');
  }
  if (!intake.checkedItems.depositHbc) complianceFlags.push('Deposit and HBC terms need confirmation');
  if (!intake.checkedItems.benchtopSplashback || !intake.jobDetails.benchtopKnown || !intake.jobDetails.splashbackKnown) {
    complianceFlags.push('Benchtop/splashback material and engineered-stone compliance need confirmation');
  }
  if (!intake.jobDetails.demolitionIncluded || !intake.jobDetails.wasteIncluded || !intake.checkedItems.demolitionWaste) {
    manualReviewFlags.push('Demolition, protection and waste removal scope needs confirmation');
  }
  if (!intake.jobDetails.appliancesSpecified || !intake.checkedItems.applianceAssumptions) {
    manualReviewFlags.push('Appliance assumptions need confirmation');
  }

  const completedCount = checksExplained.filter((check) => check.checked).length;
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
    checksExplained,
    missingItems,
    manualReviewFlags: Array.from(new Set(manualReviewFlags)),
    complianceFlags: Array.from(new Set(complianceFlags)),
    recommendedNextStep,
    disclaimer: 'This is a structured intake only. It does not perform full AI document review, legal advice or final price comparison.',
  };
}
