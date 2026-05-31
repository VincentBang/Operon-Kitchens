import Head from 'next/head';
import Link from 'next/link';

const acceptableUseRules = [
  'Do not misuse forms or submit false, misleading or irrelevant information.',
  'Do not upload malicious, unlawful, unsafe or unauthorised content.',
  'Do not scrape, copy or commercially reuse website content without permission.',
  'Do not attempt to disrupt the website, estimate tools, review tools or supporting systems.',
];

export default function TermsPage() {
  return (
    <main className="contentPage articleBody">
      <Head>
        <title>Terms of Use | Operon Kitchens</title>
        <meta
          name="description"
          content="Operon Kitchens terms for planning estimates, kitchen quote review guidance, uploaded files, compliance prompts, site measure and written scope confirmation."
        />
      </Head>
      <p className="eyebrow">Terms</p>
      <h1 className="contentTitle">Terms of Use</h1>
      <p className="muted">Last updated: 31 May 2026.</p>
      <p>
        These terms explain how to use the Operon Kitchens website, estimate wizard, quote review intake, upload pathways and planning content. They are written in plain English and should be read together with the <Link href="/privacy" className="textLink">Privacy Policy</Link>.
      </p>

      <section>
        <h2>Use of website</h2>
        <p>
          You may use this website for kitchen estimate, quote-review, planning, education and enquiry purposes. The website is intended to help customers understand scope, assumptions, exclusions, confidence, review risk and next steps before project-specific review.
        </p>
      </section>

      <section>
        <h2>Planning estimates</h2>
        <p>
          Online estimates are planning ranges and indicative ranges, not final quotes, not building proposals and not contract pricing. They are based on user-provided information, estimate assumptions and selected scope inputs. Any project-specific price is subject to site measure, selections, access, services, trade review and written scope confirmation.
        </p>
      </section>

      <section>
        <h2>Quote review guidance</h2>
        <p>
          Quote review helps identify unclear inclusions, exclusions, PC sums, provisional sums, allowances and risk items. It does not approve, reject, certify or legally assess another contractor’s quote. It is guidance only, and detailed review or professional confirmation may be required.
        </p>
      </section>

      <section>
        <h2>Uploaded documents</h2>
        <p>
          You are responsible for ensuring you have permission to upload documents, screenshots, photos, plans, drawings, appliance lists and existing quotes. Do not upload confidential third-party material you are not authorised to share, material that infringes third-party rights, or unlawful, misleading, unsafe or irrelevant content.
        </p>
      </section>

      <section>
        <h2>Customer information accuracy</h2>
        <p>
          Estimate and review outputs depend on the accuracy and completeness of your input. Missing measurements, unclear selections, incomplete access details or outdated quote documents may reduce confidence and increase review risk.
        </p>
      </section>

      <section>
        <h2>Site measure and written scope</h2>
        <p>
          Site measure is required before project-specific pricing. Confirmed selections, site-condition review, access checks, service assumptions and written scope confirmation are required before contract pricing or project commitment.
        </p>
      </section>

      <section>
        <h2>Compliance prompts</h2>
        <p>
          Deposit, HBC, written contract, strata, DBP/class 2, engineered-stone, asbestos and licensed-trade prompts are general review flags only. They are not legal advice, building advice, strata advice, insurance advice or certification. Project-specific confirmation is required.
        </p>
      </section>

      <section>
        <h2>Licensed trades</h2>
        <p>
          Electrical, plumbing and gas work must be scoped and performed by appropriately licensed trades. Online information is not a substitute for licensed trade inspection, site review, certificate requirements or written trade scope.
        </p>
      </section>

      <section>
        <h2>Strata and apartment projects</h2>
        <p>
          Apartment and strata works may require owners corporation approval, building management rules, access coordination, work-hour limits, lift or parking bookings, by-law review and further review. You are responsible for obtaining approvals unless a separate written service agreement says otherwise.
        </p>
      </section>

      <section>
        <h2>Engineered stone and materials</h2>
        <p>
          Engineered-stone restrictions may affect benchtop and splashback options. Material selections require supplier and trade confirmation. The website may suggest alternative material pathways, but it does not certify material status, silica content, installation suitability or project suitability.
        </p>
      </section>

      <section>
        <h2>Older properties and hazardous materials</h2>
        <p>
          Older homes, previous renovations or demolition work may require asbestos or hazardous material review before work proceeds. Online estimate answers are review prompts only and are not a substitute for site inspection or specialist assessment.
        </p>
      </section>

      <section>
        <h2>Contracts, deposits and HBC</h2>
        <p>
          Residential kitchen work may require written contract review depending on value and scope. Deposit terms, Home Building Compensation review and other contract requirements are subject to applicable NSW rules, provider terms and project-specific confirmation before commitment.
        </p>
      </section>

      <section>
        <h2>Future paid services</h2>
        <p>
          Operon Kitchens may later offer detailed quote review, site measure, design/specification packages, paid reports or related services. Separate terms, fees, inclusions, timing, cancellation and refund rules may apply when paid services are launched.
        </p>
      </section>

      <section>
        <h2>No guarantee</h2>
        <p>
          Operon Kitchens does not promise savings, project availability, project acceptance, a future project price or that another contractor will change their quote. The website is designed to improve scope clarity and review readiness before the next professional step.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          Website copy, estimate structures, review frameworks, design, branding, data structures and content belong to Operon Kitchens or their respective owners. They must not be copied or used commercially without permission.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul>
          {acceptableUseRules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </section>

      <section>
        <h2>Third-party links and services</h2>
        <p>
          Links or references to government resources, suppliers, trades, products or third parties are provided for convenience and information only. Operon Kitchens is not responsible for third-party content, availability or decisions.
        </p>
      </section>

      <section>
        <h2>Website availability</h2>
        <p>
          The website, tools, forms, pages or services may be unavailable, changed, updated or removed from time to time. Operon Kitchens may improve or change the estimate and review logic as the service develops.
        </p>
      </section>

      <section>
        <h2>Australian Consumer Law</h2>
        <p>
          Nothing in these terms excludes rights, remedies or guarantees that cannot be excluded under Australian Consumer Law or other applicable law.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, Operon Kitchens is not responsible for decisions made using general online guidance without project-specific professional review, site inspection, licensed trade input and written scope confirmation. This limitation does not exclude non-excludable consumer guarantees or rights.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of New South Wales, Australia.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Contact Operon Kitchens through the estimate, quote-review or contact pathway. Do not include sensitive information unless it is reasonably needed for your enquiry.
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
