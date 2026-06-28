import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('next 100 controlled-testing documents', () => {
  it('tracks the approved 100-task local batch without approving deployment', () => {
    const queue = readDoc('docs/next-100-local-tasks-2026-06-17.md');

    expect(queue).toContain('Next 100 Local Tasks');
    expect(queue).toContain('Deployment status: not needed');
    expect(queue).toContain('No deploy, no push');
    expect(queue).toContain('100. Report deployment status and next recommended task.');
  });

  it('adds release, file-upload, email, quote-review, admin, SEO and risk runbooks', () => {
    const expectedDocs = [
      'docs/release-gate-trust-visual-file-upload.md',
      'docs/file-upload-approved-release-runbook.md',
      'docs/domain-email-resend-verification-runbook.md',
      'docs/quote-review-manual-trial-runbook.md',
      'docs/controlled-testing-feedback-scorecard.md',
      'docs/admin-operations-weekly-review.md',
      'docs/seo-controlled-rollout-backlog.md',
      'docs/operations-risk-register.md',
    ];

    for (const docPath of expectedDocs) {
      expect(existsSync(join(process.cwd(), docPath))).toBe(true);
    }
  });

  it('keeps file upload release guidance private, token gated and no-public-url oriented', () => {
    const runbook = readDoc('docs/file-upload-approved-release-runbook.md');

    expect(runbook).toContain('private Supabase Storage bucket');
    expect(runbook).toContain('token-gated signed-download function');
    expect(runbook).toContain('public file URLs');
    expect(runbook).toContain('browser-side Supabase writes');
    expect(runbook).toContain('Stop after one controlled verification');
  });

  it('keeps email as notification only and Supabase as source of truth', () => {
    const runbook = readDoc('docs/domain-email-resend-verification-runbook.md');

    expect(runbook).toContain('Supabase remains the source of truth');
    expect(runbook).toContain('Email is notification only');
    expect(runbook).toContain('service role key');
    expect(runbook).toContain('If storage succeeds and email fails');
  });

  it('keeps quote-review trials customer-safe', () => {
    const runbook = readDoc('docs/quote-review-manual-trial-runbook.md');

    expect(runbook).toContain('not legal advice');
    expect(runbook).toContain('written scope confirmation');
    expect(runbook).toContain('Do not use or expose');
    expect(runbook).toContain('supplier costs');
    expect(runbook).toContain('margin logic');
  });

  it('adds a first manual quote-review trial prep sheet before paid or CRM work', () => {
    const docPath = 'docs/quote-review-first-manual-trial-prep.md';
    const prep = readDoc(docPath);
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), docPath))).toBe(true);
    expect(prep).toContain('first unpaid Operon Kitchens quote-review trial');
    expect(prep).toContain('Lead Selection Criteria');
    expect(prep).toContain('Customer-Safe Mini Report Shape');
    expect(prep).toContain('First Trial Quality Gate');
    expect(prep).toContain('payment, checkout, PDF automation, customer login, full CRM');
    expect(prep).toContain('not legal advice');
    expect(prep).toContain('written scope confirmation');
    expect(prep).toContain('supplier costs');
    expect(docsIndex).toContain('quote-review-first-manual-trial-prep.md');
    expect(tasks).toContain('docs/quote-review-first-manual-trial-prep.md');
  });

  it('adds a filled fake first trial example and next-500 local execution map', () => {
    const examplePath = 'docs/quote-review-first-trial-filled-example.md';
    const queuePath = 'docs/next-500-local-tasks-2026-06-23.md';
    const example = readDoc(examplePath);
    const queue = readDoc(queuePath);
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), examplePath))).toBe(true);
    expect(existsSync(join(process.cwd(), queuePath))).toBe(true);
    expect(example).toContain('fake no-customer-data example');
    expect(example).toContain('Basic review ready');
    expect(example).toContain('Customer-Ready Questions');
    expect(example).toContain('not legal advice');
    expect(example).toContain('not a final quote');
    expect(example).toContain('site measure');
    expect(example).toContain('written scope confirmation');
    expect(example).toContain('supplier costs');
    expect(example).toContain('margin');
    expect(example).toContain('lead score');
    expect(queue).toContain('Next 500 Local Tasks');
    expect(queue).toContain('Deployment status: not needed');
    expect(queue).toContain('Current slices executed:');
    expect(queue).toContain('first filled fake apartment/strata trial example added locally');
    expect(queue).toContain('Do not add customer file portal');
    expect(queue).toContain('Avoid final fixed quote language');
    expect(docsIndex).toContain('next-500-local-tasks-2026-06-23.md');
    expect(docsIndex).toContain('quote-review-first-trial-filled-example.md');
    expect(tasks).toContain('docs/next-500-local-tasks-2026-06-23.md');
    expect(tasks).toContain('docs/quote-review-first-trial-filled-example.md');
  });

  it('adds a second fake service-relocation quote-review scenario before changing real intake fields', () => {
    const scenarioPath = 'docs/quote-review-second-trial-service-relocation-example.md';
    const scenario = readDoc(scenarioPath);
    const queue = readDoc('docs/next-500-local-tasks-2026-06-23.md');
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), scenarioPath))).toBe(true);
    expect(scenario).toContain('fake no-customer-data example');
    expect(scenario).toContain('house/full-renovation');
    expect(scenario).toContain('service relocation');
    expect(scenario).toContain('plumbing');
    expect(scenario).toContain('electrical');
    expect(scenario).toContain('gas');
    expect(scenario).toContain('make-good');
    expect(scenario).toContain('older-property/asbestos');
    expect(scenario).toContain('not legal advice');
    expect(scenario).toContain('not a final quote');
    expect(scenario).toContain('site measure');
    expect(scenario).toContain('written scope confirmation');
    expect(scenario).toContain('Do not include supplier costs');
    expect(scenario).toContain('Do not change the public form from one fake example alone');
    expect(queue).toContain('second filled fake house/full-renovation service-relocation example');
    expect(queue).toContain('service relocation may need separate plumbing, electrical, gas and make-good prompts');
    expect(docsIndex).toContain('quote-review-second-trial-service-relocation-example.md');
    expect(tasks).toContain('docs/quote-review-second-trial-service-relocation-example.md');
  });

  it('updates the manual worksheet with operator-only service-relocation prompts', () => {
    const worksheet = readDoc('docs/quote-review-manual-trial-worksheet.md');
    const queue = readDoc('docs/next-500-local-tasks-2026-06-23.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(worksheet).toContain('Optional Service-Relocation Review');
    expect(worksheet).toContain('Keep this operator-only for now');
    expect(worksheet).toContain('Do not change the public `/request-review` form from fake examples alone');
    expect(worksheet).toContain('Current and proposed service locations');
    expect(worksheet).toContain('Plumbing review prompts');
    expect(worksheet).toContain('Electrical review prompts');
    expect(worksheet).toContain('Gas review prompts');
    expect(worksheet).toContain('Make-good after demolition');
    expect(worksheet).toContain('Older-property risk');
    expect(worksheet).toContain('licensed plumbing review required');
    expect(worksheet).toContain('licensed electrical review required');
    expect(worksheet).toContain('licensed gas review required');
    expect(queue).toContain('manual worksheet optional service-relocation prompts added locally for operator use only');
    expect(tasks).toContain('quote-review manual worksheet now has optional operator-only service-relocation prompts');
  });

  it('adds a controlled-lead trial log for service-relocation prompt evidence', () => {
    const logPath = 'docs/quote-review-controlled-lead-trial-log.md';
    const log = readDoc(logPath);
    const queue = readDoc('docs/next-500-local-tasks-2026-06-23.md');
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), logPath))).toBe(true);
    expect(log).toContain('real controlled-lead quote-review trials');
    expect(log).toContain('Service-Relocation Prompt Usage');
    expect(log).toContain('plumbing relocation prompt used');
    expect(log).toContain('electrical relocation prompt used');
    expect(log).toContain('gas work prompt used');
    expect(log).toContain('make-good after demolition prompt used');
    expect(log).toContain('older-property/asbestos prompt used');
    expect(log).toContain('Do not request a public form change from this trial alone');
    expect(log).toContain('not a final quote');
    expect(log).toContain('written scope confirmation');
    expect(log).toContain('supplier costs');
    expect(log).toContain('service keys');
    expect(queue).toContain('real controlled-lead trial log added locally');
    expect(docsIndex).toContain('quote-review-controlled-lead-trial-log.md');
    expect(tasks).toContain('docs/quote-review-controlled-lead-trial-log.md');
  });

  it('adds customer-safe service-relocation wording snippets for manual reports', () => {
    const snippets = readDoc('docs/quote-review-wording-snippets.md');
    const pack = readDoc('docs/quote-review-manual-trial-pack.md');
    const queue = readDoc('docs/next-500-local-tasks-2026-06-23.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(snippets).toContain('## Service Relocation');
    expect(snippets).toContain('## Plumbing');
    expect(snippets).toContain('## Electrical');
    expect(snippets).toContain('## Gas');
    expect(snippets).toContain('## Make-Good After Demolition');
    expect(snippets).toContain('## Older-Property Risk');
    expect(snippets).toContain('licensed plumbing work');
    expect(snippets).toContain('licensed electrical work');
    expect(snippets).toContain('licensed gas disconnection');
    expect(snippets).toContain('included, excluded or provisional');
    expect(snippets).toContain('not legal advice');
    expect(snippets).toContain('building certification');
    expect(snippets).toContain('final quote');
    expect(pack).toContain('service-relocation wording for plumbing, electrical, gas, make-good and older-property review prompts');
    expect(pack).toContain('without sounding like trade inspection, legal advice or a final quote');
    expect(queue).toContain('service-relocation wording snippets added locally');
    expect(tasks).toContain('service-relocation wording snippets are added');
  });

  it('adds a one-page manual quote-review response draft for controlled leads', () => {
    const draftPath = 'docs/quote-review-manual-response-draft.md';
    const draft = readDoc(draftPath);
    const pack = readDoc('docs/quote-review-manual-trial-pack.md');
    const docsIndex = readDoc('docs/README.md');
    const queue = readDoc('docs/next-500-local-tasks-2026-06-23.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), draftPath))).toBe(true);
    expect(draft).toContain('one-page copy/paste draft');
    expect(draft).toContain('Review readiness');
    expect(draft).toContain('Scope clarity');
    expect(draft).toContain('Allowance and provisional-sum risk');
    expect(draft).toContain('Service relocation and trade review');
    expect(draft).toContain('Questions to ask before comparing totals');
    expect(draft).toContain('General review prompts');
    expect(draft).toContain('Recommended next step');
    expect(draft).toContain('Customer-safe footer');
    expect(draft).toContain('not legal advice');
    expect(draft).toContain('not a final quote');
    expect(draft).toContain('site measure');
    expect(draft).toContain('written scope confirmation');
    expect(draft).toContain('supplier costs');
    expect(draft).toContain('service keys');
    expect(draft).toContain('no margin or markup');
    expect(pack).toContain('Quote review manual response draft');
    expect(pack).toContain('Put the customer-safe version into the manual response draft');
    expect(docsIndex).toContain('quote-review-manual-response-draft.md');
    expect(queue).toContain('manual quote-review response draft added locally');
    expect(tasks).toContain('docs/quote-review-manual-response-draft.md');
  });

  it('links the 100-task batch and runbooks from the docs index and Codex task file', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(docsIndex).toContain('next-100-local-tasks-2026-06-17.md');
    expect(docsIndex).toContain('next-100-local-tasks-2026-06-17-release-decision-visual-batch.md');
    expect(docsIndex).toContain('release-gate-trust-visual-file-upload.md');
    expect(docsIndex).toContain('release-decision-note-vincent-2026-06-17.md');
    expect(docsIndex).toContain('operations-risk-register.md');
    expect(tasks).toContain('docs/next-100-local-tasks-2026-06-17.md');
    expect(tasks).toContain('docs/next-100-local-tasks-2026-06-17-release-decision-visual-batch.md');
    expect(tasks).toContain('docs/release-decision-note-vincent-2026-06-17.md');
  });

  it('adds a Vincent-facing release decision note that keeps backend file operations approval gated', () => {
    const note = readDoc('docs/release-decision-note-vincent-2026-06-17.md');

    expect(note).toContain('Trust/visual polish only');
    expect(note).toContain('File-upload backend release only');
    expect(note).toContain('Keep local-only');
    expect(note).toContain('SUPABASE_SERVICE_ROLE_KEY');
    expect(note).toContain('no anon `SELECT` on file metadata');
    expect(note).toContain('Default recommendation: choose 1 first');
    expect(note).toContain('does not approve a deploy');
  });

  it('tracks the release decision and visual polish 100-task batch', () => {
    const queue = readDoc('docs/next-100-local-tasks-2026-06-17-release-decision-visual-batch.md');

    expect(queue).toContain('Release Decision And Visual Polish Batch');
    expect(queue).toContain('Deployment status: not needed');
    expect(queue).toContain('Simplify quote/review links');
    expect(queue).toContain('Replace lock-in price wording with contract-pricing wording');
    expect(queue).toContain('Update visual regression tests for the new tokens');
    expect(queue).toContain('100. Report deployment status and recommended next task.');
  });
});
