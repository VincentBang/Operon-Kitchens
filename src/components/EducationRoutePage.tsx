import Link from 'next/link';
import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

interface Props {
  slug: string;
}

export default function EducationRoutePage({ slug }: Props) {
  const page = getEducationPage(slug);

  if (!page) {
    return (
      <main className="contentPage">
        <section className="contentHero">
          <div>
            <p className="eyebrow">Guide unavailable</p>
            <h1 className="contentTitle">This kitchen guide needs review.</h1>
          </div>
          <div>
            <p className="muted">The requested guide is not configured yet. Use the estimate or quote review path while this page is checked.</p>
            <div className="flexActions">
              <Link href="/quote" className="button primary">Start kitchen estimate</Link>
              <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <SeoEducationPage page={page} />;
}
