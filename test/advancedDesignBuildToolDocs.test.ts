import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('advanced kitchen design-build tool documentation', () => {
  const expectedDocs = [
    'docs/advanced-kitchen-design-build-tool-master-plan.md',
    'docs/advanced-kitchen-design-build-tool-implementation-tracker.md',
    'docs/advanced-kitchen-design-build-tool-product-architecture.md',
    'docs/advanced-kitchen-design-build-tool-data-contracts.md',
    'docs/advanced-kitchen-design-build-tool-decisions.md',
    'docs/advanced-kitchen-design-build-tool-phase-1-spec.md',
    'docs/advanced-kitchen-design-build-tool-phase-2-spec.md',
    'docs/advanced-kitchen-design-build-tool-phase-2-viewport-review.md',
    'docs/advanced-kitchen-design-build-tool-phase-3-spec.md',
    'docs/advanced-kitchen-design-build-tool-phase-3-viewport-review.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-planning-spec.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql',
    'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md',
    'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md',
    'docs/advanced-kitchen-design-build-tool-phase-0-baseline-audit.md',
  ];

  it('creates the required advanced-tool source-of-truth documents', () => {
    for (const docPath of expectedDocs) {
      expect(existsSync(join(process.cwd(), docPath))).toBe(true);
    }
  });

  it('keeps the master plan stage-gated and customer-safe', () => {
    const masterPlan = readDoc('docs/advanced-kitchen-design-build-tool-master-plan.md');

    expect(masterPlan).toContain('Advanced Kitchen Design-Build Tool Master Plan');
    expect(masterPlan).toContain('Phase 0');
    expect(masterPlan).toContain('Phase 1');
    expect(masterPlan).toContain('Phase 2');
    expect(masterPlan).toContain('Phase 3');
    expect(masterPlan).toContain('Phase 4');
    expect(masterPlan).toContain('Phase 5');
    expect(masterPlan).toContain('Phase 6');
    expect(masterPlan).toContain('Phase 7');
    expect(masterPlan).toContain('Never implement more than one major stage without explicit approval');
    expect(masterPlan).toContain('Site measure and written scope confirmation are required before contract pricing');
    expect(masterPlan).toContain('Do not build or imply');
    expect(masterPlan).toContain('supplier ordering');
    expect(masterPlan).toContain('payment processing');
    expect(masterPlan).toContain('full CRM');
    expect(masterPlan).toContain('Deployment status: not needed');
  });

  it('records Phase 5 planning as spec-only with runtime still gated', () => {
    const tracker = readDoc('docs/advanced-kitchen-design-build-tool-implementation-tracker.md');

    expect(tracker).toContain('Phase 5 slice 1 is implemented locally as pure projection helpers and tests.');
    expect(tracker).toContain('Phase 5 slice 2 storage-adapter planning, interface sketch, no-write mock harness, Netlify Function contract test plan, request/response contract fixtures, thin function implementation plan, helper-only function boundary, wrapper-only implementation plan, wrapper contract tests, disabled/no-write wrapper creation plan, disabled/no-write Netlify wrapper, real Supabase adapter planning spec, mocked Supabase adapter contract tests, real adapter implementation plan, real Supabase adapter, wrapper replacement plan, wrapper replacement contract tests, activation checklists, an exact SQL-only approval packet, a wrapper replacement implementation checklist, a wrapper replacement patch plan, active-wrapper contract tests, a wrapper activation readiness review and the local active wrapper replacement are implemented locally.');
    expect(tracker).toContain('Phase 5 production persistence activation, Supabase migrations, admin UI runtime and browser submission wiring have not started.');
    expect(tracker).toContain('NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF');
    expect(tracker).toContain('NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER');
    expect(tracker).toContain('Browser viewport metrics for `/scope-builder`');
    expect(tracker).toContain('route is not linked from public header, footer, chatbot or sitemap');
    expect(tracker).toContain('Production migrations: none applied');
    expect(tracker).toContain('npm test -- --runInBand');
    expect(tracker).toContain('Human review the active local wrapper replacement with the SQL-only approval packet');
    expect(tracker).toContain('Supabase migration, admin UI and browser submission wiring not approved');
  });

  it('documents the real static-export and Netlify Functions architecture', () => {
    const architecture = readDoc('docs/advanced-kitchen-design-build-tool-product-architecture.md');
    const audit = readDoc('docs/advanced-kitchen-design-build-tool-phase-0-baseline-audit.md');

    expect(architecture).toContain('Next.js `^14.2.35`');
    expect(architecture).toContain("`output: 'export'`");
    expect(architecture).toContain('Netlify Functions');
    expect(architecture).toContain('/quote/review');
    expect(architecture).toContain('/request-review');
    expect(architecture).toContain('/admin/leads');
    expect(architecture).toContain('kitchen-request-review');
    expect(architecture).toContain('kitchen_request_reviews');
    expect(architecture).toContain('CustomerQuoteSummary');
    expect(audit).toContain('Phase 0 Baseline Audit');
    expect(audit).toContain('Data Already Captured');
    expect(audit).toContain('Data Gaps For Advanced Tool');
  });

  it('defines conceptual data contracts without approving database changes', () => {
    const contracts = readDoc('docs/advanced-kitchen-design-build-tool-data-contracts.md');

    expect(contracts).toContain('DesignBrief');
    expect(contracts).toContain('DesignBriefDraft');
    expect(contracts).toContain('MissingInformationItem');
    expect(contracts).toContain('RecommendedPathway');
    expect(contracts).toContain('KitchenScope');
    expect(contracts).toContain('KitchenDimensions');
    expect(contracts).toContain('KitchenZone');
    expect(contracts).toContain('ServiceChange');
    expect(contracts).toContain('AllowanceItem');
    expect(contracts).toContain('RiskFlag');
    expect(contracts).toContain('RiskSummary');
    expect(contracts).toContain('SiteMeasureChecklist');
    expect(contracts).toContain('ReportRecord');
    expect(contracts).toContain('AdvancedReviewConsolePayload');
    expect(contracts).toContain('AdvancedReviewInternalState');
    expect(contracts).toContain('These are conceptual TypeScript-style contracts only');
    expect(contracts).toContain('src/lib/advancedReviewConsole.ts');
    expect(contracts).toContain('supplier costs');
    expect(contracts).toContain('service role keys');
  });

  it('captures architecture decisions and Phase 1 and Phase 2 acceptance criteria', () => {
    const decisions = readDoc('docs/advanced-kitchen-design-build-tool-decisions.md');
    const phase1 = readDoc('docs/advanced-kitchen-design-build-tool-phase-1-spec.md');
    const phase2 = readDoc('docs/advanced-kitchen-design-build-tool-phase-2-spec.md');
    const phase2Viewport = readDoc('docs/advanced-kitchen-design-build-tool-phase-2-viewport-review.md');
    const phase3 = readDoc('docs/advanced-kitchen-design-build-tool-phase-3-spec.md');
    const phase3Viewport = readDoc('docs/advanced-kitchen-design-build-tool-phase-3-viewport-review.md');
    const phase5 = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-planning-spec.md');
    const phase5Slice2 = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md');
    const phase5FunctionPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md');
    const phase5ThinFunctionPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md');
    const phase5WrapperPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md');
    const phase5DisabledWrapperPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md');
    const phase5RealSupabaseAdapterPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md');
    const phase5RealAdapterImplementationPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md');
    const phase5WrapperReplacementPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md');
    const phase5ActivationChecklists = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md');
    const phase5SqlApprovalPacket = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql');
    const phase5WrapperReplacementChecklist = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md');
    const phase5WrapperReplacementPatchPlan = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md');
    const phase5WrapperActivationReadinessReview = readDoc('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md');

    expect(decisions).toContain('Structured Data Comes Before AI');
    expect(decisions).toContain('Visual Planning Is Deferred');
    expect(decisions).toContain('Numeric Scores Are Gated');
    expect(decisions).toContain('Persistence Is Approval-Gated');
    expect(decisions).toContain('Feature Flag Defaults Off');
    expect(decisions).toContain('Human Review Is Required For Reports');
    expect(phase1).toContain('Preferred route: `/design-brief`');
    expect(phase1).toContain('Do not expose this route in the public header, footer, chatbot or sitemap');
    expect(phase1).toContain('Existing written quote: primary `/quote/review`');
    expect(phase1).toContain('No quote and early planning: primary `/quote`');
    expect(phase1).toContain('Complex apartment, strata, access, structural or service-relocation concern: primary `/request-review`');
    expect(phase1).toContain('Ready for the next planning step');
    expect(phase1).toContain('Out Of Scope');
    expect(phase2).toContain('Kitchen Scope Builder');
    expect(phase2).toContain('Preferred route: `/scope-builder`');
    expect(phase2).toContain('NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER');
    expect(phase2).toContain('measurement preparation checklist');
    expect(phase2).toContain('Out Of Scope');
    expect(phase2Viewport).toContain('1440 x 900');
    expect(phase2Viewport).toContain('390 x 844');
    expect(phase2Viewport).toContain('no horizontal overflow');
    expect(phase2Viewport).toContain('Do not begin Phase 3');
    expect(phase3).toContain('Allowance And Quote-Risk Engine');
    expect(phase3).toContain('evaluateAllowanceAndQuoteRisk');
    expect(phase3).toContain('Human review recommended');
    expect(phase3).toContain('Out Of Scope');
    expect(phase3Viewport).toContain('Allowance and quote-risk prompts');
    expect(phase3Viewport).toContain('No horizontal overflow');
    expect(phase3Viewport).toContain('exclude both routes from the global chatbot shell');
    expect(phase3Viewport).toContain('Do not begin Phase 5');
    expect(phase5).toContain('Internal Review Console Integration');
    expect(phase5).toContain('Slice 1 is implemented locally as pure projection helpers and tests only');
    expect(phase5).toContain('Slice 2 is documented locally as a server-mediated storage-adapter plan only');
    expect(phase5).toContain('AdvancedReviewConsolePayload');
    expect(phase5).toContain('src/lib/advancedReviewConsole.ts');
    expect(phase5).toContain('kitchen_advanced_review_payloads');
    expect(phase5).toContain('Do not apply this SQL');
    expect(phase5).toContain('Out Of Scope');
    expect(phase5Slice2).toContain('Server-Mediated Storage Adapter');
    expect(phase5Slice2).toContain('This document now includes a completed local interface sketch.');
    expect(phase5Slice2).toContain('src/lib/advancedReviewStorage.ts');
    expect(phase5Slice2).toContain('test/advancedReviewStorage.test.ts');
    expect(phase5Slice2).toContain('This is a contract sketch, not a storage adapter implementation.');
    expect(phase5Slice2).toContain('test/helpers/advancedReviewStorageMockHarness.ts');
    expect(phase5Slice2).toContain('test/advancedReviewStorageMockHarness.test.ts');
    expect(phase5Slice2).toContain('test/fixtures/advancedReviewPayloadFunctionFixtures.ts');
    expect(phase5Slice2).toContain('src/lib/advancedReviewPayloadFunction.ts');
    expect(phase5Slice2).toContain('test/helpers/advancedReviewPayloadFunctionContractHelper.ts');
    expect(phase5Slice2).toContain('This is a test harness only. It is not production storage code');
    expect(phase5Slice2).toContain('AdvancedReviewConsolePayload');
    expect(phase5Slice2).toContain('POST /.netlify/functions/kitchen-advanced-review-payload');
    expect(phase5Slice2).toContain('kitchen_advanced_review_payloads');
    expect(phase5Slice2).toContain('Do not apply this SQL');
    expect(phase5Slice2).toContain('browser-side Supabase writes');
    expect(phase5Slice2).toContain('Human review this slice 2 storage-adapter plan and the Netlify Function contract test plan.');
    expect(phase5FunctionPlan).toContain('Netlify Function Contract Test Plan');
    expect(phase5FunctionPlan).toContain('POST /.netlify/functions/kitchen-advanced-review-payload');
    expect(phase5FunctionPlan).toContain('The disabled/no-write Netlify wrapper now exists locally. No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved');
    expect(phase5FunctionPlan).toContain('AdvancedReviewConsolePayload');
    expect(phase5FunctionPlan).toContain('validateAdvancedReviewPayloadForStorage');
    expect(phase5FunctionPlan).toContain('405');
    expect(phase5FunctionPlan).toContain('advanced_review_payload_env_missing');
    expect(phase5FunctionPlan).toContain('advanced_review_lead_not_found');
    expect(phase5FunctionPlan).toContain('advanced_review_insert_failed');
    expect(phase5FunctionPlan).toContain('advanced_review_payload_stored');
    expect(phase5FunctionPlan).toContain('Do not return success unless the storage adapter returns `stored: true`.');
    expect(phase5FunctionPlan).toContain('service keys');
    expect(phase5FunctionPlan).toContain('supplier costs');
    expect(phase5FunctionPlan).toContain('lead score');
    expect(phase5FunctionPlan).toContain('test/fixtures/advancedReviewPayloadFunctionFixtures.ts');
    expect(phase5FunctionPlan).toContain('test/helpers/advancedReviewPayloadFunctionContractHelper.ts');
    expect(phase5FunctionPlan).toContain('test/advancedReviewPayloadFunctionContractHelper.test.ts');
    expect(phase5FunctionPlan).toContain('This is a helper-only runtime slice and test fixture layer. It is not a Netlify Function implementation.');
    expect(phase5FunctionPlan).toContain('advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md');
    expect(phase5FunctionPlan).toContain('helper-only slice now exists in `src/lib/advancedReviewPayloadFunction.ts`');
    expect(phase5FunctionPlan).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md');
    expect(phase5FunctionPlan).toContain('test/advancedReviewPayloadWrapperContract.test.ts');
    expect(phase5ThinFunctionPlan).toContain('Thin Function Implementation Plan');
    expect(phase5ThinFunctionPlan).toContain('The helper-only function boundary and disabled/no-write Netlify wrapper now exist locally. No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved');
    expect(phase5ThinFunctionPlan).toContain('src/lib/advancedReviewPayloadFunction.ts');
    expect(phase5ThinFunctionPlan).toContain('netlify/functions/kitchen-advanced-review-payload.ts');
    expect(phase5ThinFunctionPlan).toContain('Implemented Helper-Only Slice');
    expect(phase5ThinFunctionPlan).toContain('modern Netlify Function syntax');
    expect(phase5ThinFunctionPlan).toContain('Netlify.env.get');
    expect(phase5ThinFunctionPlan).toContain('validAdvancedReviewPayloadRequestBody');
    expect(phase5ThinFunctionPlan).toContain('rawScopeBuilderStateRequestBody');
    expect(phase5ThinFunctionPlan).toContain('unsafeAdvancedReviewPayloadRequestBody');
    expect(phase5ThinFunctionPlan).toContain('oversizedAdvancedReviewPayloadRequestBody');
    expect(phase5ThinFunctionPlan).toContain('Do not return success unless the adapter returns `stored: true`.');
    expect(phase5ThinFunctionPlan).toContain('performs no Supabase writes');
    expect(phase5ThinFunctionPlan).toContain('Created only the disabled/no-write Netlify wrapper after explicit local approval.');
    expect(phase5ThinFunctionPlan).toContain('real Supabase adapter plan only');
    expect(phase5ThinFunctionPlan).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md');
    expect(phase5ThinFunctionPlan).toContain('test/advancedReviewPayloadWrapperContract.test.ts');
    expect(phase5WrapperPlan).toContain('Wrapper-Only Implementation Plan');
    expect(phase5WrapperPlan).toContain('netlify/functions/kitchen-advanced-review-payload.ts');
    expect(phase5WrapperPlan).toContain('The approved local slice creates the wrapper file with a disabled adapter only. No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved');
    expect(phase5WrapperPlan).toContain('netlify/functions/kitchen-advanced-review-payload.ts');
    expect(phase5WrapperPlan).toContain('handleAdvancedReviewPayloadFunctionRequest');
    expect(phase5WrapperPlan).toContain('modern default export');
    expect(phase5WrapperPlan).toContain('Netlify.env.get');
    expect(phase5WrapperPlan).toContain('Do not create a real Supabase adapter in the wrapper-only slice.');
    expect(phase5WrapperPlan).toContain('no raw payload logging');
    expect(phase5WrapperPlan).toContain('wrapper contract tests');
    expect(phase5WrapperPlan).toContain('test/advancedReviewPayloadWrapperContract.test.ts');
    expect(phase5WrapperPlan).toContain('Request-compatible');
    expect(phase5WrapperPlan).toContain('actual wrapper file exists and uses modern default export syntax');
    expect(phase5WrapperPlan).toContain('Do not create a real Supabase adapter in the wrapper-only slice.');
    expect(phase5WrapperPlan).toContain('advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md');
    expect(phase5DisabledWrapperPlan).toContain('Disabled Wrapper Creation Plan');
    expect(phase5DisabledWrapperPlan).toContain('The disabled/no-write Netlify Function wrapper has now been implemented locally');
    expect(phase5DisabledWrapperPlan).toContain('No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved');
    expect(phase5DisabledWrapperPlan).toContain('modern Netlify default export syntax');
    expect(phase5DisabledWrapperPlan).toContain('handleAdvancedReviewPayloadFunctionRequest');
    expect(phase5DisabledWrapperPlan).toContain('disabled/no-write adapter');
    expect(phase5DisabledWrapperPlan).toContain('advanced_review_payload_env_missing');
    expect(phase5DisabledWrapperPlan).toContain('503');
    expect(phase5DisabledWrapperPlan).toContain('Never fake success');
    expect(phase5DisabledWrapperPlan).toContain('do not use `process.env`');
    expect(phase5DisabledWrapperPlan).toContain('This wrapper does not read environment variables and does not import Supabase.');
    expect(phase5RealSupabaseAdapterPlan).toContain('Real Supabase Adapter Plan');
    expect(phase5RealSupabaseAdapterPlan).toContain('planning spec and mocked contract-test layer for a future real Supabase storage adapter');
    expect(phase5RealSupabaseAdapterPlan).toContain('public.kitchen_advanced_review_payloads');
    expect(phase5RealSupabaseAdapterPlan).toContain('No Supabase adapter code, Supabase SQL application, production environment change, admin UI, browser submission wiring, deploy, push or production verification is approved');
    expect(phase5RealSupabaseAdapterPlan).toContain('server-mediated through Netlify Functions');
    expect(phase5RealSupabaseAdapterPlan).toContain('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(phase5RealSupabaseAdapterPlan).toContain('alter table public.kitchen_advanced_review_payloads enable row level security');
    expect(phase5RealSupabaseAdapterPlan).toContain('revoke all on table public.kitchen_advanced_review_payloads from anon');
    expect(phase5RealSupabaseAdapterPlan).toContain('grant select, insert, update, delete on table public.kitchen_advanced_review_payloads to service_role');
    expect(phase5RealSupabaseAdapterPlan).toContain('Do not apply this SQL until Vincent explicitly approves a production database task');
    expect(phase5RealSupabaseAdapterPlan).toContain('Do not return success unless Supabase insert returns a durable stored record.');
    expect(phase5RealSupabaseAdapterPlan).toContain('test/helpers/advancedReviewSupabaseAdapterContractHarness.ts');
    expect(phase5RealSupabaseAdapterPlan).toContain('test/advancedReviewSupabaseAdapterContract.test.ts');
    expect(phase5RealSupabaseAdapterPlan).toContain('src/lib/advancedReviewSupabaseStorage.ts` exists locally');
    expect(phase5RealSupabaseAdapterPlan).toContain('docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md');
    expect(phase5RealAdapterImplementationPlan).toContain('Real Adapter Implementation Plan');
    expect(phase5RealAdapterImplementationPlan).toContain('src/lib/advancedReviewSupabaseStorage.ts');
    expect(phase5RealAdapterImplementationPlan).toContain('test/advancedReviewSupabaseStorage.test.ts');
    expect(phase5RealAdapterImplementationPlan).toContain('Default strategy: use direct Supabase REST calls with `fetch`');
    expect(phase5RealAdapterImplementationPlan).toContain('Do not add `@supabase/supabase-js` for the first real adapter slice');
    expect(phase5RealAdapterImplementationPlan).toContain('OPERON_KITCHENS_SUPABASE_URL');
    expect(phase5RealAdapterImplementationPlan).toContain('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(phase5RealAdapterImplementationPlan).toContain('GET {SUPABASE_URL}/rest/v1/kitchen_request_reviews?id=eq.{leadId}&select=id&limit=1');
    expect(phase5RealAdapterImplementationPlan).toContain('POST {SUPABASE_URL}/rest/v1/kitchen_advanced_review_payloads');
    expect(phase5RealAdapterImplementationPlan).toContain('Use mocked `global.fetch` responses only. Do not call Supabase.');
    expect(phase5RealAdapterImplementationPlan).toContain('Do not update:');
    expect(phase5RealAdapterImplementationPlan).toContain('netlify/functions/kitchen-advanced-review-payload.ts');
    expect(phase5RealAdapterImplementationPlan).toContain('Do not create `NEXT_PUBLIC_` equivalents.');
    expect(phase5RealAdapterImplementationPlan).toContain('Do not log variable values.');
    expect(phase5RealAdapterImplementationPlan).toContain('adapter code and wrapper replacement contract tests exist locally, but no SQL, actual wrapper replacement, admin UI, browser wiring or deploy is approved');
    expect(phase5RealAdapterImplementationPlan).toContain('wrapper replacement contract tests already prove');
    expect(phase5WrapperReplacementPlan).toContain('Wrapper Replacement Plan');
    expect(phase5WrapperReplacementPlan).toContain('test/advancedReviewPayloadWrapperReplacementContract.test.ts');
    expect(phase5WrapperReplacementPlan).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(phase5WrapperReplacementPlan).toContain('Do not replace the disabled wrapper in this slice.');
    expect(phase5WrapperReplacementPlan).toContain('No SQL application, admin UI change, browser submission wiring, deploy, push or production verification is approved.');
    expect(phase5WrapperReplacementPlan).toContain('advanced_review_payload_stored');
    expect(phase5WrapperReplacementPlan).toContain('advanced_review_payload_env_missing');
    expect(phase5WrapperReplacementPlan).toContain('advanced_review_lead_not_found');
    expect(phase5WrapperReplacementPlan).toContain('advanced_review_insert_failed');
    expect(phase5WrapperReplacementPlan).toContain('supplier costs');
    expect(phase5WrapperReplacementPlan).toContain('service keys');
    expect(phase5WrapperReplacementPlan).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md');
    expect(phase5WrapperReplacementPlan).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md');
    expect(phase5ActivationChecklists).toContain('Advanced Tool Phase 5 - Activation Checklists');
    expect(phase5ActivationChecklists).toContain('No SQL was applied. No wrapper file was replaced. No admin UI was changed. No browser submission wiring was added. No deploy, push or production verification is approved.');
    expect(phase5ActivationChecklists).toContain('SQL migration checklist');
    expect(phase5ActivationChecklists).toContain('Wrapper replacement checklist');
    expect(phase5ActivationChecklists).toContain('Enable RLS on `public.kitchen_advanced_review_payloads`.');
    expect(phase5ActivationChecklists).toContain('Revoke table access from `anon` and `authenticated`.');
    expect(phase5ActivationChecklists).toContain('Use service-role access only through the server-side adapter.');
    expect(phase5ActivationChecklists).toContain('Do not create `NEXT_PUBLIC_` Supabase service-role variables');
    expect(phase5ActivationChecklists).toContain('Do not drop `public.kitchen_request_reviews`.');
    expect(phase5ActivationChecklists).toContain('netlify/functions/kitchen-advanced-review-payload.ts` is the only runtime wrapper file touched');
    expect(phase5ActivationChecklists).toContain('No response exposes:');
    expect(phase5ActivationChecklists).toContain('supplier costs');
    expect(phase5ActivationChecklists).toContain('admin priority');
    expect(phase5ActivationChecklists).toContain('Stop after one verification cycle to protect Netlify credits.');
    expect(phase5ActivationChecklists).toContain('docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql');
    expect(phase5ActivationChecklists).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md');
    expect(phase5ActivationChecklists).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md');
    expect(phase5ActivationChecklists).toContain('table-specific `public.set_kitchen_advanced_review_payloads_updated_at()` trigger helper');
    expect(phase5SqlApprovalPacket).toContain('create table if not exists public.kitchen_advanced_review_payloads');
    expect(phase5SqlApprovalPacket).toContain('lead_id uuid not null references public.kitchen_request_reviews(id) on delete cascade');
    expect(phase5SqlApprovalPacket).toContain("source text not null check (source in ('requestReview', 'designBrief', 'scopeBuilder', 'quoteReview'))");
    expect(phase5SqlApprovalPacket).toContain("payload_schema_version text not null default 'advanced-review-console-v1'");
    expect(phase5SqlApprovalPacket).toContain('customer_safe_payload jsonb not null');
    expect(phase5SqlApprovalPacket).toContain("internal_review_status text not null default 'not_started'");
    expect(phase5SqlApprovalPacket).toContain('alter table public.kitchen_advanced_review_payloads enable row level security');
    expect(phase5SqlApprovalPacket).toContain('revoke all on table public.kitchen_advanced_review_payloads from anon');
    expect(phase5SqlApprovalPacket).toContain('revoke all on table public.kitchen_advanced_review_payloads from authenticated');
    expect(phase5SqlApprovalPacket).toContain('grant select, insert, update, delete on table public.kitchen_advanced_review_payloads to service_role');
    expect(phase5SqlApprovalPacket).toContain('create or replace function public.set_kitchen_advanced_review_payloads_updated_at()');
    expect(phase5SqlApprovalPacket).toContain('create trigger set_kitchen_advanced_review_payloads_updated_at');
    expect(phase5SqlApprovalPacket).toContain('select tablename, rowsecurity');
    expect(phase5SqlApprovalPacket).toContain('Do not run this SQL until the Phase 5 SQL migration gate is approved.');
    expect(phase5SqlApprovalPacket).not.toContain('#');
    expect(phase5SqlApprovalPacket).not.toContain('NEXT_PUBLIC_OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(phase5SqlApprovalPacket).not.toContain('service-role-test-key');
    expect(phase5WrapperReplacementChecklist).toContain('Wrapper Replacement Implementation Checklist');
    expect(phase5WrapperReplacementChecklist).toContain('No wrapper file was replaced. No SQL was applied. No admin UI was changed. No browser submission wiring was added.');
    expect(phase5WrapperReplacementChecklist).toContain('Netlify.env.get');
    expect(phase5WrapperReplacementChecklist).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(phase5WrapperReplacementChecklist).toContain('handleAdvancedReviewPayloadFunctionRequest');
    expect(phase5WrapperReplacementChecklist).toContain('Keep the default `/.netlify/functions/kitchen-advanced-review-payload` route');
    expect(phase5WrapperReplacementChecklist).toContain('The active wrapper does not use `process.env`.');
    expect(phase5WrapperReplacementChecklist).toContain('Stored success');
    expect(phase5WrapperReplacementChecklist).toContain('advanced_review_payload_stored');
    expect(phase5WrapperReplacementChecklist).toContain('Restore `disabledAdvancedReviewStorageAdapter`');
    expect(phase5WrapperReplacementChecklist).toContain('No response, log, test fixture, email, browser output or public doc may expose');
    expect(phase5WrapperReplacementChecklist).toContain('service role keys');
    expect(phase5WrapperReplacementChecklist).toContain('admin priority');
    expect(phase5WrapperReplacementChecklist).toContain('raw customer document text');
    expect(phase5WrapperReplacementChecklist).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md');
    expect(phase5WrapperReplacementPatchPlan).toContain('Wrapper Replacement Patch Plan');
    expect(phase5WrapperReplacementPatchPlan).toContain('No wrapper file was replaced. No SQL was applied. No admin UI was changed. No browser submission wiring was added.');
    expect(phase5WrapperReplacementPatchPlan).toContain('This is the intended future change, not a patch to apply in this task.');
    expect(phase5WrapperReplacementPatchPlan).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL')");
    expect(phase5WrapperReplacementPatchPlan).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY')");
    expect(phase5WrapperReplacementPatchPlan).toContain('disabledAdvancedReviewStorageAdapter');
    expect(phase5WrapperReplacementPatchPlan).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(phase5WrapperReplacementPatchPlan).toContain('keep the default `/.netlify/functions/kitchen-advanced-review-payload` route');
    expect(phase5WrapperReplacementPatchPlan).toContain('The wrapper no longer contains `disabledAdvancedReviewStorageAdapter`.');
    expect(phase5WrapperReplacementPatchPlan).toContain('Active-wrapper contract tests now exist in `test/advancedReviewPayloadActiveWrapperContract.test.ts`');
    expect(phase5WrapperReplacementPatchPlan).toContain('prepare a wrapper activation readiness review');
    expect(phase5WrapperReplacementPatchPlan).toContain('still without changing the actual wrapper, applying SQL, changing admin UI, wiring browser submissions, pushing or deploying');
    expect(phase5WrapperActivationReadinessReview).toContain('Wrapper Activation Readiness Review');
    expect(phase5WrapperActivationReadinessReview).toContain('No SQL was applied. No admin UI was changed.');
    expect(phase5WrapperActivationReadinessReview).toContain('public.kitchen_advanced_review_payloads');
    expect(phase5WrapperActivationReadinessReview).toContain('RLS is enabled');
    expect(phase5WrapperActivationReadinessReview).toContain('anon` has no table access');
    expect(phase5WrapperActivationReadinessReview).toContain('authenticated` has no table access');
    expect(phase5WrapperActivationReadinessReview).toContain('service_role` has only the documented server-side table access');
    expect(phase5WrapperActivationReadinessReview).toContain('Netlify.env.get`, not `process.env`');
    expect(phase5WrapperActivationReadinessReview).toContain('advanced_review_payload_stored');
    expect(phase5WrapperActivationReadinessReview).toContain('No-Go Triggers');
    expect(phase5WrapperActivationReadinessReview).toContain('Restore `disabledAdvancedReviewStorageAdapter`');
  });

  it('links the advanced-tool docs from the docs index, task queue and decision log', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');
    const decisions = readDoc('DECISION_LOG.md');

    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-master-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-implementation-tracker.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-product-architecture.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-data-contracts.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-1-spec.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-2-spec.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-2-viewport-review.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-3-spec.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-3-viewport-review.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-planning-spec.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-activation-checklists.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md');
    expect(docsIndex).toContain('advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md');
    expect(docsIndex).toContain('advancedReviewPayloadActiveWrapperContract.test.ts');
    expect(docsIndex).toContain('active wrapper tests now cover the local replacement');
    expect(docsIndex).toContain('historical disabled/no-write wrapper baseline');
    expect(docsIndex).toContain('planning spec and mocked contract-test layer for future `kitchen_advanced_review_payloads` storage');
    expect(docsIndex).toContain('copy-paste-safe SQL packet');
    expect(tasks).toContain('Advanced design-build tool stage gate');
    expect(tasks).toContain('NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER');
    expect(tasks).toContain('src/lib/advancedReviewConsole.ts');
    expect(tasks).toContain('src/lib/advancedReviewStorage.ts');
    expect(tasks).toContain('src/lib/advancedReviewPayloadFunction.ts');
    expect(tasks).toContain('test/helpers/advancedReviewStorageMockHarness.ts');
    expect(tasks).toContain('test/fixtures/advancedReviewPayloadFunctionFixtures.ts');
    expect(tasks).toContain('test/helpers/advancedReviewPayloadFunctionContractHelper.ts');
    expect(tasks).toContain('test/advancedReviewPayloadWrapperContract.test.ts');
    expect(tasks).toContain('netlify/functions/kitchen-advanced-review-payload.ts');
    expect(tasks).toContain('test/advancedReviewPayloadDisabledWrapper.test.ts');
    expect(tasks).toContain('test/helpers/advancedReviewSupabaseAdapterContractHarness.ts');
    expect(tasks).toContain('test/advancedReviewSupabaseAdapterContract.test.ts');
    expect(tasks).toContain('src/lib/advancedReviewSupabaseStorage.ts');
    expect(tasks).toContain('test/advancedReviewSupabaseStorage.test.ts');
    expect(tasks).toContain('test/advancedReviewPayloadWrapperReplacementContract.test.ts');
    expect(tasks).toContain('test/advancedReviewPayloadActiveWrapperContract.test.ts');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-phase-5-planning-spec.md');
    expect(tasks).toContain('docs/advanced-kitchen-design-build-tool-implementation-tracker.md');
    expect(existsSync(join(process.cwd(), 'src/lib/advancedReviewConsole.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewConsole.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'src/lib/advancedReviewStorage.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'src/lib/advancedReviewPayloadFunction.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewStorage.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/helpers/advancedReviewStorageMockHarness.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewStorageMockHarness.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/fixtures/advancedReviewPayloadFunctionFixtures.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/helpers/advancedReviewPayloadFunctionContractHelper.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewPayloadFunctionContractHelper.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewPayloadWrapperContract.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'netlify/functions/kitchen-advanced-review-payload.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewPayloadDisabledWrapper.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/helpers/advancedReviewSupabaseAdapterContractHarness.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewSupabaseAdapterContract.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'src/lib/advancedReviewSupabaseStorage.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewSupabaseStorage.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewPayloadWrapperReplacementContract.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/advancedReviewPayloadActiveWrapperContract.test.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md'))).toBe(true);
    const appShell = readDoc('src/pages/_app.tsx');
    expect(appShell).toContain("'/design-brief'");
    expect(appShell).toContain("'/scope-builder'");
    expect(decisions).toContain('Advanced Design-Build Tool Roadmap Captured Locally');
    expect(decisions).toContain('Phase 2 Kitchen Scope Builder Implemented Locally');
    expect(decisions).toContain('Phase 2 Scope Builder Viewport Review Completed Locally');
    expect(decisions).toContain('Phase 3 Allowance And Quote-Risk Engine Implemented Locally');
    expect(decisions).toContain('Phase 3 Risk Prompt Viewport Review Completed Locally');
    expect(decisions).toContain('Phase 3 Approved For Phase 5 Planning');
    expect(decisions).toContain('Phase 5 Internal Review Console Planning Spec Added Locally');
    expect(decisions).toContain('Phase 5 Slice 1 Projection Helpers Implemented Locally');
    expect(decisions).toContain('Phase 5 Slice 2 Storage-Adapter Plan Added Locally');
    expect(decisions).toContain('Phase 5 Slice 2 Storage Interface Sketch Added Locally');
    expect(decisions).toContain('Phase 5 Slice 2 No-Write Mock Harness Added Locally');
    expect(decisions).toContain('Phase 5 Netlify Function Contract Test Plan Added Locally');
    expect(decisions).toContain('Phase 5 Function Contract Fixtures Added Locally');
    expect(decisions).toContain('Phase 5 Thin Function Implementation Plan Added Locally');
    expect(decisions).toContain('Phase 5 Helper-Only Function Boundary Added Locally');
    expect(decisions).toContain('Phase 5 Wrapper-Only Implementation Plan Added Locally');
    expect(decisions).toContain('Phase 5 Wrapper Contract Tests Added Locally');
    expect(decisions).toContain('Phase 5 Disabled Wrapper Added Locally');
    expect(decisions).toContain('Phase 5 Disabled Wrapper Creation Plan Added Locally');
    expect(decisions).toContain('Phase 5 Real Supabase Adapter Plan Added Locally');
    expect(decisions).toContain('Phase 5 Mocked Supabase Adapter Contract Tests Added Locally');
    expect(decisions).toContain('Phase 5 Real Adapter Implementation Plan Added Locally');
    expect(decisions).toContain('Phase 5 Real Supabase Adapter Implemented Locally');
    expect(decisions).toContain('Phase 5 Wrapper Replacement Contract Tests And Plan Added Locally');
    expect(decisions).toContain('Phase 5 Activation Checklists Added Locally');
    expect(decisions).toContain('Phase 5 SQL Approval Packet Prepared Locally');
    expect(decisions).toContain('Phase 5 Wrapper Replacement Implementation Checklist Added Locally');
    expect(decisions).toContain('Phase 5 Wrapper Replacement Patch Plan Added Locally');
    expect(decisions).toContain('Phase 5 Active Wrapper Contract Tests Added Locally');
    expect(decisions).toContain('Phase 5 Wrapper Activation Readiness Review Added Locally');
    expect(decisions).toContain('Advanced Review Storage Must Be Server-Mediated');
  });
});
