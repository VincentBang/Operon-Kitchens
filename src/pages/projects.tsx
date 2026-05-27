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
    <main>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Project patterns</p>
          <h1 className="contentTitle">Recent projects</h1>
        </div>
        <p className="muted">Each project is tailored to the client’s needs, finishes, approvals and budget range.</p>
      </section>
      <section className="contentPage">
      <div className="detailGrid two">
        {projects.map((proj) => (
          <article key={proj.id} className="infoCard projectCard">
            <span className="featureIcon" aria-hidden="true">P{proj.id}</span>
            <h3>{proj.style} - {proj.suburb}</h3>
            <p><strong>Scope:</strong> {proj.scope}</p>
            <p><strong>Finish:</strong> {proj.finish}</p>
            <p><strong>Benchtop:</strong> {proj.benchtop}</p>
            <p><strong>Hardware:</strong> {proj.hardware}</p>
            <p><strong>Timeframe:</strong> {proj.timeframe}</p>
            <p><strong>Challenge:</strong> {proj.challenge}</p>
            <Link href="/quote" className="textLink">Quote a similar project</Link>
          </article>
        ))}
      </div>
      </section>
    </main>
  );
}
