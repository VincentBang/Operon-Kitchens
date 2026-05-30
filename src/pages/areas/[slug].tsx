import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import TrackedCtaLink from '@/components/TrackedCtaLink';
import { getAreaHref, getKitchenArea, KitchenArea, kitchenAreas } from '@/lib/areas';

interface Props {
  area: KitchenArea;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: kitchenAreas.map((area) => ({ params: { slug: area.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const area = getKitchenArea(String(params?.slug || ''));
  if (!area) return { notFound: true };
  return { props: { area } };
};

function typeNote(area: KitchenArea) {
  if (area.type === 'premium homes') return 'Premium home projects usually need stronger detail around finish tier, appliance allowance, custom joinery and benchtop alternatives.';
  if (area.type === 'apartments') return 'Apartment projects usually need strata, lift, access, work-hour and class 2 screening items checked before scope confirmation.';
  if (area.type === 'older housing') return 'Older homes can require extra review of walls, floors, services, access, heritage uncertainty and asbestos risk.';
  if (area.type === 'growth corridor') return 'Growth-corridor projects often involve newer homes where upgrade boundaries, allowance levels and timing need to be clear.';
  return 'Mixed suburbs benefit from early property-type, access, finish and service assumptions before comparing quote totals.';
}

export default function AreaPage({ area }: Props) {
  return (
    <main>
      <Head>
        <title>Kitchen renovation quotes in {area.name} | Operon Kitchens</title>
        <meta
          name="description"
          content={`Kitchen renovation quote guidance for ${area.name}: project types, quote risks, strata or access notes, what to prepare and next steps before site measure.`}
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Sydney kitchen quote area</p>
          <h1 className="contentTitle">Kitchen renovation quotes in {area.name}</h1>
        </div>
        <div>
          <p className="muted">{area.intro}</p>
          <div className="flexActions">
            <TrackedCtaLink href="/quote" className="button primary" eventName="area_cta_click" eventProperties={{ area: area.name, cta_type: 'estimate_hero' }}>Start {area.name} estimate</TrackedCtaLink>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            <Link href="/how-it-works" className="button ghost">How it works</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section>
          <h2>Likely project types</h2>
          <ul>
            {area.projectStyles.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section>
          <h2>Quote risks to check</h2>
          <p>{typeNote(area)}</p>
          <ul>
            {area.quoteRisks.map((risk) => <li key={risk}>{risk}</li>)}
          </ul>
        </section>

        <section>
          <h2>What to prepare before requesting a quote</h2>
          <ul>
            {area.preparation.map((item) => <li key={item}>{item}</li>)}
            <li>Any existing quote, plans, drawings, appliance lists or selection notes.</li>
          </ul>
        </section>

        <aside className="compliancePanel">
          <h2>Review note for {area.name}</h2>
          <p>
            Operon Kitchens uses estimate ranges, confidence scoring and review flags. Site measure, selections and written scope confirmation are required before contract pricing. Compliance prompts are general review flags, not legal advice.
          </p>
        </aside>

        <section>
          <h2>Nearby areas</h2>
          <div className="areaPillGrid compact">
            {area.nearby.map((nearby) => (
              <Link href={getAreaHref(nearby)} key={nearby}>{nearby}</Link>
            ))}
            <Link href="/areas">All Sydney areas</Link>
          </div>
        </section>

        <section className="faqStack">
          <h2>{area.name} kitchen renovation FAQ</h2>
          <details className="faqItem">
            <summary>Can I get a confirmed price online for {area.name}?</summary>
            <p>No. The online tool provides a planning estimate range. A site measure, confirmed selections and written scope are still required before contract pricing.</p>
          </details>
          <details className="faqItem">
            <summary>What improves quote confidence?</summary>
            <p>Photos, measurements, plans, service-location notes, access details, finish direction and appliance allowance information all help reduce uncertainty.</p>
          </details>
          <details className="faqItem">
            <summary>Can you review another kitchen quote?</summary>
            <p>Yes. Upload the quote and supporting files so missing inclusions, unclear allowances, exclusions and compliance prompts can be captured for review.</p>
          </details>
        </section>

        <section className="contentCta">
          <h2>Start with clearer scope in {area.name}</h2>
          <p>Build a planning estimate or upload an existing quote before booking site measure.</p>
          <div className="flexActions">
            <TrackedCtaLink href="/quote" className="button primary" eventName="area_cta_click" eventProperties={{ area: area.name, cta_type: 'estimate_bottom' }}>Start kitchen estimate</TrackedCtaLink>
            <TrackedCtaLink href="/request-review" className="button ghost" eventName="area_cta_click" eventProperties={{ area: area.name, cta_type: 'request_review_bottom' }}>Request review</TrackedCtaLink>
          </div>
        </section>
      </section>
    </main>
  );
}
