import Head from 'next/head';
import Link from 'next/link';

const processSections = [
  ['1', 'Start with your kitchen goal and budget range', 'Begin with project type, suburb, timing, budget band and what you want the kitchen renovation to achieve. A rough starting point is enough.'],
  ['2', 'Measure layout, access and existing conditions', 'Record the current layout, room size, access, parking, strata conditions, existing services and any site details that may affect review confidence.'],
  ['3', 'Choose scope: refresh, full renovation or apartment kitchen', 'Separate a cabinetry or benchtop refresh from a full kitchen renovation, and flag apartment kitchens where access, strata and class 2 review may matter.'],
  ['4', 'Check selections, finishes and allowances', 'Clarify cabinetry finish, hardware, benchtop, splashback, appliance allowance and finish tier assumptions before relying on a total.'],
  ['5', 'Compare quotes beyond the headline total', 'A lower total is not always a better quote if demolition, trades, access, waste, appliance assumptions or exclusions are unclear.'],
  ['6', 'Review PC sums, provisional sums and exclusions', 'Prime cost sums, provisional sums and exclusions should be visible so later selections or uncertain work do not surprise you.'],
  ['7', 'Prepare for site measure', 'Use the online review to prepare dimensions, photos, plans, service locations and quote questions before site measure or professional review.'],
  ['8', 'Confirm licensed trades, strata and contract prompts', 'Electrical, plumbing and gas work require licensed trade review. Apartment, HBC, deposit, written contract and material prompts may also need confirmation.'],
  ['9', 'Confirm written scope before pricing commitment', 'Project-specific pricing should follow site measure, confirmed selections, site condition review and written scope confirmation.'],
  ['10', 'Request review or start estimate', 'Choose the next step: start a planning estimate, review an existing kitchen quote, request review, or prepare for site measure.'],
];

const receiveItems = [
  ['Planning estimate range', 'An indicative range based on the project details supplied and the assumptions still needing review.'],
  ['Confidence level', 'A simple signal for how complete the information is before site measure.'],
  ['Assumptions', 'The key conditions the estimate or review is relying on.'],
  ['Exclusions', 'Items that should not be assumed until written scope confirms them.'],
  ['Review flags', 'Scope, allowance, access, strata, material and trade prompts that may require confirmation.'],
  ['Questions to ask', 'Practical questions for a supplier, builder or reviewer before comparing totals.'],
  ['Recommended next step', 'A suggested move toward quote review, request review, site measure or written scope preparation.'],
];

const notReplacementItems = [
  'Not a final quote',
  'Not legal advice',
  'Not compliance approval',
  'Not a substitute for site measure',
  'Not a guaranteed saving',
  'Not an online custom kitchen purchase',
];

const decisionPaths = [
  ['No quote yet', 'Start with a Sydney kitchen renovation planning estimate to understand range, assumptions and review flags.', 'Start kitchen estimate', '/quote'],
  ['Already have a quote', 'Check PC sums, provisional sums, kitchen quote exclusions and scope gaps before comparing totals.', 'Review existing quote', '/quote/review'],
  ['Need help preparing scope', 'Send project details so Operon Kitchens can identify the next practical review step.', 'Request review', '/request-review'],
  ['Ready for site measure', 'Prepare the details that need checking before written scope confirmation and project-specific pricing.', 'Prepare for site measure', '/site-measure'],
];

const checkItems = [
  'Kitchen quote exclusions and missing inclusions',
  'PC sums and provisional sums in the kitchen quote',
  'Cabinetry, benchtop, splashback and appliance assumptions',
  'Plumbing, electrical, gas, access and strata review prompts',
  'What happens before site measure and written scope confirmation',
];

export default function HowItWorksPage() {
  return (
    <main>
      <Head>
        <title>How kitchen estimates and quote review work | Operon Kitchens</title>
        <meta
          name="description"
          content="How Operon Kitchens helps Sydney homeowners move from planning estimate to kitchen quote review, site measure preparation and written scope confirmation."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">How it works</p>
          <h1 className="contentTitle">How kitchen renovation estimates and quote review work in Sydney.</h1>
        </div>
        <div>
          <p className="muted">
            Start with a planning estimate or quote review, identify missing scope and allowance risks, then move toward site measure and written scope confirmation before contract pricing.
          </p>
          <p className="heroLead reviewLead">
            Planning guidance only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button secondary">Review existing quote</Link>
            <Link href="/request-review" className="button ghost">Request review</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Start with a planning estimate, not a final quote</h2>
            <p>The estimate gives an indicative range, confidence score, assumptions and review flags. It helps prepare the next conversation before site measure and written scope.</p>
          </article>
          <article>
            <h2>Why kitchen quotes need scope and allowance review</h2>
            <p>Two kitchen renovation quotes can be difficult to compare when PC sums, provisional sums, exclusions, access or trade assumptions are worded differently.</p>
          </article>
        </section>

        <section>
          <h2>The five-step Operon Kitchens path</h2>
          <div className="processGrid">
            {processSections.map(([number, title, body]) => (
              <article className="infoCard processCard" key={number}>
                <span className="stepNumber">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="sectionIntro">
            <p className="eyebrow">What you receive</p>
            <h2>What you receive from the process</h2>
            <p className="muted">The goal is to help you prepare better questions and a clearer next step before project-specific review.</p>
          </div>
          <div className="reportPreviewGrid">
            {receiveItems.map(([title, body]) => (
              <article className="infoCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <Link href="/quote" className="textLink">Start kitchen estimate</Link>
        </section>

        <section className="guideSummary">
          <article>
            <h2>What happens before site measure</h2>
            <p>Photos, plans and written quote details can improve review confidence, but file preparation is not required to complete the planning estimate. Site measure still checks dimensions, access, services and existing conditions.</p>
          </article>
          <article>
            <h2>What Operon Kitchens checks before written scope</h2>
            <ul className="checkList">
              {checkItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </section>

        <aside className="compliancePanel">
          <h2>What this process does not replace</h2>
          <p>
            This process helps you prepare better questions and next steps before project-specific review. It does not replace site inspection, licensed trade input, supplier confirmation or written scope confirmation.
          </p>
          <ul className="checkList">
            {notReplacementItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>

        <section className="guideSummary">
          <article>
            <h2>What to do if you already have a kitchen quote</h2>
            <p>Prepare or describe quote details so the review can check scope gaps, allowances, exclusions and kitchen renovation quote comparison questions.</p>
            <Link href="/quote/review" className="textLink">Review existing quote</Link>
          </article>
          <article>
            <h2>Starting from scratch?</h2>
            <p>Use the estimate wizard to build a planning range and identify what would improve confidence before a site measure.</p>
            <Link href="/quote" className="textLink">Start kitchen estimate</Link>
          </article>
        </section>

        <section className="contentCta decisionPathSection">
          <h2>Choose the right next step</h2>
          <p>Start online if your scope is early, review an existing quote if you have one, or request follow-up when the next step needs human review.</p>
          <div className="cardGrid four">
            {decisionPaths.map(([title, body, cta, href]) => (
              <article className="infoCard" key={href}>
                <h3>{title}</h3>
                <p>{body}</p>
                <Link href={href} className="textLink">{cta}</Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
