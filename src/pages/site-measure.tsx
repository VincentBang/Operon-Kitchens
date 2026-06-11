import Head from 'next/head';
import Link from 'next/link';

const measureChecks = [
  ['Room dimensions', 'Cabinet runs, ceiling heights, openings, corners, walls and out-of-square conditions.'],
  ['Walls, floors and levels', 'Substrate condition, floor level changes, wall straightness and any make-good assumptions.'],
  ['Services location', 'Plumbing, electrical, gas, ventilation, lighting and whether services stay in place or move.'],
  ['Appliance fit', 'Nominated appliance sizes, clearances, ventilation, connection points and installation assumptions.'],
  ['Demolition and access', 'Existing cabinetry, protection, parking, loading, stairs, lift access, work hours and rubbish path.'],
  ['Strata and apartment issues', 'Owners corporation rules, lift bookings, parking, work-hour limits and class 2 review prompts.'],
  ['Installation constraints', 'Benchtop access, join positions, splashback details, older-property risk and possible asbestos review items.'],
];

export default function SiteMeasurePage() {
  return (
    <main>
      <Head>
        <title>Kitchen site measure and scope review | Operon Kitchens</title>
        <meta
          name="description"
          content="Request kitchen site measure and professional scope review before written quote confirmation, with checks for dimensions, access, services, selections and approvals."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Site measure</p>
          <h1 className="contentTitle">Confirm the kitchen scope before locking in price.</h1>
        </div>
        <div>
          <p className="muted">
            A site measure checks the details that cannot be confirmed online: dimensions, access, services, appliance fit, existing conditions, selections and project-specific review prompts.
          </p>
          <div className="flexActions">
            <Link href="/request-review" className="button primary">Request site measure</Link>
            <Link href="/quote" className="button ghost">Start estimate first</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Why it matters</h2>
            <p>Online information can show a planning range. Site measure checks whether measurements, services, access and selections support that range.</p>
          </article>
          <article>
            <h2>Written scope follows review</h2>
            <p>The goal is quote-ready documentation: clear inclusions, exclusions, assumptions, services and selection direction.</p>
          </article>
        </section>

        <section>
          <h2>What gets checked</h2>
          <div className="cardGrid">
            {measureChecks.map(([title, body]) => (
              <article className="infoCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="compliancePanel">
          <h2>What site measure is not</h2>
          <p>Site measure is not contract approval, legal advice, automatic project acceptance or a substitute for licensed trade confirmation. It supports clearer written scope before project commitment.</p>
        </aside>

        <section className="contentCta">
          <h2>Ready for site-specific review?</h2>
          <p>Request review if you have photos, plans, a current quote or enough project detail to move beyond the online estimate.</p>
          <div className="flexActions">
            <Link href="/request-review" className="button primary">Request site measure</Link>
            <Link href="/quote" className="button ghost">Start estimate first</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
