import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { db } from '@/lib/db';

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
}

const SESSION_COOKIE = 'operon_session';
const SESSION_DAYS = 30;

function now() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function configuredAdminEmails() {
  const configured = process.env.ADMIN_EMAILS || 'admin@operonkitchens.local';
  return configured.split(',').map((email) => normalizeEmail(email)).filter(Boolean);
}

function sessionHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function serializeUser(row: any): AuthUser | null {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    phone: row.phone ?? null,
    role: row.role,
  };
}

function parseCookie(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.split('=');
        return [key, decodeURIComponent(value.join('='))];
      })
  );
}

function cookieValue(req: NextApiRequest | GetServerSidePropsContext['req']) {
  return parseCookie(req.headers.cookie || '')[SESSION_COOKIE] || '';
}

function sessionCookie(token: string, expires: Date) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function roleForEmail(email: string): UserRole {
  return configuredAdminEmails().includes(normalizeEmail(email)) ? 'admin' : 'customer';
}

export function upsertUser(input: { email: string; name?: string; phone?: string }) {
  const email = normalizeEmail(input.email);
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  const timestamp = now();
  const role = roleForEmail(email);

  if (existing) {
    db.prepare('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), role = ?, updated_at = ? WHERE email = ?').run(
      input.name?.trim() || null,
      input.phone?.trim() || null,
      role,
      timestamp,
      email
    );
    return serializeUser(db.prepare('SELECT * FROM users WHERE email = ?').get(email));
  }

  db.prepare('INSERT INTO users (id, email, name, phone, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    randomUUID(),
    email,
    input.name?.trim() || null,
    input.phone?.trim() || null,
    role,
    timestamp,
    timestamp
  );

  return serializeUser(db.prepare('SELECT * FROM users WHERE email = ?').get(email));
}

export function createSession(userId: string, res: NextApiResponse) {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.prepare('INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)').run(
    randomUUID(),
    userId,
    sessionHash(token),
    expires.toISOString(),
    now()
  );
  res.setHeader('Set-Cookie', sessionCookie(token, expires));
}

export function destroySession(req: NextApiRequest, res: NextApiResponse) {
  const token = cookieValue(req);
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sessionHash(token));
  }
  res.setHeader('Set-Cookie', clearSessionCookie());
}

export function getUserFromRequest(req: NextApiRequest | GetServerSidePropsContext['req']) {
  const token = cookieValue(req);
  if (!token) return null;

  const row = db
    .prepare(
      `SELECT users.*
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > ?`
    )
    .get(sessionHash(token), now());

  return serializeUser(row);
}

export function requireAdmin(context: GetServerSidePropsContext) {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') {
    return {
      redirect: {
        destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  return { props: { user } };
}

export function adminPasscodeIsValid(passcode: string) {
  return passcode === (process.env.ADMIN_PASSCODE || 'OPERON-ADMIN');
}
