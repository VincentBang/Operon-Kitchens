import Head from 'next/head';
import QuoteWizard from '@/components/QuoteWizard';

export default function QuotePage() {
  return (
    <main className="pageSurface">
      <Head>
        <title>Sydney kitchen renovation planning estimate | Operon Kitchens</title>
        <meta
          name="description"
          content="Start a Sydney kitchen renovation planning estimate with project, layout, finish and service questions for planning range, confidence, assumptions and review flags before site measure."
        />
      </Head>
      <QuoteWizard />
    </main>
  );
}
