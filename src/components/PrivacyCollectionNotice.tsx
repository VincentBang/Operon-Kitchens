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
        We collect your name, email, phone number, {context === 'review' ? 'quote checklist details and any uploaded quote files' : 'kitchen scope details, photos or plans you provide'} to prepare and follow up your {contextLabel}. We may share relevant project details with trades, manufacturers, suppliers or service providers where needed to review scope, availability, compliance or site requirements.
      </p>
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
