export const propertyTypeOptions = ['house', 'townhouse', 'apartment', 'strataApartment', 'notSure'] as const;
export const projectStageOptions = ['planning', 'quoteInHand', 'readyForMeasure', 'urgent', 'notSure'] as const;
export const yesNoOptions = ['yes', 'no', 'notSure'] as const;
export const preferredNextStepOptions = ['planningEstimate', 'quoteReview', 'siteMeasure', 'scopeDiscussion'] as const;
export const requestReviewFileCategoryOptions = ['existingQuote', 'photo', 'plan', 'applianceList', 'other'] as const;

export type PropertyTypeOption = typeof propertyTypeOptions[number];
export type ProjectStageOption = typeof projectStageOptions[number];
export type YesNoOption = typeof yesNoOptions[number];
export type PreferredNextStepOption = typeof preferredNextStepOptions[number];
export type RequestReviewFileCategoryOption = typeof requestReviewFileCategoryOptions[number];

export const requestReviewFileLimits = {
  maxFiles: 6,
  maxFileBytes: 4 * 1024 * 1024,
  maxTotalBytes: 10 * 1024 * 1024,
};

export interface KitchenRequestReviewFile {
  id: string;
  name: string;
  category: RequestReviewFileCategoryOption;
  mimeType: string;
  size: number;
  contentBase64: string;
}

export interface RequestReviewAttribution {
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
}

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
  attribution: RequestReviewAttribution;
  files: KitchenRequestReviewFile[];
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
const base64Pattern = /^[a-z0-9+/]+={0,2}$/i;
const allowedFileMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);
const allowedFileExtensions = new Set(['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanFileName(value: unknown) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[^\w .()[\]-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
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

function getFileExtension(fileName: string) {
  const extension = fileName.split('.').pop();
  return extension ? extension.toLowerCase() : '';
}

function mimeTypeFromExtension(extension: string) {
  if (extension === 'pdf') return 'application/pdf';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  if (extension === 'heif') return 'image/heif';
  return 'application/octet-stream';
}

function normaliseBase64Content(value: unknown) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const commaIndex = trimmed.indexOf(',');
  return (commaIndex >= 0 ? trimmed.slice(commaIndex + 1) : trimmed).replace(/\s+/g, '');
}

function getBase64ByteLength(base64: string) {
  if (!base64) return 0;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function validateRequestReviewFiles(input: Record<string, unknown>, errors: string[]): KitchenRequestReviewFile[] {
  const rawFiles = input.files ?? input.uploadedFiles;
  if (rawFiles === undefined || rawFiles === null) return [];
  if (!Array.isArray(rawFiles)) {
    errors.push('Uploaded files must be supplied as a list.');
    return [];
  }
  if (rawFiles.length > requestReviewFileLimits.maxFiles) {
    errors.push(`Upload up to ${requestReviewFileLimits.maxFiles} files for this request.`);
    return [];
  }

  const files: KitchenRequestReviewFile[] = [];
  let totalBytes = 0;

  for (const rawFile of rawFiles) {
    if (!isRecord(rawFile)) {
      errors.push('Each uploaded file must include safe file metadata.');
      continue;
    }

    const name = cleanFileName(rawFile.name);
    const category = cleanString(rawFile.category, 40);
    const submittedMimeType = cleanString(rawFile.mimeType ?? rawFile.type, 120).toLowerCase();
    const declaredSize = typeof rawFile.size === 'number' && Number.isFinite(rawFile.size) ? Math.max(0, Math.round(rawFile.size)) : 0;
    const contentBase64 = normaliseBase64Content(rawFile.contentBase64 ?? rawFile.base64);
    const decodedSize = getBase64ByteLength(contentBase64);
    const size = declaredSize || decodedSize;
    const extension = getFileExtension(name);
    const fileTypeAllowed = allowedFileMimeTypes.has(submittedMimeType) || allowedFileExtensions.has(extension);

    if (!name) errors.push('Each uploaded file needs a safe file name.');
    if (!isOneOf(category, requestReviewFileCategoryOptions)) errors.push('Uploaded file category is not supported.');
    if (!fileTypeAllowed) {
      errors.push('Uploaded files must be PDF or common image files.');
    }
    if (!contentBase64 || !base64Pattern.test(contentBase64)) errors.push('Uploaded file content could not be read safely.');
    if (!size || size !== decodedSize) errors.push('Uploaded file size could not be verified.');
    if (size > requestReviewFileLimits.maxFileBytes) errors.push('Each uploaded file must be 4MB or smaller.');

    totalBytes += size;
    if (name && isOneOf(category, requestReviewFileCategoryOptions) && fileTypeAllowed && contentBase64 && size === decodedSize && size <= requestReviewFileLimits.maxFileBytes) {
      files.push({
        id: createLeadId(),
        name,
        category,
        mimeType: allowedFileMimeTypes.has(submittedMimeType) ? submittedMimeType : mimeTypeFromExtension(extension),
        size,
        contentBase64,
      });
    }
  }

  if (totalBytes > requestReviewFileLimits.maxTotalBytes) {
    errors.push('Total uploaded file size must be 10MB or smaller.');
    return [];
  }

  return files;
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
  const sourceRoute = cleanString(input.sourceRoute ?? input.source_route, 120) || '/request-review';
  const referrer = cleanString(input.referrer, 500);
  const utmSource = cleanString(input.utmSource ?? input.utm_source, 120);
  const utmMedium = cleanString(input.utmMedium ?? input.utm_medium, 120);
  const utmCampaign = cleanString(input.utmCampaign ?? input.utm_campaign, 160);
  const utmContent = cleanString(input.utmContent ?? input.utm_content, 160);
  const utmTerm = cleanString(input.utmTerm ?? input.utm_term, 160);
  const landingPage = cleanString(input.landingPage ?? input.landing_page, 500);
  const marketingOptIn = input.marketingOptIn === true;

  const errors: string[] = [];
  const files = validateRequestReviewFiles(input, errors);
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
      attribution: {
        referrer: referrer || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmContent: utmContent || undefined,
        utmTerm: utmTerm || undefined,
        landingPage: landingPage || undefined,
      },
      files,
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
    uploadedFileCount: lead.files.length,
  };
}
