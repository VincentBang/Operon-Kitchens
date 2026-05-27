import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getGuideBySlug, GuideRecord } from '@/lib/adminData';

interface Props {
  guide: GuideRecord | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const slug = typeof context.params?.slug === 'string' ? context.params.slug : '';
  return { props: { guide: slug ? getGuideBySlug(slug) : null } };
};

export default function GuidePage({ guide }: Props) {
  if (!guide) {
    return (
      <main className="contentPage">
        <h1 className="contentTitle">Guide not found</h1>
        <Link href="/" className="textLink">Return home</Link>
      </main>
    );
  }
  return (
    <main>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Kitchen guide</p>
          <h1 className="contentTitle">{guide.title}</h1>
        </div>
        <p className="muted">Use this as planning context before your estimate is professionally reviewed.</p>
      </section>
      <article className="contentPage articleBody">
        <p>{guide.content}</p>
        <p className="contentCta">For a personalised estimate, <Link href="/quote" className="textLink">start your quote</Link>.</p>
      </article>
    </main>
  );
}
