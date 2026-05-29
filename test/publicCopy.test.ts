import fs from 'node:fs';
import path from 'node:path';

const publicRoots = [
  'src/pages/index.tsx',
  'src/pages/areas',
  'src/pages/terms.tsx',
  'src/pages/privacy.tsx',
  'src/pages/design.tsx',
  'src/pages/projects.tsx',
  'src/pages/quote/review.tsx',
  'src/pages/faqs.tsx',
  'src/pages/glossary.tsx',
  'src/pages/advice.tsx',
  'src/pages/kitchen-renovation-cost-sydney.tsx',
  'src/pages/kitchen-quote-sydney.tsx',
  'src/pages/kitchen-quote-review.tsx',
  'src/pages/apartment-kitchen-renovation-sydney.tsx',
  'src/pages/kitchen-benchtop-options-after-engineered-stone-ban.tsx',
  'src/pages/kitchen-renovation-process.tsx',
  'src/pages/kitchen-pc-sums-and-provisional-sums.tsx',
  'src/pages/kitchen-renovation-glossary.tsx',
  'src/pages/full-kitchen-renovation-sydney.tsx',
  'src/pages/kitchen-cabinetry-benchtop-refresh.tsx',
  'src/pages/kitchen-benchtop-replacement-sydney.tsx',
  'src/pages/small-kitchen-renovation-sydney.tsx',
  'src/pages/luxury-kitchen-renovation-sydney.tsx',
  'src/pages/strata-kitchen-renovation-sydney.tsx',
  'src/pages/kitchen-quote-vs-estimate.tsx',
  'src/pages/pc-sums-vs-provisional-sums.tsx',
  'src/pages/flatpack-kitchen-vs-custom-kitchen.tsx',
  'src/pages/kitchen-renovation-quote-checklist.tsx',
  'src/pages/why-kitchen-quotes-vary.tsx',
  'src/pages/questions-before-accepting-kitchen-quote.tsx',
  'src/components/QuoteWizard.tsx',
  'src/components/PublicLayout.tsx',
  'src/components/ServicePageTemplate.tsx',
  'src/components/ServiceRoutePage.tsx',
  'src/components/EducationRoutePage.tsx',
  'src/components/steps',
  'src/components/SeoEducationPage.tsx',
  'src/lib/planningAssistant.ts',
  'src/lib/seoEducation.ts',
  'src/lib/servicePages.ts',
  'src/lib/i18n.ts',
  'src/data/faqs.ts',
];

const forbiddenTerms = [
  'margin',
  'markup',
  'profit',
  'supplier cost',
  'internal rate',
  'backend rate',
  'our cost',
  'cost stack',
  'final fixed quote',
];

function collectFiles(relativePath: string): string[] {
  const absolutePath = path.join(process.cwd(), relativePath);
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) return [absolutePath];
  return fs.readdirSync(absolutePath).flatMap((item) => {
    const next = path.join(relativePath, item);
    return fs.statSync(path.join(process.cwd(), next)).isDirectory() ? collectFiles(next) : [path.join(process.cwd(), next)];
  });
}

describe('customer-facing copy guardrails', () => {
  it('does not expose internal pricing language in public pages and components', () => {
    const files = publicRoots.flatMap(collectFiles).filter((file) => /\.(ts|tsx)$/.test(file));
    const matches = files.flatMap((file) => {
      const copy = fs.readFileSync(file, 'utf8').toLowerCase();
      return forbiddenTerms
        .filter((term) => copy.includes(term))
        .map((term) => `${path.relative(process.cwd(), file)}: ${term}`);
    });

    expect(matches).toEqual([]);
  });
});
