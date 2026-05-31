import fs from 'node:fs';
import path from 'node:path';

type SqliteDatabase = {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    get: (...params: unknown[]) => any;
    all: (...params: unknown[]) => any[];
    run: (...params: unknown[]) => { changes: number; lastInsertRowid: number | bigint };
  };
};

let DatabaseSync: (new (filename: string) => SqliteDatabase) | null = null;

try {
  DatabaseSync = (require('node:sqlite') as {
    DatabaseSync: new (filename: string) => SqliteDatabase;
  }).DatabaseSync;
} catch {
  DatabaseSync = null;
}

function createEphemeralDb(): SqliteDatabase {
  const emptyStatement = {
    get: () => undefined,
    all: () => [],
    run: () => ({ changes: 0, lastInsertRowid: 0 }),
  };

  return {
    exec: () => undefined,
    prepare: () => emptyStatement,
  };
}

const dataDir = path.join(process.cwd(), 'data');
const isServerlessRuntime =
  process.env.NETLIFY === 'true' ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.NEXT_RUNTIME);
const useMemoryDb = process.env.OPERON_KITCHENS_BUILD_DB === 'memory' || isServerlessRuntime;
const dbPath = useMemoryDb ? ':memory:' : path.join(dataDir, 'operon-kitchens.sqlite');

if (!useMemoryDb) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const globalForDb = globalThis as unknown as {
  operonKitchenDb?: SqliteDatabase;
};

export const db = globalForDb.operonKitchenDb ?? (DatabaseSync ? new DatabaseSync(dbPath) : createEphemeralDb());

db.exec('PRAGMA foreign_keys = ON;');
if (!useMemoryDb) {
  db.exec('PRAGMA journal_mode = WAL;');
}
db.exec('PRAGMA busy_timeout = 5000;');
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    marketing_opt_in INTEGER NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'quote_wizard',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    lead_id TEXT,
    status TEXT NOT NULL DEFAULT 'SUBMITTED',
    input_json TEXT NOT NULL,
    pricing_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    margin REAL NOT NULL,
    contingency REAL NOT NULL,
    gst REAL NOT NULL,
    total REAL NOT NULL,
    confidence_score INTEGER NOT NULL,
    confidence_level TEXT NOT NULL,
    assumptions_json TEXT NOT NULL,
    exclusions_json TEXT NOT NULL,
    flags_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS quote_items (
    id TEXT PRIMARY KEY,
    quote_id TEXT NOT NULL,
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS rate_cards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    data_json TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (name, version)
  );

  CREATE TABLE IF NOT EXISTS kitchen_product_categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    details_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kitchen_glossary_terms (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kitchen_guides (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kitchen_locations (
    id TEXT PRIMARY KEY,
    region TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    notes TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kitchen_faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_quotes_lead_id ON quotes(lead_id);
  CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
  CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);
  CREATE INDEX IF NOT EXISTS idx_rate_cards_is_active ON rate_cards(is_active);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_kitchen_product_categories_status ON kitchen_product_categories(status);
  CREATE INDEX IF NOT EXISTS idx_kitchen_glossary_terms_status ON kitchen_glossary_terms(status);
  CREATE INDEX IF NOT EXISTS idx_kitchen_guides_status ON kitchen_guides(status);
  CREATE INDEX IF NOT EXISTS idx_kitchen_locations_status ON kitchen_locations(status);
  CREATE INDEX IF NOT EXISTS idx_kitchen_faqs_status ON kitchen_faqs(status);
  CREATE INDEX IF NOT EXISTS idx_kitchen_faqs_category ON kitchen_faqs(category);
`);

if (process.env.NODE_ENV !== 'production' && !useMemoryDb) {
  globalForDb.operonKitchenDb = db;
}
