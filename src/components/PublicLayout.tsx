import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { getAreaHref } from '@/lib/areas';
import TrackedCtaLink from '@/components/TrackedCtaLink';

interface PublicLayoutProps {
  children: ReactNode;
}

const quoteReviewLinks = [
  ['Start kitchen estimate', '/quote'],
  ['Review existing kitchen quote', '/quote/review'],
  ['Request review', '/request-review'],
  ['Kitchen quote Sydney', '/kitchen-quote-sydney'],
  ['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'],
];

const serviceLinks = [
  ['Full kitchen renovation', '/full-kitchen-renovation-sydney'],
  ['Cabinetry and benchtop refresh', '/kitchen-cabinetry-benchtop-refresh'],
  ['Apartment kitchen renovation Sydney', '/apartment-kitchen-renovation-sydney'],
  ['Benchtop replacement', '/kitchen-benchtop-replacement-sydney'],
  ['Site measure', '/site-measure'],
  ['Design/specification package', '/design-specification-package'],
];

const guideLinks = [
  ['Kitchen renovation process', '/kitchen-renovation-process'],
  ['PC sums and provisional sums', '/kitchen-pc-sums-and-provisional-sums'],
  ['Benchtop options', '/kitchen-benchtop-options-after-engineered-stone-ban'],
  ['Kitchen renovation glossary', '/kitchen-renovation-glossary'],
  ['FAQ', '/faqs'],
];

const companyLinks = [
  ['Projects/examples', '/projects'],
  ['Privacy Policy', '/privacy'],
  ['Terms', '/terms'],
];

const footerAreas = ['Mosman', 'Vaucluse', 'Double Bay', 'Bellevue Hill', 'Neutral Bay', 'Manly'];

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
  const isRequestReviewFlow = router.pathname === '/request-review' || router.pathname === '/contact';
  const showStickyCta = !isQuoteFlow && !isRequestReviewFlow;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${canonicalBase}${canonicalPath}`} />
        <link rel="icon" href="/brand/operon-kitchens-favicon.png" type="image/png" />
      </Head>
      <div className="siteShell">
        <header className={isQuoteFlow ? 'siteHeader compact' : 'siteHeader'}>
          <div className="siteHeaderInner">
            <Link href="/" className="siteBrand" aria-label="Operon Kitchens home">
              <Image src="/brand/operon-kitchens-logo-header.png" alt="Operon Kitchens" width={920} height={208} priority />
            </Link>
            <nav className="desktopNav" aria-label="Primary navigation">
              <Link href="/quote">Estimate</Link>
              <Link href="/quote/review">Review quote</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/kitchen-renovation-process">Guides</Link>
              <Link href="/areas">Areas</Link>
              <Link href="/faqs">FAQ</Link>
            </nav>
            <TrackedCtaLink href="/quote" className="headerCta" eventName="estimate_start_click" eventProperties={{ route: router.pathname, cta_location: 'header' }}>Start estimate</TrackedCtaLink>
            <details className="mobileNav">
              <summary>Menu</summary>
              <div>
                <Link href="/quote">Estimate</Link>
                <Link href="/quote/review">Review quote</Link>
                <Link href="/how-it-works">How it works</Link>
                <Link href="/request-review">Request review</Link>
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
              <Image className="footerLogo" src="/brand/operon-kitchens-logo-horizontal.png" alt="Operon Kitchens logo" width={1400} height={317} />
              <h2>Kitchen renovation estimate and quote review support for Sydney homes, apartments and renovation projects.</h2>
            </div>
            <div className="footerActions">
              <TrackedCtaLink href="/quote" className="button primary" eventName="estimate_start_click" eventProperties={{ route: router.pathname, cta_location: 'footer' }}>Start kitchen estimate</TrackedCtaLink>
              <TrackedCtaLink href="/request-review" className="button ghost" eventName="quote_review_start_click" eventProperties={{ route: router.pathname, cta_location: 'footer_request_review' }}>Request review</TrackedCtaLink>
            </div>
          </div>

          <div className="footerGrid">
            <FooterColumn title="Quote & review" links={quoteReviewLinks} />
            <FooterColumn title="Services" links={serviceLinks} />
            <FooterColumn title="Guides" links={guideLinks} />
            <div className="footerStack">
              <h2>Areas & company</h2>
              <h3>Sydney areas</h3>
              <ul>
                {footerAreas.map((area) => (
                  <li key={area}>
                    <Link href={getAreaHref(area)}>{area}</Link>
                  </li>
                ))}
                <li><Link href="/areas">View all areas</Link></li>
              </ul>
              <h3>Company</h3>
              <ul>
                {companyLinks.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="footerBottom">
            Operon Kitchens is a separate customer-facing kitchen renovation brand. Planning guidance only. Site measure and written scope confirmation are required before contract pricing.
          </p>
        </footer>
        {showStickyCta && (
          <div className="stickyMobileCta" aria-label="Quick actions">
            <TrackedCtaLink href="/quote" eventName="estimate_start_click" eventProperties={{ route: router.pathname, cta_location: 'mobile_sticky' }}>Start estimate</TrackedCtaLink>
            <TrackedCtaLink href="/quote/review" eventName="quote_review_start_click" eventProperties={{ route: router.pathname, cta_location: 'mobile_sticky' }}>Review quote</TrackedCtaLink>
          </div>
        )}
      </div>
    </>
  );
}
