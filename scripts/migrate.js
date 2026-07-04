/**
 * Creates all tables in Turso database
 * Run: node scripts/migrate.js
 */
import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.+)$`, 'm'))
  return match ? match[1].trim() : process.env[key]
}

const url   = getEnv('TURSO_DATABASE_URL')
const token = getEnv('TURSO_AUTH_TOKEN')

if (!url || !token) {
  console.error('❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local')
  process.exit(1)
}

const db = createClient({ url, authToken: token })

const tables = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    avatar TEXT,
    bio TEXT DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    category_id TEXT NOT NULL DEFAULT '1',
    stock INTEGER NOT NULL DEFAULT 0,
    sku TEXT,
    images TEXT DEFAULT '[]',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS product_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    tags TEXT DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'published',
    user_id TEXT NOT NULL DEFAULT '1',
    cover_image TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    student_id TEXT DEFAULT '',
    name TEXT NOT NULL,
    gender TEXT DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    genre TEXT DEFAULT '[]',
    year INTEGER,
    rating REAL,
    director TEXT DEFAULT '',
    cast TEXT DEFAULT '[]',
    duration INTEGER,
    language TEXT DEFAULT 'English',
    poster TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT DEFAULT '',
    genre TEXT DEFAULT 'General',
    description TEXT DEFAULT '',
    year INTEGER,
    pages INTEGER,
    rating REAL,
    publisher TEXT DEFAULT '',
    language TEXT DEFAULT 'English',
    cover TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS countries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    capital TEXT DEFAULT '',
    region TEXT DEFAULT '',
    population INTEGER DEFAULT 0,
    area REAL DEFAULT 0,
    currency TEXT DEFAULT '',
    language TEXT DEFAULT '',
    flag TEXT DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    completed INTEGER NOT NULL DEFAULT 0,
    due_date TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    ingredients TEXT DEFAULT '[]',
    steps TEXT DEFAULT '[]',
    category TEXT DEFAULT 'Other',
    prep_time INTEGER DEFAULT 0,
    cook_time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    difficulty TEXT DEFAULT 'easy',
    calories INTEGER DEFAULT 0,
    tags TEXT DEFAULT '[]',
    image TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS animals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    scientific_name TEXT DEFAULT '',
    category TEXT DEFAULT 'Mammal',
    habitat TEXT DEFAULT '',
    diet TEXT DEFAULT 'Omnivore',
    lifespan INTEGER,
    weight TEXT DEFAULT '',
    length TEXT DEFAULT '',
    conservation_status TEXT DEFAULT 'Least Concern',
    description TEXT DEFAULT '',
    image TEXT,
    created_at TEXT NOT NULL
  )`,
]

console.log('🔄 Creating tables...')
for (const sql of tables) {
  const name = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1]
  await db.execute(sql)
  console.log(`  ✓ ${name}`)
}
console.log('✅ Migration complete')
