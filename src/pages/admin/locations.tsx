import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { listLocations, LocationRecord } from '@/lib/adminData';

interface Props {
  user: AuthUser;
  locations: LocationRecord[];
}

const blank = { id: '', region: '', name: '', description: '', notes: '', status: 'published' };

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  return { props: { user, locations: listLocations() } };
};

export default function LocationsAdmin({ user, locations }: Props) {
  const [items, setItems] = useState(locations);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/admin/locations');
    const payload = await response.json();
    setItems(payload.locations || []);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const payload = await response.json();
    setMessage(response.ok ? 'Location page saved.' : payload.error || 'Could not save location.');
    if (response.ok) {
      setForm(blank);
      await refresh();
    }
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    const payload = await response.json();
    setMessage(response.ok ? 'Location page deleted.' : payload.error || 'Could not delete location.');
    await refresh();
  }

  return (
    <AdminShell user={user} title="Location pages">
      <section className="wizardPanel adminTwoColumn">
        <form onSubmit={submit} className="adminForm">
          <h2>{form.id ? 'Edit location' : 'Create location'}</h2>
          <label><span>Region slug</span><input value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} /></label>
          <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label><span>Description</span><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <label><span>Notes</span><textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <div className="flexActions"><button className="button primary">Save location</button><button type="button" className="button ghost" onClick={() => setForm(blank)}>New</button></div>
          {message && <p className="privacyNotice">{message}</p>}
        </form>
        <div className="adminList">
          {items.map((item) => (
            <article className="adminListItem" key={item.id}>
              <div><strong>{item.name}</strong><p>{item.region} · {item.status}</p></div>
              <div className="adminActions"><button onClick={() => setForm(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
