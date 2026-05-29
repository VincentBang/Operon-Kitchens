import Head from 'next/head';
import Link from 'next/link';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import { ServicePage } from '@/lib/servicePages';

interface Props {
  page: ServicePage;
}

export default function ServicePageTemplate({ page }: Props) {
  const url = `https://operonkitchens.com.au/${page.slug}`;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    areaServed: 'Sydney, NSW',
    provider: { '@type': 'LocalBusiness', name: 'Operon Kitchens' },
    url,
  };

  return (
    <main>
      <Head>
        <title>{page.title} | Operon Kitchens</title>
        <meta name="description" content={page.summary} />
      </Head>
      <SchemaJsonLd data={[serviceSchema, faqSchema]} />
      <section className="contentHero">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="contentTitle">{page.title}</h1>
        </div>
        <div>
          <p className="muted">{page.summary}</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <section className="guideSummary">
          <article>
            <h2>Who this is for</h2>
            <ul>{page.whoFor.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h2>Typical scope</h2>
            <ul>{page.typicalScope.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>

        <section className="guideSummary">
          <article>
            <h2>Scope drivers</h2>
            <ul>{page.scopeDrivers.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h2>What to prepare</h2>
            <ul>{page.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>

        <section className="guideSummary">
          <article>
            <h2>What improves confidence</h2>
            <ul>{page.confidenceBoosters.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h2>Exclusions to check</h2>
            <ul>{page.exclusionsToCheck.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>

        <section>
          <h2>Quote risks to check</h2>
          <p>These items do not mean the project is a problem. They are the details that should be visible before comparing quote totals.</p>
          <ul>{page.quoteRisks.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section>
          <h2>Related guides</h2>
          <div className="linkGrid">
            {page.related.map(([label, href]) => (
              <Link href={href} className="infoCard linkedCard" key={href}>
                {label}
                <span>Read next</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Related Sydney areas</h2>
          <div className="tagList">
            {page.relatedAreas.map((area) => (
              <Link href={`/areas/${area.toLowerCase().replace(/\s+/g, '-')}`} className="miniPill" key={area}>
                {area}
              </Link>
            ))}
          </div>
        </section>

        <section className="faqStack">
          <h2>Common questions</h2>
          {page.faqs.map(([question, answer]) => (
            <details className="faqItem" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>

        <section className="contentCta">
          <h2>Turn this into a project-specific review</h2>
          <p>Use the estimate wizard or upload a current kitchen quote so assumptions, exclusions and review flags can be captured clearly.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
