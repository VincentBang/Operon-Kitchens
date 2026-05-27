import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getLocationByRegion, LocationRecord } from '@/lib/adminData';

interface Props {
  info: LocationRecord | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const region = typeof context.params?.region === 'string' ? context.params.region : '';
  return { props: { info: region ? getLocationByRegion(region) : null } };
};

export default function LocationPage({ info }: Props) {
  if (!info) {
    return (
      <main className="contentPage">
        <h1 className="contentTitle">Location not found</h1>
        <Link href="/" className="textLink">Return home</Link>
      </main>
    );
  }
  return (
    <main>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Location guide</p>
          <h1 className="contentTitle">{info.name}</h1>
        </div>
        <p className="muted">{info.description}</p>
      </section>
      <article className="contentPage articleBody">
        <aside className="notePanel">{info.notes}</aside>
        <p className="contentCta">Ready to renovate? <Link href="/quote" className="textLink">Start your estimate</Link></p>
      </article>
    </main>
  );
}
