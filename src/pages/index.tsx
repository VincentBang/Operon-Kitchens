import Link from 'next/link';

const proofPoints = [
  'Budget range before the site visit',
  'Line-item scope and trade allowances',
  'NSW deposit, HBC and compliance prompts',
  'Plan/photo upload path for tighter review',
];

const steps = [
  ['1', 'Describe the site', 'Apartment, house, access, parking and whether measurements or photos are ready.'],
  ['2', 'Build the kitchen scope', 'Cabinetry lengths, finishes, benchtop, splashback, trades and risk items.'],
  ['3', 'Review the estimate', 'See assumptions, exclusions, contingency, GST and the confidence score before submitting.'],
];

const serviceCards = [
  ['Full kitchen renovation', 'Cabinetry, benchtops, splashback, demolition and coordinated licensed trades.'],
  ['Cabinetry and benchtop refresh', 'A clearer way to price joinery upgrades without hiding allowance gaps.'],
  ['Apartment kitchen planning', 'Early checks for strata, access, parking, lifts and class 2 building risk.'],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <Link href="/" className="brand">Operon Kitchens</Link>
          <div className="navLinks">
            <Link href="/quote">Quote</Link>
            <Link href="/quote/review">Review</Link>
            <Link href="/projects">Projects</Link>
          </div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">Sydney kitchen renovation quote system</p>
          <h1>Operon Kitchens</h1>
          <p className="heroLead">
            Estimate your kitchen renovation cost with clearer scope, transparent allowances and practical NSW compliance checks before booking a site measure.
          </p>
          <div className="heroActions">
            <Link href="/quote" className="button primary">Start kitchen quote</Link>
            <Link href="/quote/review" className="button secondary">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="proofStrip">
        {proofPoints.map((point) => <span key={point}>{point}</span>)}
      </section>

      <section className="section twoColumn">
        <div>
          <p className="eyebrow">Built for early clarity</p>
          <h2>A smarter starting estimate for kitchen jobs that can easily drift.</h2>
        </div>
        <p className="muted">
          Kitchen renovation pricing depends on cabinetry, benchtops, licensed trades, access, approvals and selections. Operon Kitchens turns those moving parts into a guided estimate with visible assumptions, so customers understand what is included and what still needs professional confirmation.
        </p>
      </section>

      <section className="section stepsGrid">
        {steps.map(([number, title, body]) => (
          <article className="infoCard" key={number}>
            <span className="stepNumber">{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="section splitFeature">
        <img src="/images/kitchen-living.jpg" alt="Finished timber flooring flowing into a kitchen and living area" />
        <div>
          <p className="eyebrow">Transparent quote logic</p>
          <h2>Show the cost stack, not just a vague total.</h2>
          <p className="muted">
            The estimator separates cabinetry, hardware, finishes, benchtops, splashbacks, installation labour, trade allowances, access loading, margin, contingency and GST. Low-confidence scopes are flagged instead of being dressed up as fixed prices.
          </p>
          <Link href="/quote" className="textLink">Open the quote wizard</Link>
        </div>
      </section>

      <section className="section cardGrid">
        {serviceCards.map(([title, body]) => (
          <article className="infoCard" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="section finalCta">
        <p className="eyebrow">Ready when the customer is</p>
        <h2>Start with a useful estimate, then confirm the final quote after site review.</h2>
        <Link href="/quote" className="button primary">Start now</Link>
      </section>
    </main>
  );
}
