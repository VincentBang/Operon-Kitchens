import React from 'react';
import { QuoteInput } from '@/lib/pricing';

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
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Trades & installation</h2>
      <p>Select any trades you will require allowances for.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.keys(data.trades).map((trade) => (
          <label key={trade} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.trades[trade as keyof QuoteInput['trades']]}
              onChange={() => toggleTrade(trade as keyof QuoteInput['trades'])}
            />
            <span className="capitalize">{trade}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded"
          onClick={onBack}
        >
          Back
        </button>
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

export default TradesDetails;