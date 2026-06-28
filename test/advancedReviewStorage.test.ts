import { readFileSync } from 'fs';
import { join } from 'path';
import { createScopeBuilderReviewPayload } from '../src/lib/advancedReviewConsole';
import { evaluateAllowanceAndQuoteRisk } from '../src/lib/allowanceRisk';
import { defaultKitchenScopeInput, evaluateKitchenScope } from '../src/lib/kitchenScope';
import {
  AdvancedReviewStorageAdapter,
  advancedReviewInternalStatuses,
  advancedReviewPayloadFunctionPath,
  advancedReviewPayloadTableName,
  advancedReviewStorageDiagnostics,
  createAdvancedReviewStorageRecordDraft,
  validateAdvancedReviewPayloadForStorage,
} from '../src/lib/advancedReviewStorage';

describe('advanced review storage adapter contract sketch', () => {
  const scopeInput = {
    ...defaultKitchenScopeInput,
    layoutType: 'galley' as const,
    roomLengthMm: '3100',
    roomWidthMm: '2300',
    openingNotes: 'Balcony door and window near sink wall.',
    cabinetZones: ['Base cabinets', 'Overheads'],
    appliancePositions: ['Cooktop', 'Dishwasher'],
    benchtopScope: 'new' as const,
    splashbackScope: 'new' as const,
    demolitionAndRemoval: 'yes' as const,
    makeGoodWork: 'yes' as const,
    serviceChanges: {
      ...defaultKitchenScopeInput.serviceChanges,
      plumbing: 'relocationLikely' as const,
    },
    accessConstraints: ['Apartment or strata review'],
    scopeNotes: 'Apartment galley kitchen with plumbing relocation review.',
  };

  function createPayload() {
    return createScopeBuilderReviewPayload({
      leadId: '0993f583-2d91-4d4c-bf3f-afd71d4ebb30',
      createdAt: '2026-06-24T10:00:00.000Z',
      kitchenScope: evaluateKitchenScope(scopeInput),
      allowanceRisk: evaluateAllowanceAndQuoteRisk(scopeInput),
    });
  }

  it('defines the future server-mediated table, function and diagnostics without writing data', () => {
    expect(advancedReviewPayloadTableName).toBe('kitchen_advanced_review_payloads');
    expect(advancedReviewPayloadFunctionPath).toBe('/.netlify/functions/kitchen-advanced-review-payload');
    expect(advancedReviewInternalStatuses).toEqual([
      'not_started',
      'needs_customer_clarification',
      'ready_for_manual_review',
      'site_measure_recommended',
      'written_scope_draft_needed',
      'closed',
    ]);
    expect(advancedReviewStorageDiagnostics).toEqual(expect.arrayContaining([
      'advanced_review_payload_invalid',
      'advanced_review_payload_env_missing',
      'advanced_review_lead_not_found',
      'advanced_review_insert_failed',
      'advanced_review_payload_stored',
    ]));
  });

  it('validates a projected AdvancedReviewConsolePayload for future storage', () => {
    const payload = createPayload();
    const result = validateAdvancedReviewPayloadForStorage(payload);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.leadId).toBe(payload.leadId);
      expect(result.payload.source).toBe('scopeBuilder');
      expect(result.payload.safetyMessage).toContain('not legal advice');
    }
  });

  it('creates a record draft without inserting into Supabase', () => {
    const payload = createPayload();
    const draft = createAdvancedReviewStorageRecordDraft(payload);

    expect(draft).toEqual({
      lead_id: payload.leadId,
      source: 'scopeBuilder',
      created_at: payload.createdAt,
      customer_safe_payload: payload,
      internal_review_status: 'not_started',
    });
    expect(JSON.stringify(draft).toLowerCase()).not.toContain('service_role');
    expect(JSON.stringify(draft).toLowerCase()).not.toContain('supplier cost');
    expect(JSON.stringify(draft).toLowerCase()).not.toContain('lead score');
  });

  it('rejects raw design-builder objects and unsupported internal fields', () => {
    const rawPayload = {
      ...defaultKitchenScopeInput,
      supplierCost: 12000,
      internalRate: 88,
      margin: 0.25,
      leadScore: 91,
      adminPriority: 'urgent',
      serviceRoleKey: 'secret',
    };
    const result = validateAdvancedReviewPayloadForStorage(rawPayload);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostic).toBe('advanced_review_payload_invalid');
      expect(result.issues).toEqual(expect.arrayContaining([
        'Payload contains unsupported fields.',
        'leadId is required.',
      ]));
    }
  });

  it('rejects oversized arrays and safety-message drift', () => {
    const payload = {
      ...createPayload(),
      customerQuestions: Array.from({ length: 31 }, (_, index) => `Question ${index}`),
      safetyMessage: 'Final quote approved.',
    };
    const result = validateAdvancedReviewPayloadForStorage(payload);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual(expect.arrayContaining([
        'customerQuestions must be a bounded string array.',
        'safetyMessage must match the approved safe wording.',
      ]));
    }
  });

  it('allows tests to sketch an adapter implementation without adding production storage', async () => {
    const payload = createPayload();
    const fakeAdapter: AdvancedReviewStorageAdapter = {
      async savePayload(request) {
        return {
          ok: true,
          stored: true,
          recordId: `fake-${request.payload.leadId}`,
          diagnostic: 'advanced_review_payload_stored',
        };
      },
    };

    await expect(fakeAdapter.savePayload({ payload })).resolves.toMatchObject({
      ok: true,
      stored: true,
      diagnostic: 'advanced_review_payload_stored',
    });
  });

  it('does not import Supabase, Netlify Functions or runtime persistence dependencies', () => {
    const source = readFileSync(join(process.cwd(), 'src/lib/advancedReviewStorage.ts'), 'utf8');

    expect(source).not.toContain('@supabase/supabase-js');
    expect(source).not.toContain('createClient');
    expect(source).not.toContain('process.env.OPERON_KITCHENS_SUPABASE');
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('Handler');
    expect(source).not.toContain('Netlify');
  });
});
