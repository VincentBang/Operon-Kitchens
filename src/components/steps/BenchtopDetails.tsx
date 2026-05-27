import React from 'react';
import { QuoteInput } from '@/lib/pricing';
import { getMaterialCompliance, listMaterialOptions } from '@/lib/materialCompliance';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const BenchtopDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const benchtopCompliance = getMaterialCompliance('benchtop', data.benchtopType);
  const splashbackCompliance = getMaterialCompliance('splashback', data.splashbackType);
  const hasBannedSelection = benchtopCompliance.status === 'banned' || splashbackCompliance.status === 'banned';

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Benchtop and splashback</h2>
        <p>Material choices include crystalline silica labels and compliance prompts for professional review.</p>
      </div>
      <div className="formGrid two">
        <label className="field">
          <span>Benchtop type</span>
          <select
            value={data.benchtopType}
            onChange={(e) => onChange({ ...data, benchtopType: e.target.value as QuoteInput['benchtopType'] })}
            aria-invalid={benchtopCompliance.status === 'banned'}
          >
            {listMaterialOptions('benchtop').map((option) => (
              <option key={option.key} value={option.key}>
                {option.label} - {option.silicaLabel}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Benchtop length (m)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.benchtopMetres}
            onChange={(e) => onChange({ ...data, benchtopMetres: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="field">
          <span>Splashback type</span>
          <select
            value={data.splashbackType}
            onChange={(e) => onChange({ ...data, splashbackType: e.target.value as QuoteInput['splashbackType'] })}
            aria-invalid={splashbackCompliance.status === 'banned'}
          >
            {listMaterialOptions('splashback').map((option) => (
              <option key={option.key} value={option.key}>
                {option.label} - {option.silicaLabel}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Splashback area (sqm)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.splashbackArea}
            onChange={(e) => onChange({ ...data, splashbackArea: parseFloat(e.target.value) || 0 })}
          />
        </label>
      </div>

      <div className="compliancePanel">
        <h3 className="font-semibold mb-2">Material compliance check</h3>
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
            <strong>Engineered stone warning</strong>
            <p>
              New engineered-stone benchtops, panels or slabs containing more than 1% crystalline silica are not available for ordinary new selection. If this is an old contracted job, confirm the transition dates below and allow manual review.
            </p>
            <label className="checkCard">
              <input
                type="checkbox"
                checked={data.engineeredStoneTransitionClaimed}
                onChange={(event) => onChange({ ...data, engineeredStoneTransitionClaimed: event.target.checked })}
              />
              <span>Transition provision may apply</span>
            </label>
            <label className="checkCard">
              <input
                type="checkbox"
                checked={data.engineeredStoneContractBefore2023End}
                onChange={(event) => onChange({ ...data, engineeredStoneContractBefore2023End: event.target.checked })}
              />
              <span>Contract was entered into on or before 31 Dec 2023</span>
            </label>
            <label className="checkCard">
              <input
                type="checkbox"
                checked={data.engineeredStoneInstallBefore2024End}
                onChange={(event) => onChange({ ...data, engineeredStoneInstallBefore2024End: event.target.checked })}
              />
              <span>Installation/work is before 31 Dec 2024</span>
            </label>
          </div>
        )}
      </div>

      <p className="muted">Material availability and compliance are subject to supplier documentation and professional review.</p>
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

export default BenchtopDetails;
