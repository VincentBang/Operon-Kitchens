import { AdvancedReviewConsolePayload } from '../../src/lib/advancedReviewConsole';
import { allowanceRiskSafetyMessage } from '../../src/lib/allowanceRisk';

export const advancedReviewPayloadFixtureLeadId = '0993f583-2d91-4d4c-bf3f-afd71d4ebb30';
export const advancedReviewPayloadFixtureRequestId = 'contract-test-request-001';

export const advancedReviewPayloadFixture: AdvancedReviewConsolePayload = {
  leadId: advancedReviewPayloadFixtureLeadId,
  source: 'scopeBuilder',
  createdAt: '2026-06-25T10:00:00.000Z',
  scopeSummary: [
    'Layout: Galley',
    'Property: Apartment or strata review likely',
    'Scope: Benchtop, splashback, cabinetry and service review',
  ],
  allowanceRiskFlags: [
    {
      id: 'service-relocation-review',
      category: 'services',
      label: 'Service relocation review',
      customerSafePrompt: 'Plumbing, electrical or gas changes may require licensed trade review before written scope confirmation.',
      requiresHumanReview: true,
    },
  ],
  missingInclusions: [
    'Confirm whether demolition and rubbish removal are included.',
    'Confirm whether splashback material and installation are included.',
  ],
  customerQuestions: [
    'Is electrical relocation included or excluded?',
    'Are appliance allowances listed clearly?',
  ],
  siteMeasurePreparation: [
    'Prepare cabinet run dimensions and ceiling height.',
    'Prepare photos of access, services and existing benchtop junctions.',
  ],
  recommendedOperatorAction: 'review_scope',
  safetyMessage: allowanceRiskSafetyMessage,
};

export const validAdvancedReviewPayloadRequestBody = {
  payload: advancedReviewPayloadFixture,
  requestId: advancedReviewPayloadFixtureRequestId,
};

export const rawScopeBuilderStateRequestBody = {
  payload: {
    leadId: advancedReviewPayloadFixtureLeadId,
    layoutType: 'galley',
    roomLengthMm: '3100',
    roomWidthMm: '2300',
    cabinetZones: ['Base cabinets', 'Overheads'],
    rawScopeBuilderState: true,
  },
};

export const unsafeAdvancedReviewPayloadRequestBody = {
  payload: {
    ...advancedReviewPayloadFixture,
    supplierCost: 12000,
    internalRate: 95,
    margin: 0.22,
    leadScore: 91,
    adminPriority: 'urgent',
    internalNotes: 'Call this one first.',
    serviceRoleKey: 'not-a-real-secret',
  },
};

export const oversizedAdvancedReviewPayloadRequestBody = {
  payload: {
    ...advancedReviewPayloadFixture,
    customerQuestions: Array.from({ length: 31 }, (_, index) => `Question ${index + 1}`),
  },
};
