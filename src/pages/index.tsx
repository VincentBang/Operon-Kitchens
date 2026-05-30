import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import TrackedCtaLink from '@/components/TrackedCtaLink';
import { getAreaHref, priorityFooterAreas } from '@/lib/areas';

const pathCards = [
  ['I need a new kitchen estimate', 'Build a planning budget range with confidence scoring and review flags.', '/quote'],
  ['I already have a quote', 'Upload a current quote and check inclusions, allowances and exclusions.', '/quote/review'],
  ['I’m researching kitchen cost', 'Understand process, PC sums, benchtop options and budget drivers.', '/kitchen-renovation-cost-sydney'],
  ['I’m in an apartment or strata property', 'See access, approval and class 2 screening items before review.', '/apartment-kitchen-renovation-sydney'],
];

const quoteChangeDrivers = [
  'Cabinetry finish, door profile and hardware tier',
  'Benchtop, splashback, cut-outs, joins and edge details',
  'Appliance allowance, exact models and ventilation assumptions',
  'Plumbing, electrical, gas or lighting relocation',
  'Access, parking, lift bookings, strata and approval conditions',
  'PC sums, provisional sums, exclusions and variation wording',
];

const claritySteps = [
  ['01', 'Describe the project', 'Capture project type, suburb, timing, budget band and whether you already have a quote.'],
  ['02', 'Add layout and scope', 'Record property type, access, layout, size, inclusions, finishes and service assumptions.'],
  ['03', 'Upload context', 'Photos, plans and current quotes help reduce uncertainty before professional review.'],
  ['04', 'Review confidence', 'See estimate range, confidence score, assumptions, exclusions and manual review flags.'],
  ['05', 'Confirm on site', 'Move toward site measure, selection confirmation and written scope before contract pricing.'],
];

const finishTiers = [
  ['Refresh', 'Cabinetry fronts, benchtop or splashback updates where the existing kitchen layout mostly remains.'],
  ['Full renovation', 'Cabinetry, surfaces, sink/tap, appliance allowance, trades, demolition and make-good review.'],
  ['Apartment kitchen', 'Extra attention to strata, access, lift bookings, work hours, class 2 screening and waste.'],
];

const estimateOutputs = [
  'Budget range',
  'Confidence score',
  'Assumptions',
  'Exclusions',
  'Manual review flags',
  'Compliance prompts',
  'Recommended next step',
];

const sampleReportSections = [
  ['Planning range', '$38k - $52k example range'],
  ['Confidence score', '72/100 · medium confidence'],
  ['Included scope', 'Cabinetry, benchtop, splashback, selected trade allowances'],
  ['Assumptions', 'Services mostly stay in place and photos match site conditions'],
  ['Exclusions', 'Structural work, strata approval and final selections not confirmed'],
  ['Review flags', 'Apartment access, licensed trades, HBC/deposit prompt'],
  ['Next step', 'Upload plans or book site measure for written scope confirmation'],
];

const projectExamples = [
  ['Apartment quote review', 'Strata access, lift bookings, appliance assumptions and unclear rubbish removal were the key review items.'],
  ['Family kitchen refresh', 'The scope separated cabinetry fronts, hardware, benchtop and painting/patching boundaries.'],
  ['Premium home estimate', 'Finish tier, benchtop alternatives, appliance allowance and site access shaped the planning range.'],
];

const faqs = [
  ['Is this a confirmed quote?', 'No. It is a planning estimate range and review framework. Site measure, selections and written scope confirmation are still required.'],
  ['Why upload photos or plans?', 'They help identify service locations, access, layout, existing conditions and missing scope items.'],
  ['Can you review another kitchen quote?', 'Yes. The review intake captures inclusions, allowances, exclusions, compliance prompts and items requiring professional confirmation.'],
];

export default function Home() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Operon Kitchens',
      url: 'https://operonkitchens.com.au',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Operon Kitchens',
      areaServed: 'Sydney, NSW',
      url: 'https://operonkitchens.com.au',
    },
  ];

  return (
    <main>
      <Head>
        <title>Operon Kitchens | Sydney kitchen estimates and quote review</title>
        <meta
          name="description"
          content="Clear Sydney kitchen renovation estimate ranges, quote confidence, scope clarity, assumptions, exclusions and professional review pathways."
        />
      </Head>
      <SchemaJsonLd data={schema} />

      <section className="hero">
        <div className="heroContent heroGrid">
          <div>
            <p className="eyebrow">Sydney kitchen quote clarity</p>
            <h1>Clear kitchen renovation estimates for Sydney homes — before the site visit.</h1>
            <p className="heroLead">
              Build a planning range, understand assumptions and exclusions, then move toward professional review and site measure.
            </p>
            <div className="heroActions">
              <TrackedCtaLink href="/quote" className="button primary" eventName="estimate_start_click" eventProperties={{ route: '/', cta_location: 'home_hero' }}>Start kitchen estimate</TrackedCtaLink>
              <TrackedCtaLink href="/quote/review" className="button secondary" eventName="quote_review_start_click" eventProperties={{ route: '/', cta_location: 'home_hero' }}>Review existing quote</TrackedCtaLink>
              <Link href="/how-it-works" className="button ghost">See how it works</Link>
            </div>
          </div>
          <div className="estimatePreviewCard" aria-label="Example estimate preview">
            <span className="eyebrow">Example only</span>
            <h2>Planning range preview</h2>
            <strong>$38k - $52k</strong>
            <p>Medium confidence · 72/100</p>
            <ul>
              <li>Apartment access review</li>
              <li>Benchtop compliance confirmation</li>
              <li>Site measure required</li>
            </ul>
            <small>Example only — actual range depends on scope and site review.</small>
          </div>
        </div>
      </section>

      <section className="proofStrip">
        <span>Estimate range, not guesswork</span>
        <span>Scope and allowance clarity</span>
        <span>Photos and plans improve confidence</span>
        <span>NSW compliance-aware prompts</span>
      </section>

      <section className="section">
        <div className="sectionIntro">
          <p className="eyebrow">Sample estimate output</p>
          <h2>Know what you receive before completing the wizard.</h2>
          <p className="muted">The summary is designed like a mini planning report, not a vague calculator result.</p>
        </div>
        <div className="reportPreviewGrid">
          {sampleReportSections.map(([title, body]) => (
            <article className="infoCard" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionIntro">
          <p className="eyebrow">Choose your path</p>
          <h2>Start where your project is today.</h2>
        </div>
        <div className="cardGrid four">
          {pathCards.map(([title, body, href]) => (
            <Link href={href} className="infoCard linkedCard" key={href}>
              <h3>{title}</h3>
              <p>{body}</p>
              <span>Open</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section twoColumn">
        <div>
          <p className="eyebrow">What the estimate gives you</p>
          <h2>A clearer planning view before site measure.</h2>
          <p className="muted">
            The online estimate is built to show uncertainty clearly, so the next professional review can focus on the right questions.
          </p>
          <Link href="/quote" className="textLink">Start the estimate wizard</Link>
        </div>
        <ul className="checkList">
          {estimateOutputs.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="section splitFeature">
        <Image src="/images/kitchen-living.jpg" alt="Modern kitchen living space for renovation quote planning" width={980} height={735} sizes="(max-width: 820px) 100vw, 52vw" priority />
        <div>
          <p className="eyebrow">Why kitchen quotes change</p>
          <h2>Kitchen pricing moves when the scope is unclear.</h2>
          <p className="muted">
            Two quotes can look different because they include different selections, service assumptions, access constraints or allowance wording.
          </p>
          <ul className="checkList">
            {quoteChangeDrivers.map((driver) => <li key={driver}>{driver}</li>)}
          </ul>
          <Link href="/kitchen-pc-sums-and-provisional-sums" className="textLink">Understand PC sums and provisional sums</Link>
        </div>
      </section>

      <section className="section processSection">
        <div className="sectionIntro">
          <p className="eyebrow">Quote clarity process</p>
          <h2>From first estimate to site-ready scope.</h2>
        </div>
        <div className="processGrid">
          {claritySteps.map(([number, title, body]) => (
            <article className="infoCard processCard" key={number}>
              <span className="stepNumber">{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <Link href="/how-it-works" className="textLink">See the staged customer journey</Link>
      </section>

      <section className="section twoColumn">
        <div>
          <p className="eyebrow">Quote review</p>
          <h2>Already have a kitchen quote? Check what sits behind the total.</h2>
          <p className="muted">
            The review intake checks missing inclusions, PC sums, provisional sums, service relocation, appliance assumptions, benchtop clarity, strata risks and site measure requirements.
          </p>
          <div className="flexActions">
            <TrackedCtaLink href="/quote/review" className="button primary" eventName="quote_review_start_click" eventProperties={{ route: '/', cta_location: 'home_quote_review_section' }}>Review existing quote</TrackedCtaLink>
            <Link href="/quote-review-service" className="button ghost">View quote review service</Link>
          </div>
        </div>
        <div className="valueStack">
          {['Missing inclusions and exclusions', 'Allowance and provisional-sum clarity', 'Trade scope and licensed work prompts', 'Deposit, HBC, strata and material review flags'].map((item) => (
            <article key={item}>
              <h3>{item}</h3>
              <p>Captured as a review item so your next conversation is clearer and more useful.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionIntro">
          <p className="eyebrow">Finish tiers and project types</p>
          <h2>Controlled choices, not endless supplier chaos.</h2>
          <p className="muted">Operon Kitchens keeps early selections practical: enough detail for estimate confidence without exposing behind-the-scenes commercial details or pretending every product is final.</p>
        </div>
        <div className="cardGrid">
          {finishTiers.map(([title, body]) => (
            <article className="infoCard" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionIntro">
          <p className="eyebrow">Project examples</p>
          <h2>Typical profiles for clearer planning.</h2>
          <p className="muted">Example profiles show how scope, access and selections can affect the estimate range. They are not presented as completed Operon Kitchens jobs.</p>
        </div>
        <div className="cardGrid">
          {projectExamples.map(([title, body]) => (
            <article className="infoCard" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <Link href="/projects" className="textLink">View typical project profiles</Link>
      </section>

      <section className="section twoColumn complianceHome">
        <div>
          <p className="eyebrow">Compliance-aware prompts</p>
          <h2>Important review items are flagged early.</h2>
          <p className="muted">This is practical planning guidance, not legal advice. Each item still requires project-specific review or confirmation.</p>
        </div>
        <ul className="checkList">
          <li>HBC and 10% deposit guidance may require review for NSW residential work.</li>
          <li>Plumbing, electrical and gas work must be confirmed by appropriately licensed trades.</li>
          <li>Apartment and strata projects may need access, approval and class 2 screening.</li>
          <li>Engineered-stone restrictions must be confirmed before selecting surfaces.</li>
          <li>Site measure and written scope confirmation are required before contract pricing.</li>
        </ul>
      </section>

      <section className="section">
        <div className="sectionIntro">
          <p className="eyebrow">Sydney kitchen quote support</p>
          <h2>Area-specific planning for homes and apartments.</h2>
        </div>
        <div className="areaPillGrid">
          {priorityFooterAreas.slice(0, 12).map((area) => (
            <Link key={area} href={getAreaHref(area)}>{area}</Link>
          ))}
          <Link href="/areas">View all areas</Link>
        </div>
      </section>

      <section className="section faqStack">
        <div className="sectionIntro">
          <p className="eyebrow">FAQ</p>
          <h2>Questions before you renovate.</h2>
        </div>
        <div className="faqList">
          {faqs.map(([question, answer]) => (
            <details className="faqItem" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section finalCta">
        <p className="eyebrow">Ready to clarify the scope?</p>
        <h2>Start with a planning estimate range, then move to professional review and site measure.</h2>
        <div className="heroActions">
          <TrackedCtaLink href="/quote" className="button primary" eventName="estimate_start_click" eventProperties={{ route: '/', cta_location: 'home_final' }}>Start kitchen estimate</TrackedCtaLink>
          <TrackedCtaLink href="/quote/review" className="button secondary" eventName="quote_review_start_click" eventProperties={{ route: '/', cta_location: 'home_final' }}>Review existing quote</TrackedCtaLink>
          <Link href="/site-measure" className="button ghost">Prepare for site measure</Link>
        </div>
      </section>
    </main>
  );
}
