import Head from 'next/head';
import Link from 'next/link';

const collectedInformation = [
  'Contact details such as name, email and phone number.',
  'Suburb, address information if supplied, property type, access notes and project timing.',
  'Budget band, measurements, layout answers, finish selections and project scope notes.',
  'Estimate answers, quote-review checklist answers, risk flags and preferred next steps.',
  'Uploaded quotes, plans, photos, screenshots, drawings, appliance lists and other project documents.',
  'Communication records, support requests, chatbot or planning assistant interactions.',
  'Website analytics, cookies, page progress, conversion events and device/browser information.',
];

const collectionReasons = [
  'Prepare planning estimate ranges, indicative range outputs and confidence scoring.',
  'Review existing kitchen quotes and identify missing or unclear scope items.',
  'Flag assumptions, exclusions, risk items and compliance prompts for professional review.',
  'Coordinate follow-up, quote review, site measure interest, written scope discussions or future service enquiries.',
  'Improve the website, estimate logic, review checklist and user experience.',
  'Manage security, support, record keeping and applicable legal or regulatory obligations.',
];

const sharingParties = [
  'Trades, installers, designers, suppliers, consultants or other project advisers where review is needed.',
  'Technology, cloud hosting, file storage, analytics, email, SMS and support providers.',
  'Legal, insurance, compliance or professional advisers where reasonably required.',
];

export default function PrivacyPage() {
  return (
    <main className="contentPage articleBody">
      <Head>
        <title>Privacy Policy | Operon Kitchens</title>
        <meta
          name="description"
          content="How Operon Kitchens collects and uses information for planning estimates, quote review, uploaded photos, plans, existing quotes, analytics and follow-up."
        />
      </Head>
      <p className="eyebrow">Privacy</p>
      <h1 className="contentTitle">Privacy Policy</h1>
      <p className="muted">Last updated: 31 May 2026.</p>
      <p>
        This policy explains how Operon Kitchens handles information provided through the website, estimate wizard, quote-review pathway, upload tools, planning assistant and service enquiry forms. It is written for customers using Operon Kitchens to plan, compare or review a Sydney kitchen renovation project.
      </p>

      <section>
        <h2>Who this policy applies to</h2>
        <p>
          This policy applies to Operon Kitchens website visitors, estimate users, quote-review users, upload users, planning assistant users and people who enquire about future services such as professional review, site measure or design/specification support.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <p>Depending on how you use the site, we may collect:</p>
        <ul>
          {collectedInformation.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2>Uploaded files</h2>
        <p>
          Uploaded quotes, plans, photos, screenshots, drawings, appliance lists and other documents may contain personal information, property information or third-party commercial information. Only upload files you are authorised to share with Operon Kitchens for estimate, quote review or project planning purposes.
        </p>
      </section>

      <section>
        <h2>Why we collect information</h2>
        <p>We collect information to:</p>
        <ul>
          {collectionReasons.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2>If information is not provided</h2>
        <p>
          If key project, contact, upload or checklist information is missing, Operon Kitchens may not be able to prepare a useful planning estimate, indicative range, quote review, site measure discussion or follow-up. Missing measurements, photos, plans or service details may also lower estimate confidence and increase review risk.
        </p>
      </section>

      <section>
        <h2>Who we may share information with</h2>
        <p>
          We only share information where reasonably needed for the estimate, quote review, project review, support, security or legal purposes. Public customer outputs are limited to planning ranges, confidence, assumptions, exclusions and review prompts rather than admin-only commercial or pipeline information. Sharing may include:
        </p>
        <ul>
          {sharingParties.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2>Overseas storage or processing</h2>
        <p>
          Some technology, hosting, analytics, file storage or communication providers may store or process information outside Australia. The countries involved may vary depending on the provider and their infrastructure.
        </p>
      </section>

      <section>
        <h2>Cookies and analytics</h2>
        <p>
          The website may use cookies, logs or analytics to understand traffic, form progress, page performance, quote-tool usage, planning assistant interactions and conversion events. You may disable cookies in your browser, but some website features may not work as intended.
        </p>
      </section>

      <section>
        <h2>Marketing opt-in</h2>
        <p>
          Marketing is optional. Where marketing is offered, the checkbox should be separate from the collection notice and unticked by default. You can submit an estimate, quote review or enquiry without agreeing to marketing, and you can unsubscribe from marketing messages.
        </p>
      </section>

      <section>
        <h2>Storage and retention</h2>
        <p>
          Estimate and quote-review enquiries may be retained while active and for reasonable business record periods. Uploaded quotes, screenshots, photos, plans and related files may be deleted on request where legally and technically possible. Future paid-service records may need to be retained for business, accounting, support or legal reasons.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          Operon Kitchens takes reasonable steps to protect submitted information, including access controls, limited access, secure storage practices and service provider safeguards. Uploaded documents should only be reviewed by authorised people who need access for estimate, quote review, support or project-planning purposes. No online system can be promised as absolutely secure.
        </p>
      </section>

      <section>
        <h2>Access, correction and deletion</h2>
        <p>
          You can request access to information held about you, ask for corrections, or request deletion where legally and technically possible. Use the estimate, quote-review or contact pathway and include enough detail for your request to be identified.
        </p>
      </section>

      <section>
        <h2>Privacy complaints</h2>
        <p>
          If you have a privacy concern, contact Operon Kitchens first through the estimate, quote-review or contact pathway. If you are not satisfied with the response, you may be able to contact the Office of the Australian Information Commissioner. This policy does not provide legal advice.
        </p>
      </section>

      <section>
        <h2>Data breach response</h2>
        <p>
          If Operon Kitchens becomes aware of a data incident likely to cause serious harm, it will assess and respond according to applicable privacy and notifiable data breach obligations.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Contact Operon Kitchens through the estimate, quote-review or contact form. Do not include sensitive information unless it is reasonably needed for your kitchen estimate or review request.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          This policy may be updated as Operon Kitchens adds services or changes how the website works. The latest version will show the updated date on this page.
        </p>
      </section>

      <section className="contentCta">
        <h2>Continue planning</h2>
        <p>Return to the estimate pathway or upload an existing quote for structured review.</p>
        <div className="flexActions">
          <Link href="/quote" className="button primary">Start kitchen estimate</Link>
          <Link href="/quote/review" className="button ghost">Review existing quote</Link>
        </div>
      </section>
    </main>
  );
}
