import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { locations, LocationInfo } from '@/data/locations';

interface Props {
  info: LocationInfo;
  region: string;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(locations).map((region) => ({ params: { region } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const region = typeof params?.region === 'string' ? params.region : '';
  const info = locations[region];
  if (!info) return { notFound: true };
  return { props: { info, region } };
};

export default function LocationPage({ info }: Props) {
  return (
    <main>
      <Head>
        <title>{`${info.name} kitchen renovation guidance | Operon Kitchens`}</title>
        <meta name="description" content={`${info.name} kitchen renovation estimate and quote review guidance, including access, strata and scope notes.`} />
      </Head>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Location guide</p>
          <h1 className="contentTitle">{info.name}</h1>
        </div>
        <p className="muted">{info.description}</p>
      </section>
      <article className="contentPage articleBody">
        <aside className="notePanel">{info.notes}</aside>
        <section>
          <h2>What to prepare</h2>
          <p>Photos, rough dimensions, access notes, property type and any existing quote will make the first estimate more useful.</p>
        </section>
        <section className="contentCta">
          <h2>Ready to clarify the kitchen scope?</h2>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
