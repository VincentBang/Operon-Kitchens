import { deleteFaq, deleteProduct, getProductBySlug, listFaqs, listProducts, saveFaq, saveProduct } from '../src/lib/adminData';

describe('admin content data', () => {
  it('creates and serves product content from the kitchen CMS table', () => {
    const slug = `test-product-${Date.now()}`;
    const saved: any = saveProduct({
      slug,
      title: 'Test Product',
      summary: 'A kitchen-only editable product.',
      details: ['Editable detail one', 'Editable detail two'],
      status: 'published',
    });

    const product = getProductBySlug(slug);
    expect(product?.title).toBe('Test Product');
    expect(product?.details).toContain('Editable detail one');
    expect(listProducts().some((item) => item.slug === slug)).toBe(true);

    deleteProduct(saved.id);
  });

  it('creates and serves FAQs from the kitchen CMS table', () => {
    const question = `Does the CMS FAQ update without code ${Date.now()}?`;
    const saved: any = saveFaq({
      question,
      answer: 'Yes. Published FAQ records are read from the kitchen CMS table at request time.',
      category: 'cms',
      sortOrder: 5,
      status: 'published',
    });

    const faqs = listFaqs(false);
    const faq = faqs.find((item) => item.question === question);
    expect(faq?.answer).toContain('Published FAQ records');
    expect(faq?.category).toBe('cms');

    deleteFaq(saved.id);
  });
});
