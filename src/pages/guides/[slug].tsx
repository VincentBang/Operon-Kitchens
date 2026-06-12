import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { guides, Guide } from '@/data/guides';

interface Props {
  guide: Guide;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: guides.map((guide) => ({ params: { slug: guide.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return { notFound: true };
  return { props: { guide } };
};

export default function GuidePage({ guide }: Props) {
  return (
    <main>
      <Head>
        <title>{`${guide.title} | Operon Kitchens`}</title>
        <meta name="description" content={`${guide.title} from Operon Kitchens, with practical quote clarity and site-measure guidance.`} />
      </Head>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Kitchen guide</p>
          <h1 className="contentTitle">{guide.title}</h1>
        </div>
        <p className="muted">Use this as planning context before your estimate is professionally reviewed.</p>
      </section>
      <article className="contentPage articleBody">
        <p>{guide.content}</p>
        <section className="compliancePanel">
          <h2>Review reminder</h2>
          <p>Online guidance does not replace site inspection, licensed trade confirmation or written scope confirmation.</p>
        </section>
        <section className="contentCta">
          <h2>Make this project-specific</h2>
          <p>Start an estimate or add existing quote details so the guide can become a clearer review checklist.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
