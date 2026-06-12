import Head from 'next/head';
import Link from 'next/link';

const reviewChecks = [
  'Missing scope such as delivery, installation boundaries, protection, painting and patching',
  'Vague allowances, PC sums, provisional sums and appliance allowance wording',
  'Demolition exclusions, rubbish removal, make-good and clean-up assumptions',
  'Benchtop/splashback exclusions, cut-outs, joins, waterfalls and material restriction prompts',
  'Plumbing, electrical, gas and service relocation risk requiring licensed trade confirmation',
  'Strata/apartment constraints such as lift, parking, access and building management conditions',
  'HBC, written contract and deposit review prompts for project-specific confirmation',
  'Appliance ambiguity, model assumptions and PC sum comparison questions',
];

const customerReceives = [
  ['Scope clarity summary', 'A plain-English view of what appears included, missing or unclear.'],
  ['Allowance risk notes', 'Questions around PC sums, provisional sums, appliance allowances and surface allowances.'],
  ['Comparison questions', 'Customer-ready questions to ask before comparing totals.'],
  ['Confidence and risk guidance', 'A view of what improves review confidence and what still needs confirmation.'],
  ['Recommended next step', 'Whether to clarify the quote, upload more context or move toward site measure.'],
];

export default function QuoteReviewServicePage() {
  return (
    <main>
      <Head>
        <title>Kitchen quote review service | Operon Kitchens</title>
        <meta
          name="description"
          content="Review your kitchen quote before comparing totals. Check inclusions, PC sums, provisional sums, appliances, benchtops, trades, strata, HBC and deposit prompts."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Quote review service</p>
          <h1 className="contentTitle">Review your kitchen quote before comparing totals.</h1>
        </div>
        <div>
          <p className="muted">
            A lower total can still become expensive if demolition, trades, appliances, benchtops, exclusions, PC sums or access conditions are unclear.
          </p>
          <div className="flexActions">
            <Link href="/quote/review" className="button primary">Review existing quote</Link>
            <Link href="/request-review" className="button ghost">Start quote review</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Free basic review pathway</h2>
            <p>The current intake captures quote files, photos, plans, checklist answers and contact details so unclear items can be triaged for the next professional step.</p>
          </article>
          <article>
            <h2>Designed for quote comparison</h2>
            <p>The goal is not to choose the cheapest total. It is to understand whether the totals are describing the same scope.</p>
          </article>
        </section>

        <section>
          <h2>What the review checks</h2>
          <ul>
            {reviewChecks.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section>
          <h2>What the customer receives</h2>
          <div className="cardGrid">
            {customerReceives.map(([title, body]) => (
              <article className="infoCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="guideSummary">
          <article>
            <h2>Future detailed review</h2>
            <p>A future paid detailed review could produce a more formal written report with side-by-side scope notes and clarification questions. No checkout is active yet.</p>
          </article>
          <article>
            <h2>What to prepare</h2>
            <p>Use the review form for your existing quote, photos, plans, appliance list, screenshots or notes you are authorised to share.</p>
          </article>
        </section>

        <aside className="compliancePanel">
          <h2>Review limits</h2>
          <p>Quote review is general guidance for scope clarity. It does not replace legal advice, licensed trade inspection, site measure, strata approval, insurance confirmation or written scope confirmation.</p>
        </aside>

        <section className="contentCta">
          <h2>Already have a quote?</h2>
          <p>Add the quote details and prepare any photos or plans so the review can focus on inclusions, allowances, exclusions and site-measure questions.</p>
          <div className="flexActions">
            <Link href="/quote/review" className="button primary">Review existing quote</Link>
            <Link href="/how-it-works" className="button ghost">See how it works</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
