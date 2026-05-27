import type { NextApiRequest, NextApiResponse } from 'next';
import { adminPasscodeIsValid, createSession, roleForEmail, upsertUser } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { email, name, phone, passcode } = req.body;
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' });

  const role = roleForEmail(email);
  if (role === 'admin' && !adminPasscodeIsValid(passcode || '')) {
    return res.status(401).json({ error: 'Admin passcode is required.' });
  }

  const user = upsertUser({ email, name, phone });
  if (!user) return res.status(500).json({ error: 'Could not create user.' });

  createSession(user.id, res);
  return res.status(200).json({ user });
}
