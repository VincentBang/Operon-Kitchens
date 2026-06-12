import { educationPages, renovationGlossaryTerms } from '../src/lib/seoEducation';

const requiredSlugs = [
  'kitchen-renovation-cost-sydney',
  'kitchen-quote-sydney',
  'kitchen-quote-review',
  'apartment-kitchen-renovation-sydney',
  'kitchen-benchtop-options-after-engineered-stone-ban',
  'kitchen-renovation-process',
  'kitchen-pc-sums-and-provisional-sums',
  'kitchen-quote-vs-estimate',
  'pc-sums-vs-provisional-sums',
  'flatpack-kitchen-vs-custom-kitchen',
  'kitchen-renovation-quote-checklist',
  'why-kitchen-quotes-vary',
  'questions-before-accepting-kitchen-quote',
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

  it('has configured content for every required guide slug', () => {
    requiredSlugs.forEach((slug) => {
      const page = educationPages.find((item) => item.slug === slug);
      expect(page).toBeDefined();
      expect(page?.sections.length).toBeGreaterThanOrEqual(3);
      expect(page?.faqs.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('deepens the priority cost and quote-review guides without unsafe promises', () => {
    const costPage = educationPages.find((item) => item.slug === 'kitchen-renovation-cost-sydney');
    const reviewPage = educationPages.find((item) => item.slug === 'kitchen-quote-review');

    expect(costPage?.sections.length).toBeGreaterThanOrEqual(7);
    expect(costPage?.faqs.length).toBeGreaterThanOrEqual(4);
    expect(JSON.stringify(costPage)).toContain('Apartment and strata cost prompts');
    expect(JSON.stringify(costPage)).toContain('site measure');
    expect(JSON.stringify(costPage)).toContain('PC sums and provisional sums');

    expect(reviewPage?.sections.length).toBeGreaterThanOrEqual(7);
    expect(reviewPage?.faqs.length).toBeGreaterThanOrEqual(4);
    expect(JSON.stringify(reviewPage)).toContain('Trade and service assumptions');
    expect(JSON.stringify(reviewPage)).toContain('Contract, deposit and HBC review prompts');
    expect(JSON.stringify(reviewPage)).toContain('not legal advice');
  });

  it('deepens apartment and allowance guides with Sydney-specific review prompts', () => {
    const apartmentPage = educationPages.find((item) => item.slug === 'apartment-kitchen-renovation-sydney');
    const allowancePage = educationPages.find((item) => item.slug === 'kitchen-pc-sums-and-provisional-sums');

    expect(apartmentPage?.sections.length).toBeGreaterThanOrEqual(8);
    expect(apartmentPage?.faqs.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(apartmentPage)).toContain('strata');
    expect(JSON.stringify(apartmentPage)).toContain('class 2');
    expect(JSON.stringify(apartmentPage)).toContain('site measure');
    expect(JSON.stringify(apartmentPage)).toContain('written scope confirmation');

    expect(allowancePage?.sections.length).toBeGreaterThanOrEqual(8);
    expect(allowancePage?.faqs.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(allowancePage)).toContain('PC sums');
    expect(JSON.stringify(allowancePage)).toContain('provisional sums');
    expect(JSON.stringify(allowancePage)).toContain('Questions to ask before accepting');
    expect(JSON.stringify(allowancePage)).toContain('general quote clarity and scope guidance');
  });

  it('deepens the Sydney kitchen quote guide for quote-review conversion', () => {
    const quotePage = educationPages.find((item) => item.slug === 'kitchen-quote-sydney');

    expect(quotePage?.sections.length).toBeGreaterThanOrEqual(8);
    expect(quotePage?.faqs.length).toBeGreaterThanOrEqual(5);
    expect(quotePage?.secondaryHref).toBe('/quote/review');
    expect(JSON.stringify(quotePage)).toContain('PC sums');
    expect(JSON.stringify(quotePage)).toContain('Apartment and strata quote prompts');
    expect(JSON.stringify(quotePage)).toContain('written scope confirmation');
    expect(JSON.stringify(quotePage)).toContain('before comparing totals');
  });

  it('deepens the engineered-stone benchtop options guide with material and quote-risk prompts', () => {
    const page = educationPages.find((item) => item.slug === 'kitchen-benchtop-options-after-engineered-stone-ban');

    expect(page?.sections.length).toBeGreaterThanOrEqual(10);
    expect(page?.faqs.length).toBeGreaterThanOrEqual(6);
    expect(page?.secondaryHref).toBe('/quote/review');
    expect(JSON.stringify(page)).toContain('supplier and installer');
    expect(JSON.stringify(page)).toContain('Porcelain');
    expect(JSON.stringify(page)).toContain('Allowances and provisional items to check');
    expect(JSON.stringify(page)).toContain('Apartment and access considerations');
    expect(JSON.stringify(page)).toContain('not a compliance approval');
    expect(JSON.stringify(page)).toContain('project-specific confirmation');
  });

  it('connects the quote-risk guides without duplicate thin pages', () => {
    const checklistPage = educationPages.find((item) => item.slug === 'kitchen-renovation-quote-checklist');
    const variesPage = educationPages.find((item) => item.slug === 'why-kitchen-quotes-vary');
    const questionsPage = educationPages.find((item) => item.slug === 'questions-before-accepting-kitchen-quote');

    expect(checklistPage?.sections.length).toBeGreaterThanOrEqual(8);
    expect(checklistPage?.faqs.length).toBeGreaterThanOrEqual(5);
    expect(checklistPage?.primaryHref).toBe('/quote/review');
    expect(JSON.stringify(checklistPage)).toContain('Check contract, deposit and HBC prompts');
    expect(JSON.stringify(checklistPage)).toContain('Only share documents you are authorised to share');
    expect(JSON.stringify(checklistPage)).toContain('project-specific confirmation');

    expect(variesPage?.sections.length).toBeGreaterThanOrEqual(8);
    expect(variesPage?.faqs.length).toBeGreaterThanOrEqual(5);
    expect(variesPage?.primaryHref).toBe('/quote/review');
    expect(JSON.stringify(variesPage)).toContain('Allowances can make a quote look cheaper');
    expect(JSON.stringify(variesPage)).toContain('Normalise before comparing totals');
    expect(JSON.stringify(variesPage)).toContain('not legal advice');

    expect(questionsPage?.sections.length).toBeGreaterThanOrEqual(8);
    expect(questionsPage?.faqs.length).toBeGreaterThanOrEqual(5);
    expect(questionsPage?.primaryHref).toBe('/quote/review');
    expect(JSON.stringify(questionsPage)).toContain('PC sum and provisional sum questions');
    expect(JSON.stringify(questionsPage)).toContain('Contract and payment questions');
    expect(JSON.stringify(questionsPage)).toContain('Request written clarification');
  });
});
