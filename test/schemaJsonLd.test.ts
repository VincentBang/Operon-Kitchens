import { normaliseSchemaData } from '../src/components/SchemaJsonLd';

describe('SchemaJsonLd', () => {
  it('wraps schema arrays in a top-level context graph for browser compatibility', () => {
    const schema = normaliseSchemaData([
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'Operon Kitchens' },
      { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Operon Kitchens' },
    ]);

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', name: 'Operon Kitchens' },
        { '@type': 'LocalBusiness', name: 'Operon Kitchens' },
      ],
    });
  });
});
