import React from 'react';
import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Property and access</h2>
        <p>Level, lift, parking and access conditions affect confidence and review flags.</p>
      </div>
      <div className="formGrid two">
        <label className="field">
          <span>Property level</span>
          <select
            value={data.propertyLevel}
            onChange={(e) => onChange({ ...data, propertyLevel: e.target.value as QuoteInput['propertyLevel'] })}
          >
            <option value="ground">Ground</option>
            <option value="level1">Level 1</option>
            <option value="level2+">Level 2+</option>
            <option value="unsure">Unsure</option>
          </select>
        </label>
        <label className="field">
          <span>Lift available?</span>
          <select
            value={data.hasLift ? 'yes' : 'no'}
            onChange={(e) => onChange({ ...data, hasLift: e.target.value === 'yes' })}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="field">
          <span>Parking access</span>
          <select
            value={data.parkingAccess}
            onChange={(e) => onChange({ ...data, parkingAccess: e.target.value as QuoteInput['parkingAccess'] })}
          >
            <option value="good">Good</option>
            <option value="limited">Limited</option>
          </select>
        </label>
        <label className="checkCard">
          <input
            type="checkbox"
            checked={data.measurementsProvided}
            onChange={(e) => onChange({ ...data, measurementsProvided: e.target.checked })}
          />
          <span>I have measurements</span>
        </label>
        <label className="checkCard">
          <input
            type="checkbox"
            checked={data.photosProvided}
            onChange={(e) => onChange({ ...data, photosProvided: e.target.checked })}
          />
          <span>I have photos/floorplan</span>
        </label>
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

export default PropertyDetails;
