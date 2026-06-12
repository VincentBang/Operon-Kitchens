import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { productCategories, ProductCategory } from '@/data/products';

interface Props {
  category: ProductCategory;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(productCategories).map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const category = productCategories[slug];
  if (!category) return { notFound: true };
  return { props: { category, slug } };
};

export default function ProductPage({ category, slug }: Props) {
  return (
    <main>
      <Head>
        <title>{`${category.title} | Operon Kitchens`}</title>
        <meta name="description" content={`${category.summary} Kitchen estimate guidance for ${category.title.toLowerCase()} in Sydney renovations.`} />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Product category</p>
          <h1 className="contentTitle">{category.title}</h1>
        </div>
        <div>
          <p className="muted">{category.summary}</p>
          <div className="flexActions">
            <Link href={`/quote?category=${slug}`} className="button primary">Estimate with this scope</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
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
        <aside className="compliancePanel contentCta">
          <h2>Product selections still need confirmation</h2>
          <p>Final material suitability, fabrication requirements and trade scope must be confirmed before written scope and contract pricing.</p>
        </aside>
      </section>
    </main>
  );
}
