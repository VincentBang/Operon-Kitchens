import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getProductBySlug, ProductRecord } from '@/lib/adminData';

interface Props {
  category: ProductRecord | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const slug = typeof context.params?.slug === 'string' ? context.params.slug : '';
  return { props: { category: slug ? getProductBySlug(slug) : null } };
};

export default function ProductPage({ category }: Props) {
  if (!category) {
    return (
      <main className="contentPage">
        <h1 className="contentTitle">Product not found</h1>
        <p className="mt-2">Please select a valid product category.</p>
        <Link href="/" className="textLink mt-4 inline-block">Return home</Link>
      </main>
    );
  }
  return (
    <main>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Product category</p>
          <h1 className="contentTitle">{category.title}</h1>
        </div>
        <p className="muted">{category.summary}</p>
      </section>
      <section className="contentPage">
        <div className="detailGrid">
          {category.details.map((detail) => (
            <article className="infoCard" key={detail}>
              <span className="featureIcon" aria-hidden="true">OK</span>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <p className="contentCta">Ready to price your kitchen? <Link href="/quote" className="textLink">Start your estimate</Link></p>
      </section>
    </main>
  );
}
