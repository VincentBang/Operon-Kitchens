import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { listProducts, ProductRecord } from '@/lib/adminData';

interface Props {
  user: AuthUser;
  products: ProductRecord[];
}

const blank = { id: '', slug: '', title: '', summary: '', detailsText: '', status: 'published' };

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  return { props: { user, products: listProducts() } };
};

export default function ProductsAdmin({ user, products }: Props) {
  const [items, setItems] = useState(products);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/admin/products');
    const payload = await response.json();
    setItems(payload.products || []);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    setMessage(response.ok ? 'Product saved.' : payload.error || 'Could not save product.');
    if (response.ok) {
      setForm(blank);
      await refresh();
    }
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    const payload = await response.json();
    setMessage(response.ok ? 'Product deleted.' : payload.error || 'Could not delete product.');
    await refresh();
  }

  return (
    <AdminShell user={user} title="Product categories">
      <section className="wizardPanel adminTwoColumn">
        <form onSubmit={submit} className="adminForm">
          <h2>{form.id ? 'Edit product' : 'Create product'}</h2>
          <label><span>Slug</span><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
          <label><span>Title</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
          <label><span>Summary</span><textarea rows={3} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
          <label><span>Details, one per line</span><textarea rows={7} value={form.detailsText} onChange={(event) => setForm({ ...form, detailsText: event.target.value })} /></label>
          <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <div className="flexActions">
            <button className="button primary">Save product</button>
            <button type="button" className="button ghost" onClick={() => setForm(blank)}>New</button>
          </div>
          {message && <p className="privacyNotice">{message}</p>}
        </form>
        <div className="adminList">
          {items.map((item) => (
            <article className="adminListItem" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.slug} · {item.status}</p>
              </div>
              <div className="adminActions">
                <button onClick={() => setForm({ id: item.id, slug: item.slug, title: item.title, summary: item.summary, detailsText: item.details.join('\n'), status: item.status })}>Edit</button>
                <button onClick={() => remove(item.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
