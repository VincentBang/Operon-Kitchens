import { useRouter } from 'next/router';
import Link from 'next/link';
import { locations } from '@/data/locations';

export default function LocationPage() {
  const router = useRouter();
  const { region } = router.query;
  if (!region || Array.isArray(region)) return null;
  const info = locations[region as string];
  if (!info) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-3xl font-bold">Location not found</h1>
        <Link href="/" className="textLink">Return home</Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{info.name}</h1>
      <p>{info.description}</p>
      <p className="italic text-gray-700">{info.notes}</p>
      <p className="mt-4">Ready to renovate? <Link href="/quote" className="textLink">Start your estimate</Link></p>
    </main>
  );
}
