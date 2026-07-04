/**
 * Vercel Serverless Function — handles ALL /api/* routes
 * Uses Turso (LibSQL) for persistent storage
 */
import bcrypt from 'bcryptjs'
import { db, toCamel, paginate, nextId } from './_lib/turso.js'
import {
  ok, err, handleOptions, withCors,
  requireAuth, requireAdmin, safeUser,
  signAccess, signRefresh, verifyRefresh,
} from './_lib/helpers.js'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2548'
const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

async function logActivity(req, path, statusCode) {
  try {
    const method = req.method
    if (!MUTATION_METHODS.includes(method)) return
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || 'unknown'
    const body = req.body ? JSON.stringify(req.body) : null
    await db.execute({
      sql: 'INSERT INTO activity_logs (method, path, body, ip, status_code, timestamp) VALUES (?,?,?,?,?,?)',
      args: [method, `/api${path}`, body, ip, statusCode, new Date().toISOString()],
    })
  } catch (_) { /* ไม่ให้ log error กระทบ main response */ }
}

function matchPath(pattern, pathname) {
  const patParts = pattern.split('/')
  const urlParts = pathname.split('/')
  if (patParts.length !== urlParts.length) return null
  const params = {}
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = decodeURIComponent(urlParts[i])
    } else if (patParts[i] !== urlParts[i]) {
      return null
    }
  }
  return params
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  withCors(res)

  const url   = new URL(req.url, 'http://x')
  const path  = url.pathname.replace(/^\/api/, '').replace(/\/$/, '') || '/'
  const query = Object.fromEntries(url.searchParams)
  const method = req.method
  let m

  // wrap ok/err เพื่อ auto-log mutations
  const _ok = (data, status = 200) => {
    if (MUTATION_METHODS.includes(method) && !path.startsWith('/admin')) {
      logActivity(req, path, status)
    }
    return ok(res, data, status)
  }
  const _err = (status, message) => err(res, status, message)

  // ── AUTH ───────────────────────────────────────────────────────────────
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = req.body || {}
    if (!email || !password) return err(res, 400, 'email and password are required')
    const r = await db.execute({ sql: 'SELECT * FROM users WHERE email=?', args: [email] })
    if (!r.rows.length) return err(res, 401, 'Invalid email or password')
    const user = toCamel(r.rows[0])
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return err(res, 401, 'Invalid email or password')
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)
    return ok(res, { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 900, user: safeUser(user) })
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, confirmPassword } = req.body || {}
    if (!name || !email || !password || !confirmPassword) return err(res, 400, 'name, email, password, and confirmPassword are required')
    if (password !== confirmPassword) return err(res, 400, 'Passwords do not match')
    if (password.length < 8) return err(res, 400, 'Password must be at least 8 characters')
    const exists = await db.execute({ sql: 'SELECT id FROM users WHERE email=?', args: [email] })
    if (exists.rows.length) return err(res, 409, 'Email already registered')
    const hashed = await bcrypt.hash(password, 10)
    const id = await nextId('users')
    const createdAt = new Date().toISOString()
    await db.execute({ sql: 'INSERT INTO users (id,name,email,password,role,avatar,bio,created_at) VALUES (?,?,?,?,?,?,?,?)', args: [id, name, email, hashed, 'user', `https://i.pravatar.cc/150?u=${email}`, '', createdAt] })
    const newUser = { id, name, email, role: 'user', avatar: `https://i.pravatar.cc/150?u=${email}`, bio: '', createdAt }
    const p2 = { sub: id, email, role: 'user' }
    return ok(res, { user: newUser, accessToken: signAccess(p2), refreshToken: signRefresh(p2) }, 201)
  }

  if (path === '/auth/forgot-password' && method === 'POST') {
    const { email } = req.body || {}
    if (!email) return err(res, 400, 'email is required')
    return ok(res, { message: 'If an account with that email exists, a reset link has been sent.' })
  }

  // ── USERS ──────────────────────────────────────────────────────────────
  if (path === '/users') {
    if (method === 'GET') {
      const { search, sort = 'id', order = 'asc', page, limit } = query
      let sql = 'SELECT id,name,email,role,avatar,bio,created_at FROM users'
      const args = []
      if (search) { sql += ' WHERE name LIKE ? OR email LIKE ?'; args.push(`%${search}%`, `%${search}%`) }
      const validSort = { id:'id', name:'name', email:'email', createdAt:'created_at' }
      sql += ` ORDER BY ${validSort[sort]||'id'} ${order==='desc'?'DESC':'ASC'}`
      const rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r))
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { name, email, password, role = 'user', avatar } = req.body || {}
      if (!name || !email || !password) return err(res, 400, 'name, email, and password are required')
      const exists = await db.execute({ sql: 'SELECT id FROM users WHERE email=?', args: [email] })
      if (exists.rows.length) return err(res, 409, 'Email already exists')
      const hashed = await bcrypt.hash(password, 10)
      const id = await nextId('users')
      const av = avatar || `https://i.pravatar.cc/150?u=${email}`
      await db.execute({ sql: 'INSERT INTO users (id,name,email,password,role,avatar,bio,created_at) VALUES (?,?,?,?,?,?,?,?)', args: [id, name, email, hashed, role, av, '', new Date().toISOString()] })
      return ok(res, { id, name, email, role, avatar: av, bio: '' }, 201)
    }
  }

  if ((m = matchPath('/users/:id', path))) {
    const { id } = m
    const r = await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [id] })
    if (!r.rows.length) return err(res, 404, 'User not found')
    const user = toCamel(r.rows[0])
    if (method === 'GET') return ok(res, safeUser(user))
    if (method === 'PUT') {
      const { name, email, avatar, bio, role } = req.body || {}
      if (!name || !email) return err(res, 400, 'name and email are required')
      await db.execute({ sql: 'UPDATE users SET name=?,email=?,avatar=?,bio=?,role=? WHERE id=?', args: [name, email, avatar||user.avatar, bio??user.bio, role||user.role, id] })
      return ok(res, { ...safeUser(user), name, email, avatar: avatar||user.avatar, bio: bio??user.bio, role: role||user.role })
    }
    if (method === 'PATCH') {
      const allowed = ['name','email','avatar','bio','role']
      const sets = []; const args = []
      for (const k of allowed) {
        if (req.body?.[k] !== undefined) { sets.push(`${k===k?k:k}=?`); args.push(req.body[k]) }
      }
      const colMap = { name:'name', email:'email', avatar:'avatar', bio:'bio', role:'role' }
      const setCols = []; const setArgs = []
      for (const k of allowed) { if (req.body?.[k] !== undefined) { setCols.push(`${colMap[k]}=?`); setArgs.push(req.body[k]) } }
      if (setCols.length) await db.execute({ sql: `UPDATE users SET ${setCols.join(',')} WHERE id=?`, args: [...setArgs, id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [id] })).rows[0])
      return ok(res, safeUser(updated))
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM users WHERE id=?', args: [id] })
      return res.status(204).end()
    }
  }

  // ── PRODUCTS ───────────────────────────────────────────────────────────
  if (path === '/products') {
    if (method === 'GET') {
      const { search, category, minPrice, maxPrice, inStock, sort = 'created_at', order = 'desc', page, limit } = query
      let sql = 'SELECT * FROM products WHERE 1=1'; const args = []
      if (category)  { sql += ' AND category_id=?'; args.push(category) }
      if (minPrice)  { sql += ' AND price>=?'; args.push(Number(minPrice)) }
      if (maxPrice)  { sql += ' AND price<=?'; args.push(Number(maxPrice)) }
      if (inStock === 'true')  { sql += ' AND stock>0' }
      if (inStock === 'false') { sql += ' AND stock=0' }
      if (search)    { sql += ' AND (name LIKE ? OR description LIKE ?)'; args.push(`%${search}%`, `%${search}%`) }
      const validSort = { price:'price', createdAt:'created_at', created_at:'created_at' }
      sql += ` ORDER BY ${validSort[sort]||'created_at'} ${order==='asc'?'ASC':'DESC'}`
      const rows = (await db.execute({ sql, args })).rows.map(r => { const c = toCamel(r, ['images']); c.categoryId = c.categoryId; return c })
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { name, price, description, stock = 0 } = req.body || {}
      if (!name || price === undefined) return err(res, 400, 'name and price are required')
      const id = await nextId('products')
      const sku = `SKU-${id.padStart(3,'0')}`
      await db.execute({ sql: 'INSERT INTO products (id,name,description,price,category_id,stock,sku,images,created_at) VALUES (?,?,?,?,?,?,?,?,?)', args: [id, name, description||'', Number(price), '1', Number(stock), sku, '[]', new Date().toISOString()] })
      return ok(res, { id, name, description: description||'', price: Number(price), categoryId: '1', stock: Number(stock), sku }, 201)
    }
  }

  if ((m = matchPath('/products/:id', path))) {
    const { id } = m
    const r = await db.execute({ sql: 'SELECT * FROM products WHERE id=?', args: [id] })
    if (!r.rows.length) return err(res, 404, 'Product not found')
    const prod = toCamel(r.rows[0], ['images'])
    if (method === 'GET') return ok(res, prod)
    if (method === 'PUT') {
      const { name, price, description, stock } = req.body || {}
      if (!name || price === undefined) return err(res, 400, 'name and price are required')
      await db.execute({ sql: 'UPDATE products SET name=?,price=?,description=?,stock=? WHERE id=?', args: [name, Number(price), description??prod.description, stock!==undefined?Number(stock):prod.stock, id] })
      return ok(res, { ...prod, name, price: Number(price), description: description??prod.description, stock: stock!==undefined?Number(stock):prod.stock })
    }
    if (method === 'PATCH') {
      const allowed = { name:'name', price:'price', description:'description', stock:'stock' }
      const setCols = []; const args = []
      for (const [k, col] of Object.entries(allowed)) {
        if (req.body?.[k] !== undefined) { setCols.push(`${col}=?`); args.push((k==='price'||k==='stock')?Number(req.body[k]):req.body[k]) }
      }
      if (setCols.length) await db.execute({ sql: `UPDATE products SET ${setCols.join(',')} WHERE id=?`, args: [...args, id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM products WHERE id=?', args: [id] })).rows[0], ['images'])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM products WHERE id=?', args: [id] })
      return res.status(204).end()
    }
  }

  // ── PRODUCT CATEGORIES ─────────────────────────────────────────────────
  if (path === '/categories' && method === 'GET') {
    const rows = (await db.execute('SELECT * FROM product_categories')).rows.map(r => toCamel(r))
    return ok(res, { data: rows })
  }

  // ── POSTS ──────────────────────────────────────────────────────────────
  if (path === '/posts') {
    if (method === 'GET') {
      const { search, userId, tag, page, limit } = query
      let sql = 'SELECT * FROM posts WHERE 1=1'; const args = []
      if (userId) { sql += ' AND user_id=?'; args.push(userId) }
      if (search) { sql += ' AND (title LIKE ? OR content LIKE ?)'; args.push(`%${search}%`, `%${search}%`) }
      let rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r, ['tags']))
      if (tag) rows = rows.filter(p => p.tags?.includes(tag))
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { title, content, tags } = req.body || {}
      if (!title || !content) return err(res, 400, 'title and content are required')
      const id = await nextId('posts')
      const excerpt = content.slice(0, 150) + '...'
      await db.execute({ sql: 'INSERT INTO posts (id,title,content,excerpt,tags,status,user_id,cover_image,created_at) VALUES (?,?,?,?,?,?,?,?,?)', args: [id, title, content, excerpt, JSON.stringify(tags||[]), 'published', '1', `https://picsum.photos/seed/post${id}/800/400`, new Date().toISOString()] })
      return ok(res, { id, title, content, excerpt, tags: tags||[], status: 'published', userId: '1' }, 201)
    }
  }

  if ((m = matchPath('/posts/:id', path))) {
    const { id } = m
    const r = await db.execute({ sql: 'SELECT * FROM posts WHERE id=?', args: [id] })
    if (!r.rows.length) return err(res, 404, 'Post not found')
    const post = toCamel(r.rows[0], ['tags'])
    if (method === 'GET') return ok(res, post)
    if (method === 'PUT') {
      const { title, content, tags } = req.body || {}
      if (!title || !content) return err(res, 400, 'title and content are required')
      await db.execute({ sql: 'UPDATE posts SET title=?,content=?,tags=? WHERE id=?', args: [title, content, JSON.stringify(tags||post.tags), id] })
      return ok(res, { ...post, title, content, tags: tags||post.tags })
    }
    if (method === 'PATCH') {
      const setCols = []; const args = []
      if (req.body?.title   !== undefined) { setCols.push('title=?');   args.push(req.body.title) }
      if (req.body?.content !== undefined) { setCols.push('content=?'); args.push(req.body.content) }
      if (req.body?.tags    !== undefined) { setCols.push('tags=?');    args.push(JSON.stringify(req.body.tags)) }
      if (setCols.length) await db.execute({ sql: `UPDATE posts SET ${setCols.join(',')} WHERE id=?`, args: [...args, id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM posts WHERE id=?', args: [id] })).rows[0], ['tags'])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM posts WHERE id=?', args: [id] })
      return res.status(204).end()
    }
  }

  // ── TODOS ──────────────────────────────────────────────────────────────
  if (path === '/todos') {
    if (method === 'GET') {
      const { completed, priority } = query
      let sql = 'SELECT * FROM todos WHERE 1=1'; const args = []
      if (completed !== undefined) { sql += ' AND completed=?'; args.push(completed==='true'?1:0) }
      if (priority)  { sql += ' AND priority=?'; args.push(priority) }
      const rows = (await db.execute({ sql, args })).rows.map(r => ({ ...toCamel(r), completed: r.completed===1||r.completed==='1' }))
      return ok(res, { data: rows })
    }
    if (method === 'POST') {
      const { title, description, priority = 'medium', dueDate } = req.body || {}
      if (!title?.trim()) return err(res, 400, 'title is required')
      const id = await nextId('todos')
      await db.execute({ sql: 'INSERT INTO todos (id,title,description,priority,completed,due_date,created_at) VALUES (?,?,?,?,?,?,?)', args: [id, title.trim(), description||null, priority, 0, dueDate||null, new Date().toISOString()] })
      return ok(res, { id, title: title.trim(), description: description||null, priority, completed: false, dueDate: dueDate||null }, 201)
    }
  }

  if ((m = matchPath('/todos/:id/toggle', path)) && method === 'PATCH') {
    const r = await db.execute({ sql: 'SELECT * FROM todos WHERE id=?', args: [m.id] })
    if (!r.rows.length) return err(res, 404, 'Todo not found')
    const todo = toCamel(r.rows[0])
    const newVal = (todo.completed===1||todo.completed===true) ? 0 : 1
    await db.execute({ sql: 'UPDATE todos SET completed=? WHERE id=?', args: [newVal, m.id] })
    return ok(res, { ...todo, completed: newVal===1 })
  }

  if ((m = matchPath('/todos/:id', path)) && method === 'DELETE') {
    const r = await db.execute({ sql: 'SELECT id FROM todos WHERE id=?', args: [m.id] })
    if (!r.rows.length) return err(res, 404, 'Todo not found')
    await db.execute({ sql: 'DELETE FROM todos WHERE id=?', args: [m.id] })
    return res.status(204).end()
  }

  // ── COUNTRIES ──────────────────────────────────────────────────────────
  if (path === '/countries') {
    if (method === 'GET') {
      const { region, search } = query
      let sql = 'SELECT * FROM countries WHERE 1=1'; const args = []
      if (region) { sql += ' AND region=?'; args.push(region) }
      if (search) { sql += ' AND name LIKE ?'; args.push(`%${search}%`) }
      const rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r))
      return ok(res, { data: rows, total: rows.length })
    }
    if (method === 'POST') {
      const { name, code, capital, region, population, area, currency, language, flag } = req.body || {}
      if (!name || !code) return err(res, 400, 'name and code are required')
      const exists = await db.execute({ sql: 'SELECT id FROM countries WHERE code=?', args: [code.toUpperCase()] })
      if (exists.rows.length) return err(res, 409, 'Country code already exists')
      const id = await nextId('countries')
      await db.execute({ sql: 'INSERT INTO countries (id,name,code,capital,region,population,area,currency,language,flag) VALUES (?,?,?,?,?,?,?,?,?,?)', args: [id, name, code.toUpperCase(), capital||'', region||'', population||0, area||0, currency||'', language||'', flag||''] })
      return ok(res, { id, name, code: code.toUpperCase(), capital: capital||'', region: region||'', population: population||0, area: area||0, currency: currency||'', language: language||'', flag: flag||'' }, 201)
    }
  }

  if ((m = matchPath('/countries/:code', path))) {
    const r = await db.execute({ sql: 'SELECT * FROM countries WHERE code=?', args: [m.code.toUpperCase()] })
    if (!r.rows.length) return err(res, 404, 'Country not found')
    const country = toCamel(r.rows[0])
    if (method === 'GET') return ok(res, country)
    if (method === 'PUT') {
      const { name, capital, region, population, area, currency, language, flag } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      await db.execute({ sql: 'UPDATE countries SET name=?,capital=?,region=?,population=?,area=?,currency=?,language=?,flag=? WHERE code=?', args: [name, capital??country.capital, region??country.region, population??country.population, area??country.area, currency??country.currency, language??country.language, flag??country.flag, m.code.toUpperCase()] })
      return ok(res, { ...country, name, capital: capital??country.capital })
    }
    if (method === 'PATCH') {
      const allowed = { name:'name', capital:'capital', region:'region', population:'population', area:'area', currency:'currency', language:'language', flag:'flag' }
      const setCols = []; const args = []
      for (const [k, col] of Object.entries(allowed)) { if (req.body?.[k] !== undefined) { setCols.push(`${col}=?`); args.push(req.body[k]) } }
      if (setCols.length) await db.execute({ sql: `UPDATE countries SET ${setCols.join(',')} WHERE code=?`, args: [...args, m.code.toUpperCase()] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM countries WHERE code=?', args: [m.code.toUpperCase()] })).rows[0])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM countries WHERE code=?', args: [m.code.toUpperCase()] })
      return res.status(204).end()
    }
  }

  // ── MOVIES ─────────────────────────────────────────────────────────────
  if (path === '/movies') {
    if (method === 'GET') {
      const { search, genre, year, minRating, page, limit } = query
      let sql = 'SELECT * FROM movies WHERE 1=1'; const args = []
      if (year)      { sql += ' AND year=?'; args.push(Number(year)) }
      if (minRating) { sql += ' AND rating>=?'; args.push(Number(minRating)) }
      if (search)    { sql += ' AND title LIKE ?'; args.push(`%${search}%`) }
      let rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r, ['genre','cast']))
      if (genre) rows = rows.filter(m => m.genre?.some(g => g.toLowerCase() === genre.toLowerCase()))
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { title, genre, year, rating, director, cast, duration, language, description } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      const id = await nextId('movies')
      await db.execute({ sql: 'INSERT INTO movies (id,title,description,genre,year,rating,director,cast,duration,language,poster,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', args: [id, title, description||'', JSON.stringify(genre||[]), year||null, rating||null, director||'', JSON.stringify(cast||[]), duration||null, language||'English', `https://picsum.photos/seed/movie${id}/300/450`, new Date().toISOString()] })
      return ok(res, { id, title, description: description||'', genre: genre||[], year: year||null, rating: rating||null, director: director||'', cast: cast||[], duration: duration||null, language: language||'English' }, 201)
    }
  }

  if ((m = matchPath('/movies/:id', path))) {
    const r = await db.execute({ sql: 'SELECT * FROM movies WHERE id=?', args: [m.id] })
    if (!r.rows.length) return err(res, 404, 'Movie not found')
    const movie = toCamel(r.rows[0], ['genre','cast'])
    if (method === 'GET') return ok(res, movie)
    if (method === 'PUT') {
      const { title, genre, year, rating, director, cast, duration, language, description } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      await db.execute({ sql: 'UPDATE movies SET title=?,description=?,genre=?,year=?,rating=?,director=?,cast=?,duration=?,language=? WHERE id=?', args: [title, description??movie.description, JSON.stringify(genre??movie.genre), year??movie.year, rating??movie.rating, director??movie.director, JSON.stringify(cast??movie.cast), duration??movie.duration, language??movie.language, m.id] })
      return ok(res, { ...movie, title, description: description??movie.description })
    }
    if (method === 'PATCH') {
      const allowed = { title:'title', description:'description', year:'year', rating:'rating', director:'director', duration:'duration', language:'language' }
      const setCols = []; const args = []
      for (const [k, col] of Object.entries(allowed)) { if (req.body?.[k] !== undefined) { setCols.push(`${col}=?`); args.push(req.body[k]) } }
      if (req.body?.genre !== undefined) { setCols.push('genre=?'); args.push(JSON.stringify(req.body.genre)) }
      if (req.body?.cast  !== undefined) { setCols.push('cast=?');  args.push(JSON.stringify(req.body.cast)) }
      if (setCols.length) await db.execute({ sql: `UPDATE movies SET ${setCols.join(',')} WHERE id=?`, args: [...args, m.id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM movies WHERE id=?', args: [m.id] })).rows[0], ['genre','cast'])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM movies WHERE id=?', args: [m.id] })
      return res.status(204).end()
    }
  }

  // ── BOOKS ──────────────────────────────────────────────────────────────
  if (path === '/books') {
    if (method === 'GET') {
      const { search, genre, author, page, limit } = query
      let sql = 'SELECT * FROM books WHERE 1=1'; const args = []
      if (genre)  { sql += ' AND genre=?'; args.push(genre) }
      if (author) { sql += ' AND author LIKE ?'; args.push(`%${author}%`) }
      if (search) { sql += ' AND (title LIKE ? OR isbn LIKE ?)'; args.push(`%${search}%`, `%${search}%`) }
      const rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r))
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { title, author, isbn, genre, description, year, pages, rating, publisher, language } = req.body || {}
      if (!title || !author) return err(res, 400, 'title and author are required')
      if (isbn) {
        const exists = await db.execute({ sql: 'SELECT id FROM books WHERE isbn=?', args: [isbn] })
        if (exists.rows.length) return err(res, 409, 'ISBN already exists')
      }
      const id = await nextId('books')
      await db.execute({ sql: 'INSERT INTO books (id,title,author,isbn,genre,description,year,pages,rating,publisher,language,cover,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', args: [id, title, author, isbn||'', genre||'General', description||'', year||null, pages||null, rating||null, publisher||'', language||'English', `https://picsum.photos/seed/book${id}/200/300`, new Date().toISOString()] })
      return ok(res, { id, title, author, isbn: isbn||'', genre: genre||'General' }, 201)
    }
  }

  if ((m = matchPath('/books/:isbn', path))) {
    const r = await db.execute({ sql: 'SELECT * FROM books WHERE isbn=?', args: [m.isbn] })
    if (!r.rows.length) return err(res, 404, 'Book not found')
    const book = toCamel(r.rows[0])
    if (method === 'GET') return ok(res, book)
    if (method === 'PUT') {
      const { title, author, genre, description, year, pages, rating, publisher, language } = req.body || {}
      if (!title || !author) return err(res, 400, 'title and author are required')
      await db.execute({ sql: 'UPDATE books SET title=?,author=?,genre=?,description=?,year=?,pages=?,rating=?,publisher=?,language=? WHERE isbn=?', args: [title, author, genre??book.genre, description??book.description, year??book.year, pages??book.pages, rating??book.rating, publisher??book.publisher, language??book.language, m.isbn] })
      return ok(res, { ...book, title, author })
    }
    if (method === 'PATCH') {
      const allowed = { title:'title', author:'author', genre:'genre', description:'description', year:'year', pages:'pages', rating:'rating', publisher:'publisher', language:'language' }
      const setCols = []; const args = []
      for (const [k, col] of Object.entries(allowed)) { if (req.body?.[k] !== undefined) { setCols.push(`${col}=?`); args.push(req.body[k]) } }
      if (setCols.length) await db.execute({ sql: `UPDATE books SET ${setCols.join(',')} WHERE isbn=?`, args: [...args, m.isbn] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM books WHERE isbn=?', args: [m.isbn] })).rows[0])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM books WHERE isbn=?', args: [m.isbn] })
      return res.status(204).end()
    }
  }

  // ── RECIPES ────────────────────────────────────────────────────────────
  if (path === '/recipes') {
    if (method === 'GET') {
      const { search, category, difficulty, maxCalories, page, limit } = query
      let sql = 'SELECT * FROM recipes WHERE 1=1'; const args = []
      if (category)    { sql += ' AND category=?'; args.push(category) }
      if (difficulty)  { sql += ' AND difficulty=?'; args.push(difficulty) }
      if (maxCalories) { sql += ' AND calories<=?'; args.push(Number(maxCalories)) }
      if (search)      { sql += ' AND (title LIKE ? OR description LIKE ?)'; args.push(`%${search}%`, `%${search}%`) }
      const rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r, ['ingredients','steps','tags']))
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { title, description, ingredients, steps, category, prepTime, cookTime, servings, difficulty, calories, tags } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      const id = await nextId('recipes')
      await db.execute({ sql: 'INSERT INTO recipes (id,title,description,ingredients,steps,category,prep_time,cook_time,servings,difficulty,calories,tags,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', args: [id, title, description||'', JSON.stringify(ingredients||[]), JSON.stringify(steps||[]), category||'Other', prepTime||0, cookTime||0, servings||1, difficulty||'easy', calories||0, JSON.stringify(tags||[]), `https://picsum.photos/seed/recipe${id}/600/400`, new Date().toISOString()] })
      return ok(res, { id, title, category: category||'Other', difficulty: difficulty||'easy' }, 201)
    }
  }

  if ((m = matchPath('/recipes/:id', path))) {
    const r = await db.execute({ sql: 'SELECT * FROM recipes WHERE id=?', args: [m.id] })
    if (!r.rows.length) return err(res, 404, 'Recipe not found')
    const recipe = toCamel(r.rows[0], ['ingredients','steps','tags'])
    if (method === 'GET') return ok(res, recipe)
    if (method === 'PUT') {
      const { title, description, ingredients, steps, category, prepTime, cookTime, servings, difficulty, calories, tags } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      await db.execute({ sql: 'UPDATE recipes SET title=?,description=?,ingredients=?,steps=?,category=?,prep_time=?,cook_time=?,servings=?,difficulty=?,calories=?,tags=? WHERE id=?', args: [title, description??recipe.description, JSON.stringify(ingredients??recipe.ingredients), JSON.stringify(steps??recipe.steps), category??recipe.category, prepTime??recipe.prepTime, cookTime??recipe.cookTime, servings??recipe.servings, difficulty??recipe.difficulty, calories??recipe.calories, JSON.stringify(tags??recipe.tags), m.id] })
      return ok(res, { ...recipe, title })
    }
    if (method === 'PATCH') {
      const scalar = { title:'title', description:'description', category:'category', prepTime:'prep_time', cookTime:'cook_time', servings:'servings', difficulty:'difficulty', calories:'calories' }
      const setCols = []; const args = []
      for (const [k, col] of Object.entries(scalar)) { if (req.body?.[k] !== undefined) { setCols.push(`${col}=?`); args.push(req.body[k]) } }
      if (req.body?.ingredients !== undefined) { setCols.push('ingredients=?'); args.push(JSON.stringify(req.body.ingredients)) }
      if (req.body?.steps       !== undefined) { setCols.push('steps=?');       args.push(JSON.stringify(req.body.steps)) }
      if (req.body?.tags        !== undefined) { setCols.push('tags=?');        args.push(JSON.stringify(req.body.tags)) }
      if (setCols.length) await db.execute({ sql: `UPDATE recipes SET ${setCols.join(',')} WHERE id=?`, args: [...args, m.id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM recipes WHERE id=?', args: [m.id] })).rows[0], ['ingredients','steps','tags'])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM recipes WHERE id=?', args: [m.id] })
      return res.status(204).end()
    }
  }

  // ── ANIMALS ────────────────────────────────────────────────────────────
  if (path === '/animals') {
    if (method === 'GET') {
      const { search, category, habitat, diet, conservationStatus, page, limit } = query
      let sql = 'SELECT * FROM animals WHERE 1=1'; const args = []
      if (category)           { sql += ' AND category=?'; args.push(category) }
      if (habitat)            { sql += ' AND habitat=?'; args.push(habitat) }
      if (diet)               { sql += ' AND diet=?'; args.push(diet) }
      if (conservationStatus) { sql += ' AND conservation_status=?'; args.push(conservationStatus) }
      if (search)             { sql += ' AND (name LIKE ? OR scientific_name LIKE ?)'; args.push(`%${search}%`, `%${search}%`) }
      const rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r))
      return ok(res, paginate(rows, page, limit))
    }
    if (method === 'POST') {
      const { name, scientificName, category, habitat, diet, lifespan, weight, length: len, conservationStatus, description } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      const id = await nextId('animals')
      await db.execute({ sql: 'INSERT INTO animals (id,name,scientific_name,category,habitat,diet,lifespan,weight,length,conservation_status,description,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', args: [id, name, scientificName||'', category||'Mammal', habitat||'', diet||'Omnivore', lifespan||null, weight||'', len||'', conservationStatus||'Least Concern', description||'', `https://picsum.photos/seed/animal${id}/600/400`, new Date().toISOString()] })
      return ok(res, { id, name, category: category||'Mammal', conservationStatus: conservationStatus||'Least Concern' }, 201)
    }
  }

  if ((m = matchPath('/animals/:id', path))) {
    const r = await db.execute({ sql: 'SELECT * FROM animals WHERE id=?', args: [m.id] })
    if (!r.rows.length) return err(res, 404, 'Animal not found')
    const animal = toCamel(r.rows[0])
    if (method === 'GET') return ok(res, animal)
    if (method === 'PUT') {
      const { name, scientificName, category, habitat, diet, lifespan, weight, length: len, conservationStatus, description } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      await db.execute({ sql: 'UPDATE animals SET name=?,scientific_name=?,category=?,habitat=?,diet=?,lifespan=?,weight=?,length=?,conservation_status=?,description=? WHERE id=?', args: [name, scientificName??animal.scientificName, category??animal.category, habitat??animal.habitat, diet??animal.diet, lifespan??animal.lifespan, weight??animal.weight, len??animal.length, conservationStatus??animal.conservationStatus, description??animal.description, m.id] })
      return ok(res, { ...animal, name })
    }
    if (method === 'PATCH') {
      const allowed = { name:'name', scientificName:'scientific_name', category:'category', habitat:'habitat', diet:'diet', lifespan:'lifespan', weight:'weight', conservationStatus:'conservation_status', description:'description' }
      const setCols = []; const args = []
      for (const [k, col] of Object.entries(allowed)) { if (req.body?.[k] !== undefined) { setCols.push(`${col}=?`); args.push(req.body[k]) } }
      if (req.body?.length !== undefined) { setCols.push('length=?'); args.push(req.body.length) }
      if (setCols.length) await db.execute({ sql: `UPDATE animals SET ${setCols.join(',')} WHERE id=?`, args: [...args, m.id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM animals WHERE id=?', args: [m.id] })).rows[0])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM animals WHERE id=?', args: [m.id] })
      return res.status(204).end()
    }
  }

  // ── STUDENTS ───────────────────────────────────────────────────────────
  if (path === '/students') {
    if (method === 'GET') {
      const { search, gender } = query
      let sql = 'SELECT * FROM students WHERE 1=1'; const args = []
      if (gender) { sql += ' AND gender=?'; args.push(gender) }
      if (search) { sql += ' AND (name LIKE ? OR student_id LIKE ? OR id LIKE ?)'; args.push(`%${search}%`, `%${search}%`, `%${search}%`) }
      const rows = (await db.execute({ sql, args })).rows.map(r => toCamel(r))
      return ok(res, { data: rows, total: rows.length })
    }
    if (method === 'POST') {
      const { studentId, name, gender } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      if (studentId) {
        const exists = await db.execute({ sql: 'SELECT id FROM students WHERE student_id=?', args: [String(studentId)] })
        if (exists.rows.length) return err(res, 409, 'studentId already exists')
      }
      const id = await nextId('students')
      await db.execute({ sql: 'INSERT INTO students (id,student_id,name,gender,created_at) VALUES (?,?,?,?,?)', args: [id, studentId?String(studentId):'', name, gender||'', new Date().toISOString()] })
      return ok(res, { id, studentId: studentId?String(studentId):'', name, gender: gender||'' }, 201)
    }
  }

  if ((m = matchPath('/students/:id', path))) {
    const r = await db.execute({ sql: 'SELECT * FROM students WHERE id=?', args: [m.id] })
    if (!r.rows.length) return err(res, 404, 'Student not found')
    const student = toCamel(r.rows[0])
    if (method === 'GET') return ok(res, student)
    if (method === 'PUT') {
      const { studentId, name, gender } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      await db.execute({ sql: 'UPDATE students SET name=?,gender=?,student_id=? WHERE id=?', args: [name, gender??student.gender, studentId?String(studentId):student.studentId, m.id] })
      return ok(res, { ...student, name, gender: gender??student.gender })
    }
    if (method === 'PATCH') {
      const setCols = []; const args = []
      if (req.body?.name      !== undefined) { setCols.push('name=?');       args.push(req.body.name) }
      if (req.body?.gender    !== undefined) { setCols.push('gender=?');     args.push(req.body.gender) }
      if (req.body?.studentId !== undefined) { setCols.push('student_id=?'); args.push(String(req.body.studentId)) }
      if (setCols.length) await db.execute({ sql: `UPDATE students SET ${setCols.join(',')} WHERE id=?`, args: [...args, m.id] })
      const updated = toCamel((await db.execute({ sql: 'SELECT * FROM students WHERE id=?', args: [m.id] })).rows[0])
      return ok(res, updated)
    }
    if (method === 'DELETE') {
      await db.execute({ sql: 'DELETE FROM students WHERE id=?', args: [m.id] })
      return res.status(204).end()
    }
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────
  if (path === '/admin/login' && method === 'POST') {
    const { password } = req.body || {}
    if (password !== ADMIN_PASSWORD) return err(res, 401, 'รหัสผ่านไม่ถูกต้อง')
    return ok(res, { token: Buffer.from(`admin:${ADMIN_PASSWORD}:${Date.now()}`).toString('base64') })
  }

  // ตรวจ admin token สำหรับ routes ที่เหลือ
  if (path.startsWith('/admin/')) {
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return err(res, 401, 'กรุณา login ก่อน')
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8')
      if (!decoded.startsWith(`admin:${ADMIN_PASSWORD}:`)) return err(res, 401, 'token ไม่ถูกต้อง')
    } catch { return err(res, 401, 'token ไม่ถูกต้อง') }

    // GET /admin/logs — ดู activity log
    if (path === '/admin/logs' && method === 'GET') {
      const { page = 1, limit = 50, method: filterMethod, table: filterTable } = query
      let sql = 'SELECT * FROM activity_logs WHERE 1=1'; const args = []
      if (filterMethod) { sql += ' AND method=?'; args.push(filterMethod.toUpperCase()) }
      if (filterTable)  { sql += ' AND path LIKE ?'; args.push(`/api/${filterTable}%`) }
      sql += ' ORDER BY id DESC'
      const all = (await db.execute({ sql, args })).rows.map(r => toCamel(r))
      return ok(res, paginate(all, page, limit))
    }

    // DELETE /admin/logs — ล้าง log ทั้งหมด
    if (path === '/admin/logs' && method === 'DELETE') {
      await db.execute('DELETE FROM activity_logs')
      return ok(res, { message: 'ล้าง log ทั้งหมดแล้ว' })
    }

    // GET /admin/stats — สถิติ
    if (path === '/admin/stats' && method === 'GET') {
      const tables = ['users','products','posts','students','movies','books','countries','todos','recipes','animals']
      const counts = {}
      for (const t of tables) {
        const r = await db.execute(`SELECT COUNT(*) as cnt FROM ${t}`)
        counts[t] = r.rows[0]?.cnt ?? 0
      }
      const logCount = (await db.execute('SELECT COUNT(*) as cnt FROM activity_logs')).rows[0]?.cnt ?? 0
      const recentLogs = (await db.execute('SELECT method, path, timestamp FROM activity_logs ORDER BY id DESC LIMIT 5')).rows.map(r => toCamel(r))
      return ok(res, { rowCounts: counts, totalLogs: logCount, recentActivity: recentLogs })
    }

    // POST /admin/reset/:table — reset ตาราง
    if ((m = matchPath('/admin/reset/:table', path)) && method === 'POST') {
      const tableMap = {
        users: 'users', products: 'products', posts: 'posts', students: 'students',
        movies: 'movies', books: 'books', countries: 'countries', todos: 'todos',
        recipes: 'recipes', animals: 'animals',
      }
      const tableName = tableMap[m.table]
      if (!tableName) return err(res, 400, `ไม่รู้จัก table: ${m.table}`)

      // inline seed ตาราง
      const { users: usersData, products: productsData, posts: postsData, students: studentsData, movies: moviesData, books: booksData, countries: countriesData, recipes: recipesData, animals: animalsData } = await import('./_lib/db.js')
      const todosData = [{id:'1',title:'ทดสอบ GET /api/todos',description:'ลองดึงรายการ todo',priority:'high',completed:false,dueDate:null},{id:'2',title:'ทดสอบ POST /api/todos',description:'ลองสร้าง todo ใหม่',priority:'high',completed:false,dueDate:null},{id:'3',title:'ทดสอบ PATCH toggle',description:'ลอง toggle สถานะ',priority:'medium',completed:true,dueDate:null},{id:'4',title:'ทดสอบ DELETE /api/todos/:id',description:null,priority:'low',completed:false,dueDate:null},{id:'5',title:'เรียน REST API',description:'HTTP Methods ครบ 5 ตัว',priority:'high',completed:true,dueDate:'2025-12-31'},{id:'6',title:'ทำรายงาน Web Dev',description:'สรุปเนื้อหา Chapter 5-7',priority:'medium',completed:false,dueDate:'2025-12-15'},{id:'7',title:'ส่งการบ้าน Postman',description:null,priority:'high',completed:false,dueDate:null},{id:'8',title:'อ่านหนังสือ Clean Code',description:'บทที่ 1-3',priority:'low',completed:false,dueDate:null},{id:'9',title:'ติดตั้ง Node.js และ Bun',description:null,priority:'medium',completed:true,dueDate:null},{id:'10',title:'Deploy ขึ้น Vercel',description:'ทดสอบหลัง deploy',priority:'medium',completed:true,dueDate:null}]
      const seedMap = {
        users:    async () => { await db.execute('DELETE FROM users'); for (const u of usersData) await db.execute({ sql:'INSERT INTO users (id,name,email,password,role,avatar,bio,created_at) VALUES (?,?,?,?,?,?,?,?)',args:[u.id,u.name,u.email,u.password,u.role,u.avatar||'',u.bio||'',u.createdAt] }); return usersData.length },
        products: async () => { await db.execute('DELETE FROM products'); for (const p of productsData) await db.execute({ sql:'INSERT INTO products (id,name,description,price,category_id,stock,sku,images,created_at) VALUES (?,?,?,?,?,?,?,?,?)',args:[p.id,p.name,p.description||'',p.price,p.categoryId||'1',p.stock||0,p.sku||'',JSON.stringify(p.images||[]),p.createdAt] }); return productsData.length },
        posts:    async () => { await db.execute('DELETE FROM posts'); for (const p of postsData) await db.execute({ sql:'INSERT INTO posts (id,title,content,excerpt,tags,status,user_id,cover_image,created_at) VALUES (?,?,?,?,?,?,?,?,?)',args:[p.id,p.title,p.content,p.excerpt||'',JSON.stringify(p.tags||[]),p.status||'published',p.userId||'1',p.coverImage||'',p.createdAt] }); return postsData.length },
        students: async () => { await db.execute('DELETE FROM students'); for (const s of studentsData) await db.execute({ sql:'INSERT INTO students (id,student_id,name,gender,created_at) VALUES (?,?,?,?,?)',args:[s.id,s.studentId||'',s.name,s.gender||'',s.createdAt] }); return studentsData.length },
        movies:   async () => { await db.execute('DELETE FROM movies'); for (const mv of moviesData) await db.execute({ sql:'INSERT INTO movies (id,title,description,genre,year,rating,director,cast,duration,language,poster,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',args:[mv.id,mv.title,mv.description||'',JSON.stringify(mv.genre||[]),mv.year||null,mv.rating||null,mv.director||'',JSON.stringify(mv.cast||[]),mv.duration||null,mv.language||'English',mv.poster||'',mv.createdAt] }); return moviesData.length },
        books:    async () => { await db.execute('DELETE FROM books'); for (const b of booksData) await db.execute({ sql:'INSERT INTO books (id,title,author,isbn,genre,description,year,pages,rating,publisher,language,cover,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',args:[b.id,b.title,b.author,b.isbn||'',b.genre||'General',b.description||'',b.year||null,b.pages||null,b.rating||null,b.publisher||'',b.language||'English',b.cover||'',b.createdAt] }); return booksData.length },
        countries:async () => { await db.execute('DELETE FROM countries'); for (const c of countriesData) await db.execute({ sql:'INSERT INTO countries (id,name,code,capital,region,population,area,currency,language,flag) VALUES (?,?,?,?,?,?,?,?,?,?)',args:[c.id,c.name,c.code,c.capital||'',c.region||'',c.population||0,c.area||0,c.currency||'',c.language||'',c.flag||''] }); return countriesData.length },
        todos:    async () => { await db.execute('DELETE FROM todos'); for (const t of todosData) await db.execute({ sql:'INSERT INTO todos (id,title,description,priority,completed,due_date,created_at) VALUES (?,?,?,?,?,?,?)',args:[t.id,t.title,t.description||null,t.priority,t.completed?1:0,t.dueDate||null,new Date().toISOString()] }); return todosData.length },
        recipes:  async () => { await db.execute('DELETE FROM recipes'); for (const r of recipesData) await db.execute({ sql:'INSERT INTO recipes (id,title,description,ingredients,steps,category,prep_time,cook_time,servings,difficulty,calories,tags,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',args:[r.id,r.title,r.description||'',JSON.stringify(r.ingredients||[]),JSON.stringify(r.steps||[]),r.category||'Other',r.prepTime||0,r.cookTime||0,r.servings||1,r.difficulty||'easy',r.calories||0,JSON.stringify(r.tags||[]),r.image||'',r.createdAt] }); return recipesData.length },
        animals:  async () => { await db.execute('DELETE FROM animals'); for (const a of animalsData) await db.execute({ sql:'INSERT INTO animals (id,name,scientific_name,category,habitat,diet,lifespan,weight,length,conservation_status,description,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',args:[a.id,a.name,a.scientificName||'',a.category||'Mammal',a.habitat||'',a.diet||'Omnivore',a.lifespan||null,a.weight||'',a.length||'',a.conservationStatus||'Least Concern',a.description||'',a.image||'',a.createdAt] }); return animalsData.length },
      }
      if (!seedMap[tableName]) return err(res, 400, 'ไม่รู้จัก table: ' + tableName)
      const count = await seedMap[tableName]()
      await db.execute({ sql:'INSERT INTO activity_logs (method,path,body,ip,status_code,timestamp) VALUES (?,?,?,?,?,?)', args:['POST','/api/admin/reset/'+tableName,null,'admin',200,new Date().toISOString()] })
      return ok(res, { message: 'reset ' + tableName + ' สำเร็จ (' + count + ' rows)' })
    }

    return err(res, 404, `Admin route not found: ${method} /api${path}`)
  }

  // ── 404 ────────────────────────────────────────────────────────────────
  return err(res, 404, `Route not found: ${method} /api${path}`)
}
