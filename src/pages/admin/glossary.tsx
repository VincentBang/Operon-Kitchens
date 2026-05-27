import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { GlossaryRecord, listGlossary } from '@/lib/adminData';

interface Props {
  user: AuthUser;
  glossary: GlossaryRecord[];
}

const blank = { id: '', slug: '', term: '', definition: '', status: 'published' };

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  return { props: { user, glossary: listGlossary() } };
};

export default function GlossaryAdmin({ user, glossary }: Props) {
  const [items, setItems] = useState(glossary);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/admin/glossary');
    const payload = await response.json();
    setItems(payload.glossary || []);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/glossary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const payload = await response.json();
    setMessage(response.ok ? 'Glossary term saved.' : payload.error || 'Could not save term.');
    if (response.ok) {
      setForm(blank);
      await refresh();
    }
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/glossary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    const payload = await response.json();
    setMessage(response.ok ? 'Glossary term deleted.' : payload.error || 'Could not delete term.');
    await refresh();
  }

  return (
    <AdminShell user={user} title="Glossary terms">
      <section className="wizardPanel adminTwoColumn">
        <form onSubmit={submit} className="adminForm">
          <h2>{form.id ? 'Edit term' : 'Create term'}</h2>
          <label><span>Slug</span><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
          <label><span>Term</span><input value={form.term} onChange={(event) => setForm({ ...form, term: event.target.value })} required /></label>
          <label><span>Definition</span><textarea rows={5} value={form.definition} onChange={(event) => setForm({ ...form, definition: event.target.value })} /></label>
          <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <div className="flexActions"><button className="button primary">Save term</button><button type="button" className="button ghost" onClick={() => setForm(blank)}>New</button></div>
          {message && <p className="privacyNotice">{message}</p>}
        </form>
        <div className="adminList">
          {items.map((item) => (
            <article className="adminListItem" key={item.id}>
              <div><strong>{item.term}</strong><p>{item.slug} · {item.status}</p></div>
              <div className="adminActions"><button onClick={() => setForm(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
