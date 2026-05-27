import Head from 'next/head';
import Link from 'next/link';
import { SeoEducationPage as SeoEducationPageData } from '@/lib/seoEducation';

interface Props {
  page: SeoEducationPageData;
}

export default function SeoEducationPage({ page }: Props) {
  return (
    <main>
      <Head>
        <title>{page.title} | Operon Kitchens</title>
        <meta name="description" content={page.summary} />
      </Head>

      <section className="contentHero">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="contentTitle">{page.title}</h1>
        </div>
        <div>
          <p className="muted">{page.summary}</p>
          <div className="flexActions">
            <Link href={page.primaryHref} className="button primary">{page.primaryCta}</Link>
            <Link href={page.secondaryHref} className="button ghost">{page.secondaryCta}</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        {page.sections.map((section) => (
          section.expandable ? (
            <details className="faqItem" key={section.heading}>
              <summary>{section.heading}</summary>
              <p>{section.body}</p>
            </details>
          ) : (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          )
        ))}

        <aside className="compliancePanel">
          <h2>Review note</h2>
          <p>
            This content is general planning guidance for kitchen renovation scope and quote clarity. It is not legal advice and does not replace licensed trade, supplier, strata or contract review.
          </p>
        </aside>

        <section className="faqStack">
          <h2>Common questions</h2>
          <div className="faqList">
            {page.faqs.map((faq) => (
              <details className="faqItem" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contentCta">
          <h2>Next step</h2>
          <p>
            Build a clearer estimate or upload an existing quote for structured review before comparing totals.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
