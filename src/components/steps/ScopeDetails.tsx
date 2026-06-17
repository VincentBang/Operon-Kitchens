import React from 'react';
import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const ScopeDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Scope and layout</h2>
        <p>These choices flag when the estimate needs a closer review before it can become a fixed written quote.</p>
      </div>
      <div className="formGrid two">
        <label className="field">
          <span>Property type</span>
          <select
            value={data.propertyType}
            onChange={(e) => onChange({ ...data, propertyType: e.target.value as QuoteInput['propertyType'] })}
          >
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
            <option value="strataApartment">Strata apartment</option>
          </select>
        </label>
        <label className="checkCard">
          <input
            type="checkbox"
            checked={data.strataApprovalRequired}
            onChange={(e) => onChange({ ...data, strataApprovalRequired: e.target.checked })}
          />
          <span>Strata review likely required</span>
        </label>
      </div>
      <div className="choiceGrid">
        <label className="checkCard tall">
          <input
            type="checkbox"
            checked={data.layoutChange}
            onChange={(e) => onChange({ ...data, layoutChange: e.target.checked })}
          />
          <span><strong>I want to change the layout</strong><small>Cabinet positions, appliance zones or workflow will move.</small></span>
        </label>
        <label className="checkCard tall">
          <input
            type="checkbox"
            checked={data.highRiskItems}
            onChange={(e) => onChange({ ...data, highRiskItems: e.target.checked })}
          />
          <span><strong>Structural or service relocation</strong><small>Wall changes, gas, plumbing or electrical relocation need licensed review.</small></span>
        </label>
      </div>
      <details className="advancedPanel">
        <summary>Approvals, access and older-property risks</summary>
        <div className="choiceGrid compact">
          <label className="checkCard">
            <input type="checkbox" checked={data.basixReviewRequired} onChange={(e) => onChange({ ...data, basixReviewRequired: e.target.checked })} />
            <span>BASIX review may apply</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.dbpReviewRequired} onChange={(e) => onChange({ ...data, dbpReviewRequired: e.target.checked })} />
            <span>DBP/class 2 review may apply</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.asbestosRisk} onChange={(e) => onChange({ ...data, asbestosRisk: e.target.checked })} />
            <span>Older-property/asbestos risk</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.accessConstraints.narrowAccess} onChange={(e) => onChange({ ...data, accessConstraints: { ...data.accessConstraints, narrowAccess: e.target.checked } })} />
            <span>Narrow access</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.accessConstraints.longCarry} onChange={(e) => onChange({ ...data, accessConstraints: { ...data.accessConstraints, longCarry: e.target.checked } })} />
            <span>Long material carry</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.accessConstraints.occupiedHome} onChange={(e) => onChange({ ...data, accessConstraints: { ...data.accessConstraints, occupiedHome: e.target.checked } })} />
            <span>Occupied home staging required</span>
          </label>
        </div>
      </details>
      <details className="advancedPanel">
        <summary>Structural works</summary>
        <div className="choiceGrid compact">
          <label className="checkCard">
            <input type="checkbox" checked={data.structuralWorks.wallRemoval} onChange={(e) => onChange({ ...data, structuralWorks: { ...data.structuralWorks, wallRemoval: e.target.checked } })} />
            <span>Wall removal</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.structuralWorks.beamRequired} onChange={(e) => onChange({ ...data, structuralWorks: { ...data.structuralWorks, beamRequired: e.target.checked } })} />
            <span>Beam or engineering likely</span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.structuralWorks.windowDoorChanges} onChange={(e) => onChange({ ...data, structuralWorks: { ...data.structuralWorks, windowDoorChanges: e.target.checked } })} />
            <span>Window/door changes</span>
          </label>
        </div>
      </details>
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

export default ScopeDetails;
