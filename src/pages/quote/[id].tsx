import Head from 'next/head';
import QuoteWizard from '@/components/QuoteWizard';

export default function SavedQuotePage() {
  return (
    <main className="pageSurface">
      <Head>
        <title>Saved kitchen estimate | Operon Kitchens</title>
        <meta
          name="description"
          content="View or update a saved Operon Kitchens planning estimate before professional review, site measure and written scope confirmation."
        />
      </Head>
      <QuoteWizard />
    </main>
  );
}
