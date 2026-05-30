import { QuoteInput } from '@/lib/pricing';
import { getMaterialCompliance, listMaterialOptions } from '@/lib/materialCompliance';
import HelpTooltip from '@/components/ui/HelpTooltip';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FinishesAllowancesStep({ data, onChange, onNext, onBack }: Props) {
  const benchtopCompliance = getMaterialCompliance('benchtop', data.benchtopType);
  const splashbackCompliance = getMaterialCompliance('splashback', data.splashbackType);
  const hasBannedSelection = benchtopCompliance.status === 'banned' || splashbackCompliance.status === 'banned';

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Finishes and allowance tiers</h2>
        <p>Select visible finish tiers and material directions. Exact products are confirmed during review.</p>
      </div>
      <div className="formGrid three">
        <label className="field">
          <span>Door finish <HelpTooltip label="Door finish help">A finish tier only. Final selection needs supplier confirmation.</HelpTooltip></span>
          <select value={data.doorFinish} onChange={(event) => onChange({ ...data, doorFinish: event.target.value as QuoteInput['doorFinish'] })}>
            <option value="melamine">Melamine</option>
            <option value="laminate">Laminate</option>
            <option value="thermo">Thermolaminated</option>
            <option value="polyurethane">Polyurethane</option>
            <option value="veneer">Timber veneer</option>
            <option value="shaker">Shaker/profiled</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="field">
          <span>Panel finish</span>
          <select value={data.panelFinish} onChange={(event) => onChange({ ...data, panelFinish: event.target.value as QuoteInput['panelFinish'] })}>
            <option value="melamine">Melamine</option>
            <option value="laminate">Laminate</option>
            <option value="thermo">Thermolaminated</option>
            <option value="polyurethane">Polyurethane</option>
            <option value="veneer">Timber veneer</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="field">
          <span>Hardware level</span>
          <select value={data.drawerRunnerLevel} onChange={(event) => onChange({ ...data, drawerRunnerLevel: event.target.value as QuoteInput['drawerRunnerLevel'] })}>
            <option value="standard">Standard soft-close</option>
            <option value="premium">Premium soft-close</option>
            <option value="heavyDuty">Heavy duty</option>
            <option value="tipOn">Push/tip-on</option>
          </select>
        </label>
        <label className="field">
          <span>Benchtop type</span>
          <select value={data.benchtopType} aria-invalid={benchtopCompliance.status === 'banned'} onChange={(event) => onChange({ ...data, benchtopType: event.target.value as QuoteInput['benchtopType'] })}>
            {listMaterialOptions('benchtop').map((option) => (
              <option key={option.key} value={option.key}>{option.label} - {option.silicaLabel}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Benchtop length (m)</span>
          <input type="number" min="0" step="0.1" value={data.benchtopMetres} onChange={(event) => onChange({ ...data, benchtopMetres: parseFloat(event.target.value) || 0 })} />
        </label>
        <label className="field">
          <span>Splashback type</span>
          <select value={data.splashbackType} aria-invalid={splashbackCompliance.status === 'banned'} onChange={(event) => onChange({ ...data, splashbackType: event.target.value as QuoteInput['splashbackType'] })}>
            {listMaterialOptions('splashback').map((option) => (
              <option key={option.key} value={option.key}>{option.label} - {option.silicaLabel}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Splashback area (sqm)</span>
          <input type="number" min="0" step="0.1" value={data.splashbackArea} onChange={(event) => onChange({ ...data, splashbackArea: parseFloat(event.target.value) || 0 })} />
        </label>
      </div>
      <div className="compliancePanel">
        <h3>Material compliance</h3>
        {[benchtopCompliance, splashbackCompliance].map((material) => (
          <div key={`${material.key}-${material.label}`} className={material.status === 'banned' ? 'warningNotice' : 'statusNotice'}>
            <strong>{material.label}</strong>
            <p>{material.message}</p>
            <p className="muted">Crystalline silica: {material.silicaLabel}</p>
            {material.alternatives.length > 0 && <p>Alternatives: {material.alternatives.join(', ')}.</p>}
          </div>
        ))}
        {hasBannedSelection && (
          <div className="warningNotice">
            <strong>Restricted material selected</strong>
            <p>Engineered stone containing more than 1% crystalline silica is restricted for ordinary new work. Select a supplier-confirmed alternative or mark the transition claim for manual review.</p>
            <label className="checkCard">
              <input type="checkbox" checked={data.engineeredStoneTransitionClaimed} onChange={(event) => onChange({ ...data, engineeredStoneTransitionClaimed: event.target.checked })} />
              <span>Transition provision may apply</span>
            </label>
          </div>
        )}
      </div>
      <div className="wizardActions">
        <button className="button ghost" onClick={onBack}>Back</button>
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
