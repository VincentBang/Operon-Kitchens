import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { calculatePricing, PricingResult, QuoteInput } from '@/lib/pricing';
import { toCustomerQuoteSummary } from '@/lib/quotePresentation';
import { getActiveRateCardData, seedDefaultRateCard } from '@/lib/rateCards';

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  marketingOptIn?: boolean;
}

export interface SaveQuoteInput {
  quoteId?: string;
  quoteInput: QuoteInput;
  contact: ContactInput;
  status?: string;
}

export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function now() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function assertContact(contact: ContactInput) {
  if (!contact?.name?.trim()) throw new Error('Name is required.');
  if (!contact?.email?.trim()) throw new Error('Email is required.');
  if (!contact?.phone?.trim()) throw new Error('Phone is required.');
}

function getLeadByEmail(email: string) {
  return db.prepare('SELECT * FROM leads WHERE email = ?').get(normalizeEmail(email));
}

function getLeadById(id: string) {
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
}

function serializeLead(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    marketingOptIn: Boolean(row.marketing_opt_in),
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPublicPricing(pricing: PricingResult | null) {
  if (!pricing) return null;
  return toCustomerQuoteSummary(pricing);
}

function serializeQuote(row: any) {
  const items = db
    .prepare('SELECT id, name, cost, sort_order AS sortOrder, created_at AS createdAt FROM quote_items WHERE quote_id = ? ORDER BY sort_order ASC')
    .all(row.id);
  const lead = row.lead_id ? serializeLead(getLeadById(row.lead_id)) : null;
  const pricing = parseJson<PricingResult | null>(row.pricing_json, null);
  const publicPricing = toPublicPricing(pricing);

  return {
    id: row.id,
    status: row.status,
    lead,
    quoteInput: parseJson<QuoteInput | null>(row.input_json, null),
    pricing: publicPricing,
    totals: {
      estimateLow: publicPricing?.estimateLow ?? row.total,
      estimateHigh: publicPricing?.estimateHigh ?? row.total,
      confidenceScore: row.confidence_score,
      confidenceLevel: row.confidence_level,
      confidenceLabel: publicPricing?.confidenceLabel ?? row.confidence_level,
    },
    assumptions: parseJson<string[]>(row.assumptions_json, []),
    exclusions: parseJson<string[]>(row.exclusions_json, []),
    flags: parseJson<string[]>(row.flags_json, []),
    items: items.map((item: any) => ({
      id: item.id,
      name: item.name,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function upsertLead(contact: ContactInput) {
  const email = normalizeEmail(contact.email);
  const existing = getLeadByEmail(email);
  const timestamp = now();

  if (existing) {
    db.prepare(`
      UPDATE leads
      SET name = ?, phone = ?, marketing_opt_in = ?, updated_at = ?
      WHERE email = ?
    `).run(contact.name.trim(), contact.phone.trim(), contact.marketingOptIn ? 1 : 0, timestamp, email);
    return getLeadByEmail(email);
  }

  const id = randomUUID();
  db.prepare(`
    INSERT INTO leads (id, name, email, phone, marketing_opt_in, source, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    contact.name.trim(),
    email,
    contact.phone.trim(),
    contact.marketingOptIn ? 1 : 0,
    'quote_wizard',
    timestamp,
    timestamp
  );

  return getLeadByEmail(email);
}

export async function saveLeadRecord(contact: ContactInput & { source?: string }) {
  assertContact(contact);
  const lead = upsertLead(contact);
  if (contact.source && lead) {
    const timestamp = now();
    db.prepare('UPDATE leads SET source = ?, updated_at = ? WHERE id = ?').run(contact.source, timestamp, lead.id);
    return serializeLead(getLeadById(lead.id));
  }
  return serializeLead(lead);
}

export async function saveQuoteRecord(input: SaveQuoteInput) {
  assertContact(input.contact);

  const lead = upsertLead(input.contact);
  const pricing = calculatePricing(input.quoteInput, getActiveRateCardData());
  const quoteId = input.quoteId || randomUUID();
  const createdAt = now();
  const updatedAt = createdAt;
  const quoteExists = input.quoteId ? db.prepare('SELECT id, created_at FROM quotes WHERE id = ?').get(input.quoteId) : null;

  if (quoteExists) {
    db.prepare(`
      UPDATE quotes
      SET lead_id = ?, status = ?, input_json = ?, pricing_json = ?, subtotal = ?, margin = ?, contingency = ?,
        gst = ?, total = ?, confidence_score = ?, confidence_level = ?, assumptions_json = ?, exclusions_json = ?,
        flags_json = ?, updated_at = ?
      WHERE id = ?
    `).run(
      lead.id,
      input.status ?? 'SUBMITTED',
      JSON.stringify(input.quoteInput),
      JSON.stringify(pricing),
      pricing.subtotal,
      pricing.margin,
      pricing.contingency,
      pricing.gst,
      pricing.total,
      pricing.confidenceScore,
      pricing.confidenceLevel,
      JSON.stringify(pricing.assumptions),
      JSON.stringify(pricing.exclusions),
      JSON.stringify(pricing.flags),
      updatedAt,
      quoteId
    );
    db.prepare('DELETE FROM quote_items WHERE quote_id = ?').run(quoteId);
  } else {
    db.prepare(`
      INSERT INTO quotes (
        id, lead_id, status, input_json, pricing_json, subtotal, margin, contingency, gst, total,
        confidence_score, confidence_level, assumptions_json, exclusions_json, flags_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      quoteId,
      lead.id,
      input.status ?? 'SUBMITTED',
      JSON.stringify(input.quoteInput),
      JSON.stringify(pricing),
      pricing.subtotal,
      pricing.margin,
      pricing.contingency,
      pricing.gst,
      pricing.total,
      pricing.confidenceScore,
      pricing.confidenceLevel,
      JSON.stringify(pricing.assumptions),
      JSON.stringify(pricing.exclusions),
      JSON.stringify(pricing.flags),
      createdAt,
      updatedAt
    );
  }

  const insertItem = db.prepare(`
    INSERT INTO quote_items (id, quote_id, name, cost, sort_order, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  pricing.lineItems.forEach((item, index) => {
    insertItem.run(randomUUID(), quoteId, item.name, item.cost, index, now());
  });

  return getQuoteById(quoteId);
}

export async function getQuoteById(id: string) {
  const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(id);
  return quote ? serializeQuote(quote) : null;
}

export async function getQuotesByEmail(email: string) {
  const rows = db
    .prepare(`
      SELECT quotes.*
      FROM quotes
      JOIN leads ON leads.id = quotes.lead_id
      WHERE leads.email = ?
      ORDER BY quotes.updated_at DESC
    `)
    .all(normalizeEmail(email));

  return rows.map(serializeQuote);
}

export async function getLeadWithQuotes(email: string) {
  const lead = getLeadByEmail(email);
  if (!lead) return null;
  const quotes = await getQuotesByEmail(email);
  return {
    ...serializeLead(lead),
    quotes: quotes.map((quote) => ({
      id: quote.id,
      status: quote.status,
      estimateLow: quote.totals.estimateLow,
      estimateHigh: quote.totals.estimateHigh,
      confidenceLevel: quote.totals.confidenceLevel,
      updatedAt: quote.updatedAt,
    })),
  };
}

export async function getAdminDashboardData() {
  seedDefaultRateCard();
  const leads = db
    .prepare(
      `SELECT leads.*, COUNT(quotes.id) AS quoteCount, COALESCE(MAX(quotes.total), 0) AS latestQuoteTotal
       FROM leads
       LEFT JOIN quotes ON quotes.lead_id = leads.id
       GROUP BY leads.id
       ORDER BY leads.updated_at DESC`
    )
    .all()
    .map((row: any) => ({ ...serializeLead(row), quoteCount: row.quoteCount, latestQuoteTotal: row.latestQuoteTotal }));

  const quotes = db
    .prepare(
      `SELECT quotes.*, leads.email AS leadEmail, leads.name AS leadName
       FROM quotes
       LEFT JOIN leads ON leads.id = quotes.lead_id
       ORDER BY quotes.updated_at DESC
       LIMIT 25`
    )
    .all()
    .map((row: any) => ({ ...serializeQuote(row), leadEmail: row.leadEmail, leadName: row.leadName }));

  const rateCards = db
    .prepare('SELECT id, name, version, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt FROM rate_cards ORDER BY updated_at DESC')
    .all()
    .map((row: any) => ({ ...row, isActive: Boolean(row.isActive) }));

  return { leads, quotes, rateCards };
}
