import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="contentPage articleBody">
      <p className="eyebrow">Privacy</p>
      <h1 className="contentTitle">Operon Kitchens privacy policy</h1>
      <p>
        This policy explains how Operon Kitchens collects and uses information submitted through the kitchen estimate and quote-review tools. It is a working policy for the prototype and should be reviewed before production launch.
      </p>
      <section>
        <h2>Information we collect</h2>
        <p>We may collect your name, email, phone number, property and project details, kitchen measurements, selected materials, quote checklist answers, photos, plans and uploaded quote files.</p>
      </section>
      <section>
        <h2>Why we collect it</h2>
        <p>We use this information to prepare budget estimates, review existing quotes, clarify scope, coordinate follow-up, screen compliance items and arrange professional review where needed.</p>
      </section>
      <section>
        <h2>Who we may share it with</h2>
        <p>We may share relevant project information with trades, manufacturers, suppliers, consultants or service providers where needed to review scope, product availability, compliance, logistics or site requirements.</p>
      </section>
      <section>
        <h2>Marketing</h2>
        <p>Marketing emails are optional. The marketing checkbox is separate from your estimate or review request and can be left unticked.</p>
      </section>
      <section>
        <h2>Access and correction</h2>
        <p>You can ask to access or correct personal information held about you by contacting Operon Kitchens. Production contact details should be added before launch.</p>
      </section>
      <Link href="/quote" className="textLink">Return to quote wizard</Link>
    </main>
  );
}
