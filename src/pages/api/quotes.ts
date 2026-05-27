import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';
import { getQuoteById, getQuotesByEmail, saveQuoteRecord } from '@/lib/quoteRecords';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const user = getUserFromRequest(req);
      if (!user) return res.status(401).json({ error: 'Sign in to view saved quotes.' });

      const id = typeof req.query.id === 'string' ? req.query.id : '';
      const email = typeof req.query.email === 'string' ? req.query.email : '';

      if (id) {
        const quote = await getQuoteById(id);
        if (!quote) return res.status(404).json({ error: 'Quote not found.' });
        if (user.role !== 'admin' && quote.lead?.email !== user.email) {
          return res.status(403).json({ error: 'You can only view your own quotes.' });
        }
        return res.status(200).json({ quote });
      }

      if (email) {
        if (user.role !== 'admin' && email.trim().toLowerCase() !== user.email) {
          return res.status(403).json({ error: 'You can only view your own quotes.' });
        }
        const quotes = await getQuotesByEmail(email);
        return res.status(200).json({ quotes });
      }

      return res.status(400).json({ error: 'Provide an id or email.' });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const user = getUserFromRequest(req);
      if (req.method === 'PUT') {
        if (!user) return res.status(401).json({ error: 'Sign in to update a saved quote.' });
        const existing = req.body.quoteId ? await getQuoteById(req.body.quoteId) : null;
        if (!existing) return res.status(404).json({ error: 'Quote not found.' });
        if (user.role !== 'admin' && existing.lead?.email !== user.email) {
          return res.status(403).json({ error: 'You can only update your own quotes.' });
        }
      }

      const saved = await saveQuoteRecord({
        quoteId: req.body.quoteId,
        quoteInput: req.body.quoteInput,
        contact: req.body.contact,
        status: req.body.status,
      });

      return res.status(req.method === 'POST' ? 201 : 200).json({ quote: saved });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected quote API error.';
    return res.status(500).json({ error: message });
  }
}
