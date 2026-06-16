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

  it('links the 100-task batch and runbooks from the docs index and Codex task file', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(docsIndex).toContain('next-100-local-tasks-2026-06-17.md');
    expect(docsIndex).toContain('release-gate-trust-visual-file-upload.md');
    expect(docsIndex).toContain('operations-risk-register.md');
    expect(tasks).toContain('docs/next-100-local-tasks-2026-06-17.md');
  });
});
