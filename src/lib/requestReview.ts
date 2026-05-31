export const propertyTypeOptions = ['house', 'townhouse', 'apartment', 'strataApartment', 'notSure'] as const;
export const projectStageOptions = ['planning', 'quoteInHand', 'readyForMeasure', 'urgent', 'notSure'] as const;
export const yesNoOptions = ['yes', 'no', 'notSure'] as const;
export const preferredNextStepOptions = ['planningEstimate', 'quoteReview', 'siteMeasure', 'scopeDiscussion'] as const;

export type PropertyTypeOption = typeof propertyTypeOptions[number];
export type ProjectStageOption = typeof projectStageOptions[number];
export type YesNoOption = typeof yesNoOptions[number];
export type PreferredNextStepOption = typeof preferredNextStepOptions[number];

export interface KitchenRequestReviewLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  suburb?: string;
  propertyType: PropertyTypeOption;
  projectStage: ProjectStageOption;
  hasCurrentQuote: YesNoOption;
  hasPhotosPlans: YesNoOption;
  approximateBudgetRange?: string;
  preferredNextStep: PreferredNextStepOption;
  message: string;
  privacyAcknowledged: true;
  termsAcknowledged: true;
  marketingOptIn: boolean;
  sourceRoute: string;
  createdAt: string;
}

interface ValidationSuccess {
  ok: true;
  data: KitchenRequestReviewLead;
}

interface ValidationFailure {
  ok: false;
  status: number;
  errors: string[];
}

export type RequestReviewValidationResult = ValidationSuccess | ValidationFailure;

const disallowedKeys = new Set([
  'margin',
  'markup',
  'supplierCost',
  'supplierCosts',
  'internalRate',
  'internalRates',
  'leadScore',
  'leadPriority',
  'adminNotes',
  'internalNotes',
  'followUpPriority',
  'quoteLineItems',
  'lineItemCosts',
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isOneOf<T extends readonly string[]>(value: string, options: T): value is T[number] {
  return options.includes(value);
}

function findDisallowedKeys(value: unknown, path = ''): string[] {
  if (!isRecord(value)) return [];
  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const currentPath = path ? `${path}.${key}` : key;
    const matched = disallowedKeys.has(key) ? [currentPath] : [];
    return matched.concat(findDisallowedKeys(nestedValue, currentPath));
  });
}

function looksSpammy(message: string) {
  const linkCount = (message.match(/https?:\/\//gi) ?? []).length;
  const repeatedCharacter = /(.)\1{14,}/.test(message);
  const spamTerms = /\b(casino|crypto giveaway|forex signal|loan offer|seo backlink)\b/i.test(message);
  return linkCount > 3 || repeatedCharacter || spamTerms;
}

function createLeadId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const value = Math.floor(Math.random() * 16);
    const resolved = token === 'x' ? value : (value & 0x3) | 0x8;
    return resolved.toString(16);
  });
}

export function validateKitchenRequestReview(input: unknown): RequestReviewValidationResult {
  if (!isRecord(input)) {
    return { ok: false, status: 400, errors: ['Request body must be an object.'] };
  }

  if (cleanString(input.website, 120)) {
    return { ok: false, status: 400, errors: ['Submission could not be accepted.'] };
  }

  const unsafeKeys = findDisallowedKeys(input);
  if (unsafeKeys.length > 0) {
    return { ok: false, status: 400, errors: ['Submission includes unsupported internal fields.'] };
  }

  const name = cleanString(input.name, 120);
  const email = cleanString(input.email, 160).toLowerCase();
  const phone = cleanString(input.phone, 60);
  const suburb = cleanString(input.suburb, 120);
  const propertyType = cleanString(input.propertyType, 40);
  const projectStage = cleanString(input.projectStage, 40);
  const hasCurrentQuote = cleanString(input.hasCurrentQuote, 20);
  const hasPhotosPlans = cleanString(input.hasPhotosPlans, 20);
  const approximateBudgetRange = cleanString(input.approximateBudgetRange, 80);
  const preferredNextStep = cleanString(input.preferredNextStep, 40);
  const message = cleanString(input.message, 1500);
  const sourceRoute = cleanString(input.sourceRoute, 120) || '/request-review';
  const marketingOptIn = input.marketingOptIn === true;

  const errors: string[] = [];
  if (!name) errors.push('Name is required.');
  if (!email || !emailPattern.test(email)) errors.push('A valid email is required.');
  if (!isOneOf(propertyType, propertyTypeOptions)) errors.push('Property type is required.');
  if (!isOneOf(projectStage, projectStageOptions)) errors.push('Project stage is required.');
  if (!isOneOf(hasCurrentQuote, yesNoOptions)) errors.push('Current quote answer is required.');
  if (!isOneOf(hasPhotosPlans, yesNoOptions)) errors.push('Photos/plans answer is required.');
  if (!isOneOf(preferredNextStep, preferredNextStepOptions)) errors.push('Preferred next step is required.');
  if (message.length < 10) errors.push('Message must include at least 10 characters.');
  if (looksSpammy(message)) errors.push('Message appears automated or unsafe.');
  if (input.privacyAcknowledged !== true) errors.push('Privacy acknowledgement is required.');
  if (input.termsAcknowledged !== true) errors.push('Terms acknowledgement is required.');

  if (errors.length > 0) return { ok: false, status: 400, errors };

  return {
    ok: true,
    data: {
      id: createLeadId(),
      name,
      email,
      phone: phone || undefined,
      suburb: suburb || undefined,
      propertyType: propertyType as PropertyTypeOption,
      projectStage: projectStage as ProjectStageOption,
      hasCurrentQuote: hasCurrentQuote as YesNoOption,
      hasPhotosPlans: hasPhotosPlans as YesNoOption,
      approximateBudgetRange: approximateBudgetRange || undefined,
      preferredNextStep: preferredNextStep as PreferredNextStepOption,
      message,
      privacyAcknowledged: true,
      termsAcknowledged: true,
      marketingOptIn,
      sourceRoute,
      createdAt: new Date().toISOString(),
    },
  };
}

export function createCustomerRequestAcknowledgement(lead: KitchenRequestReviewLead) {
  return {
    requestId: lead.id,
    message: 'Your request has been received for Operon Kitchens review intake.',
    nextStep:
      lead.preferredNextStep === 'siteMeasure'
        ? 'We will use your details to assess whether site measure is the right next step.'
        : 'We will use your details to prepare the right quote review or planning follow-up.',
  };
}
