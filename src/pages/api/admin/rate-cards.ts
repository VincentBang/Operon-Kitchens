import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';
import { activateRateCard, createRateCard, deleteRateCard, listRateCards, updateRateCard } from '@/lib/rateCards';

function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    res.status(401).json({ error: 'Admin access required.' });
    return false;
  }
  return true;
}

function parseData(data: unknown) {
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!requireAdmin(req, res)) return;

    if (req.method === 'GET') return res.status(200).json({ rateCards: listRateCards() });

    if (req.method === 'POST') {
      const { action, id, name, version, data, isActive } = req.body;
      if (action === 'activate') return res.status(200).json({ rateCard: activateRateCard(id) });
      if (action === 'delete') return res.status(200).json({ deleted: deleteRateCard(id) });
      const payload = { name, version, data: parseData(data), isActive: Boolean(isActive) };
      const rateCard = id ? updateRateCard(id, payload) : createRateCard(payload);
      return res.status(id ? 200 : 201).json({ rateCard });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected rate card error.' });
  }
}
