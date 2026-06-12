import Head from 'next/head';
import Link from 'next/link';

const packageItems = [
  ['Layout direction', 'A practical direction for cabinet runs, appliance positions and service assumptions.'],
  ['Finish allowance structure', 'Door finish tier, hardware direction, benchtop and splashback preference for quoting.'],
  ['Cabinet, surface and appliance notes', 'Cabinetry, benchtop, splashback and appliance scope notes for clearer comparison.'],
  ['Quote comparison checklist', 'A structured list of inclusions, exclusions, allowances and questions to resolve.'],
  ['Supplier and builder questions', 'Questions to ask showrooms, suppliers or builders before relying on a quote total.'],
];

const audience = [
  'Homeowners comparing kitchen quotes',
  'Apartment owners with strata or access constraints',
  'Customers with unclear scope or allowance wording',
  'Customers preparing before showroom, supplier or site visits',
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
          <h1 className="contentTitle">Turn a rough kitchen idea into a clearer scope.</h1>
        </div>
        <div>
          <p className="muted">
            After estimate and site measure, a specification package can help convert ideas into clearer layout direction, finish allowances, scope notes and quote comparison questions.
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
          <h2>What could be included</h2>
          <div className="cardGrid">
            {packageItems.map(([title, body]) => (
              <article className="infoCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Who it is for</h2>
          <div className="cardGrid">
            {audience.map((item) => (
              <article className="infoCard" key={item}>
                <h3>{item}</h3>
                <p>Useful when you need clearer scope before comparing quotes, visiting suppliers or preparing for site-specific review.</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="compliancePanel">
          <h2>Planning guidance only</h2>
          <p>This future service pathway is not architectural documentation, building certification, legal advice or project approval. Site measure, provider confirmation and written scope confirmation are still required before project commitment.</p>
        </aside>

        <section className="contentCta">
          <h2>Start with the right amount of detail</h2>
          <p>Use the estimate wizard or review existing quote details first, then move toward site measure and specification when the scope is ready.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            <Link href="/request-review" className="button ghost">Contact Operon Kitchens</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
