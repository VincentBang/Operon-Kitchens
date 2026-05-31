import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function GlossaryAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Glossary editing is not enabled on the public site"
      description="Glossary content is available publicly for customer education. Admin editing will move behind a kitchen-namespaced backend later."
      primaryHref="/kitchen-renovation-glossary"
      primaryLabel="View glossary"
      secondaryHref="/admin"
      secondaryLabel="Back to admin notice"
    />
  );
}
