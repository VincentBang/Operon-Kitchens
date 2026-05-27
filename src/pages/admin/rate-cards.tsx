import { GetServerSideProps } from 'next';
import { FormEvent, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { listRateCards, RateCardRecord } from '@/lib/rateCards';

interface Props {
  user: AuthUser;
  rateCards: RateCardRecord[];
}

const emptyCard = {
  id: '',
  name: 'Kitchen rate card',
  version: new Date().toISOString().slice(0, 10),
  dataText: '',
  baseRate: 600,
  isActive: false,
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') {
    return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  }
  return { props: { user, rateCards: listRateCards() } };
};

export default function RateCardsPage({ user, rateCards }: Props) {
  const [cards, setCards] = useState(rateCards);
  const [form, setForm] = useState(() => ({
    ...emptyCard,
    dataText: JSON.stringify(rateCards[0]?.data ?? {}, null, 2),
    baseRate: rateCards[0]?.data.cabinetry.baseRate ?? 600,
  }));
  const [message, setMessage] = useState('');

  const active = useMemo(() => cards.find((card) => card.isActive), [cards]);

  function edit(card: RateCardRecord) {
    setForm({
      id: card.id,
      name: card.name,
      version: card.version,
      dataText: JSON.stringify(card.data, null, 2),
      baseRate: card.data.cabinetry.baseRate,
      isActive: card.isActive,
    });
  }

  async function refresh() {
    const response = await fetch('/api/admin/rate-cards');
    const payload = await response.json();
    setCards(payload.rateCards || []);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    try {
      const data = JSON.parse(form.dataText);
      data.cabinetry.baseRate = Number(form.baseRate) || data.cabinetry.baseRate;
      const response = await fetch('/api/admin/rate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id || undefined, name: form.name, version: form.version, data, isActive: form.isActive }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save rate card.');
      setMessage('Rate card saved. New submitted quotes will use the active card.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save rate card.');
    }
  }

  async function action(actionName: 'activate' | 'delete', id: string) {
    setMessage('');
    const response = await fetch('/api/admin/rate-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionName, id }),
    });
    const payload = await response.json();
    if (!response.ok) setMessage(payload.error || 'Action failed.');
    await refresh();
  }

  return (
    <AdminShell user={user} title="Rate cards">
      <section className="wizardPanel adminTwoColumn">
        <form onSubmit={submit} className="adminForm">
          <h2>{form.id ? 'Edit rate card' : 'Create rate card'}</h2>
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            <span>Version</span>
            <input value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} required />
          </label>
          <label>
            <span>Base cabinet rate quick edit</span>
            <input type="number" value={form.baseRate} onChange={(event) => setForm({ ...form, baseRate: Number(event.target.value) })} />
          </label>
          <label>
            <span>Full rate card JSON</span>
            <textarea value={form.dataText} onChange={(event) => setForm({ ...form, dataText: event.target.value })} rows={18} spellCheck={false} />
          </label>
          <label className="adminCheck">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
            <span>Make active for new submitted quotes</span>
          </label>
          <div className="flexActions">
            <button className="button primary">Save rate card</button>
            <button type="button" className="button ghost" onClick={() => setForm({ ...emptyCard, dataText: JSON.stringify(active?.data ?? {}, null, 2), baseRate: active?.data.cabinetry.baseRate ?? 600 })}>New</button>
          </div>
          {message && <p className="privacyNotice">{message}</p>}
        </form>

        <div className="adminList">
          {cards.map((card) => (
            <article key={card.id} className="adminListItem">
              <div>
                <strong>{card.name}</strong>
                <p>Version {card.version} · Base rate ${card.data.cabinetry.baseRate} · {card.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="adminActions">
                <button onClick={() => edit(card)}>Edit</button>
                {!card.isActive && <button onClick={() => action('activate', card.id)}>Activate</button>}
                {!card.isActive && <button onClick={() => action('delete', card.id)}>Delete</button>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
