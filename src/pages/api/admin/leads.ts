import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';
import { listLeadsAndQuotes, updateQuoteStatus } from '@/lib/adminData';

function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    res.status(401).json({ error: 'Admin access required.' });
    return false;
  }
  return true;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!requireAdmin(req, res)) return;
    if (req.method === 'GET') {
      return res.status(200).json({
        data: listLeadsAndQuotes({
          status: typeof req.query.status === 'string' ? req.query.status : 'all',
          q: typeof req.query.q === 'string' ? req.query.q : '',
        }),
      });
    }
    if (req.method === 'POST') {
      if (req.body.action === 'status') return res.status(200).json({ updated: updateQuoteStatus(req.body.id, req.body.status) });
      return res.status(400).json({ error: 'Unsupported action.' });
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected leads error.' });
  }
}
