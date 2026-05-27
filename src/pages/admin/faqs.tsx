import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { FaqRecord, listFaqs } from '@/lib/adminData';

interface Props {
  user: AuthUser;
  faqs: FaqRecord[];
}

const blank = { id: '', question: '', answer: '', category: 'quotes', sortOrder: 0, status: 'published' };

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  return { props: { user, faqs: listFaqs() } };
};

export default function FaqsAdmin({ user, faqs }: Props) {
  const [items, setItems] = useState(faqs);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/admin/faqs');
    const payload = await response.json();
    setItems(payload.faqs || []);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const payload = await response.json();
    setMessage(response.ok ? 'FAQ saved.' : payload.error || 'Could not save FAQ.');
    if (response.ok) {
      setForm(blank);
      await refresh();
    }
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    const payload = await response.json();
    setMessage(response.ok ? 'FAQ deleted.' : payload.error || 'Could not delete FAQ.');
    await refresh();
  }

  return (
    <AdminShell user={user} title="FAQs">
      <section className="wizardPanel adminTwoColumn">
        <form onSubmit={submit} className="adminForm">
          <h2>{form.id ? 'Edit FAQ' : 'Create FAQ'}</h2>
          <label><span>Question</span><input value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} required /></label>
          <label><span>Answer</span><textarea rows={7} value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} /></label>
          <label><span>Category</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
          <label><span>Sort order</span><input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
          <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <div className="flexActions"><button className="button primary">Save FAQ</button><button type="button" className="button ghost" onClick={() => setForm(blank)}>New</button></div>
          {message && <p className="privacyNotice">{message}</p>}
        </form>
        <div className="adminList">
          {items.map((item) => (
            <article className="adminListItem" key={item.id}>
              <div><strong>{item.question}</strong><p>{item.category} · order {item.sortOrder} · {item.status}</p></div>
              <div className="adminActions"><button onClick={() => setForm(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
