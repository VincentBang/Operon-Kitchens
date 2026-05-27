import Head from 'next/head';
import Link from 'next/link';

const termsSections = [
  {
    title: 'Planning estimates',
    body: 'Operon Kitchens provides planning estimate ranges, confidence scoring, assumptions, exclusions and review flags. Online estimates are not binding building quotes and must not be relied on as contract pricing.',
  },
  {
    title: 'Site measure and written scope',
    body: 'A site measure, confirmed selections, site-condition review and written scope confirmation are required before any project-specific contract price or building proposal is issued.',
  },
  {
    title: 'Quote review guidance',
    body: 'Uploaded quote review is designed to identify unclear inclusions, allowances, exclusions and risk items. It is guidance only and does not automatically approve, reject or certify another contractor quote.',
  },
  {
    title: 'Compliance prompts',
    body: 'Deposit, HBC, strata, engineered-stone, DBP, BASIX and licensed-trade prompts are general review flags. They are not legal, financial, building-certification or compliance advice.',
  },
  {
    title: 'Customer information',
    body: 'Customers are responsible for providing accurate project details, photos, measurements, documents, site access information, approvals and selection preferences where available.',
  },
  {
    title: 'Licensed trades and inspections',
    body: 'Electrical, plumbing and gas work must be inspected, scoped and completed by appropriately licensed trades. Online information is not a substitute for trade inspection.',
  },
  {
    title: 'Intellectual property',
    body: 'Website content, estimate structures, review frameworks, copy, design and Operon Kitchens branding remain the intellectual property of their respective owners and must not be copied for commercial use without permission.',
  },
  {
    title: 'Acceptable use',
    body: 'Do not upload unlawful, misleading, unsafe or unrelated material. Do not attempt to interfere with the website, forms, quote tools or supporting systems.',
  },
  {
    title: 'Limitation of liability',
    body: 'To the extent permitted by law, Operon Kitchens is not liable for decisions made using general online guidance without project-specific professional review, site inspection and written scope confirmation.',
  },
];

export default function TermsPage() {
  return (
    <main className="contentPage articleBody">
      <Head>
        <title>Terms | Operon Kitchens</title>
        <meta
          name="description"
          content="Operon Kitchens website terms for planning estimates, quote review guidance, compliance prompts, uploaded files and professional site confirmation."
        />
      </Head>
      <p className="eyebrow">Terms</p>
      <h1 className="contentTitle">Operon Kitchens terms of use</h1>
      <p>
        These terms explain how to use the Operon Kitchens website, estimate tools and quote review intake. They are written in plain English and should be read together with the privacy policy.
      </p>

      {termsSections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section className="compliancePanel">
        <h2>Disclaimer</h2>
        <p>
          Operon Kitchens does not provide legal advice, financial advice, building certification advice or a substitute for licensed trade inspection. Compliance items require project-specific confirmation.
        </p>
      </section>

      <section className="contentCta">
        <h2>Need a clearer next step?</h2>
        <p>Start an estimate or upload a current kitchen quote so the scope can be reviewed more carefully.</p>
        <div className="flexActions">
          <Link href="/quote" className="button primary">Start kitchen estimate</Link>
          <Link href="/quote/review" className="button ghost">Review existing quote</Link>
        </div>
      </section>
    </main>
  );
}
