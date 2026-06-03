import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('paid quote-review service packaging', () => {
  it('documents the future paid detailed review package without enabling payment', () => {
    const docPath = 'docs/paid-quote-review-service-packaging.md';
    const doc = readDoc(docPath);

    expect(existsSync(join(process.cwd(), docPath))).toBe(true);
    expect(doc).toContain('Do not implement payment');
    expect(doc).toContain('checkout');
    expect(doc).toContain('Purpose: define the future paid detailed quote-review offer');
    expect(doc).toContain('Included In The Paid Detailed Review');
    expect(doc).toContain('Excluded From The Paid Detailed Review');
    expect(doc).toContain('Customer-Safe Report Structure');
    expect(doc).toContain('Delivery Expectations');
    expect(doc).toContain('Refund And Cancellation Principles');
    expect(doc).toContain('Launch Gate Before Payment');
  });

  it('keeps the offer customer-safe and bounded to quote clarity', () => {
    const doc = readDoc('docs/paid-quote-review-service-packaging.md');

    for (const required of [
      'not a final quote',
      'not legal advice',
      'site measure',
      'written scope confirmation',
      'customer-ready questions',
      'scope clarity',
      'allowance risk',
      'missing information',
      'recommended next step',
    ]) {
      expect(doc).toContain(required);
    }

    for (const excluded of [
      'final fixed quote or contract pricing',
      'guaranteed savings',
      'compliance approval',
      'HBC approval',
      'strata approval',
      'building certification',
      'full custom kitchen ordering before site measure and written scope confirmation',
    ]) {
      expect(doc).toContain(excluded);
    }
  });

  it('links the package into the docs index and release checkpoint', () => {
    const index = readDoc('docs/README.md');
    const checkpoints = readDoc('docs/release-checkpoints.md');
    const tasks = readDoc('CODEX_TASKS.md');

    expect(index).toContain('paid-quote-review-service-packaging.md');
    expect(checkpoints).toContain('paid quote review service packaging');
    expect(tasks).toContain('Paid quote-review service packaging is documented');
  });
});
