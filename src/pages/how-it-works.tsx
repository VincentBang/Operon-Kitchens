import Head from 'next/head';
import Link from 'next/link';

const steps = [
  ['1', 'Check planning range online', 'Start with project type, suburb, property, layout, scope, finish tiers and trade assumptions to create an early budget range.'],
  ['2', 'Upload project context', 'Photos, plans, appliance notes or an existing quote help identify what is known and what still needs review.'],
  ['3', 'Review confidence and flags', 'The summary shows confidence, assumptions, exclusions, manual review flags and compliance prompts before the next conversation.'],
  ['4', 'Request professional review', 'A review can focus on unclear inclusions, PC sums, provisional sums, services, access and missing scope.'],
  ['5', 'Book site measure', 'Site measure checks dimensions, access, services, existing conditions, benchtop details and approval pathway items.'],
  ['6', 'Confirm selections and written scope', 'Selections, inclusions, exclusions, trade requirements and review prompts are converted into quote-ready scope.'],
  ['7', 'Move toward project delivery', 'Only after site measure and written scope confirmation should the project move toward contract decisions and delivery planning.'],
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
          <h1 className="contentTitle">How Operon Kitchens works.</h1>
        </div>
        <div>
          <p className="muted">
            Operon Kitchens is built around staged commitment: planning estimate, upload context, professional review, site measure and written scope confirmation before project decisions.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            <Link href="/site-measure" className="button ghost">Request site measure</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Planning estimate, not final quote</h2>
            <p>The online estimate gives a budget range, confidence score, assumptions and review flags. It is not contract pricing.</p>
          </article>
          <article>
            <h2>Site measure required</h2>
            <p>Measurements, access, services, existing conditions and selections still need project-specific confirmation.</p>
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
          <h2>Written scope confirmation required</h2>
          <p>
            Before relying on pricing, the project should have confirmed selections, site conditions, licensed trade review where needed, exclusions and written scope. Compliance prompts are review items, not legal advice.
          </p>
        </aside>

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
