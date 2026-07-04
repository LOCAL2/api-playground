/**
 * Reset a single table back to seed data
 * Usage: node scripts/seed-table.js <tableName>
 * Example: node scripts/seed-table.js students
 */
import { createClient } from '@libsql/client'
import { readFileSync, existsSync } from 'fs'

// Read env from .env.local or process.env
let TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL
let TURSO_AUTH_TOKEN   = process.env.TURSO_AUTH_TOKEN

const envPath = existsSync('.env.local') ? '.env.local' : '/var/task/.env.local'
if (existsSync(envPath)) {
  const env = readFileSync(envPath, 'utf8')
  const getEnv = (key) => { const m = env.match(new RegExp(`^${key}=(.+)$`, 'm')); return m ? m[1].trim() : null }
  TURSO_DATABASE_URL = TURSO_DATABASE_URL || getEnv('TURSO_DATABASE_URL')
  TURSO_AUTH_TOKEN   = TURSO_AUTH_TOKEN   || getEnv('TURSO_AUTH_TOKEN')
}

const db = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN })
const tableName = process.argv[2]

if (!tableName) { console.error('Usage: node seed-table.js <tableName>'); process.exit(1) }

// Import seed data
import {
  users, products, categories, posts, students,
  movies, books, countries, recipes, animals,
} from '../api/_lib/db.js'

const todos = [
  { id: '1', title: 'ทดสอบ GET /api/todos', description: 'ลองดึงรายการ todo ทั้งหมด', priority: 'high', completed: false, dueDate: null, createdAt: new Date().toISOString() },
  { id: '2', title: 'ทดสอบ POST /api/todos', description: 'ลองสร้าง todo ใหม่', priority: 'high', completed: false, dueDate: null, createdAt: new Date().toISOString() },
  { id: '3', title: 'ทดสอบ PATCH toggle', description: 'ลอง toggle สถานะ todo', priority: 'medium', completed: true, dueDate: null, createdAt: new Date().toISOString() },
  { id: '4', title: 'ทดสอบ DELETE /api/todos/:id', description: null, priority: 'low', completed: false, dueDate: null, createdAt: new Date().toISOString() },
  { id: '5', title: 'เรียน REST API', description: 'ศึกษา HTTP Methods ครบ 5 ตัว', priority: 'high', completed: true, dueDate: '2025-12-31', createdAt: new Date().toISOString() },
  { id: '6', title: 'ทำรายงาน Web Dev', description: 'สรุปเนื้อหา Chapter 5-7', priority: 'medium', completed: false, dueDate: '2025-12-15', createdAt: new Date().toISOString() },
  { id: '7', title: 'ส่งการบ้าน Postman', description: null, priority: 'high', completed: false, dueDate: null, createdAt: new Date().toISOString() },
  { id: '8', title: 'อ่านหนังสือ Clean Code', description: 'บทที่ 1-3', priority: 'low', completed: false, dueDate: null, createdAt: new Date().toISOString() },
  { id: '9', title: 'ติดตั้ง Node.js และ Bun', description: null, priority: 'medium', completed: true, dueDate: null, createdAt: new Date().toISOString() },
  { id: '10', title: 'Deploy ขึ้น Vercel', description: 'ทดสอบหลัง deploy', priority: 'medium', completed: true, dueDate: null, createdAt: new Date().toISOString() },
]

const seeders = {
  async users() {
    await db.execute('DELETE FROM users')
    for (const u of users) {
      await db.execute({ sql: 'INSERT INTO users (id,name,email,password,role,avatar,bio,created_at) VALUES (?,?,?,?,?,?,?,?)', args: [u.id,u.name,u.email,u.password,u.role,u.avatar||'',u.bio||'',u.createdAt] })
    }
    return users.length
  },
  async products() {
    await db.execute('DELETE FROM products')
    for (const p of products) {
      await db.execute({ sql: 'INSERT INTO products (id,name,description,price,category_id,stock,sku,images,created_at) VALUES (?,?,?,?,?,?,?,?,?)', args: [p.id,p.name,p.description||'',p.price,p.categoryId||'1',p.stock||0,p.sku||'',JSON.stringify(p.images||[]),p.createdAt] })
    }
    return products.length
  },
  async posts() {
    await db.execute('DELETE FROM posts')
    for (const p of posts) {
      await db.execute({ sql: 'INSERT INTO posts (id,title,content,excerpt,tags,status,user_id,cover_image,created_at) VALUES (?,?,?,?,?,?,?,?,?)', args: [p.id,p.title,p.content,p.excerpt||'',JSON.stringify(p.tags||[]),p.status||'published',p.userId||'1',p.coverImage||'',p.createdAt] })
    }
    return posts.length
  },
  async students() {
    await db.execute('DELETE FROM students')
    for (const s of students) {
      await db.execute({ sql: 'INSERT INTO students (id,student_id,name,gender,created_at) VALUES (?,?,?,?,?)', args: [s.id,s.studentId||'',s.name,s.gender||'',s.createdAt] })
    }
    return students.length
  },
  async movies() {
    await db.execute('DELETE FROM movies')
    for (const m of movies) {
      await db.execute({ sql: 'INSERT INTO movies (id,title,description,genre,year,rating,director,cast,duration,language,poster,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', args: [m.id,m.title,m.description||'',JSON.stringify(m.genre||[]),m.year||null,m.rating||null,m.director||'',JSON.stringify(m.cast||[]),m.duration||null,m.language||'English',m.poster||'',m.createdAt] })
    }
    return movies.length
  },
  async books() {
    await db.execute('DELETE FROM books')
    for (const b of books) {
      await db.execute({ sql: 'INSERT INTO books (id,title,author,isbn,genre,description,year,pages,rating,publisher,language,cover,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', args: [b.id,b.title,b.author,b.isbn||'',b.genre||'General',b.description||'',b.year||null,b.pages||null,b.rating||null,b.publisher||'',b.language||'English',b.cover||'',b.createdAt] })
    }
    return books.length
  },
  async countries() {
    await db.execute('DELETE FROM countries')
    for (const c of countries) {
      await db.execute({ sql: 'INSERT INTO countries (id,name,code,capital,region,population,area,currency,language,flag) VALUES (?,?,?,?,?,?,?,?,?,?)', args: [c.id,c.name,c.code,c.capital||'',c.region||'',c.population||0,c.area||0,c.currency||'',c.language||'',c.flag||''] })
    }
    return countries.length
  },
  async todos() {
    await db.execute('DELETE FROM todos')
    for (const t of todos) {
      await db.execute({ sql: 'INSERT INTO todos (id,title,description,priority,completed,due_date,created_at) VALUES (?,?,?,?,?,?,?)', args: [t.id,t.title,t.description||null,t.priority||'medium',t.completed?1:0,t.dueDate||null,t.createdAt] })
    }
    return todos.length
  },
  async recipes() {
    await db.execute('DELETE FROM recipes')
    for (const r of recipes) {
      await db.execute({ sql: 'INSERT INTO recipes (id,title,description,ingredients,steps,category,prep_time,cook_time,servings,difficulty,calories,tags,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', args: [r.id,r.title,r.description||'',JSON.stringify(r.ingredients||[]),JSON.stringify(r.steps||[]),r.category||'Other',r.prepTime||0,r.cookTime||0,r.servings||1,r.difficulty||'easy',r.calories||0,JSON.stringify(r.tags||[]),r.image||'',r.createdAt] })
    }
    return recipes.length
  },
  async animals() {
    await db.execute('DELETE FROM animals')
    for (const a of animals) {
      await db.execute({ sql: 'INSERT INTO animals (id,name,scientific_name,category,habitat,diet,lifespan,weight,length,conservation_status,description,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', args: [a.id,a.name,a.scientificName||'',a.category||'Mammal',a.habitat||'',a.diet||'Omnivore',a.lifespan||null,a.weight||'',a.length||'',a.conservationStatus||'Least Concern',a.description||'',a.image||'',a.createdAt] })
    }
    return animals.length
  },
}

if (!seeders[tableName]) { console.error(`Unknown table: ${tableName}`); process.exit(1) }

const count = await seeders[tableName]()
console.log(`✓ reset ${tableName} (${count} rows)`)
