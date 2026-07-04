/**
 * Seeds all data from db.js into Turso database
 * Run AFTER migrate.js: node scripts/seed.js
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

// Import seed data
import {
  users, products, categories, posts, students,
  movies, books, countries, todos, recipes, animals,
} from '../api/_lib/db.js'

async function seed() {
  console.log('🌱 Seeding database...\n')

  // Clear all tables first
  const tables = ['users','products','product_categories','posts','students','movies','books','countries','todos','recipes','animals']
  for (const t of tables) {
    await db.execute(`DELETE FROM ${t}`)
  }
  console.log('🗑  Cleared all tables')

  // ── Users ──────────────────────────────────────────────────────────────
  for (const u of users) {
    await db.execute({
      sql: `INSERT INTO users (id,name,email,password,role,avatar,bio,created_at) VALUES (?,?,?,?,?,?,?,?)`,
      args: [u.id, u.name, u.email, u.password, u.role, u.avatar||'', u.bio||'', u.createdAt],
    })
  }
  console.log(`  ✓ users (${users.length})`)

  // ── Product Categories ─────────────────────────────────────────────────
  for (const c of categories) {
    await db.execute({
      sql: `INSERT INTO product_categories (id,name,slug,description,parent_id) VALUES (?,?,?,?,?)`,
      args: [c.id, c.name, c.slug, c.description||null, c.parentId||null],
    })
  }
  console.log(`  ✓ product_categories (${categories.length})`)

  // ── Products ───────────────────────────────────────────────────────────
  for (const p of products) {
    await db.execute({
      sql: `INSERT INTO products (id,name,description,price,category_id,stock,sku,images,created_at) VALUES (?,?,?,?,?,?,?,?,?)`,
      args: [p.id, p.name, p.description||'', p.price, p.categoryId||'1', p.stock||0, p.sku||'', JSON.stringify(p.images||[]), p.createdAt],
    })
  }
  console.log(`  ✓ products (${products.length})`)

  // ── Posts ──────────────────────────────────────────────────────────────
  for (const p of posts) {
    await db.execute({
      sql: `INSERT INTO posts (id,title,content,excerpt,tags,status,user_id,cover_image,created_at) VALUES (?,?,?,?,?,?,?,?,?)`,
      args: [p.id, p.title, p.content, p.excerpt||'', JSON.stringify(p.tags||[]), p.status||'published', p.userId||'1', p.coverImage||'', p.createdAt],
    })
  }
  console.log(`  ✓ posts (${posts.length})`)

  // ── Students ───────────────────────────────────────────────────────────
  for (const s of students) {
    await db.execute({
      sql: `INSERT INTO students (id,student_id,name,gender,created_at) VALUES (?,?,?,?,?)`,
      args: [s.id, s.studentId||'', s.name, s.gender||'', s.createdAt],
    })
  }
  console.log(`  ✓ students (${students.length})`)

  // ── Movies ─────────────────────────────────────────────────────────────
  for (const m of movies) {
    await db.execute({
      sql: `INSERT INTO movies (id,title,description,genre,year,rating,director,cast,duration,language,poster,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [m.id, m.title, m.description||'', JSON.stringify(m.genre||[]), m.year||null, m.rating||null, m.director||'', JSON.stringify(m.cast||[]), m.duration||null, m.language||'English', m.poster||'', m.createdAt],
    })
  }
  console.log(`  ✓ movies (${movies.length})`)

  // ── Books ──────────────────────────────────────────────────────────────
  for (const b of books) {
    await db.execute({
      sql: `INSERT INTO books (id,title,author,isbn,genre,description,year,pages,rating,publisher,language,cover,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [b.id, b.title, b.author, b.isbn||'', b.genre||'General', b.description||'', b.year||null, b.pages||null, b.rating||null, b.publisher||'', b.language||'English', b.cover||'', b.createdAt],
    })
  }
  console.log(`  ✓ books (${books.length})`)

  // ── Countries ──────────────────────────────────────────────────────────
  for (const c of countries) {
    await db.execute({
      sql: `INSERT INTO countries (id,name,code,capital,region,population,area,currency,language,flag) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      args: [c.id, c.name, c.code, c.capital||'', c.region||'', c.population||0, c.area||0, c.currency||'', c.language||'', c.flag||''],
    })
  }
  console.log(`  ✓ countries (${countries.length})`)

  // ── Todos ──────────────────────────────────────────────────────────────
  for (const t of todos) {
    await db.execute({
      sql: `INSERT INTO todos (id,title,description,priority,completed,due_date,created_at) VALUES (?,?,?,?,?,?,?)`,
      args: [t.id, t.title, t.description||null, t.priority||'medium', t.completed?1:0, t.dueDate||null, t.createdAt],
    })
  }
  console.log(`  ✓ todos (${todos.length})`)

  // ── Recipes ────────────────────────────────────────────────────────────
  for (const r of recipes) {
    await db.execute({
      sql: `INSERT INTO recipes (id,title,description,ingredients,steps,category,prep_time,cook_time,servings,difficulty,calories,tags,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [r.id, r.title, r.description||'', JSON.stringify(r.ingredients||[]), JSON.stringify(r.steps||[]), r.category||'Other', r.prepTime||0, r.cookTime||0, r.servings||1, r.difficulty||'easy', r.calories||0, JSON.stringify(r.tags||[]), r.image||'', r.createdAt],
    })
  }
  console.log(`  ✓ recipes (${recipes.length})`)

  // ── Animals ────────────────────────────────────────────────────────────
  for (const a of animals) {
    await db.execute({
      sql: `INSERT INTO animals (id,name,scientific_name,category,habitat,diet,lifespan,weight,length,conservation_status,description,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [a.id, a.name, a.scientificName||'', a.category||'Mammal', a.habitat||'', a.diet||'Omnivore', a.lifespan||null, a.weight||'', a.length||'', a.conservationStatus||'Least Concern', a.description||'', a.image||'', a.createdAt],
    })
  }
  console.log(`  ✓ animals (${animals.length})`)

  console.log('\n✅ Seed complete!')
}

seed().catch(e => { console.error('❌', e); process.exit(1) })
