import Head from 'next/head';
import Link from 'next/link';
import { SeoEducationPage as SeoEducationPageData } from '@/lib/seoEducation';

interface Props {
  page: SeoEducationPageData;
}

export default function SeoEducationPage({ page }: Props) {
  const relatedLinks = [
    ['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'],
    ['Kitchen quote review', '/kitchen-quote-review'],
    ['Kitchen renovation process', '/kitchen-renovation-process'],
    ['Apartment kitchen renovation Sydney', '/apartment-kitchen-renovation-sydney'],
  ].filter(([, href]) => href !== `/${page.slug}`);

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
        <section className="guideSummary">
          <article>
            <h2>Quote clarity first</h2>
            <p>
              A useful kitchen estimate separates inclusions, allowances, exclusions, assumptions and review flags before comparing totals.
            </p>
          </article>
          <article>
            <h2>Sydney context</h2>
            <p>
              Access, strata rules, older properties, licensed trades and material restrictions can all affect the path from planning estimate to confirmed scope.
            </p>
          </article>
        </section>

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

        <section>
          <h2>Common cost and scope drivers</h2>
          <ul>
            <li>Cabinetry quantity, door finish, hardware and storage accessories.</li>
            <li>Benchtop and splashback material, cut-outs, joins, waterfalls and edge detail.</li>
            <li>Appliance allowance, exact model selection, ventilation and installation assumptions.</li>
            <li>Plumbing, electrical, gas, lighting, demolition, waste, access and make-good scope.</li>
          </ul>
        </section>

        <section>
          <h2>What to prepare</h2>
          <p>
            Bring photos of each wall, rough measurements, plans if available, current quote documents, appliance preferences, finish direction, access notes and any strata or approval requirements.
          </p>
        </section>

        <section>
          <h2>Risks and exclusions to check</h2>
          <p>
            Check whether demolition, rubbish removal, delivery, final clean, painting, plaster patching, flooring touch-ups, service relocation and provisional allowances are included or excluded.
          </p>
        </section>

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

        <section>
          <h2>Related guides</h2>
          <div className="linkGrid">
            {relatedLinks.map(([label, href]) => (
              <Link href={href} className="infoCard linkedCard" key={href}>
                {label}
                <span>Read guide</span>
              </Link>
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
