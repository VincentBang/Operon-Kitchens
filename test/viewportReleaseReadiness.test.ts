import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('viewport release readiness documents', () => {
  it('records the latest 100-task local viewport batch without approving deployment', () => {
    const queue = readDoc('docs/next-100-local-tasks-2026-06-17-viewport-release-readiness.md');

    expect(queue).toContain('Viewport And Release Readiness Batch');
    expect(queue).toContain('Deployment status: not needed');
    expect(queue).toContain('Do not touch Operon Flooring or Oz Timber Floor');
    expect(queue).toContain('100. Report deployment status and next recommended task.');
  });

  it('records the browser-backed local viewport review and admin isolation result', () => {
    const review = readDoc('docs/local-viewport-review-2026-06-17.md');

    expect(review).toContain('/quote/review');
    expect(review).toContain('/request-review');
    expect(review).toContain('/site-measure');
    expect(review).toContain('/admin/leads');
    expect(review).toContain('no horizontal overflow');
    expect(review).toContain('noindex,nofollow');
    expect(review).toContain('strata approval or notification review');
  });

  it('prepares a one-approved-deploy smoke pack without requiring deployment now', () => {
    const smokePack = readDoc('docs/release-smoke-check-pack-2026-06-17.md');

    expect(smokePack).toContain('Deployment status: optional, not approved by this document');
    expect(smokePack).toContain('One-Deploy Smoke Check');
    expect(smokePack).toContain('/faqs');
    expect(smokePack).toContain('If The File-Upload Bundle Is Included');
    expect(smokePack).toContain('Do not run repeated clear-cache deploys');
  });

  it('links the new readiness docs from the repo docs index and task file', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), 'docs/next-100-local-tasks-2026-06-17-viewport-release-readiness.md'))).toBe(true);
    expect(docsIndex).toContain('next-100-local-tasks-2026-06-17-viewport-release-readiness.md');
    expect(docsIndex).toContain('local-viewport-review-2026-06-17.md');
    expect(docsIndex).toContain('release-smoke-check-pack-2026-06-17.md');
    expect(tasks).toContain('docs/next-100-local-tasks-2026-06-17-viewport-release-readiness.md');
  });
});
