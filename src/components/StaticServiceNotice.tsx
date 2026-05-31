import Head from 'next/head';
import Link from 'next/link';

interface StaticServiceNoticeProps {
  title: string;
  eyebrow?: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function StaticServiceNotice({
  title,
  eyebrow = 'Operon Kitchens',
  description,
  primaryHref = '/',
  primaryLabel = 'Return home',
  secondaryHref = '/quote',
  secondaryLabel = 'Start kitchen estimate',
}: StaticServiceNoticeProps) {
  return (
    <>
      <Head>
        <title>{title} | Operon Kitchens</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="pageSurface">
        <section className="wizardShell">
          <div className="wizardHeader">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="muted">{description}</p>
          </div>
          <div className="wizardPanel stepStack">
            <p>
              This public deployment is configured for the customer website, planning estimate and quote review pathways.
              Admin, account and database-backed tools are intentionally disabled until a kitchen-namespaced backend is connected.
            </p>
            <div className="flexActions">
              <Link href={primaryHref} className="button primary">
                {primaryLabel}
              </Link>
              <Link href={secondaryHref} className="button ghost">
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
