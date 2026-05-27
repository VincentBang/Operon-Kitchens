import Link from 'next/link';
import { ReactNode } from 'react';
import { AuthUser } from '@/lib/auth';

const nav = [
  ['/admin', 'Overview'],
  ['/admin/leads', 'Leads'],
  ['/admin/rate-cards', 'Rate cards'],
  ['/admin/products', 'Products'],
  ['/admin/glossary', 'Glossary'],
  ['/admin/guides', 'Guides'],
  ['/admin/locations', 'Locations'],
  ['/admin/faqs', 'FAQs'],
];

export default function AdminShell({ user, title, eyebrow = 'Admin dashboard', children }: { user: AuthUser; title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <main className="pageSurface adminSurface">
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="muted">Signed in as {user.email}</p>
        </div>
        <nav className="adminNav">
          {nav.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        {children}
      </section>
    </main>
  );
}
