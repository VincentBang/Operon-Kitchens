import { randomUUID } from 'node:crypto';
import rateCardJson from '@/data/rateCard.json';
import { db } from '@/lib/db';

export type RateCardData = typeof rateCardJson;

export interface RateCardRecord {
  id: string;
  name: string;
  version: string;
  data: RateCardData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function now() {
  return new Date().toISOString();
}

function parseRateCard(value: string): RateCardData {
  try {
    return JSON.parse(value) as RateCardData;
  } catch {
    return rateCardJson;
  }
}

function serializeRateCard(row: any): RateCardRecord {
  return {
    id: row.id,
    name: row.name,
    version: row.version,
    data: parseRateCard(row.data_json),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function seedDefaultRateCard() {
  const existing = db.prepare('SELECT id FROM rate_cards WHERE name = ? AND version = ?').get('default-kitchen-rate-card', '2026-05-27');
  if (existing) return;
  const timestamp = now();
  db.prepare(`
    INSERT INTO rate_cards (id, name, version, data_json, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(randomUUID(), 'default-kitchen-rate-card', '2026-05-27', JSON.stringify(rateCardJson), 1, timestamp, timestamp);
}

export function listRateCards(): RateCardRecord[] {
  seedDefaultRateCard();
  return db
    .prepare('SELECT * FROM rate_cards ORDER BY is_active DESC, updated_at DESC')
    .all()
    .map(serializeRateCard);
}

export function getActiveRateCard(): RateCardRecord {
  seedDefaultRateCard();
  const active = db.prepare('SELECT * FROM rate_cards WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1').get();
  if (active) return serializeRateCard(active);
  const fallback = listRateCards()[0];
  return fallback ?? {
    id: 'static-rate-card',
    name: 'static-kitchen-rate-card',
    version: 'static',
    data: rateCardJson,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  };
}

export function getActiveRateCardData(): RateCardData {
  return getActiveRateCard().data;
}

export function createRateCard(input: { name: string; version: string; data: RateCardData; isActive?: boolean }) {
  const timestamp = now();
  if (input.isActive) db.prepare('UPDATE rate_cards SET is_active = 0, updated_at = ?').run(timestamp);
  const id = randomUUID();
  db.prepare(`
    INSERT INTO rate_cards (id, name, version, data_json, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.name.trim(), input.version.trim(), JSON.stringify(input.data), input.isActive ? 1 : 0, timestamp, timestamp);
  return getRateCard(id);
}

export function updateRateCard(id: string, input: { name: string; version: string; data: RateCardData; isActive?: boolean }) {
  const timestamp = now();
  if (input.isActive) db.prepare('UPDATE rate_cards SET is_active = 0, updated_at = ? WHERE id <> ?').run(timestamp, id);
  db.prepare(`
    UPDATE rate_cards
    SET name = ?, version = ?, data_json = ?, is_active = ?, updated_at = ?
    WHERE id = ?
  `).run(input.name.trim(), input.version.trim(), JSON.stringify(input.data), input.isActive ? 1 : 0, timestamp, id);
  return getRateCard(id);
}

export function activateRateCard(id: string) {
  const timestamp = now();
  db.prepare('UPDATE rate_cards SET is_active = 0, updated_at = ?').run(timestamp);
  db.prepare('UPDATE rate_cards SET is_active = 1, updated_at = ? WHERE id = ?').run(timestamp, id);
  return getRateCard(id);
}

export function deleteRateCard(id: string) {
  const card = getRateCard(id);
  if (!card) return false;
  if (card.isActive) throw new Error('Activate another rate card before deleting this one.');
  return db.prepare('DELETE FROM rate_cards WHERE id = ?').run(id).changes > 0;
}

export function getRateCard(id: string): RateCardRecord | null {
  const row = db.prepare('SELECT * FROM rate_cards WHERE id = ?').get(id);
  return row ? serializeRateCard(row) : null;
}
