import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function AdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Admin tools are not enabled on the public site"
      description="The public Operon Kitchens deployment is static for reliability. Kitchen admin, rate-card editing and lead queues will be connected through a kitchen-namespaced backend in a later operational phase."
      primaryHref="/"
      primaryLabel="Return to public site"
      secondaryHref="/quote/review"
      secondaryLabel="Review a kitchen quote"
    />
  );
}
