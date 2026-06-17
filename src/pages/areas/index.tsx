import Head from 'next/head';
import Link from 'next/link';
import { AreaType, kitchenAreas } from '@/lib/areas';
import TrackedCtaLink from '@/components/TrackedCtaLink';

const groups = kitchenAreas.reduce<Record<string, typeof kitchenAreas>>((acc, area) => {
  const key = area.type;
  return { ...acc, [key]: [...(acc[key] || []), area] };
}, {});

const groupOrder: AreaType[] = ['premium homes', 'apartments', 'older housing', 'mixed', 'family homes', 'growth corridor'];

const groupContent: Record<AreaType, { eyebrow: string; title: string; intro: string; cta: string; href: string }> = {
  'premium homes': {
    eyebrow: 'Premium homes',
    title: 'Premium homes',
    intro: 'Higher finish expectations, custom joinery, appliance allowances and benchtop detail can make quote comparison difficult until selections are clearly documented.',
    cta: 'Start estimate with finish level selected',
    href: '/quote',
  },
  apartments: {
    eyebrow: 'Apartments and strata',
    title: 'Apartment and strata-heavy suburbs',
    intro: 'Lift access, strata or owners corporation approval review, work-hour limits, class 2 screening and service constraints may require confirmation before a scope can be relied on.',
    cta: 'Review quote for access and strata assumptions',
    href: '/quote/review',
  },
  'older housing': {
    eyebrow: 'Older housing',
    title: 'Older housing and heritage-style areas',
    intro: 'Older homes may carry hidden conditions, make-good work, access limits, plumbing or electrical uncertainty and asbestos review prompts before site measure.',
    cta: 'Request review before site measure',
    href: '/request-review',
  },
  mixed: {
    eyebrow: 'Mixed areas',
    title: 'Mixed homes and apartments',
    intro: 'Mixed suburbs need early separation of property type, access, finish level, licensed trade scope and apartment or older-home review prompts.',
    cta: 'Choose the right quote path',
    href: '/how-it-works',
  },
  'family homes': {
    eyebrow: 'Family homes',
    title: 'Family-home suburbs',
    intro: 'Larger kitchens, pantry zones, appliance planning, demolition, waste, lighting and finish boundaries should be clear before comparing quote totals.',
    cta: 'Start planning estimate',
    href: '/quote',
  },
  'growth corridor': {
    eyebrow: 'Growth corridors',
    title: 'Growth corridors and new-home upgrades',
    intro: 'Newer-home upgrades often depend on builder-grade finish boundaries, storage changes, appliance allowance, timing and budget alignment.',
    cta: 'Start planning estimate',
    href: '/quote',
  },
};

const contextCards = [
  ['Apartments and strata', 'Lift access, strata approval or notification review, class 2 screening, work-hour limits and service constraints can affect quote confidence before site measure.'],
  ['Older homes', 'Hidden conditions, make-good work, plumbing or electrical uncertainty and asbestos review prompts may require confirmation.'],
  ['Premium renovations', 'Custom joinery, finish selection, benchtop and splashback detail, hardware and allowance clarity can change quote review risk.'],
  ['Growth corridors and family homes', 'Project size, upgrade level, appliance planning, cabinetry quantity and budget alignment shape the planning estimate range.'],
];

const nextSteps = [
  ['No quote yet', 'Start with project type, suburb, timing, layout, inclusions and finish level.', 'Start kitchen estimate', '/quote'],
  ['Already have a quote', 'Check inclusions, exclusions, allowances, access, trades and unclear scope before comparing totals.', 'Review existing quote', '/quote/review'],
  ['Need help preparing scope', 'Use request review when you want Operon Kitchens to check the project context before site measure.', 'Request review', '/request-review'],
  ['Preparing for site measure', 'Gather dimensions, photos, access notes, selections and quote questions for the next review step.', 'Prepare for site measure', '/site-measure'],
];

const relatedLinks = [
  ['Kitchen renovation process', '/kitchen-renovation-process'],
  ['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'],
  ['Apartment kitchen renovation Sydney', '/apartment-kitchen-renovation-sydney'],
  ['Kitchen FAQ', '/faqs'],
];

export default function AreasPage() {
  return (
    <main>
      <Head>
        <title>Sydney kitchen renovation service areas | Operon Kitchens</title>
        <meta
          name="description"
          content="Sydney kitchen renovation service areas and quote review support by suburb, property type, access, strata, older-home risk and finish expectations."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Sydney areas</p>
          <h1 className="contentTitle">Sydney kitchen renovation service areas and quote review support.</h1>
        </div>
        <div>
          <p className="muted">
            Kitchen quote confidence can change by suburb, property type, access, strata requirements, older-home conditions and finish expectations. Use Operon Kitchens to start with a planning estimate or review an existing quote before site measure.
          </p>
          <p className="heroLead reviewLead">
            Planning guidance only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.
          </p>
          <div className="flexActions">
            <TrackedCtaLink href="/quote" className="button primary" eventName="area_cta_click" eventProperties={{ area: 'Sydney', cta_type: 'areas_hero_estimate' }}>Start kitchen estimate</TrackedCtaLink>
            <TrackedCtaLink href="/quote/review" className="button ghost" eventName="area_cta_click" eventProperties={{ area: 'Sydney', cta_type: 'areas_hero_review' }}>Review existing quote</TrackedCtaLink>
          </div>
        </div>
      </section>

      <section className="contentPage wide articleBody">
        <section>
          <div className="sectionIntro">
            <p className="eyebrow">Quote confidence</p>
            <h2>Why suburb and property type affect kitchen quote confidence</h2>
            <p>
              A planning range is more useful when local access, building type, finish expectations and approval prompts are visible early. These are review prompts, not legal advice or confirmed pricing.
            </p>
          </div>
          <div className="detailGrid four">
            {contextCards.map(([title, body]) => (
              <article className="infoCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="sectionIntro">
            <p className="eyebrow">Sydney suburb groups</p>
            <h2>Find the area context that matches your kitchen project</h2>
            <p>
              Browse suburbs by project pattern, then move to a planning estimate, quote review or site-measure preparation pathway.
            </p>
          </div>
        </section>

        {groupOrder.map((type) => {
          const areas = groups[type] || [];
          const content = groupContent[type];
          if (!areas.length) return null;
          return (
          <section className="areaGroup" key={type}>
            <div className="sectionIntro areaGroupHeader">
              <div>
                <p className="eyebrow">{content.eyebrow}</p>
                <h2>{content.title}</h2>
                <p>{content.intro}</p>
              </div>
              <TrackedCtaLink href={content.href} className="button secondary" eventName="area_cta_click" eventProperties={{ area: content.title, cta_type: 'area_group' }}>
                {content.cta}
              </TrackedCtaLink>
            </div>
            <div className="areaCardGrid">
              {areas.map((area) => (
                <Link href={`/areas/${area.slug}`} className="infoCard linkedCard" key={area.slug}>
                  <h3>{area.name}</h3>
                  <p>{area.intro}</p>
                  <ul className="miniRiskList">
                    {area.quoteRisks.slice(0, 2).map((risk) => <li key={risk}>{risk}</li>)}
                  </ul>
                  <span>Review {area.name} quote context</span>
                </Link>
              ))}
            </div>
          </section>
          );
        })}

        <section className="contentCtaBlock">
          <div className="sectionIntro">
            <p className="eyebrow">Next step</p>
            <h2>Choose the right next step for your kitchen project</h2>
          </div>
          <div className="detailGrid four">
            {nextSteps.map(([title, body, cta, href]) => (
              <article className="infoCard linkedActionCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
                <TrackedCtaLink href={href} className="textLink" eventName="area_cta_click" eventProperties={{ area: 'Sydney', cta_type: title }}>
                  {cta}
                </TrackedCtaLink>
              </article>
            ))}
          </div>
        </section>

        <section className="guideSummary">
          {relatedLinks.map(([label, href]) => (
            <article key={href}>
              <h2>{label}</h2>
              <p>Use this guide alongside your suburb context before relying on a kitchen renovation quote total.</p>
              <Link href={href} className="textLink">Read guide</Link>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
