import Head from 'next/head';
import Link from 'next/link';
import { renovationGlossaryTerms } from '@/lib/seoEducation';

export default function KitchenRenovationGlossaryPage() {
  return (
    <main>
      <Head>
        <title>Kitchen renovation glossary | Operon Kitchens</title>
        <meta
          name="description"
          content="Plain English kitchen renovation glossary for allowances, exclusions, PC sums, provisional sums, site measure, HBC, strata and engineered-stone review items."
        />
      </Head>

      <section className="contentHero">
        <div>
          <p className="eyebrow">Kitchen renovation glossary</p>
          <h1 className="contentTitle">Kitchen renovation terms, explained simply.</h1>
        </div>
        <div>
          <p className="muted">
            Understand the words that often decide whether a kitchen quote is clear, comparable and ready for professional review.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage">
        <div className="definitionList">
          {renovationGlossaryTerms.map(([term, definition]) => (
            <article key={term}>
              <h2>{term}</h2>
              <p>{definition}</p>
            </article>
          ))}
        </div>

        <aside className="compliancePanel contentCta">
          <h2>Use the glossary while comparing quotes</h2>
          <p>
            If a quote uses unclear allowances, exclusions or compliance wording, capture it through the quote review intake before relying on the total.
          </p>
          <Link href="/kitchen-pc-sums-and-provisional-sums" className="textLink">Read about PC sums and provisional sums</Link>
        </aside>
      </section>
    </main>
  );
}
