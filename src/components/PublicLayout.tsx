import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { getAreaHref, priorityFooterAreas } from '@/lib/areas';

interface PublicLayoutProps {
  children: ReactNode;
}

const quoteTools = [
  ['Start kitchen estimate', '/quote'],
  ['Review existing kitchen quote', '/quote/review'],
  ['Kitchen quote Sydney', '/kitchen-quote-sydney'],
  ['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'],
  ['Quote vs estimate', '/kitchen-quote-vs-estimate'],
  ['Quote checklist', '/kitchen-renovation-quote-checklist'],
];

const planningGuides = [
  ['Kitchen renovation process', '/kitchen-renovation-process'],
  ['PC sums and provisional sums', '/kitchen-pc-sums-and-provisional-sums'],
  ['Benchtop options after engineered stone restrictions', '/kitchen-benchtop-options-after-engineered-stone-ban'],
  ['Apartment kitchen renovation Sydney', '/apartment-kitchen-renovation-sydney'],
  ['Kitchen renovation glossary', '/kitchen-renovation-glossary'],
  ['Why kitchen quotes vary', '/why-kitchen-quotes-vary'],
  ['Questions before accepting a quote', '/questions-before-accepting-kitchen-quote'],
  ['FAQ', '/faqs'],
];

const projectTypes = [
  ['Full kitchen renovation', '/full-kitchen-renovation-sydney'],
  ['Cabinetry and benchtop refresh', '/kitchen-cabinetry-benchtop-refresh'],
  ['Apartment kitchen renovation', '/apartment-kitchen-renovation-sydney'],
  ['Benchtop replacement', '/kitchen-benchtop-replacement-sydney'],
  ['Quote review', '/quote/review'],
];

const companyLinks = [
  ['Projects/examples', '/projects'],
  ['Request review', '/quote/review'],
  ['Privacy Policy', '/privacy'],
  ['Terms', '/terms'],
];

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const router = useRouter();
  const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://operonkitchens.com.au';
  const canonicalPath = router.asPath === '/' ? '' : router.asPath.split('?')[0];
  const isQuoteFlow = router.pathname.startsWith('/quote');

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${canonicalBase}${canonicalPath}`} />
      </Head>
      <div className="siteShell">
        <header className={isQuoteFlow ? 'siteHeader compact' : 'siteHeader'}>
          <div className="siteHeaderInner">
            <Link href="/" className="siteBrand" aria-label="Operon Kitchens home">
              <span>Operon</span> Kitchens
            </Link>
            <nav className="desktopNav" aria-label="Primary navigation">
              <Link href="/quote">Estimate</Link>
              <Link href="/quote/review">Review quote</Link>
              <Link href="/kitchen-renovation-process">Guides</Link>
              <Link href="/areas">Areas</Link>
              <Link href="/faqs">FAQ</Link>
            </nav>
            <Link href="/quote" className="headerCta">Start estimate</Link>
            <details className="mobileNav">
              <summary>Menu</summary>
              <div>
                <Link href="/quote">Estimate</Link>
                <Link href="/quote/review">Review quote</Link>
                <Link href="/kitchen-renovation-process">Guides</Link>
                <Link href="/areas">Areas</Link>
                <Link href="/faqs">FAQ</Link>
                <Link href="/projects">Examples</Link>
              </div>
            </details>
          </div>
        </header>

        {children}

        <footer className="siteFooter">
          <div className="footerIntro">
            <div>
              <p className="eyebrow">Operon Kitchens</p>
              <h2>Kitchen renovation estimate and quote review support for Sydney homes, apartments and renovation projects.</h2>
            </div>
            <div className="footerActions">
              <Link href="/quote" className="button primary">Start kitchen estimate</Link>
              <Link href="/quote/review" className="button ghost">Review existing quote</Link>
            </div>
          </div>

          <div className="footerGrid">
            <FooterColumn title="Quote tools" links={quoteTools} />
            <FooterColumn title="Planning guides" links={planningGuides} />
            <FooterColumn title="Kitchen project types" links={projectTypes} />
            <div>
              <h2>Sydney areas</h2>
              <ul>
                {priorityFooterAreas.map((area) => (
                  <li key={area}>
                    <Link href={getAreaHref(area)}>{area}</Link>
                  </li>
                ))}
                <li><Link href="/areas">View all kitchen renovation service areas</Link></li>
              </ul>
            </div>
            <FooterColumn title="Company/legal" links={companyLinks} />
          </div>

          <div className="footerBottom">
            <span>Operon Kitchens is a separate customer-facing kitchen renovation brand.</span>
            <span>Planning guidance only. Site measure and written scope confirmation are required before contract pricing.</span>
          </div>
        </footer>
        {!router.pathname.startsWith('/quote') && (
          <div className="stickyMobileCta" aria-label="Quick actions">
            <Link href="/quote">Start estimate</Link>
            <Link href="/quote/review">Review quote</Link>
          </div>
        )}
      </div>
    </>
  );
}
