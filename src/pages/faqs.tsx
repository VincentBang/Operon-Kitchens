import Head from 'next/head';
import Link from 'next/link';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import { faqs, Faq } from '@/data/faqs';

function groupFaqs(items: Faq[]) {
  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .reduce<Record<string, Faq[]>>((groups, faq) => {
      const category = faq.category || 'general';
      return { ...groups, [category]: [...(groups[category] || []), faq] };
    }, {});
}

function titleCase(value: string) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function FaqsPage() {
  const grouped = groupFaqs(faqs);
  const categories = Object.keys(grouped);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <main>
      <Head>
        <title>Kitchen renovation FAQ | Operon Kitchens</title>
        <meta
          name="description"
          content="Answers about kitchen estimate ranges, quote review, confidence scores, compliance prompts, site measure and Sydney renovation planning."
        />
      </Head>
      <SchemaJsonLd data={faqSchema} />
      <section className="contentHero">
        <div>
          <p className="eyebrow">Kitchen quote help</p>
          <h1 className="contentTitle">Questions before you renovate</h1>
        </div>
        <div>
          <p className="muted">
            Practical answers about estimate confidence, compliance prompts, review steps and what still needs confirmation before contract pricing.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage faqStack">
        {categories.map((category) => (
          <article key={category} className="wizardPanel">
            <h2>{titleCase(category)}</h2>
            <div className="faqList">
              {grouped[category].map((faq) => (
                <details key={faq.question} className="faqItem">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </article>
        ))}
        <section className="contentCta">
          <h2>Still comparing kitchen options?</h2>
          <p>Use the estimate or quote-review path to turn general questions into project-specific review items.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
