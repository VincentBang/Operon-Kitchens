import Head from 'next/head';

interface SchemaJsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function normaliseSchemaData(data: SchemaJsonLdProps['data']) {
  if (!Array.isArray(data)) return data;

  return {
    '@context': 'https://schema.org',
    '@graph': data.map((item) => {
      const { '@context': _context, ...rest } = item;
      return rest;
    }),
  };
}

export default function SchemaJsonLd({ data }: SchemaJsonLdProps) {
  const schemaData = normaliseSchemaData(data);

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData).replace(/</g, '\\u003c') }}
      />
    </Head>
  );
}
