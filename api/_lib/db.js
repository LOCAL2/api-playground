/**
 * In-memory "database" for the API Playground backend
 * Data resets on each cold start (Vercel serverless)
 * Good enough for learning/demo purposes
 */

// ── Users ──────────────────────────────────────────────────────────────────
export let users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=alice', bio: 'Admin user', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Bob Smith',    email: 'bob@example.com',   password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'user',  avatar: 'https://i.pravatar.cc/150?u=bob',   bio: 'Regular user', createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', name: 'Carol White',  email: 'carol@example.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'user',  avatar: 'https://i.pravatar.cc/150?u=carol', bio: 'Teacher',      createdAt: '2024-01-03T00:00:00Z' },
]
// password for all seed users is: "password"

// ── Products ───────────────────────────────────────────────────────────────
export let products = [
  { id: '1', name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 99.99,  categoryId: '1', stock: 50,  sku: 'WH-001', images: ['https://picsum.photos/seed/wh/400/300'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard',              price: 149.99, categoryId: '1', stock: 30,  sku: 'KB-001', images: ['https://picsum.photos/seed/kb/400/300'], createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', name: 'Clean Code (Book)',   description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin', price: 35.00, categoryId: '2', stock: 100, sku: 'BK-001', images: ['https://picsum.photos/seed/cc/400/300'], createdAt: '2024-01-03T00:00:00Z' },
  { id: '4', name: 'REST API Design',     description: 'RESTful Web API Design best practices', price: 29.99, categoryId: '2', stock: 80,  sku: 'BK-002', images: ['https://picsum.photos/seed/ra/400/300'], createdAt: '2024-01-04T00:00:00Z' },
]

// ── Categories ────────────────────────────────────────────────────────────
export let categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', parentId: null },
  { id: '2', name: 'Books',       slug: 'books',       description: 'Technical and educational books',    parentId: null },
  { id: '3', name: 'Phones',      slug: 'phones',      description: 'Smartphones and accessories',        parentId: '1' },
]

// ── Posts ─────────────────────────────────────────────────────────────────
export let posts = [
  { id: '1', title: 'Introduction to REST APIs', content: 'REST (Representational State Transfer) is an architectural style for building web services...', excerpt: 'Learn the basics of REST APIs', tags: ['api', 'rest', 'tutorial'], status: 'published', userId: '1', coverImage: 'https://picsum.photos/seed/rest/800/400', createdAt: '2024-01-10T00:00:00Z' },
  { id: '2', title: 'HTTP Methods Explained',    content: 'HTTP defines a set of request methods to indicate the desired action...', excerpt: 'GET, POST, PUT, PATCH, DELETE explained', tags: ['http', 'methods'], status: 'published', userId: '1', coverImage: 'https://picsum.photos/seed/http/800/400', createdAt: '2024-01-11T00:00:00Z' },
  { id: '3', title: 'Draft: JWT Authentication', content: 'JSON Web Tokens are an open standard (RFC 7519)...', excerpt: 'Work in progress', tags: ['jwt', 'auth'], status: 'draft', userId: '2', coverImage: null, createdAt: '2024-01-12T00:00:00Z' },
]

// ── Comments ──────────────────────────────────────────────────────────────
export let comments = [
  { id: '1', postId: '1', userId: '2', content: 'Great introduction!',          parentId: null, createdAt: '2024-01-11T08:00:00Z' },
  { id: '2', postId: '1', userId: '3', content: 'Very helpful, thank you!',     parentId: null, createdAt: '2024-01-11T09:00:00Z' },
  { id: '3', postId: '1', userId: '1', content: 'Glad it helped!', parentId: '2', createdAt: '2024-01-11T10:00:00Z' },
  { id: '4', postId: '2', userId: '3', content: 'Good explanation of methods.', parentId: null, createdAt: '2024-01-12T07:00:00Z' },
]

// ── Todos ─────────────────────────────────────────────────────────────────
export let todos = [
  { id: '1', userId: '2', title: 'Read REST API chapter',    description: null,                  priority: 'high',   completed: false, dueDate: '2025-12-31T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', userId: '2', title: 'Setup Postman',            description: 'Install and configure', priority: 'medium', completed: true,  dueDate: null,                  createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', userId: '3', title: 'Prepare lecture slides',   description: null,                  priority: 'high',   completed: false, dueDate: '2025-11-01T00:00:00Z', createdAt: '2024-01-03T00:00:00Z' },
]

// ── Orders ────────────────────────────────────────────────────────────────
export let orders = [
  { id: '1', userId: '2', items: [{ productId: '1', quantity: 1, price: 99.99 }],  total: 99.99,  status: 'delivered', trackingNumber: 'TRK001', createdAt: '2024-02-01T00:00:00Z' },
  { id: '2', userId: '2', items: [{ productId: '2', quantity: 2, price: 149.99 }], total: 299.98, status: 'shipped',   trackingNumber: 'TRK002', createdAt: '2024-02-10T00:00:00Z' },
  { id: '3', userId: '3', items: [{ productId: '3', quantity: 1, price: 35.00 }],  total: 35.00,  status: 'pending',   trackingNumber: null,     createdAt: '2024-02-15T00:00:00Z' },
]

// ── Countries (static) ────────────────────────────────────────────────────
export const countries = [
  { code: 'TH', name: 'Thailand',      region: 'Asia',    capital: 'Bangkok',    currency: 'THB', population: 71601103 },
  { code: 'US', name: 'United States', region: 'Americas',capital: 'Washington', currency: 'USD', population: 331002651 },
  { code: 'JP', name: 'Japan',         region: 'Asia',    capital: 'Tokyo',      currency: 'JPY', population: 126476461 },
  { code: 'GB', name: 'United Kingdom',region: 'Europe',  capital: 'London',     currency: 'GBP', population: 67886011 },
  { code: 'DE', name: 'Germany',       region: 'Europe',  capital: 'Berlin',     currency: 'EUR', population: 83783942 },
  { code: 'FR', name: 'France',        region: 'Europe',  capital: 'Paris',      currency: 'EUR', population: 65273511 },
  { code: 'CN', name: 'China',         region: 'Asia',    capital: 'Beijing',    currency: 'CNY', population: 1439323776 },
  { code: 'IN', name: 'India',         region: 'Asia',    capital: 'New Delhi',  currency: 'INR', population: 1380004385 },
  { code: 'BR', name: 'Brazil',        region: 'Americas',capital: 'Brasília',   currency: 'BRL', population: 212559417 },
  { code: 'AU', name: 'Australia',     region: 'Oceania', capital: 'Canberra',   currency: 'AUD', population: 25499884 },
]

// ── Sports ────────────────────────────────────────────────────────────────
export const teams = [
  { id: '1', name: 'Manchester United', sport: 'football', country: 'GB', league: 'Premier League', founded: 1878 },
  { id: '2', name: 'FC Barcelona',      sport: 'football', country: 'ES', league: 'La Liga',         founded: 1899 },
  { id: '3', name: 'LA Lakers',         sport: 'basketball', country: 'US', league: 'NBA',           founded: 1947 },
  { id: '4', name: 'Bangkok United',    sport: 'football', country: 'TH', league: 'Thai League 1',  founded: 2005 },
]

export const players = [
  { id: '1', name: 'Marcus Rashford', teamId: '1', position: 'Forward',  nationality: 'GB', age: 27, stats: { goals: 30, assists: 12 } },
  { id: '2', name: 'LeBron James',    teamId: '3', position: 'Forward',  nationality: 'US', age: 40, stats: { points: 27.1, rebounds: 7.5, assists: 8.3 } },
]

// ── Movies ────────────────────────────────────────────────────────────────
export const movies = [
  { id: '1', title: 'Inception',       year: 2010, genre: ['Sci-Fi', 'Thriller'], rating: 8.8, director: 'Christopher Nolan', duration: 148 },
  { id: '2', title: 'The Dark Knight', year: 2008, genre: ['Action', 'Drama'],    rating: 9.0, director: 'Christopher Nolan', duration: 152 },
  { id: '3', title: 'Interstellar',    year: 2014, genre: ['Sci-Fi', 'Drama'],    rating: 8.6, director: 'Christopher Nolan', duration: 169 },
  { id: '4', title: 'Avengers: Endgame', year: 2019, genre: ['Action', 'Sci-Fi'],rating: 8.4, director: 'Anthony Russo',     duration: 181 },
  { id: '5', title: 'Your Name',       year: 2016, genre: ['Animation', 'Romance'], rating: 8.4, director: 'Makoto Shinkai', duration: 106 },
]

// ── Books ─────────────────────────────────────────────────────────────────
export const books = [
  { id: '1', isbn: '9780132350884', title: 'Clean Code',              author: 'Robert C. Martin', genre: 'Technology', year: 2008, rating: 4.4, pages: 431 },
  { id: '2', isbn: '9780201633610', title: 'Design Patterns',         author: 'Gang of Four',     genre: 'Technology', year: 1994, rating: 4.2, pages: 395 },
  { id: '3', isbn: '9781491950296', title: 'Learning React',          author: 'Alex Banks',       genre: 'Technology', year: 2020, rating: 4.1, pages: 350 },
  { id: '4', isbn: '9780061965784', title: 'The Pragmatic Programmer',author: 'David Thomas',     genre: 'Technology', year: 1999, rating: 4.5, pages: 352 },
]

// ── Refresh tokens store ──────────────────────────────────────────────────
export let refreshTokens = new Set()

// ── ID counter helper ─────────────────────────────────────────────────────
export function nextId(arr) {
  return String(Math.max(0, ...arr.map(i => Number(i.id))) + 1)
}
