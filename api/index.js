/**
 * Single Vercel Serverless Function — handles ALL /api/* routes
 * Stays within Hobby plan's 12-function limit (counts as 1)
 */
import bcrypt from 'bcryptjs'
import {
  users, products, categories, posts, students,
  movies, books, countries, todos, recipes, animals,
  refreshTokens, nextId,
} from './_lib/db.js'
import {
  ok, err, handleOptions, withCors, paginate,
  requireAuth, requireAdmin, safeUser,
  signAccess, signRefresh, verifyRefresh, extractToken, verifyAccess,
} from './_lib/helpers.js'

// ── tiny path-param matcher ────────────────────────────────────────────────
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

  // Strip /api prefix and trailing slash
  const url   = new URL(req.url, 'http://x')
  const path  = url.pathname.replace(/^\/api/, '').replace(/\/$/, '') || '/'
  const query = Object.fromEntries(url.searchParams)
  // Merge path into req.query for handler compatibility
  req.query = { ...req.query, ...query }

  const method = req.method

  // ── AUTH ───────────────────────────────────────────────────────────────
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = req.body || {}
    if (!email || !password) return err(res, 400, 'email and password are required')
    const user = users.find(u => u.email === email)
    if (!user) return err(res, 401, 'Invalid email or password')
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return err(res, 401, 'Invalid email or password')
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)
    refreshTokens.add(refreshToken)
    return ok(res, { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 900, user: safeUser(user) })
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, confirmPassword } = req.body || {}
    if (!name || !email || !password || !confirmPassword)
      return err(res, 400, 'name, email, password, and confirmPassword are required')
    if (password !== confirmPassword) return err(res, 400, 'Passwords do not match')
    if (password.length < 8) return err(res, 400, 'Password must be at least 8 characters')
    if (users.find(u => u.email === email)) return err(res, 409, 'Email already registered')
    const hashed = await bcrypt.hash(password, 10)
    const newUser = { id: nextId(users), name, email, password: hashed, role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${email}`, bio: '', createdAt: new Date().toISOString() }
    users.push(newUser)
    const p2 = { sub: newUser.id, email: newUser.email, role: newUser.role }
    return ok(res, { user: safeUser(newUser), accessToken: signAccess(p2), refreshToken: signRefresh(p2) }, 201)
  }

  if (path === '/auth/logout' && method === 'POST') {
    const user = requireAuth(req, res); if (!user) return
    refreshTokens.clear()
    return ok(res, { message: 'Logged out successfully' })
  }

  if (path === '/auth/refresh' && method === 'POST') {
    const { refreshToken } = req.body || {}
    if (!refreshToken) return err(res, 400, 'refreshToken is required')
    if (!refreshTokens.has(refreshToken)) return err(res, 401, 'Invalid or expired refresh token')
    const p3 = verifyRefresh(refreshToken)
    if (!p3) return err(res, 401, 'Invalid or expired refresh token')
    refreshTokens.delete(refreshToken)
    return ok(res, { accessToken: signAccess({ sub: p3.sub, email: p3.email, role: p3.role }), tokenType: 'Bearer', expiresIn: 900 })
  }

  if (path === '/auth/forgot-password' && method === 'POST') {
    const { email } = req.body || {}
    if (!email) return err(res, 400, 'email is required')
    return ok(res, { message: 'If an account with that email exists, a reset link has been sent.' })
  }

  if (path === '/auth/reset-password' && method === 'POST') {
    const { token, newPassword, confirmPassword } = req.body || {}
    if (!token || !newPassword || !confirmPassword)
      return err(res, 400, 'token, newPassword, and confirmPassword are required')
    if (newPassword !== confirmPassword) return err(res, 400, 'Passwords do not match')
    if (newPassword.length < 8) return err(res, 400, 'Password must be at least 8 characters')
    if (token.length < 4) return err(res, 400, 'Invalid reset token')
    return ok(res, { message: 'Password reset successfully. Please log in with your new password.' })
  }

  // ── USERS ──────────────────────────────────────────────────────────────
  if (path === '/users') {
    if (method === 'GET') {
      const { page, limit, search, sort = 'id', order = 'asc' } = query
      let list = [...users].map(safeUser)
      if (search) list = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
      list.sort((a, b) => {
        const av = sort === 'id' ? Number(a.id) : String(a[sort] ?? '')
        const bv = sort === 'id' ? Number(b.id) : String(b[sort] ?? '')
        if (sort === 'id') return order === 'asc' ? av - bv : bv - av
        return order === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
      })
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { name, email, password, role = 'user', avatar } = req.body || {}
      if (!name || !email || !password) return err(res, 400, 'name, email, and password are required')
      if (users.find(u => u.email === email)) return err(res, 409, 'Email already exists')
      const hashed = await bcrypt.hash(password, 10)
      const nu = { id: nextId(users), name, email, password: hashed, role,
        avatar: avatar || `https://i.pravatar.cc/150?u=${email}`, bio: '', createdAt: new Date().toISOString() }
      users.push(nu)
      return ok(res, safeUser(nu), 201)
    }
  }

  let m
  if ((m = matchPath('/users/:id', path))) {
    req.query = { ...req.query, ...m }
    const { id } = m
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) return err(res, 404, 'User not found')
    if (method === 'GET') {
      return ok(res, safeUser(users[idx]))
    }
    if (method === 'PUT') {
      const { name, email, avatar, bio, role } = req.body || {}
      if (!name || !email) return err(res, 400, 'name and email are required')
      users[idx] = { ...users[idx], name, email, avatar, bio, ...(role && { role }) }
      return ok(res, safeUser(users[idx]))
    }
    if (method === 'PATCH') {
      const allowed = ['name', 'email', 'avatar', 'bio', 'role']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      users[idx] = { ...users[idx], ...updates }
      return ok(res, safeUser(users[idx]))
    }
    if (method === 'DELETE') {
      users.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── PRODUCTS ───────────────────────────────────────────────────────────
  if (path === '/products') {
    if (method === 'GET') {
      const { page, limit, category, minPrice, maxPrice, search, sort = 'createdAt', order = 'desc', inStock } = query
      let list = [...products]
      if (category)       list = list.filter(p => p.categoryId === category)
      if (minPrice)       list = list.filter(p => p.price >= Number(minPrice))
      if (maxPrice)       list = list.filter(p => p.price <= Number(maxPrice))
      if (inStock === 'true')  list = list.filter(p => p.stock > 0)
      if (inStock === 'false') list = list.filter(p => p.stock === 0)
      if (search)         list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
      list.sort((a, b) => sort === 'price'
        ? (order === 'asc' ? a.price - b.price : b.price - a.price)
        : (order === 'asc' ? String(a[sort]??'').localeCompare(String(b[sort]??'')) : String(b[sort]??'').localeCompare(String(a[sort]??''))))
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { name, price, description, stock = 0 } = req.body || {}
      if (!name || price === undefined) return err(res, 400, 'name and price are required')
      const np = { id: nextId(products), name, price: Number(price), description: description || '', stock: Number(stock), createdAt: new Date().toISOString() }
      products.push(np)
      return ok(res, np, 201)
    }
  }

  if ((m = matchPath('/products/:id', path))) {
    const idx = products.findIndex(x => x.id === m.id)
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Product not found')
      return ok(res, products[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Product not found')
      const { name, price, description, stock } = req.body || {}
      if (!name || price === undefined) return err(res, 400, 'name and price are required')
      products[idx] = { ...products[idx], name, price: Number(price), description: description ?? products[idx].description, stock: stock !== undefined ? Number(stock) : products[idx].stock }
      return ok(res, products[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Product not found')
      const allowed = ['name', 'price', 'description', 'stock']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = key === 'price' || key === 'stock' ? Number(req.body[key]) : req.body[key] }
      products[idx] = { ...products[idx], ...updates }
      return ok(res, products[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Product not found')
      products.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── CATEGORIES ─────────────────────────────────────────────────────────
  if (path === '/categories') {
    if (method === 'GET') {
      const { parentId } = query
      let list = [...categories]
      if (parentId !== undefined) list = list.filter(c => c.parentId === (parentId === 'null' ? null : parentId))
      return ok(res, { data: list })
    }
    if (method === 'POST') {
      const admin = requireAdmin(req, res); if (!admin) return
      const { name, slug, description, parentId, image } = req.body || {}
      if (!name || !slug) return err(res, 400, 'name and slug are required')
      if (categories.find(c => c.slug === slug)) return err(res, 400, 'Slug already exists')
      const nc = { id: nextId(categories), name, slug, description: description||null, parentId: parentId||null, image: image||null }
      categories.push(nc)
      return ok(res, nc, 201)
    }
  }

  // ── POSTS ──────────────────────────────────────────────────────────────
  if (path === '/posts') {
    if (method === 'GET') {
      const { page, limit, userId, tag, search } = query
      let list = [...posts]
      if (userId) list = list.filter(p => p.userId === userId)
      if (tag)    list = list.filter(p => p.tags?.includes(tag))
      if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { title, content, tags } = req.body || {}
      if (!title || !content) return err(res, 400, 'title and content are required')
      const np = { id: nextId(posts), title, content,
        excerpt: content.slice(0, 150) + '...', tags: tags||[], status: 'published',
        userId: '1', createdAt: new Date().toISOString() }
      posts.push(np)
      return ok(res, np, 201)
    }
  }

  if ((m = matchPath('/posts/:id', path))) {
    const idx = posts.findIndex(p => p.id === m.id)
    if (idx === -1) return err(res, 404, 'Post not found')
    if (method === 'GET') return ok(res, posts[idx])
    if (method === 'PUT') {
      const { title, content, tags } = req.body || {}
      if (!title || !content) return err(res, 400, 'title and content are required')
      posts[idx] = { ...posts[idx], title, content, tags: tags || posts[idx].tags }
      return ok(res, posts[idx])
    }
    if (method === 'PATCH') {
      const allowed = ['title', 'content', 'tags']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      posts[idx] = { ...posts[idx], ...updates }
      return ok(res, posts[idx])
    }
    if (method === 'DELETE') {
      posts.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── TODOS ───────────────────────────────────────────────────────────────
  if (path === '/todos') {
    if (method === 'GET') {
      const { completed, priority } = query
      let list = [...todos]
      if (completed !== undefined) list = list.filter(t => t.completed === (completed === 'true'))
      if (priority) list = list.filter(t => t.priority === priority)
      return ok(res, { data: list })
    }
    if (method === 'POST') {
      const { title, description, priority = 'medium', dueDate } = req.body || {}
      if (!title?.trim()) return err(res, 400, 'title is required')
      const nt = { id: nextId(todos), title: title.trim(), description: description||null,
        priority, completed: false, dueDate: dueDate||null, createdAt: new Date().toISOString() }
      todos.push(nt)
      return ok(res, nt, 201)
    }
  }

  if ((m = matchPath('/todos/:id/toggle', path)) && method === 'PATCH') {
    const idx = todos.findIndex(t => t.id === m.id)
    if (idx === -1) return err(res, 404, 'Todo not found')
    todos[idx] = { ...todos[idx], completed: !todos[idx].completed }
    return ok(res, todos[idx])
  }

  if ((m = matchPath('/todos/:id', path)) && method === 'DELETE') {
    const idx = todos.findIndex(t => t.id === m.id)
    if (idx === -1) return err(res, 404, 'Todo not found')
    todos.splice(idx, 1)
    return res.status(204).end()
  }

  // ── COUNTRIES ──────────────────────────────────────────────────────────
  if (path === '/countries') {
    if (method === 'GET') {
      const { region, search } = query
      let list = [...countries]
      if (region) list = list.filter(c => c.region.toLowerCase() === region.toLowerCase())
      if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      return ok(res, { data: list, total: list.length })
    }
    if (method === 'POST') {
      const { name, code, capital, region, population, area, currency, language, flag } = req.body || {}
      if (!name || !code) return err(res, 400, 'name and code are required')
      if (countries.find(c => c.code.toUpperCase() === code.toUpperCase())) return err(res, 409, 'Country code already exists')
      const nc = { id: nextId(countries), name, code: code.toUpperCase(), capital: capital || '',
        region: region || '', population: population || 0, area: area || 0,
        currency: currency || '', language: language || '', flag: flag || '' }
      countries.push(nc)
      return ok(res, nc, 201)
    }
  }
  if ((m = matchPath('/countries/:code', path))) {
    const idx = countries.findIndex(c => c.code.toUpperCase() === m.code.toUpperCase())
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Country not found')
      return ok(res, countries[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Country not found')
      const { name, capital, region, population, area, currency, language, flag } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      countries[idx] = { ...countries[idx], name, capital: capital ?? countries[idx].capital,
        region: region ?? countries[idx].region, population: population ?? countries[idx].population,
        area: area ?? countries[idx].area, currency: currency ?? countries[idx].currency,
        language: language ?? countries[idx].language, flag: flag ?? countries[idx].flag }
      return ok(res, countries[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Country not found')
      const allowed = ['name','capital','region','population','area','currency','language','flag']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      countries[idx] = { ...countries[idx], ...updates }
      return ok(res, countries[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Country not found')
      countries.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── SPORTS ─────────────────────────────────────────────────────────────
  // ── MOVIES ─────────────────────────────────────────────────────────────
  if (path === '/movies') {
    if (method === 'GET') {
      const { page, limit, genre, year, minRating, search } = query
      let list = [...movies]
      if (genre)     list = list.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
      if (year)      list = list.filter(m => m.year === Number(year))
      if (minRating) list = list.filter(m => m.rating >= Number(minRating))
      if (search)    list = list.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { title, genre, year, rating, director, cast, duration, language, description } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      const newId = nextId(movies)
      const nm = { id: newId, title, description: description || '', genre: genre || [], year: year || null,
        rating: rating || null, director: director || '', cast: cast || [], duration: duration || null,
        language: language || 'English', poster: `https://picsum.photos/seed/movie${newId}/300/450`,
        createdAt: new Date().toISOString() }
      movies.push(nm)
      return ok(res, nm, 201)
    }
  }
  if ((m = matchPath('/movies/:id', path))) {
    const idx = movies.findIndex(x => x.id === m.id)
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Movie not found')
      return ok(res, movies[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Movie not found')
      const { title, genre, year, rating, director, cast, duration, language, description } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      movies[idx] = { ...movies[idx], title, description: description ?? movies[idx].description,
        genre: genre ?? movies[idx].genre, year: year ?? movies[idx].year, rating: rating ?? movies[idx].rating,
        director: director ?? movies[idx].director, cast: cast ?? movies[idx].cast,
        duration: duration ?? movies[idx].duration, language: language ?? movies[idx].language }
      return ok(res, movies[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Movie not found')
      const allowed = ['title','description','genre','year','rating','director','cast','duration','language']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      movies[idx] = { ...movies[idx], ...updates }
      return ok(res, movies[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Movie not found')
      movies.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── BOOKS ──────────────────────────────────────────────────────────────
  if (path === '/books') {
    if (method === 'GET') {
      const { page, limit, genre, author, search } = query
      let list = [...books]
      if (genre)  list = list.filter(b => b.genre.toLowerCase() === genre.toLowerCase())
      if (author) list = list.filter(b => b.author.toLowerCase().includes(author.toLowerCase()))
      if (search) list = list.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search))
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { title, author, isbn, genre, description, year, pages, rating, publisher, language } = req.body || {}
      if (!title || !author) return err(res, 400, 'title and author are required')
      if (isbn && books.find(b => b.isbn === isbn)) return err(res, 409, 'ISBN already exists')
      const newId = nextId(books)
      const nb = { id: newId, title, author, isbn: isbn || '', genre: genre || 'General',
        description: description || '', year: year || null, pages: pages || null,
        rating: rating || null, publisher: publisher || '', language: language || 'English',
        cover: `https://picsum.photos/seed/book${newId}/200/300`, createdAt: new Date().toISOString() }
      books.push(nb)
      return ok(res, nb, 201)
    }
  }
  if ((m = matchPath('/books/:isbn', path))) {
    const idx = books.findIndex(b => b.isbn === m.isbn)
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Book not found')
      return ok(res, books[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Book not found')
      const { title, author, genre, description, year, pages, rating, publisher, language } = req.body || {}
      if (!title || !author) return err(res, 400, 'title and author are required')
      books[idx] = { ...books[idx], title, author, genre: genre ?? books[idx].genre,
        description: description ?? books[idx].description, year: year ?? books[idx].year,
        pages: pages ?? books[idx].pages, rating: rating ?? books[idx].rating,
        publisher: publisher ?? books[idx].publisher, language: language ?? books[idx].language }
      return ok(res, books[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Book not found')
      const allowed = ['title','author','genre','description','year','pages','rating','publisher','language']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      books[idx] = { ...books[idx], ...updates }
      return ok(res, books[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Book not found')
      books.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────
  // ── RECIPES ────────────────────────────────────────────────────────────
  if (path === '/recipes') {
    if (method === 'GET') {
      const { page, limit, category, difficulty, search, maxCalories } = query
      let list = [...recipes]
      if (category)    list = list.filter(r => r.category.toLowerCase() === category.toLowerCase())
      if (difficulty)  list = list.filter(r => r.difficulty === difficulty)
      if (maxCalories) list = list.filter(r => r.calories <= Number(maxCalories))
      if (search)      list = list.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { title, description, ingredients, steps, category, prepTime, cookTime, servings, difficulty, calories, tags } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      const newId = nextId(recipes)
      const nr = { id: newId, title, description: description || '', ingredients: ingredients || [],
        steps: steps || [], category: category || 'Other', prepTime: prepTime || 0, cookTime: cookTime || 0,
        servings: servings || 1, difficulty: difficulty || 'easy', calories: calories || 0,
        tags: tags || [], image: `https://picsum.photos/seed/recipe${newId}/600/400`, createdAt: new Date().toISOString() }
      recipes.push(nr)
      return ok(res, nr, 201)
    }
  }
  if ((m = matchPath('/recipes/:id', path))) {
    const idx = recipes.findIndex(r => r.id === m.id)
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Recipe not found')
      return ok(res, recipes[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Recipe not found')
      const { title, description, ingredients, steps, category, prepTime, cookTime, servings, difficulty, calories, tags } = req.body || {}
      if (!title) return err(res, 400, 'title is required')
      recipes[idx] = { ...recipes[idx], title, description: description ?? recipes[idx].description,
        ingredients: ingredients ?? recipes[idx].ingredients, steps: steps ?? recipes[idx].steps,
        category: category ?? recipes[idx].category, prepTime: prepTime ?? recipes[idx].prepTime,
        cookTime: cookTime ?? recipes[idx].cookTime, servings: servings ?? recipes[idx].servings,
        difficulty: difficulty ?? recipes[idx].difficulty, calories: calories ?? recipes[idx].calories,
        tags: tags ?? recipes[idx].tags }
      return ok(res, recipes[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Recipe not found')
      const allowed = ['title','description','ingredients','steps','category','prepTime','cookTime','servings','difficulty','calories','tags']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      recipes[idx] = { ...recipes[idx], ...updates }
      return ok(res, recipes[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Recipe not found')
      recipes.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── ANIMALS ────────────────────────────────────────────────────────────
  if (path === '/animals') {
    if (method === 'GET') {
      const { page, limit, category, habitat, diet, conservationStatus, search } = query
      let list = [...animals]
      if (category)           list = list.filter(a => a.category.toLowerCase() === category.toLowerCase())
      if (habitat)            list = list.filter(a => a.habitat.toLowerCase() === habitat.toLowerCase())
      if (diet)               list = list.filter(a => a.diet.toLowerCase() === diet.toLowerCase())
      if (conservationStatus) list = list.filter(a => a.conservationStatus.toLowerCase() === conservationStatus.toLowerCase())
      if (search)             list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.scientificName.toLowerCase().includes(search.toLowerCase()))
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const { name, scientificName, category, habitat, diet, lifespan, weight, length: len, conservationStatus, description } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      const newId = nextId(animals)
      const na = { id: newId, name, scientificName: scientificName || '', category: category || 'Mammal',
        habitat: habitat || '', diet: diet || 'Omnivore', lifespan: lifespan || null, weight: weight || '',
        length: len || '', conservationStatus: conservationStatus || 'Least Concern',
        description: description || '', image: `https://picsum.photos/seed/animal${newId}/600/400`,
        createdAt: new Date().toISOString() }
      animals.push(na)
      return ok(res, na, 201)
    }
  }
  if ((m = matchPath('/animals/:id', path))) {
    const idx = animals.findIndex(a => a.id === m.id)
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Animal not found')
      return ok(res, animals[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Animal not found')
      const { name, scientificName, category, habitat, diet, lifespan, weight, length: len, conservationStatus, description } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      animals[idx] = { ...animals[idx], name, scientificName: scientificName ?? animals[idx].scientificName,
        category: category ?? animals[idx].category, habitat: habitat ?? animals[idx].habitat,
        diet: diet ?? animals[idx].diet, lifespan: lifespan ?? animals[idx].lifespan,
        weight: weight ?? animals[idx].weight, length: len ?? animals[idx].length,
        conservationStatus: conservationStatus ?? animals[idx].conservationStatus,
        description: description ?? animals[idx].description }
      return ok(res, animals[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Animal not found')
      const allowed = ['name','scientificName','category','habitat','diet','lifespan','weight','length','conservationStatus','description']
      const updates = {}
      for (const key of allowed) { if (req.body?.[key] !== undefined) updates[key] = req.body[key] }
      animals[idx] = { ...animals[idx], ...updates }
      return ok(res, animals[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Animal not found')
      animals.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── STUDENTS ───────────────────────────────────────────────────────────
  if (path === '/students') {
    if (method === 'GET') {
      const { search, gender } = query
      let list = [...students]
      if (search) list = list.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.includes(search) ||
        s.id.includes(search)
      )
      if (gender) list = list.filter(s => s.gender === gender)
      return ok(res, { data: list, total: list.length })
    }
    if (method === 'POST') {
      const { studentId, name, gender } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      if (studentId && students.find(s => s.studentId === String(studentId)))
        return err(res, 409, 'studentId already exists')
      const ns = {
        id: nextId(students),
        studentId: studentId ? String(studentId) : '',
        name,
        gender: gender || '',
        createdAt: new Date().toISOString(),
      }
      students.push(ns)
      return ok(res, ns, 201)
    }
  }

  if ((m = matchPath('/students/:id', path))) {
    const idx = students.findIndex(s => s.id === m.id)
    if (method === 'GET') {
      if (idx === -1) return err(res, 404, 'Student not found')
      return ok(res, students[idx])
    }
    if (method === 'PUT') {
      if (idx === -1) return err(res, 404, 'Student not found')
      const { studentId, name, gender } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      students[idx] = { ...students[idx], ...(studentId && { studentId: String(studentId) }), name, gender: gender ?? students[idx].gender }
      return ok(res, students[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Student not found')
      const updates = {}
      if (req.body?.studentId !== undefined) updates.studentId = String(req.body.studentId)
      if (req.body?.name !== undefined) updates.name = req.body.name
      if (req.body?.gender !== undefined) updates.gender = req.body.gender
      students[idx] = { ...students[idx], ...updates }
      return ok(res, students[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return err(res, 404, 'Student not found')
      students.splice(idx, 1)
      return res.status(204).end()
    }
  }

  // ── 404 ────────────────────────────────────────────────────────────────
  return err(res, 404, `Route not found: ${method} /api${path}`)
}
