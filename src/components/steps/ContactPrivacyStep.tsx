import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';

export interface WizardContact {
  name: string;
  email: string;
  phone: string;
  preferredContactMethod?: 'phone' | 'email' | 'either';
  addressOptional?: string;
  marketingOptIn: boolean;
  privacyAcknowledged: boolean;
}

interface Props {
  contact: WizardContact;
  onChange: (contact: WizardContact) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContactPrivacyStep({ contact, onChange, onNext, onBack }: Props) {
  const ready = Boolean(contact.name.trim() && contact.email.trim() && contact.phone.trim() && contact.privacyAcknowledged);
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Contact details and privacy notice</h2>
        <p>We need contact details before saving the estimate for professional follow-up.</p>
      </div>
      <div className="quoteResult">
        <div className="formGrid">
          <label className="field">
            <span>Name</span>
            <input type="text" value={contact.name} required aria-invalid={!contact.name.trim()} onChange={(event) => onChange({ ...contact, name: event.target.value })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={contact.email} required aria-invalid={!contact.email.trim()} onChange={(event) => onChange({ ...contact, email: event.target.value })} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input type="tel" value={contact.phone} required aria-invalid={!contact.phone.trim()} onChange={(event) => onChange({ ...contact, phone: event.target.value })} />
          </label>
        </div>
        <div className="formGrid two">
          <label className="field">
            <span>Preferred contact method</span>
            <select value={contact.preferredContactMethod ?? 'either'} onChange={(event) => onChange({ ...contact, preferredContactMethod: event.target.value as WizardContact['preferredContactMethod'] })}>
              <option value="either">Either</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
          </label>
          <label className="field">
            <span>Suburb/address optional</span>
            <input type="text" value={contact.addressOptional ?? ''} onChange={(event) => onChange({ ...contact, addressOptional: event.target.value })} />
          </label>
        </div>
        <PrivacyCollectionNotice
          acknowledged={contact.privacyAcknowledged}
          marketingOptIn={contact.marketingOptIn}
          onAcknowledgedChange={(privacyAcknowledged) => onChange({ ...contact, privacyAcknowledged })}
          onMarketingChange={(marketingOptIn) => onChange({ ...contact, marketingOptIn })}
        />
      </div>
      <div className="wizardActions">
        <button className="button ghost" onClick={onBack}>Back</button>
        <button className="button primary" onClick={onNext} disabled={!ready}>Next</button>
      </div>
    </div>
  );
}
