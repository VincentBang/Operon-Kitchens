import Head from 'next/head';

interface SchemaJsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function SchemaJsonLd({ data }: SchemaJsonLdProps) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
      />
    </Head>
  );
}
