import { useState } from 'react';
import Link from 'next/link';

const quoteFields = [
  'Cabinet material',
  'Door finish',
  'Hardware brand/level',
  'Benchtop material',
  'Splashback',
  'Demolition',
  'Disposal',
  'Plumbing',
  'Electrical',
  'Appliances',
  'Installation',
  'Site access',
  'GST status',
  'Warranty',
  'Exclusions',
  'Payment stages',
  'Quote expiry',
  'PC sums/provisional sums',
  'Stone/benchtop compliance',
  'Licence and insurance'
];

export default function QuoteReview() {
  const [mode, setMode] = useState<'choose' | 'nofile' | 'file'>('choose');
  const [checked, setChecked] = useState<{ [field: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [lookup, setLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [storedQuotes, setStoredQuotes] = useState<any[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const handleToggle = (field: string) => {
    setChecked((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleSubmit = () => {
    setSubmitted(true);
  };
  const handleLookup = async () => {
    setLookupError('');
    setStoredQuotes([]);
    setIsLookingUp(true);
    try {
      const trimmed = lookup.trim();
      const query = trimmed.includes('@') ? `email=${encodeURIComponent(trimmed)}` : `id=${encodeURIComponent(trimmed)}`;
      const response = await fetch(`/api/quotes?${query}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not find stored quote.');

      setStoredQuotes(payload.quote ? [payload.quote] : payload.quotes ?? []);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Could not find stored quote.');
    } finally {
      setIsLookingUp(false);
    }
  };

  if (mode === 'choose') {
    return (
      <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold mb-4">Review your kitchen quote</h1>
        <p className="mb-2">Choose how you would like to review your existing quote:</p>
        <div className="space-x-4">
          <button
            onClick={() => setMode('file')}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Upload quote file
          </button>
          <button
            onClick={() => setMode('nofile')}
            className="border border-blue-600 text-blue-600 py-2 px-4 rounded"
          >
            No file – checklist
          </button>
        </div>
        <section className="quoteResult mt-8">
          <h2 className="text-xl font-semibold">Find a saved Operon estimate</h2>
          <p className="text-gray-600 mt-1">Enter a quote ID or lead email to return to a saved quote.</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <input
              type="text"
              value={lookup}
              onChange={(event) => setLookup(event.target.value)}
              placeholder="Quote ID or email"
              className="p-2 border rounded flex-1"
            />
            <button
              onClick={handleLookup}
              disabled={!lookup.trim() || isLookingUp}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              {isLookingUp ? 'Searching...' : 'Find quote'}
            </button>
          </div>
          {lookupError && <div className="p-3 mt-3 bg-red-50 border border-red-200 rounded text-red-700">{lookupError}</div>}
          {storedQuotes.length > 0 && (
            <div className="mt-4 space-y-3">
              {storedQuotes.map((quote) => (
                <article key={quote.id} className="border rounded p-3 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-semibold">Quote {quote.id}</p>
                      <p className="text-sm text-gray-600">
                        ${quote.totals.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {quote.totals.confidenceLevel} confidence
                      </p>
                    </div>
                    <Link href={`/quote/${quote.id}`} className="textLink">View or edit</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <p className="mt-8 text-sm text-gray-600">Not sure about your quote? You can also start a new estimate here: <Link href="/quote" className="textLink">Start estimate</Link></p>
      </main>
    );
  }
  if (mode === 'file') {
    return (
      <main className="min-h-screen p-4 max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold mb-4">Upload your quote</h1>
        <p>For privacy reasons we do not expose uploaded files publicly. Please upload a PDF or image of your existing kitchen quote for review.</p>
        <input type="file" accept=".pdf,image/*" className="mt-2" />
        <p className="text-sm text-gray-500 mt-2">Note: File uploads are stored securely and used solely for quote preparation.</p>
        <button
          onClick={() => setMode('choose')}
          className="text-blue-600 underline mt-4"
        >
          Back to options
        </button>
      </main>
    );
  }
  // No-file checklist mode
  const total = quoteFields.length;
  const completed = quoteFields.filter((field) => checked[field]).length;
  const completeness = Math.round((completed / total) * 100);
  const missing = quoteFields.filter((field) => !checked[field]);
  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-4">Quote completeness checklist</h1>
      {submitted ? (
        <div className="p-4 bg-green-100 border rounded">
          <p>Your quote completeness score is {completeness}%. Here are items that appear to be missing:</p>
          <ul className="list-disc list-inside">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="mt-4">Questions to ask: ensure pricing covers all selected items, confirm compliance with engineered stone restrictions, check allowance for trades and site access.</p>
          <p className="mt-2">To get a comparison estimate, <Link href="/quote" className="textLink">start a new estimate</Link>.</p>
        </div>
      ) : (
        <>
          <p>Tick the items that your current quote clearly includes:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quoteFields.map((field) => (
              <label key={field} className="flex items-center space-x-2 border p-2 rounded">
                <input
                  type="checkbox"
                  checked={checked[field] || false}
                  onChange={() => handleToggle(field)}
                />
                <span>{field}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setMode('choose')}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Evaluate
            </button>
          </div>
        </>
      )}
    </main>
  );
}
