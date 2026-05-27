import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';
import { deleteProduct, listProducts, saveProduct } from '@/lib/adminData';

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
    if (req.method === 'GET') return res.status(200).json({ products: listProducts() });
    if (req.method === 'POST') {
      if (req.body.action === 'delete') return res.status(200).json({ deleted: deleteProduct(req.body.id) });
      return res.status(req.body.id ? 200 : 201).json({ product: saveProduct(req.body) });
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected products error.' });
  }
}
