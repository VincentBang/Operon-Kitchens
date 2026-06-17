import Head from 'next/head';
import Link from 'next/link';

interface ProjectProfile {
  id: number;
  title: string;
  suburbType: string;
  problem: string;
  scope: string;
  finish: string;
  benchtop: string;
  timeframe: string;
  costDrivers: string[];
  result: string;
  imageClass: string;
}

const projectProfiles: ProjectProfile[] = [
  {
    id: 1,
    title: 'Apartment kitchen with strata access',
    suburbType: 'Eastern suburbs apartment',
    problem: 'The customer needed to compare a quote where access, waste removal and strata conditions were not clearly separated.',
    scope: 'Cabinetry replacement, benchtop, splashback, appliance allowance and licensed trade coordination.',
    finish: 'Painted/profiled door direction with premium soft-close hardware.',
    benchtop: 'Porcelain or supplier-confirmed surface.',
    timeframe: 'Typical planning window: 6-8 weeks subject to approvals and selections.',
    costDrivers: ['Lift and parking access', 'Strata approval or notification review pathway', 'Benchtop material confirmation', 'Electrical and plumbing review'],
    result: 'The estimate would flag strata, service and allowance items before site measure.',
    imageClass: 'apartment',
  },
  {
    id: 2,
    title: 'Family home cabinetry and benchtop refresh',
    suburbType: 'North Shore house',
    problem: 'The main risk was comparing a refresh scope against a full renovation quote without clear exclusions.',
    scope: 'Cabinetry fronts, selected storage accessories, benchtop replacement, sink/tap allowance and minor make-good.',
    finish: 'Laminate or polyurethane direction depending on budget band.',
    benchtop: 'Laminate, timber or porcelain/sintered surface direction.',
    timeframe: 'Typical planning window: 4-6 weeks after selections and measure.',
    costDrivers: ['Door finish tier', 'Hardware and accessory selection', 'Existing service locations', 'Painting/patching allowance'],
    result: 'The estimate would separate refresh scope from items better handled by trades or separate quotes.',
    imageClass: 'refresh',
  },
];

export default function ProjectsPage() {
  return (
    <main>
      <Head>
        <title>Typical kitchen project profiles | Operon Kitchens</title>
        <meta
          name="description"
          content="Example kitchen project profiles showing scope, finish direction, quote risks, budget drivers and planning pathways for Sydney renovations."
        />
      </Head>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Project examples</p>
          <h1 className="contentTitle">Typical kitchen project profiles</h1>
        </div>
        <p className="muted">
          These are example profiles for planning and quote education. They are not presented as completed Operon Kitchens jobs.
        </p>
      </section>
      <section className="contentPage">
        <div className="detailGrid two">
          {projectProfiles.map((profile) => (
            <article key={profile.id} className="infoCard projectCard">
              <div className={`projectVisual ${profile.imageClass}`} role="img" aria-label={`${profile.title} planning example visual`}>
                <span>Planning example</span>
              </div>
              <span className="featureIcon" aria-hidden="true">E{profile.id}</span>
              <h2>{profile.title}</h2>
              <p><strong>Profile:</strong> {profile.suburbType}</p>
              <p><strong>Problem:</strong> {profile.problem}</p>
              <p><strong>Scope:</strong> {profile.scope}</p>
              <p><strong>Finish:</strong> {profile.finish}</p>
              <p><strong>Benchtop:</strong> {profile.benchtop}</p>
              <p><strong>Timeframe:</strong> {profile.timeframe}</p>
              <details className="advancedPanel">
                <summary>What affected the budget range</summary>
                <div className="tagList">{profile.costDrivers.map((item) => <span key={item}>{item}</span>)}</div>
              </details>
              <p><strong>Result:</strong> {profile.result}</p>
              <Link href="/quote" className="button primary">Estimate this type of kitchen</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
