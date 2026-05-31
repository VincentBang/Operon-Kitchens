import Link from 'next/link';

interface Props {
  acknowledged: boolean;
  marketingOptIn: boolean;
  onAcknowledgedChange: (checked: boolean) => void;
  onMarketingChange: (checked: boolean) => void;
  context?: 'quote' | 'review';
}

export default function PrivacyCollectionNotice({
  acknowledged,
  marketingOptIn,
  onAcknowledgedChange,
  onMarketingChange,
  context = 'quote',
}: Props) {
  const contextLabel = context === 'review' ? 'quote review request' : 'estimate request';
  return (
    <section className="privacyNotice" aria-label="Privacy collection notice">
      <h4>Privacy collection notice</h4>
      <p>
        Operon Kitchens collects your contact, project and {context === 'review' ? 'quote checklist and uploaded file' : 'estimate answer and uploaded file'} information to prepare planning estimates, review quotes, flag scope/risk items and coordinate follow-up. We may share relevant details with trades, suppliers, consultants or service providers where needed.
      </p>
      <p>Only upload files you are authorised to share. Uploaded quotes, plans and photos may contain personal or property information.</p>
      <p>
        Read the full <Link href="/privacy" className="textLink">Operon Kitchens privacy policy</Link>.
      </p>
      <label className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => onAcknowledgedChange(event.target.checked)}
        />
        <span>I acknowledge this collection notice.</span>
      </label>
      <label className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(event) => onMarketingChange(event.target.checked)}
        />
        <span>Send me optional planning tips, product updates and newsletters.</span>
      </label>
    </section>
  );
}
