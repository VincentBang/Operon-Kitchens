import { glossary } from '@/data/glossary';

export default function GlossaryPage() {
  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Kitchen glossary</h1>
      <p className="mb-6">Understand common kitchen and cabinetry terminology to help you navigate your renovation with confidence.</p>
      <div className="divide-y divide-gray-200">
        {glossary.map(({ term, definition }) => (
          <div key={term} className="py-4">
            <h3 className="font-semibold">{term}</h3>
            <p>{definition}</p>
          </div>
        ))}
      </div>
    </main>
  );
}