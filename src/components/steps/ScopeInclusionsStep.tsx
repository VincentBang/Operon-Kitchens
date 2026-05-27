import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const accessories: { key: QuoteInput['selectedAccessories'][number]; label: string }[] = [
  { key: 'pullOutBin', label: 'Pull-out bin' },
  { key: 'cutleryTray', label: 'Cutlery tray' },
  { key: 'spicePullOut', label: 'Spice pull-out' },
  { key: 'carousel', label: 'Corner carousel' },
  { key: 'pullOutPantry', label: 'Pull-out pantry' },
  { key: 'applianceGarage', label: 'Appliance garage' },
  { key: 'openShelves', label: 'Open shelves' },
];

export default function ScopeInclusionsStep({ data, onChange, onNext, onBack }: Props) {
  const toggleAccessory = (key: QuoteInput['selectedAccessories'][number]) => {
    onChange({
      ...data,
      selectedAccessories: data.selectedAccessories.includes(key)
        ? data.selectedAccessories.filter((item) => item !== key)
        : [...data.selectedAccessories, key],
    });
  };
  const toggleAppliance = (key: keyof QuoteInput['appliances']) => {
    onChange({ ...data, appliances: { ...data.appliances, [key]: !data.appliances[key] } });
  };

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Scope inclusions</h2>
        <p>Choose the main inclusions for review. Optional items can stay approximate.</p>
      </div>
      <h3 className="compactHeading">Accessories</h3>
      <div className="choiceGrid compact">
        {accessories.map((item) => (
          <label key={item.key} className="checkCard">
            <input type="checkbox" checked={data.selectedAccessories.includes(item.key)} onChange={() => toggleAccessory(item.key)} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
      <h3 className="compactHeading">Appliances and flooring</h3>
      <div className="choiceGrid compact">
        {Object.keys(data.appliances).map((key) => (
          <label key={key} className="checkCard">
            <input type="checkbox" checked={data.appliances[key as keyof QuoteInput['appliances']]} onChange={() => toggleAppliance(key as keyof QuoteInput['appliances'])} />
            <span className="capitalize">{key}</span>
          </label>
        ))}
        <label className="checkCard">
          <input type="checkbox" checked={data.flooring.included} onChange={(event) => onChange({ ...data, flooring: { ...data.flooring, included: event.target.checked } })} />
          <span>Include kitchen flooring allowance</span>
        </label>
      </div>
      <div className="formGrid two">
        <label className="field">
          <span>Appliance allowance</span>
          <select value={data.applianceAllowance} onChange={(event) => onChange({ ...data, applianceAllowance: event.target.value as QuoteInput['applianceAllowance'] })}>
            <option value="notSure">Not sure</option>
            <option value="excluded">Excluded / by owner</option>
            <option value="standardPc">Standard PC allowance</option>
            <option value="premiumPc">Premium PC allowance</option>
            <option value="exactModelsKnown">Exact models known</option>
          </select>
        </label>
      </div>
      <h3 className="compactHeading">Removal, make-good and clean-up</h3>
      <div className="choiceGrid compact">
        <label className="checkCard">
          <input type="checkbox" checked={data.highRiskItems} onChange={(event) => onChange({ ...data, highRiskItems: event.target.checked })} />
          <span><strong>Demolition/removal needs review</strong><small>Includes removal, protection or waste uncertainty.</small></span>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.trades.tiling} onChange={(event) => onChange({ ...data, trades: { ...data.trades, tiling: event.target.checked } })} />
          <span>Splashback tiling included</span>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.trades.painting} onChange={(event) => onChange({ ...data, trades: { ...data.trades, painting: event.target.checked } })} />
          <span>Painting/plaster patching included</span>
        </label>
      </div>
      {data.flooring.included && (
        <div className="formGrid two">
          <label className="field">
            <span>Flooring type</span>
            <select value={data.flooring.type} onChange={(event) => onChange({ ...data, flooring: { ...data.flooring, type: event.target.value as QuoteInput['flooring']['type'] } })}>
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
      )}
      <div className="wizardActions">
        <button className="button ghost" onClick={onBack}>Back</button>
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
