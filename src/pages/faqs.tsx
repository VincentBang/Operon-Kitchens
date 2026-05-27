import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaqRecord, listFaqs } from '@/lib/adminData';

interface Props {
  faqs: FaqRecord[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { props: { faqs: listFaqs(false) } };
};

function groupFaqs(faqs: FaqRecord[]) {
  return faqs.reduce<Record<string, FaqRecord[]>>((groups, faq) => {
    const category = faq.category || 'general';
    return { ...groups, [category]: [...(groups[category] || []), faq] };
  }, {});
}

function titleCase(value: string) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function FaqsPage({ faqs }: Props) {
  const grouped = groupFaqs(faqs);
  const categories = Object.keys(grouped);

  return (
    <main>
      <section className="section twoColumn">
        <div>
          <p className="eyebrow">Kitchen quote help</p>
          <h1 className="contentTitle">Questions before you renovate</h1>
        </div>
        <div>
          <p className="muted">
            Practical answers about estimate confidence, compliance prompts, review steps and what still needs confirmation before a fixed written quote.
          </p>
          <Link href="/quote" className="textLink">Start an estimate</Link>
        </div>
      </section>

      <section className="section faqStack">
        {categories.map((category) => (
          <article key={category} className="wizardPanel">
            <h2>{titleCase(category)}</h2>
            <div className="faqList">
              {grouped[category].map((faq) => (
                <details key={faq.id} className="faqItem">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
