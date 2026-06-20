import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('controlled testing documentation handoff', () => {
  it('keeps the operator handoff linked from the docs index and Codex task file', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(existsSync(join(process.cwd(), 'docs/controlled-testing-handoff.md'))).toBe(true);
    expect(docsIndex).toContain('[Controlled testing handoff](./controlled-testing-handoff.md)');
    expect(tasks).toContain('docs/controlled-testing-handoff.md');
  });

  it('documents daily admin checks, tester flow, file status and release gates in one place', () => {
    const handoff = readDoc('docs/controlled-testing-handoff.md');

    expect(handoff).toContain('Daily Admin Routine');
    expect(handoff).toContain('Trusted Tester Flow');
    expect(handoff).toContain('What Not To Promise');
    expect(handoff).toContain('Site-Measure Triggers');
    expect(handoff).toContain('File Upload Status');
    expect(handoff).toContain('Manual Quote-Review Trial');
    expect(handoff).toContain('Release Checkpoint Summary');
    expect(handoff).toContain('Default: no deploy.');
    expect(handoff).toContain('Current Local Fixes Waiting For Release');
  });

  it('links the controlled feedback log and records the current CTA release-bundle finding', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');
    const findingsLog = readDoc('docs/controlled-testing-findings-log.md');
    const latestQueue = readDoc('docs/next-100-local-tasks-2026-06-20-controlled-feedback.md');

    expect(docsIndex).toContain('[Controlled testing findings log](./controlled-testing-findings-log.md)');
    expect(tasks).toContain('docs/next-100-local-tasks-2026-06-20-controlled-feedback.md');
    expect(findingsLog).toContain('Homepage Final CTA Ghost Buttons Low Contrast');
    expect(findingsLog).toContain('include in next trust/visual polish release');
    expect(findingsLog).toContain('Local Controlled Tester Simulation');
    expect(findingsLog).toContain('no new blocker found');
    expect(latestQueue).toContain('Controlled Feedback Capture And Release Bundling');
    expect(latestQueue).toContain('No deploy, no push, no production verification');
  });

  it('keeps a concise trust visual release candidate summary linked for deploy approval decisions', () => {
    const docsIndex = readDoc('docs/README.md');
    const tasks = readDoc('CODEX_TASKS.md');
    const summary = readDoc('docs/trust-visual-release-candidate-summary-2026-06-20.md');

    expect(docsIndex).toContain('[Trust / visual release candidate summary: 20 June 2026](./trust-visual-release-candidate-summary-2026-06-20.md)');
    expect(tasks).toContain('docs/trust-visual-release-candidate-summary-2026-06-20.md');
    expect(summary).toContain('Approve this as the next trust/visual polish release');
    expect(summary).toContain('Do not include file-upload backend changes');
    expect(summary).toContain('homepage final CTA ghost buttons fixed');
    expect(summary).toContain('Deployment status: optional, not approved by this document');
  });

  it('documents the second approved 30-task local batch without approving deployment', () => {
    const queue = readDoc('docs/next-30-local-tasks-2026-06-17-handoff-batch.md');

    expect(queue).toContain('Controlled Testing Handoff Batch');
    expect(queue).toContain('Do not push, deploy, create previews');
    expect(queue).toContain('Tasks 1-10: complete');
    expect(queue).toContain('Tasks 21-28: complete');
    expect(queue).toContain('Tasks 29-30: complete');
  });

  it('adds compact one-deploy checklists for signed downloads and soft delete', () => {
    const signedDownload = readDoc('docs/signed-download-one-deploy-checklist.md');
    const softDelete = readDoc('docs/soft-delete-one-deploy-checklist.md');

    expect(signedDownload).toContain('Signed Download One-Deploy Checklist');
    expect(signedDownload).toContain('Stop after one controlled verification');
    expect(signedDownload).toContain('service role key');
    expect(softDelete).toContain('Soft Delete One-Deploy Checklist');
    expect(softDelete).toContain('This does not approve a visible delete button');
    expect(softDelete).toContain('physical object deletion remains deferred');
  });

  it('adds a manual quote-review trial pack and fake sample with safe boundaries', () => {
    const pack = readDoc('docs/quote-review-manual-trial-pack.md');
    const sample = readDoc('docs/quote-review-sample-trial.md');

    expect(pack).toContain('unpaid, controlled quote-review report trials');
    expect(pack).toContain('Do not copy supplier costs');
    expect(sample).toContain('fake, no-customer-data example');
    expect(sample).toContain('Basic review ready');
    expect(sample).toContain('not legal advice');
    expect(sample).toContain('not a public proof item');
  });
});
