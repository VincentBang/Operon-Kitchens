import { useRouter } from 'next/router';
import Link from 'next/link';
import { productCategories } from '@/data/products';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug || Array.isArray(slug)) return null;
  const category = productCategories[slug];
  if (!category) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-2">Please select a valid product category.</p>
        <Link href="/" className="textLink mt-4 inline-block">Return home</Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{category.title}</h1>
      <p>{category.summary}</p>
      <ul className="list-disc list-inside space-y-2">
        {category.details.map((detail, idx) => (
          <li key={idx}>{detail}</li>
        ))}
      </ul>
      <p className="mt-4">Ready to price your kitchen? <Link href="/quote" className="textLink">Start your estimate</Link></p>
    </main>
  );
}
