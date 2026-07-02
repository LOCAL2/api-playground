/**
 * Single Vercel Serverless Function — handles ALL /api/* routes
 * Stays within Hobby plan's 12-function limit (counts as 1)
 */
import bcrypt from 'bcryptjs'
import {
  users, products, categories, posts, students,
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
      if (inStock === 'true') list = list.filter(p => p.stock > 0)
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

  // ── COMMENTS ───────────────────────────────────────────────────────────
  if ((m = matchPath('/comments/:id', path)) && method === 'DELETE') {
    const auth = requireAuth(req, res); if (!auth) return
    const idx = comments.findIndex(c => c.id === m.id)
    if (idx === -1) return err(res, 404, 'Comment not found')
    if (auth.role !== 'admin' && comments[idx].userId !== auth.sub) return err(res, 403, 'Not the comment author or admin')
    comments.splice(idx, 1)
    return res.status(204).end()
  }

  // ── TODOS ───────────────────────────────────────────────────────────────
  if (path === '/todos') {
    const auth = requireAuth(req, res); if (!auth) return
    if (method === 'GET') {
      const { completed, priority } = query
      let list = todos.filter(t => t.userId === auth.sub)
      if (completed !== undefined) list = list.filter(t => t.completed === (completed === 'true'))
      if (priority) list = list.filter(t => t.priority === priority)
      return ok(res, { data: list })
    }
    if (method === 'POST') {
      const { title, description, priority = 'medium', dueDate } = req.body || {}
      if (!title?.trim()) return err(res, 400, 'title is required')
      const nt = { id: nextId(todos), userId: auth.sub, title: title.trim(), description: description||null,
        priority, completed: false, dueDate: dueDate||null, createdAt: new Date().toISOString() }
      todos.push(nt)
      return ok(res, nt, 201)
    }
  }

  if ((m = matchPath('/todos/:id/toggle', path)) && method === 'PATCH') {
    const auth = requireAuth(req, res); if (!auth) return
    const idx = todos.findIndex(t => t.id === m.id && t.userId === auth.sub)
    if (idx === -1) return err(res, 404, 'Todo not found')
    todos[idx] = { ...todos[idx], completed: !todos[idx].completed }
    return ok(res, todos[idx])
  }

  if ((m = matchPath('/todos/:id', path)) && method === 'DELETE') {
    const auth = requireAuth(req, res); if (!auth) return
    const idx = todos.findIndex(t => t.id === m.id && t.userId === auth.sub)
    if (idx === -1) return err(res, 404, 'Todo not found')
    todos.splice(idx, 1)
    return res.status(204).end()
  }

  // ── ORDERS ─────────────────────────────────────────────────────────────
  if (path === '/orders') {
    if (method === 'GET') {
      const auth = requireAuth(req, res); if (!auth) return
      const { page, limit, status } = query
      let list = auth.role === 'admin' ? [...orders] : orders.filter(o => o.userId === auth.sub)
      if (status) list = list.filter(o => o.status === status)
      return ok(res, paginate(list, page, limit))
    }
    if (method === 'POST') {
      const auth = requireAuth(req, res); if (!auth) return
      const { items, shippingAddressId, paymentMethodId, couponCode } = req.body || {}
      if (!items?.length || !shippingAddressId || !paymentMethodId)
        return err(res, 400, 'items, shippingAddressId, and paymentMethodId are required')
      let total = 0; const orderItems = []
      for (const item of items) {
        const prod = products.find(p => p.id === String(item.productId))
        if (!prod) return err(res, 400, `Product ${item.productId} not found`)
        if (prod.stock < item.quantity) return err(res, 400, `Insufficient stock for ${prod.name}`)
        total += prod.price * item.quantity
        orderItems.push({ productId: String(item.productId), quantity: item.quantity, price: prod.price })
      }
      if (couponCode === 'SAVE10') total = total * 0.9
      for (const item of orderItems) { const p = products.find(pr => pr.id === item.productId); if (p) p.stock -= item.quantity }
      const no = { id: nextId(orders), userId: auth.sub, items: orderItems, total: Math.round(total*100)/100,
        status: 'pending', trackingNumber: null, shippingAddressId, paymentMethodId, createdAt: new Date().toISOString() }
      orders.push(no)
      return ok(res, no, 201)
    }
  }

  if ((m = matchPath('/orders/:id/status', path)) && method === 'PATCH') {
    const admin = requireAdmin(req, res); if (!admin) return
    const idx = orders.findIndex(o => o.id === m.id)
    if (idx === -1) return err(res, 404, 'Order not found')
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled']
    const { status, trackingNumber } = req.body || {}
    if (!status || !validStatuses.includes(status)) return err(res, 400, `status must be one of: ${validStatuses.join(', ')}`)
    orders[idx] = { ...orders[idx], status, ...(trackingNumber && { trackingNumber }) }
    return ok(res, orders[idx])
  }

  if ((m = matchPath('/orders/:id', path))) {
    const idx = orders.findIndex(o => o.id === m.id)
    if (idx === -1) return err(res, 404, 'Order not found')
    const auth = requireAuth(req, res); if (!auth) return
    if (auth.role !== 'admin' && orders[idx].userId !== auth.sub) return err(res, 403, 'Cannot access another user\'s order')
    if (method === 'GET') return ok(res, orders[idx])
    if (method === 'DELETE') {
      if (!['pending', 'processing'].includes(orders[idx].status)) return err(res, 400, 'Only pending or processing orders can be cancelled')
      orders[idx] = { ...orders[idx], status: 'cancelled' }
      return ok(res, { message: 'Order cancelled' })
    }
  }

  // ── COUNTRIES ──────────────────────────────────────────────────────────
  if (path === '/countries') {
    const { region, search } = query
    let list = [...countries]
    if (region) list = list.filter(c => c.region.toLowerCase() === region.toLowerCase())
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    return ok(res, { data: list, total: list.length })
  }
  if ((m = matchPath('/countries/:code', path))) {
    const country = countries.find(c => c.code.toUpperCase() === m.code.toUpperCase())
    if (!country) return err(res, 404, 'Country not found')
    return ok(res, country)
  }

  // ── SPORTS ─────────────────────────────────────────────────────────────
  if (path === '/sports/teams') {
    const { sport, country, league } = query
    let list = [...teams]
    if (sport)   list = list.filter(t => t.sport.toLowerCase() === sport.toLowerCase())
    if (country) list = list.filter(t => t.country.toUpperCase() === country.toUpperCase())
    if (league)  list = list.filter(t => t.league.toLowerCase().includes(league.toLowerCase()))
    return ok(res, { data: list, total: list.length })
  }
  if ((m = matchPath('/sports/players/:id', path))) {
    const player = players.find(p => p.id === m.id)
    if (!player) return err(res, 404, 'Player not found')
    return ok(res, player)
  }

  // ── MOVIES ─────────────────────────────────────────────────────────────
  if (path === '/movies') {
    const { page, limit, genre, year, minRating, search } = query
    let list = [...movies]
    if (genre)     list = list.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    if (year)      list = list.filter(m => m.year === Number(year))
    if (minRating) list = list.filter(m => m.rating >= Number(minRating))
    if (search)    list = list.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    return ok(res, paginate(list, page, limit))
  }
  if ((m = matchPath('/movies/:id', path))) {
    const movie = movies.find(x => x.id === m.id)
    if (!movie) return err(res, 404, 'Movie not found')
    return ok(res, movie)
  }

  // ── BOOKS ──────────────────────────────────────────────────────────────
  if (path === '/books') {
    const { page, limit, genre, author, search } = query
    let list = [...books]
    if (genre)  list = list.filter(b => b.genre.toLowerCase() === genre.toLowerCase())
    if (author) list = list.filter(b => b.author.toLowerCase().includes(author.toLowerCase()))
    if (search) list = list.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search))
    return ok(res, paginate(list, page, limit))
  }
  if ((m = matchPath('/books/:isbn', path))) {
    const book = books.find(b => b.isbn === m.isbn)
    if (!book) return err(res, 404, 'Book not found')
    return ok(res, book)
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────
  if (path === '/dashboard/stats') {
    const admin = requireAdmin(req, res); if (!admin) return
    const { period = 'month' } = query
    const totalRevenue = orders.reduce((s, o) => s + (o.status !== 'cancelled' ? o.total : 0), 0)
    return ok(res, {
      period,
      users: { total: users.length, admins: users.filter(u => u.role === 'admin').length },
      products: { total: products.length, outOfStock: products.filter(p => p.stock === 0).length },
      orders: { total: orders.length,
        byStatus: { pending: orders.filter(o=>o.status==='pending').length, processing: orders.filter(o=>o.status==='processing').length,
          shipped: orders.filter(o=>o.status==='shipped').length, delivered: orders.filter(o=>o.status==='delivered').length, cancelled: orders.filter(o=>o.status==='cancelled').length },
        totalRevenue: Math.round(totalRevenue * 100) / 100 },
      posts: { total: posts.length, published: posts.filter(p=>p.status==='published').length, draft: posts.filter(p=>p.status==='draft').length },
      generatedAt: new Date().toISOString(),
    })
  }

  if (path === '/dashboard/revenue') {
    const admin = requireAdmin(req, res); if (!admin) return
    const { from, to, groupBy = 'month' } = query
    if (!from || !to) return err(res, 400, 'from and to query parameters are required')
    const fromDate = new Date(from), toDate = new Date(to)
    if (isNaN(fromDate) || isNaN(toDate)) return err(res, 400, 'Invalid date format. Use ISO 8601 (YYYY-MM-DD)')
    if (fromDate > toDate) return err(res, 400, 'from must be before to')
    const filtered = orders.filter(o => { const d = new Date(o.createdAt); return d >= fromDate && d <= toDate && o.status !== 'cancelled' })
    const grouped = {}
    for (const order of filtered) {
      const d = new Date(order.createdAt)
      const key = groupBy === 'day' ? d.toISOString().slice(0,10) : groupBy === 'week' ? `${d.getFullYear()}-W${String(Math.ceil(d.getDate()/7)).padStart(2,'0')}` : d.toISOString().slice(0,7)
      grouped[key] = (grouped[key]||0) + order.total
    }
    const data = Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b)).map(([period,revenue])=>({ period, revenue: Math.round(revenue*100)/100 }))
    return ok(res, { data, from, to, groupBy, totalRevenue: data.reduce((s,d)=>s+d.revenue,0) })
  }

  // ── STUDENTS ───────────────────────────────────────────────────────────
  if (path === '/students') {
    if (method === 'GET') {
      const { search } = query
      let list = [...students]
      if (search) list = list.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.includes(search)
      )
      return ok(res, { data: list, total: list.length })
    }
    if (method === 'POST') {
      const { id, name, gender } = req.body || {}
      if (!id || !name) return err(res, 400, 'id and name are required')
      if (students.find(s => s.id === String(id))) return err(res, 409, 'Student ID already exists')
      const ns = { id: String(id), name, gender: gender || '', createdAt: new Date().toISOString() }
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
      const { name, gender } = req.body || {}
      if (!name) return err(res, 400, 'name is required')
      students[idx] = { ...students[idx], name, gender: gender ?? students[idx].gender }
      return ok(res, students[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return err(res, 404, 'Student not found')
      const updates = {}
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
