import { useRouter } from 'next/router';
import Link from 'next/link';
import { guides } from '@/data/guides';

export default function GuidePage() {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug || Array.isArray(slug)) return null;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-3xl font-bold">Guide not found</h1>
        <Link href="/" className="textLink">Return home</Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{guide.title}</h1>
      <p>{guide.content}</p>
      <p className="mt-4">For a personalised estimate, <Link href="/quote" className="textLink">start your quote</Link>.</p>
    </main>
  );
}
