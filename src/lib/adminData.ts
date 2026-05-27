import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { faqs } from '@/data/faqs';
import { glossary } from '@/data/glossary';
import { guides } from '@/data/guides';
import { locations } from '@/data/locations';
import { productCategories } from '@/data/products';
import { parseJson } from '@/lib/quoteRecords';
import { listRateCards, seedDefaultRateCard } from '@/lib/rateCards';

type Status = 'published' | 'draft';

export interface ProductRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details: string[];
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryRecord {
  id: string;
  slug: string;
  term: string;
  definition: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface GuideRecord {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface LocationRecord {
  id: string;
  region: string;
  name: string;
  description: string;
  notes: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

function now() {
  return new Date().toISOString();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function status(value: unknown): Status {
  return value === 'draft' ? 'draft' : 'published';
}

function detailsFromText(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function serializeProduct(row: any): ProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    details: parseJson<string[]>(row.details_json, []),
    status: status(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeGlossary(row: any): GlossaryRecord {
  return {
    id: row.id,
    slug: row.slug,
    term: row.term,
    definition: row.definition,
    status: status(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeGuide(row: any): GuideRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    status: status(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeLocation(row: any): LocationRecord {
  return {
    id: row.id,
    region: row.region,
    name: row.name,
    description: row.description,
    notes: row.notes,
    status: status(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeFaq(row: any): FaqRecord {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    sortOrder: Number(row.sort_order),
    status: status(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function seedKitchenContent() {
  const timestamp = now();
  Object.entries(productCategories).forEach(([slug, item]) => {
    db.prepare(`
      INSERT OR IGNORE INTO kitchen_product_categories (id, slug, title, summary, details_json, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'published', ?, ?)
    `).run(randomUUID(), slug, item.title, item.summary, JSON.stringify(item.details), timestamp, timestamp);
  });

  glossary.forEach((item) => {
    const slug = slugify(item.term);
    db.prepare(`
      INSERT OR IGNORE INTO kitchen_glossary_terms (id, slug, term, definition, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'published', ?, ?)
    `).run(randomUUID(), slug, item.term, item.definition, timestamp, timestamp);
  });

  guides.forEach((item) => {
    db.prepare(`
      INSERT OR IGNORE INTO kitchen_guides (id, slug, title, content, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'published', ?, ?)
    `).run(randomUUID(), item.slug, item.title, item.content, timestamp, timestamp);
  });

  Object.entries(locations).forEach(([region, item]) => {
    db.prepare(`
      INSERT OR IGNORE INTO kitchen_locations (id, region, name, description, notes, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'published', ?, ?)
    `).run(randomUUID(), region, item.name, item.description, item.notes, timestamp, timestamp);
  });

  faqs.forEach((item) => {
    const seedId = `seed-${slugify(item.question)}`;
    db.prepare('DELETE FROM kitchen_faqs WHERE question = ? AND id != ?').run(item.question, seedId);
    db.prepare(`
      INSERT OR IGNORE INTO kitchen_faqs (id, question, answer, category, sort_order, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'published', ?, ?)
    `).run(seedId, item.question, item.answer, item.category, item.sortOrder, timestamp, timestamp);
  });
}

export function ensureAdminData() {
  seedDefaultRateCard();
  seedKitchenContent();
}

export function listProducts(includeDrafts = true): ProductRecord[] {
  seedKitchenContent();
  const query = includeDrafts ? 'SELECT * FROM kitchen_product_categories ORDER BY title' : "SELECT * FROM kitchen_product_categories WHERE status = 'published' ORDER BY title";
  return db.prepare(query).all().map(serializeProduct);
}

export function getProductBySlug(slug: string, includeDrafts = false) {
  seedKitchenContent();
  const row = db
    .prepare(`SELECT * FROM kitchen_product_categories WHERE slug = ? ${includeDrafts ? '' : "AND status = 'published'"} LIMIT 1`)
    .get(slug);
  return row ? serializeProduct(row) : null;
}

export function saveProduct(input: Partial<ProductRecord> & { detailsText?: string }) {
  const timestamp = now();
  const id = input.id || randomUUID();
  const slug = input.slug?.trim() || slugify(input.title || '');
  const details = input.details ?? detailsFromText(input.detailsText || '');
  if (!slug || !input.title?.trim()) throw new Error('Slug and title are required.');

  db.prepare(`
    INSERT INTO kitchen_product_categories (id, slug, title, summary, details_json, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, title = excluded.title, summary = excluded.summary,
      details_json = excluded.details_json, status = excluded.status, updated_at = excluded.updated_at
  `).run(id, slug, input.title.trim(), input.summary?.trim() || '', JSON.stringify(details), status(input.status), timestamp, timestamp);
  return db.prepare('SELECT * FROM kitchen_product_categories WHERE id = ?').get(id);
}

export function deleteProduct(id: string) {
  return db.prepare('DELETE FROM kitchen_product_categories WHERE id = ?').run(id).changes > 0;
}

export function listGlossary(includeDrafts = true): GlossaryRecord[] {
  seedKitchenContent();
  const query = includeDrafts ? 'SELECT * FROM kitchen_glossary_terms ORDER BY term' : "SELECT * FROM kitchen_glossary_terms WHERE status = 'published' ORDER BY term";
  return db.prepare(query).all().map(serializeGlossary);
}

export function saveGlossary(input: Partial<GlossaryRecord>) {
  const timestamp = now();
  const id = input.id || randomUUID();
  const slug = input.slug?.trim() || slugify(input.term || '');
  if (!slug || !input.term?.trim()) throw new Error('Slug and term are required.');
  db.prepare(`
    INSERT INTO kitchen_glossary_terms (id, slug, term, definition, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, term = excluded.term, definition = excluded.definition,
      status = excluded.status, updated_at = excluded.updated_at
  `).run(id, slug, input.term.trim(), input.definition?.trim() || '', status(input.status), timestamp, timestamp);
  return db.prepare('SELECT * FROM kitchen_glossary_terms WHERE id = ?').get(id);
}

export function deleteGlossary(id: string) {
  return db.prepare('DELETE FROM kitchen_glossary_terms WHERE id = ?').run(id).changes > 0;
}

export function listGuides(includeDrafts = true): GuideRecord[] {
  seedKitchenContent();
  const query = includeDrafts ? 'SELECT * FROM kitchen_guides ORDER BY title' : "SELECT * FROM kitchen_guides WHERE status = 'published' ORDER BY title";
  return db.prepare(query).all().map(serializeGuide);
}

export function getGuideBySlug(slug: string, includeDrafts = false) {
  seedKitchenContent();
  const row = db.prepare(`SELECT * FROM kitchen_guides WHERE slug = ? ${includeDrafts ? '' : "AND status = 'published'"} LIMIT 1`).get(slug);
  return row ? serializeGuide(row) : null;
}

export function saveGuide(input: Partial<GuideRecord>) {
  const timestamp = now();
  const id = input.id || randomUUID();
  const slug = input.slug?.trim() || slugify(input.title || '');
  if (!slug || !input.title?.trim()) throw new Error('Slug and title are required.');
  db.prepare(`
    INSERT INTO kitchen_guides (id, slug, title, content, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, title = excluded.title, content = excluded.content,
      status = excluded.status, updated_at = excluded.updated_at
  `).run(id, slug, input.title.trim(), input.content?.trim() || '', status(input.status), timestamp, timestamp);
  return db.prepare('SELECT * FROM kitchen_guides WHERE id = ?').get(id);
}

export function deleteGuide(id: string) {
  return db.prepare('DELETE FROM kitchen_guides WHERE id = ?').run(id).changes > 0;
}

export function listLocations(includeDrafts = true): LocationRecord[] {
  seedKitchenContent();
  const query = includeDrafts ? 'SELECT * FROM kitchen_locations ORDER BY name' : "SELECT * FROM kitchen_locations WHERE status = 'published' ORDER BY name";
  return db.prepare(query).all().map(serializeLocation);
}

export function getLocationByRegion(region: string, includeDrafts = false) {
  seedKitchenContent();
  const row = db.prepare(`SELECT * FROM kitchen_locations WHERE region = ? ${includeDrafts ? '' : "AND status = 'published'"} LIMIT 1`).get(region);
  return row ? serializeLocation(row) : null;
}

export function saveLocation(input: Partial<LocationRecord>) {
  const timestamp = now();
  const id = input.id || randomUUID();
  const region = input.region?.trim() || slugify(input.name || '');
  if (!region || !input.name?.trim()) throw new Error('Region and name are required.');
  db.prepare(`
    INSERT INTO kitchen_locations (id, region, name, description, notes, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET region = excluded.region, name = excluded.name, description = excluded.description,
      notes = excluded.notes, status = excluded.status, updated_at = excluded.updated_at
  `).run(id, region, input.name.trim(), input.description?.trim() || '', input.notes?.trim() || '', status(input.status), timestamp, timestamp);
  return db.prepare('SELECT * FROM kitchen_locations WHERE id = ?').get(id);
}

export function deleteLocation(id: string) {
  return db.prepare('DELETE FROM kitchen_locations WHERE id = ?').run(id).changes > 0;
}

export function listFaqs(includeDrafts = true): FaqRecord[] {
  seedKitchenContent();
  const query = includeDrafts ? 'SELECT * FROM kitchen_faqs ORDER BY category, sort_order, question' : "SELECT * FROM kitchen_faqs WHERE status = 'published' ORDER BY category, sort_order, question";
  return db.prepare(query).all().map(serializeFaq);
}

export function saveFaq(input: Partial<FaqRecord>) {
  const timestamp = now();
  const id = input.id || randomUUID();
  if (!input.question?.trim()) throw new Error('Question is required.');
  db.prepare(`
    INSERT INTO kitchen_faqs (id, question, answer, category, sort_order, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET question = excluded.question, answer = excluded.answer, category = excluded.category,
      sort_order = excluded.sort_order, status = excluded.status, updated_at = excluded.updated_at
  `).run(
    id,
    input.question.trim(),
    input.answer?.trim() || '',
    input.category?.trim() || 'general',
    Number(input.sortOrder || 0),
    status(input.status),
    timestamp,
    timestamp
  );
  return db.prepare('SELECT * FROM kitchen_faqs WHERE id = ?').get(id);
}

export function deleteFaq(id: string) {
  return db.prepare('DELETE FROM kitchen_faqs WHERE id = ?').run(id).changes > 0;
}

export function listLeadsAndQuotes(filters: { status?: string; q?: string } = {}) {
  const q = `%${(filters.q || '').trim().toLowerCase()}%`;
  const statusFilter = filters.status && filters.status !== 'all' ? filters.status : '';
  const leads = db.prepare(`
    SELECT leads.*, COUNT(quotes.id) AS quoteCount, COALESCE(MAX(quotes.total), 0) AS latestQuoteTotal,
      MAX(quotes.updated_at) AS latestQuoteAt
    FROM leads
    LEFT JOIN quotes ON quotes.lead_id = leads.id
    WHERE (? = '%%' OR LOWER(leads.name) LIKE ? OR LOWER(leads.email) LIKE ? OR LOWER(leads.phone) LIKE ?)
    GROUP BY leads.id
    ORDER BY COALESCE(latestQuoteAt, leads.updated_at) DESC
  `).all(q, q, q, q).map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    marketingOptIn: Boolean(row.marketing_opt_in),
    source: row.source,
    quoteCount: row.quoteCount,
    latestQuoteTotal: row.latestQuoteTotal,
    latestQuoteAt: row.latestQuoteAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  const quotes = db.prepare(`
    SELECT quotes.*, leads.name AS leadName, leads.email AS leadEmail
    FROM quotes
    LEFT JOIN leads ON leads.id = quotes.lead_id
    WHERE (? = '' OR quotes.status = ?)
      AND (? = '%%' OR LOWER(COALESCE(leads.name, '')) LIKE ? OR LOWER(COALESCE(leads.email, '')) LIKE ? OR LOWER(quotes.id) LIKE ?)
    ORDER BY quotes.updated_at DESC
    LIMIT 100
  `).all(statusFilter, statusFilter, q, q, q, q).map((row: any) => ({
    id: row.id,
    status: row.status,
    leadName: row.leadName,
    leadEmail: row.leadEmail,
    total: row.total,
    confidenceScore: row.confidence_score,
    confidenceLevel: row.confidence_level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return { leads, quotes };
}

export function updateQuoteStatus(id: string, statusValue: string) {
  const timestamp = now();
  return db.prepare('UPDATE quotes SET status = ?, updated_at = ? WHERE id = ?').run(statusValue.trim() || 'SUBMITTED', timestamp, id).changes > 0;
}

export function getAdminSummary() {
  ensureAdminData();
  const { leads, quotes } = listLeadsAndQuotes();
  return {
    leads: leads.slice(0, 8),
    quotes: quotes.slice(0, 8),
    rateCards: listRateCards().map(({ id, name, version, isActive, createdAt, updatedAt }) => ({ id, name, version, isActive, createdAt, updatedAt })),
    contentCounts: {
      products: listProducts().length,
      glossary: listGlossary().length,
      guides: listGuides().length,
      locations: listLocations().length,
      faqs: listFaqs().length,
    },
  };
}
