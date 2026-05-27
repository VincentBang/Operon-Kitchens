import Head from 'next/head';
import Link from 'next/link';
import { kitchenAreas } from '@/lib/areas';

const groups = kitchenAreas.reduce<Record<string, typeof kitchenAreas>>((acc, area) => {
  const key = area.type;
  return { ...acc, [key]: [...(acc[key] || []), area] };
}, {});

export default function AreasPage() {
  return (
    <main>
      <Head>
        <title>Sydney kitchen renovation service areas | Operon Kitchens</title>
        <meta
          name="description"
          content="Sydney kitchen renovation quote guidance by suburb, including premium homes, apartments, family homes, older housing and growth-corridor projects."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Sydney areas</p>
          <h1 className="contentTitle">Kitchen renovation quote support across Sydney.</h1>
        </div>
        <div>
          <p className="muted">
            Area pages help identify common quote risks for homes, apartments, older properties and growth-corridor renovations before site measure.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage wide">
        {Object.entries(groups).map(([type, areas]) => (
          <section className="areaGroup" key={type}>
            <div className="sectionIntro">
              <p className="eyebrow">{type}</p>
              <h2>{type === 'apartments' ? 'Apartment and strata-heavy suburbs' : `Kitchen quote areas for ${type}`}</h2>
            </div>
            <div className="areaCardGrid">
              {areas.map((area) => (
                <Link href={`/areas/${area.slug}`} className="infoCard linkedCard" key={area.slug}>
                  <h3>{area.name}</h3>
                  <p>{area.intro}</p>
                  <span>Kitchen renovation quotes in {area.name}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
