import { educationPages, renovationGlossaryTerms } from '../src/lib/seoEducation';

const requiredSlugs = [
  'kitchen-renovation-cost-sydney',
  'kitchen-quote-sydney',
  'kitchen-quote-review',
  'apartment-kitchen-renovation-sydney',
  'kitchen-benchtop-options-after-engineered-stone-ban',
  'kitchen-renovation-process',
  'kitchen-pc-sums-and-provisional-sums',
];

describe('SEO education content', () => {
  it('covers the required Operon Kitchens education topics', () => {
    expect(educationPages.map((page) => page.slug)).toEqual(expect.arrayContaining(requiredSlugs));
  });

  it('keeps internal links focused on estimate and review paths', () => {
    educationPages.forEach((page) => {
      expect([page.primaryHref, page.secondaryHref]).toEqual(
        expect.arrayContaining([expect.stringMatching(/^\/(quote|kitchen|apartment)/)]),
      );
      expect(`${page.primaryHref} ${page.secondaryHref}`).toMatch(/\/quote/);
    });
  });

  it('does not claim online estimates are confirmed contract prices', () => {
    const allCopy = JSON.stringify(educationPages).toLowerCase();
    expect(allCopy).not.toContain('guaranteed fixed price');
    expect(allCopy).not.toContain('final fixed price online');
    expect(allCopy).not.toContain('final fixed quote');
  });

  it('includes glossary terms for allowances and compliance-aware review', () => {
    const terms = renovationGlossaryTerms.map(([term]) => term);
    expect(terms).toEqual(expect.arrayContaining(['PC sum', 'Provisional sum', 'HBC', 'Engineered stone restriction']));
  });
});
