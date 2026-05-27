import React from 'react';
import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
}

const PropertyDetails: React.FC<Props> = ({ data, onChange, onNext }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Property details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span>Property level</span>
          <select
            value={data.propertyLevel}
            onChange={(e) => onChange({ ...data, propertyLevel: e.target.value as QuoteInput['propertyLevel'] })}
            className="p-2 border rounded"
          >
            <option value="ground">Ground</option>
            <option value="level1">Level 1</option>
            <option value="level2+">Level 2+</option>
            <option value="unsure">Unsure</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span>Lift available?</span>
          <select
            value={data.hasLift ? 'yes' : 'no'}
            onChange={(e) => onChange({ ...data, hasLift: e.target.value === 'yes' })}
            className="p-2 border rounded"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span>Parking access</span>
          <select
            value={data.parkingAccess}
            onChange={(e) => onChange({ ...data, parkingAccess: e.target.value as QuoteInput['parkingAccess'] })}
            className="p-2 border rounded"
          >
            <option value="good">Good</option>
            <option value="limited">Limited</option>
          </select>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.measurementsProvided}
            onChange={(e) => onChange({ ...data, measurementsProvided: e.target.checked })}
          />
          <span>I have measurements</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.photosProvided}
            onChange={(e) => onChange({ ...data, photosProvided: e.target.checked })}
          />
          <span>I have photos/floorplan</span>
        </label>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;