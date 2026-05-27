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
          <span>Property type</span>
          <select value={data.propertyType} onChange={(event) => onChange({ ...data, propertyType: event.target.value as QuoteInput['propertyType'] })}>
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
            <option value="strataApartment">Apartment / strata</option>
          </select>
        </label>
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
        <label className="field">
          <span>Property age if known</span>
          <select value={data.propertyAgeBand} onChange={(event) => onChange({ ...data, propertyAgeBand: event.target.value as QuoteInput['propertyAgeBand'] })}>
            <option value="unknown">Not sure</option>
            <option value="pre1980">Pre-1980</option>
            <option value="1980To2000">1980-2000</option>
            <option value="post2000">After 2000</option>
          </select>
        </label>
        <label className="checkCard">
          <input
            type="checkbox"
            checked={data.strataApprovalRequired}
            onChange={(e) => onChange({ ...data, strataApprovalRequired: e.target.checked })}
          />
          <span>Strata/body corporate involved</span>
        </label>
        <label className="checkCard">
          <input
            type="checkbox"
            checked={data.heritageOrOlderHomeUncertainty}
            onChange={(e) => onChange({ ...data, heritageOrOlderHomeUncertainty: e.target.checked })}
          />
          <span>Heritage or older-home uncertainty</span>
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
