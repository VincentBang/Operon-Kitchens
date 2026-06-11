import fs from 'node:fs';
import path from 'node:path';

function readDoc(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('SEO planning documentation', () => {
  it('stores the SEO master plan, tracker and local audit in docs', () => {
    const masterPlan = readDoc('docs/seo-master-plan.md');
    const tracker = readDoc('docs/seo-implementation-tracker.md');
    const audit = readDoc('docs/seo-audit-local.md');
    const nextPageBriefs = readDoc('docs/seo-next-page-briefs.md');

    expect(masterPlan).toContain('Strategic SEO Thesis');
    expect(masterPlan).toContain('kitchen quote review Sydney');
    expect(masterPlan).toContain('kitchen renovation estimate vs quote');
    expect(masterPlan).toContain('No deploy until Vincent approves a release checkpoint');
    expect(masterPlan).toContain('docs/seo-next-page-briefs.md');

    expect(tracker).toContain('/quote/review');
    expect(tracker).toContain('/kitchen-quote-exclusions');
    expect(tracker).toContain('Future Suburb Pages');
    expect(tracker).toContain('Do not build now; avoid duplicate content');

    expect(audit).toContain('Deployment status: not deployed');
    expect(audit).toMatch(/`\/kitchen-quote-exclusions` is not present/);
    expect(audit).toMatch(/`\/site-measure` now links to `\/quote\/review`/);

    expect(nextPageBriefs).toContain('Kitchen Quote Exclusions');
    expect(nextPageBriefs).toContain('Kitchen quote exclusions: what to check before comparing totals');
    expect(nextPageBriefs).toContain('Do not create a third public page with similar content yet');
    expect(nextPageBriefs).toContain('Do not create doorway pages');
  });
});
