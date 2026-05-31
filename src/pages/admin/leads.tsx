import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function LeadsAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Lead queue is not enabled on the public site"
      description="Kitchen lead management will be connected through a kitchen-namespaced backend in a later operational phase. This public deployment does not expose internal pipeline fields or follow-up workflows."
      primaryHref="/admin"
      primaryLabel="Back to admin notice"
      secondaryHref="/quote/review"
      secondaryLabel="Review a kitchen quote"
    />
  );
}
