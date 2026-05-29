import Head from 'next/head';
import Link from 'next/link';

const privacySections = [
  {
    title: 'Information we collect',
    body: 'We may collect your name, email, phone number, suburb or address details, property type, project timing, budget band, measurements, selections, scope notes, risk flags, photos, plans, appliance lists and uploaded quote files.',
  },
  {
    title: 'Why we collect it',
    body: 'We collect this information to prepare planning estimate ranges, review existing quote documents, clarify inclusions and exclusions, screen project risk items, coordinate follow-up and arrange professional review where needed.',
  },
  {
    title: 'Uploads, photos and quote documents',
    body: 'Uploaded files may contain personal information or property details. Only upload documents you are comfortable sharing for kitchen renovation estimate or quote review purposes.',
  },
  {
    title: 'Who we may share it with',
    body: 'We may share relevant project information with trades, manufacturers, suppliers, consultants, technology providers or service providers where reasonably needed to review scope, product suitability, logistics, compliance prompts or site requirements.',
  },
  {
    title: 'Storage and security',
    body: 'We take reasonable steps to keep submitted information secure and limit access to people or service providers who need it for the kitchen estimate, quote review or follow-up process.',
  },
  {
    title: 'File retention and deletion requests',
    body: 'Uploaded photos, plans and quote documents are kept only for as long as reasonably needed for estimate, review, follow-up, record keeping or dispute-prevention purposes. You can request deletion of uploaded files or personal information through the contact path, subject to lawful retention requirements.',
  },
  {
    title: 'Cookies and analytics readiness',
    body: 'The website may use basic cookies, logs or privacy-conscious analytics to understand estimate starts, quote review requests, page performance and form issues. Production tracking services should be configured with appropriate consent and notice before activation.',
  },
  {
    title: 'Marketing opt-in',
    body: 'Marketing emails are optional. The marketing checkbox is separate from the collection notice and can be left unticked without stopping an estimate or quote review request.',
  },
  {
    title: 'Access and correction',
    body: 'You can ask to access or correct personal information held about you by contacting Operon Kitchens through the estimate form, quote-review form or contact pathway on this website.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="contentPage articleBody">
      <Head>
        <title>Privacy Policy | Operon Kitchens</title>
        <meta
          name="description"
          content="How Operon Kitchens collects and uses information for kitchen estimates, uploaded quotes, photos, plans, review requests and optional marketing consent."
        />
      </Head>
      <p className="eyebrow">Privacy</p>
      <h1 className="contentTitle">Operon Kitchens privacy policy</h1>
      <p>
        This policy explains how Operon Kitchens collects and uses information submitted through the kitchen estimate, quote review, planning and contact pathways.
      </p>
      <p className="muted">Last updated: 28 May 2026.</p>

      {privacySections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section>
        <h2>Contact path</h2>
        <p>
          For privacy questions, access requests or correction requests, contact Operon Kitchens through the estimate or quote-review form and include enough detail for the request to be identified.
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
