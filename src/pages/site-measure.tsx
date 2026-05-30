import Head from 'next/head';
import Link from 'next/link';

const measureChecks = [
  ['Measurements', 'Room dimensions, cabinet runs, ceiling heights, openings, corners and out-of-square conditions.'],
  ['Access', 'Parking, loading, lift access, stairs, protection, work hours and rubbish removal path.'],
  ['Services', 'Plumbing, electrical, gas, ventilation, lighting and whether services stay in place or move.'],
  ['Selections', 'Appliance list, sink/tap, benchtop, splashback, door finish, hardware and accessory direction.'],
  ['Site conditions', 'Existing cabinetry, walls, floors, substrate, older-property risk and possible asbestos review items.'],
  ['Approvals', 'Strata, apartment, DBP/class 2, BASIX or other review prompts where the scope suggests they may matter.'],
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
          <h1 className="contentTitle">Site measure turns an estimate into quote-ready scope.</h1>
        </div>
        <div>
          <p className="muted">
            A site measure checks the details that cannot be confirmed online: dimensions, access, services, existing conditions, selections and project-specific review prompts.
          </p>
          <div className="flexActions">
            <Link href="/request-review" className="button primary">Request site measure</Link>
            <Link href="/quote" className="button ghost">Start estimate first</Link>
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
          <h2>What should be checked</h2>
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
          <h2>Before contract decisions</h2>
          <p>Final written scope should confirm dimensions, selections, trade assumptions, approvals, exclusions and any compliance review items. This page is planning guidance, not legal advice.</p>
        </aside>

        <section className="contentCta">
          <h2>Ready for site-specific review?</h2>
          <p>Request review if you have photos, plans, a current quote or enough project detail to move beyond the online estimate.</p>
          <div className="flexActions">
            <Link href="/request-review" className="button primary">Request site measure</Link>
            <Link href="/quote" className="button ghost">Start estimate first</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
