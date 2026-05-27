import Link from 'next/link';

interface Project {
  id: number;
  style: string;
  suburb: string;
  scope: string;
  finish: string;
  benchtop: string;
  hardware: string;
  timeframe: string;
  challenge: string;
}

const projects: Project[] = [
  {
    id: 1,
    style: 'Modern coastal',
    suburb: 'Bondi',
    scope: 'Full kitchen replacement',
    finish: 'Polyurethane shaker',
    benchtop: 'Engineered stone alternative',
    hardware: 'Premium soft-close',
    timeframe: '6 weeks',
    challenge: 'Working within tight strata regulations',
  },
  {
    id: 2,
    style: 'Contemporary',
    suburb: 'Chatswood',
    scope: 'Cabinetry & benchtop',
    finish: 'Melamine flat panel',
    benchtop: 'Laminate',
    hardware: 'Standard soft-close',
    timeframe: '4 weeks',
    challenge: 'Integrating existing appliances',
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Recent projects</h1>
      <p className="mb-6">Each project is tailored to the client’s needs, finishes and budget.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="border p-4 rounded shadow-sm space-y-2">
            <h3 className="font-semibold text-lg">{proj.style} - {proj.suburb}</h3>
            <p><strong>Scope:</strong> {proj.scope}</p>
            <p><strong>Finish:</strong> {proj.finish}</p>
            <p><strong>Benchtop:</strong> {proj.benchtop}</p>
            <p><strong>Hardware:</strong> {proj.hardware}</p>
            <p><strong>Timeframe:</strong> {proj.timeframe}</p>
            <p><strong>Challenge:</strong> {proj.challenge}</p>
            <Link href="/quote" className="textLink">Quote a similar project</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
