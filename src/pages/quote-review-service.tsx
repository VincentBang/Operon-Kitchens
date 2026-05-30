import Head from 'next/head';
import Link from 'next/link';

const reviewChecks = [
  'Missing inclusions such as demolition, delivery, rubbish removal, final clean, painting and patching',
  'PC sums, provisional sums and appliance allowance wording',
  'Benchtop, splashback, cut-outs, joins, waterfalls and material restriction prompts',
  'Plumbing, electrical, gas and service relocation assumptions',
  'Apartment, strata, lift, access, parking and building management conditions',
  'Deposit guidance, HBC review threshold and final site measure requirement',
];

const futureReport = [
  'Side-by-side scope clarity notes',
  'Allowance and provisional-sum questions to send back',
  'Missing information list for professional follow-up',
  'Site-measure and written scope checklist',
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
            A lower total can still become expensive if demolition, trades, appliances, benchtops, exclusions or access conditions are unclear.
          </p>
          <div className="flexActions">
            <Link href="/quote/review" className="button primary">Upload existing quote</Link>
            <Link href="/request-review" className="button ghost">Start quote review</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Basic review checks</h2>
            <p>The current review intake captures quote files, photos, plans, checklist answers and contact details so unclear items can be reviewed professionally.</p>
          </article>
          <article>
            <h2>Future detailed report pathway</h2>
            <p>A future professional review pathway can turn the intake into a written report. For now, this page focuses on review readiness and the next professional step.</p>
          </article>
        </section>

        <section>
          <h2>What the review checks</h2>
          <ul>
            {reviewChecks.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section>
          <h2>What a future detailed review could include</h2>
          <div className="cardGrid">
            {futureReport.map((item) => (
              <article className="infoCard" key={item}>
                <h3>{item}</h3>
                <p>Prepared as a professional review item before relying on a quote total or moving toward site measure.</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="compliancePanel">
          <h2>Review limits</h2>
          <p>Quote review is guidance for scope clarity. It does not replace legal advice, licensed trade inspection, site measure or written scope confirmation.</p>
        </aside>

        <section className="contentCta">
          <h2>Already have a quote?</h2>
          <p>Upload it with photos or plans so the review can focus on inclusions, allowances, exclusions and site-measure questions.</p>
          <div className="flexActions">
            <Link href="/quote/review" className="button primary">Upload existing quote</Link>
            <Link href="/how-it-works" className="button ghost">See how it works</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
