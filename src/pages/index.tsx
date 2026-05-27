import Link from 'next/link';
import Image from 'next/image';

const valuePoints = [
  ['Scope clarity', 'Separate cabinetry, finishes, trades, approvals and site risks before comparing totals.'],
  ['Estimate confidence', 'Show whether the estimate is ready to rely on or still needs photos, plans and review.'],
  ['Assumptions and exclusions', 'Make allowances, exclusions and unknowns visible instead of hiding them in a headline number.'],
  ['Professional review', 'Move from online estimate to review, site measure and final scope before a confirmed quote.'],
];

const processSteps = [
  ['01', 'Online estimate', 'Answer guided kitchen questions and receive a budget range, confidence score and next-step prompts.'],
  ['02', 'Upload photos/plans', 'Add existing photos, plans or a current builder quote so the review can be more specific.'],
  ['03', 'Professional review', 'A reviewer checks inclusions, allowances, compliance flags and unclear scope items.'],
  ['04', 'Site measure', 'Measurements, access and selections are confirmed before any final quote position is offered.'],
  ['05', 'Final scope and quote', 'The final proposal follows confirmed site conditions, selections and trade requirements.'],
];

const complianceNotes = [
  'HBC review may be required for residential work over $20,000 including GST.',
  'Deposit guidance is capped at 10% for NSW residential home building contracts.',
  'Electrical, plumbing and gas work must be confirmed by appropriately licensed trades.',
  'Strata, apartment and engineered-stone risks are flagged for confirmation.',
];

const finishTiers = [
  ['Essential', 'Practical cabinetry and laminate-led selections for controlled budgets.'],
  ['Refined', 'Upgraded door finishes, hardware and benchtop directions with clearer allowances.'],
  ['Signature', 'More detailed finish direction for premium cabinetry, surfaces and accessories.'],
];

const faqs = [
  ['Is the online estimate a final quote?', 'No. It is a budget range with assumptions, exclusions and confidence scoring. A final quote follows review, site measure and confirmed selections.'],
  ['Can I upload an existing kitchen quote?', 'Yes. The review intake captures your quote, photos, plans and the key scope items that often make quotes hard to compare.'],
  ['Do you check compliance items?', 'The system flags common review areas such as HBC, deposit terms, strata risk, licensed trades and engineered-stone restrictions. It is not legal advice.'],
  ['Why use finish tiers instead of endless product choices?', 'Early estimates need controlled choices. Exact supplier products can be confirmed later once the scope, budget and site conditions are clearer.'],
];

const educationLinks = [
  ['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'],
  ['Kitchen quote review', '/kitchen-quote-review'],
  ['Apartment kitchen renovation', '/apartment-kitchen-renovation-sydney'],
  ['Benchtop options after engineered stone restrictions', '/kitchen-benchtop-options-after-engineered-stone-ban'],
  ['PC sums and provisional sums', '/kitchen-pc-sums-and-provisional-sums'],
  ['Kitchen renovation glossary', '/kitchen-renovation-glossary'],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <Link href="/" className="brand">Operon Kitchens</Link>
          <div className="navLinks">
            <Link href="/quote">Estimate</Link>
            <Link href="/quote/review">Review</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/faqs">FAQ</Link>
          </div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">Kitchen renovation estimates</p>
          <h1>Clear kitchen renovation estimates before the final quote.</h1>
          <p className="heroLead">
            Start with a structured budget range, visible assumptions, exclusions and review flags before booking a site measure.
          </p>
          <div className="heroActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button secondary">Review existing kitchen quote</Link>
          </div>
        </div>
      </section>

      <section className="proofStrip">
        {valuePoints.map(([title]) => <span key={title}>{title}</span>)}
      </section>

      <section className="section twoColumn">
        <div>
          <p className="eyebrow">Why it exists</p>
          <h2>Kitchen quotes should be easier to understand before anyone commits.</h2>
        </div>
        <div className="valueStack">
          {valuePoints.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section processSection">
        <div className="sectionIntro">
          <p className="eyebrow">Process</p>
          <h2>From first estimate to final scope.</h2>
        </div>
        <div className="processGrid">
          {processSteps.map(([number, title, body]) => (
            <article className="infoCard processCard" key={number}>
              <span className="stepNumber">{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section splitFeature">
        <Image src="/images/kitchen-living.jpg" alt="Finished kitchen with cabinetry and benchtop details" width={980} height={735} sizes="(max-width: 820px) 100vw, 52vw" />
        <div>
          <p className="eyebrow">Compliance-aware review</p>
          <h2>Flag the common issues early.</h2>
          <p className="muted">
            Operon Kitchens highlights review areas that can affect budget, timing or contract readiness. This guidance is practical and concise, not legal advice.
          </p>
          <ul className="checkList">
            {complianceNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
          <Link href="/quote/review" className="textLink">Review an existing quote</Link>
        </div>
      </section>

      <section className="section finishSection">
        <div className="sectionIntro">
          <p className="eyebrow">Finish tiers</p>
          <h2>Controlled choices, clearer allowances.</h2>
          <p className="muted">
            Early quoting works best when selections are structured. Operon Kitchens uses finish tiers to keep decisions calm, comparable and ready for professional review.
          </p>
        </div>
        <div className="cardGrid">
          {finishTiers.map(([title, body]) => (
            <article className="infoCard" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section faqStack">
        <div className="sectionIntro">
          <p className="eyebrow">FAQ</p>
          <h2>Clear answers before the next step.</h2>
        </div>
        <div className="faqList">
          {faqs.map(([question, answer]) => (
            <details className="faqItem" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section educationLinks">
        <div className="sectionIntro">
          <p className="eyebrow">Education</p>
          <h2>Plan with clearer renovation language.</h2>
        </div>
        <div className="linkGrid">
          {educationLinks.map(([label, href]) => (
            <Link key={href} href={href} className="infoCard textLink">{label}</Link>
          ))}
        </div>
      </section>

      <section className="section finalCta">
        <p className="eyebrow">Ready to start</p>
        <h2>Build a clearer kitchen estimate, then confirm the final quote after review and site measure.</h2>
        <div className="heroActions">
          <Link href="/quote" className="button primary">Start kitchen estimate</Link>
          <Link href="/quote/review" className="button secondary">Review existing kitchen quote</Link>
        </div>
      </section>
    </main>
  );
}
