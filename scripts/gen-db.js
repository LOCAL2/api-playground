/**
 * Script to generate seed data for db.js
 * Run: node scripts/gen-db.js
 * Output: api/_lib/db.js
 */

import { writeFileSync } from 'fs'
import { createHash } from 'crypto'

// ── helpers ────────────────────────────────────────────────────────────────
const bcryptHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // "password"
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const dateStr = (daysAgo) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

// ── USERS (50) ─────────────────────────────────────────────────────────────
const firstNames = ['Alice','Bob','Carol','David','Emma','Frank','Grace','Henry','Iris','James','Karen','Leo','Mia','Noah','Olivia','Paul','Quinn','Rose','Sam','Tina','Uma','Victor','Wendy','Xander','Yara','Zoe','Anon','Beth','Chris','Diana','Ethan','Fiona','George','Hannah','Ivan','Julia','Kevin','Laura','Mike','Nancy','Oscar','Patricia','Ray','Sandra','Tom','Ursula','Vince','Wanda','Xavier','Yasmin']
const lastNames  = ['Johnson','Smith','White','Brown','Davis','Wilson','Taylor','Anderson','Thomas','Jackson','Harris','Martin','Thompson','Garcia','Martinez','Robinson','Clark','Lewis','Lee','Walker','Hall','Allen','Young','King','Wright','Scott','Green','Adams','Baker','Nelson','Carter','Mitchell','Perez','Roberts','Turner','Phillips','Campbell','Parker','Evans','Edwards','Collins','Stewart','Sanchez','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy']
const roles = ['user','user','user','user','admin']

const users = firstNames.map((fn, i) => ({
  id: String(i + 1),
  name: `${fn} ${lastNames[i]}`,
  email: `${fn.toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
  password: bcryptHash,
  role: i < 3 ? 'admin' : 'user',
  avatar: `https://i.pravatar.cc/150?u=${fn.toLowerCase()}${i}`,
  bio: rand(['Developer','Designer','Teacher','Student','Manager','Freelancer','Engineer','Analyst','']),
  createdAt: dateStr(randInt(10, 365)),
}))

// ── PRODUCTS (60) ──────────────────────────────────────────────────────────
const productNames = [
  'Wireless Headphones','Mechanical Keyboard','Gaming Mouse','USB-C Hub','Webcam HD 1080p',
  'Standing Desk','Monitor 27"','Laptop Stand','Cable Management Kit','LED Desk Lamp',
  'Noise Cancelling Earbuds','Bluetooth Speaker','Smart Watch','Fitness Tracker','Phone Stand',
  'Microphone USB','Ring Light','Green Screen','Capture Card','Stream Deck',
  'Ergonomic Chair','Wrist Rest','Mouse Pad XL','Monitor Arm','Keyboard Tray',
  'Portable SSD 1TB','Flash Drive 64GB','SD Card 128GB','Card Reader','Docking Station',
  'HDMI Cable 2m','Ethernet Cable 5m','Power Strip','Extension Cord','Surge Protector',
  'Laptop Bag','Backpack Tech','Sleeve Case','Hard Case','Cable Organizer',
  'Clean Code (Book)','The Pragmatic Programmer','Design Patterns','Learning React','You Don\'t Know JS',
  'Eloquent JavaScript','TypeScript Handbook','Node.js Design Patterns','REST API Design','HTTP: The Definitive Guide',
  'Webcam Cover','Privacy Screen','Blue Light Glasses','Laptop Cooling Pad','Screen Cleaner Kit',
  'Desk Organizer','Sticky Notes Pack','Whiteboard Markers','A4 Notebook','Pen Set',
]
const productDescs = [
  'Premium quality product for professionals',
  'Perfect for students and developers',
  'Ergonomic design for long working hours',
  'High performance, great value',
  'Top-rated by our customers',
  'Essential tool for your workspace',
  'Lightweight and portable',
  'Built to last, easy to use',
]

const products = productNames.map((name, i) => ({
  id: String(i + 1),
  name,
  description: rand(productDescs),
  price: Math.round(randInt(50, 5000) * 0.99 * 100) / 100,
  categoryId: String(randInt(1, 3)),
  stock: randInt(0, 200),
  sku: `SKU-${String(i + 1).padStart(3, '0')}`,
  images: [`https://picsum.photos/seed/${createHash('md5').update(name).digest('hex').slice(0,6)}/400/300`],
  createdAt: dateStr(randInt(1, 300)),
}))

// ── POSTS (60) ─────────────────────────────────────────────────────────────
const postTitles = [
  'Introduction to REST APIs','HTTP Methods Explained','Understanding Status Codes',
  'What is JSON?','How to Use Postman','API Authentication Basics',
  'GET vs POST: What\'s the Difference?','URL Parameters vs Query Strings','Request Headers Explained',
  'Response Body and Content-Type','Pagination in REST APIs','Filtering and Sorting Data',
  'CRUD Operations with REST','Building Your First API Client','Error Handling in APIs',
  'What is a Base URL?','Path Parameters Explained','Bearer Token Authentication',
  'JSON vs XML','API Rate Limiting','Versioning Your API',
  'Using curl to Test APIs','Postman Collections Guide','Environment Variables in Postman',
  'Testing APIs with Automated Tests','Mock Servers and API Testing','API Documentation Best Practices',
  'OpenAPI and Swagger Overview','REST vs GraphQL','Webhooks Explained',
  'What is CORS?','Same-Origin Policy','Preflight Requests',
  'Caching in REST APIs','ETags and Conditional Requests','Compression in HTTP',
  'HTTP/2 vs HTTP/1.1','HTTPS and TLS Basics','SSL Certificates Explained',
  'What is a Serverless Function?','Deploying APIs to Vercel','Environment Variables in Node.js',
  'Middleware in Express.js','Routing in REST APIs','Data Validation Best Practices',
  'Input Sanitization','SQL Injection Prevention','XSS and API Security',
  'OWASP Top 10 for APIs','API Gateway Pattern',
  'Microservices vs Monolith','Service Discovery','Load Balancing Basics',
  'Database Design for APIs','NoSQL vs SQL','Indexing for Performance',
  'Caching with Redis','Message Queues','Event-Driven Architecture',
  'Docker for Developers','CI/CD Pipeline Basics',
]
const tagPool = [
  ['api','rest','tutorial'],['http','methods'],['json','data'],['postman','testing'],
  ['auth','security'],['pagination','query'],['crud','operations'],['headers','request'],
  ['cors','browser'],['node','javascript'],['express','middleware'],['database','sql'],
  ['docker','devops'],['cache','performance'],['graphql','api'],
]

const posts = postTitles.map((title, i) => ({
  id: String(i + 1),
  title,
  content: `${title} is an important concept in web development. In this post, we explore the fundamentals and practical applications. Understanding this topic will help you build better APIs and become a more effective developer. We cover real-world examples, common pitfalls, and best practices used in the industry today.`,
  excerpt: `Learn about ${title.toLowerCase()} with practical examples.`,
  tags: rand(tagPool),
  status: 'published',
  userId: String(randInt(1, users.length)),
  coverImage: `https://picsum.photos/seed/post${i + 1}/800/400`,
  createdAt: dateStr(randInt(1, 200)),
}))

// ── OUTPUT ─────────────────────────────────────────────────────────────────
const output = `/**
 * In-memory "database" for the API Playground backend
 * Data resets on each cold start (Vercel serverless)
 * Generated by scripts/gen-db.js — do not edit manually
 *
 * Users:    ${users.length}
 * Products: ${products.length}
 * Posts:    ${posts.length}
 */

// ── Users ──────────────────────────────────────────────────────────────────
// password for all seed users is: "password"
export let users = ${JSON.stringify(users, null, 2)}

// ── Products ───────────────────────────────────────────────────────────────
export let products = ${JSON.stringify(products, null, 2)}

// ── Categories ────────────────────────────────────────────────────────────
export let categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', parentId: null },
  { id: '2', name: 'Books',       slug: 'books',       description: 'Technical and educational books',    parentId: null },
  { id: '3', name: 'Accessories', slug: 'accessories', description: 'Workspace accessories and tools',    parentId: null },
]

// ── Posts ─────────────────────────────────────────────────────────────────
export let posts = ${JSON.stringify(posts, null, 2)}

// ── Refresh tokens store ──────────────────────────────────────────────────
export let refreshTokens = new Set()

// ── ID counter helper ─────────────────────────────────────────────────────
export function nextId(arr) {
  return String(Math.max(0, ...arr.map(i => Number(i.id))) + 1)
}
`

writeFileSync('api/_lib/db.js', output, 'utf8')
console.log(`✓ Generated:`)
console.log(`  - ${users.length} users`)
console.log(`  - ${products.length} products`)
console.log(`  - ${posts.length} posts`)
console.log(`  → api/_lib/db.js`)
