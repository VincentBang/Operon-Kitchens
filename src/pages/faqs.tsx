import Head from 'next/head';
import Link from 'next/link';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import { faqs, Faq } from '@/data/faqs';

const categoryOrder = [
  'kitchen-estimates',
  'quote-review',
  'scope-allowances-and-exclusions',
  'site-measure-and-written-scope',
  'apartments-strata-and-access',
  'nsw-contract-deposit-and-hbc-prompts',
  'materials-benchtops-and-engineered-stone',
  'using-operon-kitchens',
];

const categoryTitles: Record<string, string> = {
  'kitchen-estimates': 'Kitchen estimates',
  'quote-review': 'Quote review',
  'scope-allowances-and-exclusions': 'Scope, allowances and exclusions',
  'site-measure-and-written-scope': 'Site measure and written scope',
  'apartments-strata-and-access': 'Apartments, strata and access',
  'nsw-contract-deposit-and-hbc-prompts': 'NSW contract, deposit and HBC prompts',
  'materials-benchtops-and-engineered-stone': 'Materials, benchtops and engineered stone',
  'using-operon-kitchens': 'Using Operon Kitchens',
};

const categoryIntros: Record<string, string> = {
  'kitchen-estimates': 'Start here if you are trying to understand the difference between a planning range, quote confidence and project-specific pricing.',
  'quote-review': 'Use quote review questions to check whether a kitchen quote is complete enough to compare beyond the headline total.',
  'scope-allowances-and-exclusions': 'These answers help you spot unclear inclusions, PC sums, provisional sums, allowances and exclusions.',
  'site-measure-and-written-scope': 'Site measure and written scope confirmation turn planning assumptions into a clearer project pathway.',
  'apartments-strata-and-access': 'Apartment and strata kitchens often need extra review around access, building rules and licensed trade coordination.',
  'nsw-contract-deposit-and-hbc-prompts': 'These are general NSW review prompts only, not legal advice or project-specific approval.',
  'materials-benchtops-and-engineered-stone': 'Selections, material restrictions and benchtop details should be checked before relying on a quote total.',
  'using-operon-kitchens': 'How to choose the right path and prepare information for a planning estimate or quote review.',
};

const ctaBlocks = [
  {
    after: 'quote-review',
    eyebrow: 'Already comparing quotes?',
    title: 'Review scope before comparing totals',
    body: 'A quote review can flag unclear inclusions, allowances, exclusions, access assumptions and site-measure questions.',
    links: [
      ['Review existing quote', '/quote/review', 'primary'],
      ['Request review', '/request-review', 'ghost'],
    ],
  },
  {
    after: 'site-measure-and-written-scope',
    eyebrow: 'Next step',
    title: 'Move from planning range to site measure readiness',
    body: 'Prepare dimensions, access notes, selection assumptions and quote questions before site measure and written scope confirmation.',
    links: [
      ['Prepare for site measure', '/site-measure', 'primary'],
      ['How it works', '/how-it-works', 'ghost'],
    ],
  },
  {
    after: 'using-operon-kitchens',
    eyebrow: 'Choose your path',
    title: 'Turn FAQ answers into a project-specific next step',
    body: 'Start a planning estimate if you do not have a quote yet, or request review when you need help clarifying scope.',
    links: [
      ['Start kitchen estimate', '/quote', 'primary'],
      ['Request review', '/request-review', 'ghost'],
    ],
  },
];

const relatedLinks = [
  ['Kitchen renovation process', '/kitchen-renovation-process'],
  ['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'],
  ['PC sums and provisional sums', '/kitchen-pc-sums-and-provisional-sums'],
  ['Sydney service areas', '/areas'],
  ['Privacy Policy', '/privacy'],
  ['Terms', '/terms'],
];

function groupFaqs(items: Faq[]) {
  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .reduce<Record<string, Faq[]>>((groups, faq) => {
      const category = faq.category || 'general';
      return { ...groups, [category]: [...(groups[category] || []), faq] };
    }, {});
}

export default function FaqsPage() {
  const grouped = groupFaqs(faqs);
  const categories = categoryOrder.filter((category) => grouped[category]?.length);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <main>
      <Head>
        <title>Kitchen renovation FAQs Sydney | Quotes, scope and site measure</title>
        <meta
          name="description"
          content="Kitchen renovation FAQ for Sydney estimates, quote review, PC sums, provisional sums, exclusions, strata, site measure and written scope confirmation."
        />
      </Head>
      <SchemaJsonLd data={faqSchema} />
      <section className="contentHero">
        <div>
          <p className="eyebrow">Kitchen quote FAQ</p>
          <h1 className="contentTitle">Kitchen renovation FAQs for Sydney quotes, scope and site measure.</h1>
        </div>
        <div>
          <p className="muted">
            Clear answers about planning estimates, kitchen quote review, PC sums, provisional sums, exclusions, strata, site measure and written scope confirmation.
          </p>
          <p className="heroLead reviewLead">
            Planning guidance only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            <Link href="/request-review" className="button ghost">Request review</Link>
          </div>
        </div>
      </section>

      <section className="contentPage faqStack articleBody">
        <section className="guideSummary">
          <article>
            <h2>Estimate first</h2>
            <p>No quote yet? Start with a planning range, confidence level, assumptions and review flags.</p>
            <Link href="/quote" className="textLink">Start kitchen estimate</Link>
          </article>
          <article>
            <h2>Quote in hand</h2>
            <p>Already have a quote? Check scope, allowances, exclusions and review prompts before comparing totals.</p>
            <Link href="/quote/review" className="textLink">Review existing quote</Link>
          </article>
        </section>

        {categories.map((category) => {
          const cta = ctaBlocks.find((block) => block.after === category);
          return (
            <section key={category}>
              <article className="wizardPanel">
                <p className="eyebrow">{categoryTitles[category]}</p>
                <h2>{categoryTitles[category]}</h2>
                <p className="muted">{categoryIntros[category]}</p>
                <div className="faqList">
                  {grouped[category].map((faq) => (
                    <details key={faq.question} className="faqItem">
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </article>
              {cta && (
                <section className="contentCta">
                  <p className="eyebrow">{cta.eyebrow}</p>
                  <h2>{cta.title}</h2>
                  <p>{cta.body}</p>
                  <div className="flexActions">
                    {cta.links.map(([label, href, tone]) => (
                      <Link key={href} href={href} className={`button ${tone}`}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </section>
          );
        })}

        <section className="guideSummary">
          {relatedLinks.map(([label, href]) => (
            <article key={href}>
              <h2>{label}</h2>
              <p>Use this alongside the FAQ when preparing a kitchen estimate, quote review or site-measure discussion.</p>
              <Link href={href} className="textLink">Open resource</Link>
            </article>
          ))}
        </section>

        <section className="contentCta">
          <h2>Still comparing kitchen options?</h2>
          <p>Use the estimate or quote-review path to turn general questions into project-specific review items.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            <Link href="/request-review" className="button ghost">Request review</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
