import Head from 'next/head';
import Link from 'next/link';

const packageItems = [
  ['Site measure record', 'Measured dimensions, access notes and existing condition observations.'],
  ['Layout confirmation', 'A practical direction for cabinet runs, appliance positions and service assumptions.'],
  ['Finish direction', 'Door finish tier, hardware direction, benchtop and splashback preference for quoting.'],
  ['Appliance schedule', 'Allowance level or nominated models, sizes and installation assumptions.'],
  ['Scope inclusions and exclusions', 'Clear boundaries for demolition, trades, delivery, waste, make-good and final clean.'],
  ['Quote-ready documentation', 'A written specification pack designed to reduce uncertainty before formal quote review.'],
];

export default function DesignSpecificationPackagePage() {
  return (
    <main>
      <Head>
        <title>Kitchen design and specification package | Operon Kitchens</title>
        <meta
          name="description"
          content="Future Operon Kitchens design and specification package pathway for site measure, layout, finishes, appliance schedule, scope inclusions and quote-ready documentation."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Future service pathway</p>
          <h1 className="contentTitle">Design and specification package for quote-ready kitchens.</h1>
        </div>
        <div>
          <p className="muted">
            After estimate and site measure, a specification package can help convert ideas into clearer layout, selections, inclusions and exclusions before formal quoting.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Not full design for free</h2>
            <p>The online estimate and quote review help clarify direction. A specification package is a future professional service pathway, not an automatic free design inclusion.</p>
          </article>
          <article>
            <h2>Built after site context</h2>
            <p>The most useful specification work follows site measure, selection direction and review of services, access and existing conditions.</p>
          </article>
        </section>

        <section>
          <h2>What the package could include</h2>
          <div className="cardGrid">
            {packageItems.map(([title, body]) => (
              <article className="infoCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="compliancePanel">
          <h2>Purpose</h2>
          <p>The goal is better quote-ready documentation before project delivery decisions, with site measure and written scope confirmation still required.</p>
        </aside>

        <section className="contentCta">
          <h2>Start with the right amount of detail</h2>
          <p>Use the estimate wizard or upload an existing quote first, then move toward site measure and specification when the scope is ready.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
