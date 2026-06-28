import { readFileSync } from 'fs';
import { join } from 'path';
import { createScopeBuilderReviewPayload } from '../src/lib/advancedReviewConsole';
import { evaluateAllowanceAndQuoteRisk } from '../src/lib/allowanceRisk';
import { defaultKitchenScopeInput, evaluateKitchenScope } from '../src/lib/kitchenScope';
import { createAdvancedReviewStorageMockHarness } from './helpers/advancedReviewStorageMockHarness';

describe('advanced review storage mock harness', () => {
  const leadId = '0993f583-2d91-4d4c-bf3f-afd71d4ebb30';
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
      leadId,
      createdAt: '2026-06-24T11:00:00.000Z',
      kitchenScope: evaluateKitchenScope(scopeInput),
      allowanceRisk: evaluateAllowanceAndQuoteRisk(scopeInput),
    });
  }

  it('simulates a successful storage path without writing outside memory', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [leadId] });
    const result = await harness.savePayload({ payload: createPayload() });

    expect(result).toEqual({
      ok: true,
      stored: true,
      recordId: 'mock-1',
      diagnostic: 'advanced_review_payload_stored',
    });
    expect(harness.getDiagnostics()).toEqual(['advanced_review_payload_stored']);
    expect(harness.getStoredDrafts()).toHaveLength(1);
    expect(harness.getStoredDrafts()[0]).toMatchObject({
      lead_id: leadId,
      source: 'scopeBuilder',
      internal_review_status: 'not_started',
    });
  });

  it('simulates validation failure without storing a draft', async () => {
    const harness = createAdvancedReviewStorageMockHarness();
    const result = await harness.savePayload({
      payload: {
        ...createPayload(),
        leadScore: 100,
        adminPriority: 'urgent',
      } as any,
    });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
    expect(harness.getDiagnostics()).toEqual(['advanced_review_payload_invalid']);
  });

  it('simulates missing storage environment without faking success', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ mode: 'envMissing' });
    const result = await harness.savePayload({ payload: createPayload() });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
  });

  it('simulates lead-link failure when a known lead cannot be confirmed', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: ['different-lead-id'] });
    const result = await harness.savePayload({ payload: createPayload() });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
  });

  it('simulates insert failure without leaking unsafe fields', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ mode: 'insertFailed' });
    const result = await harness.savePayload({ payload: createPayload() });
    const text = JSON.stringify(result).toLowerCase();

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });
    expect(text).not.toContain('service_role');
    expect(text).not.toContain('supplier cost');
    expect(text).not.toContain('internal rate');
    expect(text).not.toContain('margin');
    expect(text).not.toContain('lead score');
    expect(text).not.toContain('admin priority');
  });

  it('keeps the mock harness test-only and free of Supabase or Netlify runtime imports', () => {
    const source = readFileSync(join(process.cwd(), 'test/helpers/advancedReviewStorageMockHarness.ts'), 'utf8');

    expect(source).not.toContain('@supabase/supabase-js');
    expect(source).not.toContain('createClient');
    expect(source).not.toContain('process.env');
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('Handler');
    expect(source).not.toContain('Netlify');
  });
});
