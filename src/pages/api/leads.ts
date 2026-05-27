import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';
import { getLeadWithQuotes, saveLeadRecord } from '@/lib/quoteRecords';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const user = getUserFromRequest(req);
      if (!user) return res.status(401).json({ error: 'Sign in to view lead records.' });
      const email = typeof req.query.email === 'string' ? req.query.email : '';
      if (!email) return res.status(400).json({ error: 'Email is required.' });
      if (user.role !== 'admin' && email.trim().toLowerCase() !== user.email) {
        return res.status(403).json({ error: 'You can only view your own account.' });
      }

      const lead = await getLeadWithQuotes(email);

      if (!lead) return res.status(404).json({ error: 'Lead not found.' });
      return res.status(200).json({ lead });
    }

    if (req.method === 'POST') {
      const { name, email, phone, marketingOptIn, source } = req.body;
      if (!name?.trim() || !email?.trim() || !phone?.trim()) {
        return res.status(400).json({ error: 'Name, email and phone are required.' });
      }

      const lead = await saveLeadRecord({ name, email, phone, marketingOptIn, source: source ?? 'manual' });

      return res.status(201).json({ lead });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected lead API error.';
    return res.status(500).json({ error: message });
  }
}
