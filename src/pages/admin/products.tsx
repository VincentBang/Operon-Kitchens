import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function ProductsAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Product editing is not enabled on the public site"
      description="Product and project-type content is currently published as customer-safe website content. Editable CMS/admin tools are planned for a later phase."
      primaryHref="/"
      primaryLabel="Return to public site"
      secondaryHref="/projects"
      secondaryLabel="View project profiles"
    />
  );
}
