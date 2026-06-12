import Head from 'next/head';
import Link from 'next/link';
import { glossary } from '@/data/glossary';

export default function GlossaryPage() {
  return (
    <main>
      <Head>
        <title>Kitchen glossary | Operon Kitchens</title>
        <meta name="description" content="Plain-English kitchen glossary for cabinetry, benchtops, allowances, site measure and quote review planning." />
      </Head>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Planning language</p>
          <h1 className="contentTitle">Kitchen glossary</h1>
        </div>
        <p className="muted">Understand common kitchen and cabinetry terminology before comparing estimates, allowances and exclusions.</p>
      </section>
      <section className="contentPage">
        <div className="definitionList">
          {glossary.map(({ term, definition }) => (
            <article key={term}>
              <h2>{term}</h2>
              <p>{definition}</p>
            </article>
          ))}
        </div>
        <section className="contentCta">
          <h2>Use the glossary with your own scope</h2>
          <p>Start an estimate or add existing quote details to see which terms need project-specific review.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
