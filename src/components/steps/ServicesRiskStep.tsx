import { QuoteInput } from '@/lib/pricing';
import HelpTooltip from '@/components/ui/HelpTooltip';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ServicesRiskStep({ data, onChange, onNext, onBack }: Props) {
  const toggleTrade = (trade: keyof QuoteInput['trades']) => {
    onChange({ ...data, trades: { ...data.trades, [trade]: !data.trades[trade] } });
  };
  const depositPercentInvalid = data.depositOfferedPercent > 10;

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Services and risk flags</h2>
        <p>Flag items that need licensed trades, approvals or manual review before final pricing.</p>
      </div>
      <div className="choiceGrid compact">
        {Object.keys(data.trades).map((trade) => (
          <label key={trade} className="checkCard">
            <input type="checkbox" checked={data.trades[trade as keyof QuoteInput['trades']]} onChange={() => toggleTrade(trade as keyof QuoteInput['trades'])} />
            <span className="capitalize">{trade}</span>
          </label>
        ))}
      </div>
      <details className="advancedPanel" open>
        <summary>Approvals and property risks</summary>
        <div className="choiceGrid compact">
          <label className="checkCard"><input type="checkbox" checked={data.strataApprovalRequired} onChange={(event) => onChange({ ...data, strataApprovalRequired: event.target.checked })} /><span>Strata approval likely</span></label>
          <label className="checkCard"><input type="checkbox" checked={data.basixReviewRequired} onChange={(event) => onChange({ ...data, basixReviewRequired: event.target.checked })} /><span>BASIX review risk</span></label>
          <label className="checkCard"><input type="checkbox" checked={data.dbpReviewRequired} onChange={(event) => onChange({ ...data, dbpReviewRequired: event.target.checked })} /><span>DBP/class 2 screen</span></label>
          <label className="checkCard"><input type="checkbox" checked={data.asbestosRisk} onChange={(event) => onChange({ ...data, asbestosRisk: event.target.checked })} /><span>Older property/asbestos</span></label>
          <label className="checkCard"><input type="checkbox" checked={data.structuralWorks.wallRemoval} onChange={(event) => onChange({ ...data, structuralWorks: { ...data.structuralWorks, wallRemoval: event.target.checked } })} /><span>Wall removal</span></label>
          <label className="checkCard"><input type="checkbox" checked={data.structuralWorks.beamRequired} onChange={(event) => onChange({ ...data, structuralWorks: { ...data.structuralWorks, beamRequired: event.target.checked } })} /><span>Beam/engineering likely</span></label>
        </div>
      </details>
      <div className="quoteResult">
        <h3>Deposit and HBC screening</h3>
        <p className="muted">These are review prompts only. Contract terms and insurance are confirmed before money is taken or work starts.</p>
        <div className="formGrid two">
          <label className="field">
            <span>Proposed deposit amount ($)</span>
            <input type="number" min="0" value={data.depositOfferedAmount} onChange={(event) => onChange({ ...data, depositOfferedAmount: parseFloat(event.target.value) || 0 })} />
          </label>
          <label className="field">
            <span>Proposed deposit percent (%) <HelpTooltip label="Deposit cap help">NSW residential home building contracts generally cap deposits at 10%.</HelpTooltip></span>
            <input type="number" min="0" max="100" value={data.depositOfferedPercent} aria-invalid={depositPercentInvalid} onChange={(event) => onChange({ ...data, depositOfferedPercent: parseFloat(event.target.value) || 0 })} />
            {depositPercentInvalid && <small className="fieldError">Deposit percentage is above the 10% guidance cap.</small>}
          </label>
          <label className="checkCard"><input type="checkbox" checked={data.hbcInsuranceIncluded} onChange={(event) => onChange({ ...data, hbcInsuranceIncluded: event.target.checked })} /><span>HBC insurance included if required</span></label>
          <label className="checkCard"><input type="checkbox" checked={data.hbcCertificateConfirmed} onChange={(event) => onChange({ ...data, hbcCertificateConfirmed: event.target.checked })} /><span>HBC certificate confirmed/provided</span></label>
        </div>
      </div>
      <div className="wizardActions">
        <button className="button ghost" onClick={onBack}>Back</button>
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
