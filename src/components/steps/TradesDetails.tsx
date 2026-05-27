import React from 'react';
import { QuoteInput } from '@/lib/pricing';
import HelpTooltip from '@/components/ui/HelpTooltip';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const TradesDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const toggleTrade = (trade: keyof QuoteInput['trades']) => {
    onChange({ ...data, trades: { ...data.trades, [trade]: !data.trades[trade] } });
  };
  const toggleAppliance = (appliance: keyof QuoteInput['appliances']) => {
    onChange({ ...data, appliances: { ...data.appliances, [appliance]: !data.appliances[appliance] } });
  };
  const depositPercentInvalid = data.depositOfferedPercent > 10;
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Trades and installation</h2>
        <p>Select the allowances that need review. Plumbing, gas and electrical work must be handled by appropriately licensed trades.</p>
      </div>
      <div className="choiceGrid compact">
        {Object.keys(data.trades).map((trade) => (
          <label key={trade} className="checkCard">
            <input
              type="checkbox"
              checked={data.trades[trade as keyof QuoteInput['trades']]}
              onChange={() => toggleTrade(trade as keyof QuoteInput['trades'])}
            />
            <span className="capitalize">{trade}</span>
          </label>
        ))}
      </div>
      <details className="advancedPanel" open>
        <summary>Appliances, lighting and flooring</summary>
        <div className="choiceGrid compact">
          {Object.keys(data.appliances).map((appliance) => (
            <label key={appliance} className="checkCard">
              <input
                type="checkbox"
                checked={data.appliances[appliance as keyof QuoteInput['appliances']]}
                onChange={() => toggleAppliance(appliance as keyof QuoteInput['appliances'])}
              />
              <span className="capitalize">{appliance}</span>
            </label>
          ))}
        </div>
        <div className="formGrid three">
          <label className="field">
            <span>LED strip lighting (m)</span>
            <input type="number" min="0" step="0.1" value={data.lighting.ledStripsMetres} onChange={(event) => onChange({ ...data, lighting: { ...data.lighting, ledStripsMetres: parseFloat(event.target.value) || 0 } })} />
          </label>
          <label className="field">
            <span>Downlights (qty)</span>
            <input type="number" min="0" value={data.lighting.downlightQty} onChange={(event) => onChange({ ...data, lighting: { ...data.lighting, downlightQty: parseInt(event.target.value) || 0 } })} />
          </label>
          <label className="field">
            <span>Pendants (qty)</span>
            <input type="number" min="0" value={data.lighting.pendantQty} onChange={(event) => onChange({ ...data, lighting: { ...data.lighting, pendantQty: parseInt(event.target.value) || 0 } })} />
          </label>
        </div>
        <div className="formGrid three">
          <label className="checkCard">
            <input type="checkbox" checked={data.flooring.included} onChange={(event) => onChange({ ...data, flooring: { ...data.flooring, included: event.target.checked } })} />
            <span>Include kitchen flooring allowance</span>
          </label>
          <label className="field">
            <span>Flooring type</span>
            <select value={data.flooring.type} onChange={(event) => onChange({ ...data, flooring: { ...data.flooring, type: event.target.value as QuoteInput['flooring']['type'] } })}>
              <option value="none">None</option>
              <option value="vinyl">Vinyl</option>
              <option value="hybrid">Hybrid</option>
              <option value="engineeredTimber">Engineered timber</option>
              <option value="tile">Tile</option>
            </select>
          </label>
          <label className="field">
            <span>Floor area (sqm)</span>
            <input type="number" min="0" step="0.1" value={data.flooring.areaSqm} onChange={(event) => onChange({ ...data, flooring: { ...data.flooring, areaSqm: parseFloat(event.target.value) || 0 } })} />
          </label>
        </div>
      </details>
      <div className="quoteResult">
        <h3>Deposit and HBC screening</h3>
        <p className="muted">
          These details help flag NSW contract review items. Final contract terms and insurance should be confirmed before money is taken or work starts.
        </p>
        <div className="formGrid two">
          <label className="field">
            <span>Proposed deposit amount ($)</span>
            <input
              type="number"
              min="0"
              value={data.depositOfferedAmount}
              onChange={(e) => onChange({ ...data, depositOfferedAmount: parseFloat(e.target.value) || 0 })}
            />
          </label>
          <label className="field">
            <span>Proposed deposit percent (%) <HelpTooltip label="Deposit cap help">NSW residential home building contracts generally cap deposits at 10%. This tool flags review, not legal advice.</HelpTooltip></span>
            <input
              type="number"
              min="0"
              max="100"
              value={data.depositOfferedPercent}
              onChange={(e) => onChange({ ...data, depositOfferedPercent: parseFloat(e.target.value) || 0 })}
              aria-invalid={depositPercentInvalid}
            />
            {depositPercentInvalid && <small className="fieldError">Deposit percentage is above the 10% guidance cap.</small>}
          </label>
          <label className="checkCard">
            <input
              type="checkbox"
              checked={data.hbcInsuranceIncluded}
              onChange={(e) => onChange({ ...data, hbcInsuranceIncluded: e.target.checked })}
            />
            <span>HBC insurance is included if required</span>
          </label>
          <label className="checkCard">
            <input
              type="checkbox"
              checked={data.hbcCertificateConfirmed}
              onChange={(e) => onChange({ ...data, hbcCertificateConfirmed: e.target.checked })}
            />
            <span>HBC certificate has been confirmed/provided</span>
          </label>
        </div>
      </div>
      <div className="wizardActions">
        <button
          className="button ghost"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="button primary"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TradesDetails;
