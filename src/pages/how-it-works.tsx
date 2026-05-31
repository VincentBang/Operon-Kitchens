import Head from 'next/head';
import Link from 'next/link';

const steps = [
  ['1', 'Get a planning estimate', 'Start with project type, suburb, property, layout, scope, finish tiers and trade assumptions to create an indicative budget range.'],
  ['2', 'Upload quote, photos or plans', 'Photos, plans, appliance notes or an existing quote help identify what is known and what still requires review.'],
  ['3', 'Review hidden scope and allowance risks', 'The summary separates confidence, assumptions, exclusions, manual review flags, PC sums and allowance questions.'],
  ['4', 'Book site measure or scope review', 'A professional review can focus on dimensions, services, access, missing inclusions and supplier or trade confirmation items.'],
  ['5', 'Confirm written scope before project commitment', 'Selections, inclusions, exclusions, trade requirements and review prompts should be converted into confirmed written scope before commitment.'],
];

export default function HowItWorksPage() {
  return (
    <main>
      <Head>
        <title>How Operon Kitchens works | Estimate, review and site measure</title>
        <meta
          name="description"
          content="How Operon Kitchens moves from online planning estimate to quote review, site measure, written scope confirmation and kitchen project delivery planning."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">How it works</p>
          <h1 className="contentTitle">Kitchen quote clarity before commitment.</h1>
        </div>
        <div>
          <p className="muted">
            Understand your likely kitchen renovation range, quote risks and next step before relying on a total or committing to project delivery.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            <Link href="/site-measure" className="button ghost">Understand site measure</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Planning estimate, not contract pricing</h2>
            <p>The online estimate gives an indicative range, confidence score, assumptions and review flags. It is not a confirmed project quote.</p>
          </article>
          <article>
            <h2>Staged commitment</h2>
            <p>Measurements, access, services, existing conditions and selections still require project-specific confirmation before written scope.</p>
          </article>
        </section>

        <section>
          <h2>The staged journey</h2>
          <div className="processGrid">
            {steps.map(([number, title, body]) => (
              <article className="infoCard processCard" key={number}>
                <span className="stepNumber">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="compliancePanel">
          <h2>Trust and risk note</h2>
          <p>
            Operon Kitchens provides planning guidance for quote clarity. Site measure, confirmed selections, licensed trade review where needed and written scope confirmation are required before project commitment. Risk prompts are general guidance only and are not legal advice.
          </p>
        </aside>

        <section className="guideSummary">
          <article>
            <h2>Have an existing quote?</h2>
            <p>Upload it with photos or plans so the review can check scope gaps, allowances, exclusions and comparison questions.</p>
            <Link href="/quote/review" className="textLink">Review existing quote</Link>
          </article>
          <article>
            <h2>Starting from scratch?</h2>
            <p>Use the estimate wizard to build a planning range and identify what would improve confidence before a site visit.</p>
            <Link href="/quote" className="textLink">Start kitchen estimate</Link>
          </article>
        </section>

        <section className="contentCta">
          <h2>Choose the right next step</h2>
          <p>Start online if your scope is early, or upload a quote if you already have one to compare.</p>
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
