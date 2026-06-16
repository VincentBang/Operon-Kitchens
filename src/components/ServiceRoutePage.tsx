import Link from 'next/link';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import { getServicePage } from '@/lib/servicePages';

interface Props {
  slug: string;
}

export default function ServiceRoutePage({ slug }: Props) {
  const page = getServicePage(slug);

  if (!page) {
    return (
      <main className="contentPage">
        <section className="contentHero">
          <div>
            <p className="eyebrow">Service page unavailable</p>
            <h1 className="contentTitle">This kitchen service page needs review.</h1>
          </div>
          <div>
            <p className="muted">The requested service page is not configured yet. Use the estimate or quote review path while this page is checked.</p>
            <div className="flexActions">
              <Link href="/quote" className="button primary">Start kitchen estimate</Link>
              <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <ServicePageTemplate page={page} />;
}
