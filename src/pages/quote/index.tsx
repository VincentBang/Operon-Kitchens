import Head from 'next/head';
import QuoteWizard from '@/components/QuoteWizard';

export default function QuotePage() {
  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen estimate wizard | Operon Kitchens</title>
        <meta
          name="description"
          content="Start a Sydney kitchen renovation planning estimate with scope, finish tiers, uploads, confidence scoring, assumptions, exclusions and review flags."
        />
      </Head>
      <QuoteWizard />
    </main>
  );
}
