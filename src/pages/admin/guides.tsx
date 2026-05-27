import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { GuideRecord, listGuides } from '@/lib/adminData';

interface Props {
  user: AuthUser;
  guides: GuideRecord[];
}

const blank = { id: '', slug: '', title: '', content: '', status: 'published' };

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  return { props: { user, guides: listGuides() } };
};

export default function GuidesAdmin({ user, guides }: Props) {
  const [items, setItems] = useState(guides);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/admin/guides');
    const payload = await response.json();
    setItems(payload.guides || []);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/guides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const payload = await response.json();
    setMessage(response.ok ? 'Guide saved.' : payload.error || 'Could not save guide.');
    if (response.ok) {
      setForm(blank);
      await refresh();
    }
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/guides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    const payload = await response.json();
    setMessage(response.ok ? 'Guide deleted.' : payload.error || 'Could not delete guide.');
    await refresh();
  }

  return (
    <AdminShell user={user} title="Guides">
      <section className="wizardPanel adminTwoColumn">
        <form onSubmit={submit} className="adminForm">
          <h2>{form.id ? 'Edit guide' : 'Create guide'}</h2>
          <label><span>Slug</span><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
          <label><span>Title</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
          <label><span>Content</span><textarea rows={10} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></label>
          <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <div className="flexActions"><button className="button primary">Save guide</button><button type="button" className="button ghost" onClick={() => setForm(blank)}>New</button></div>
          {message && <p className="privacyNotice">{message}</p>}
        </form>
        <div className="adminList">
          {items.map((item) => (
            <article className="adminListItem" key={item.id}>
              <div><strong>{item.title}</strong><p>{item.slug} · {item.status}</p></div>
              <div className="adminActions"><button onClick={() => setForm(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
