import Head from 'next/head';
import Link from 'next/link';
import DesignPlanner from '@/components/DesignPlanner';

export default function DesignPage() {
  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen measurement sketch beta | Operon Kitchens</title>
        <meta
          name="description"
          content="A beta kitchen measurement sketch tool for early planning context before professional site measure and written scope confirmation."
        />
      </Head>
      <section className="wizardShell designShell">
        <div className="wizardHeader">
          <p className="eyebrow">Measurement sketch beta</p>
          <h1>Kitchen measurement sketch</h1>
          <p className="muted">
            Sketch the room in millimetres, place early cabinet and appliance blocks, then attach the exported plan to your quote request for professional review.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Open quote wizard</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
        <section className="notePanel">
          This beta sketch is for planning context only. Measure wall-to-wall in millimetres, record ceiling height, mark windows and doors, and note plumbing, gas, electrical and ventilation points. Operon Kitchens can arrange a professional measure before written scope confirmation.
        </section>
        <DesignPlanner />
      </section>
    </main>
  );
}
