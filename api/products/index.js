import { products, nextId } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  // GET /api/products
  if (req.method === 'GET') {
    const { page, limit, category, minPrice, maxPrice, search, sort = 'createdAt', order = 'desc', inStock } = req.query
    let list = [...products]

    if (category) list = list.filter(p => p.categoryId === category)
    if (minPrice)  list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice)  list = list.filter(p => p.price <= Number(maxPrice))
    if (inStock === 'true') list = list.filter(p => p.stock > 0)
    if (search)    list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))

    list.sort((a, b) => {
      if (sort === 'price') return order === 'asc' ? a.price - b.price : b.price - a.price
      return order === 'asc'
        ? String(a[sort] ?? '').localeCompare(String(b[sort] ?? ''))
        : String(b[sort] ?? '').localeCompare(String(a[sort] ?? ''))
    })

    const p = Math.max(1, Number(page) || 1)
    const l = Math.min(100, Math.max(1, Number(limit) || 20))
    const total = list.length
    return ok(res, { data: list.slice((p - 1) * l, p * l), pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } })
  }

  // POST /api/products
  if (req.method === 'POST') {
    const auth = requireAuth(req, res)
    if (!auth) return
    if (auth.role !== 'admin') return err(res, 403, 'Admin or seller role required')

    const { name, description, price, categoryId, stock, images, sku, weight } = req.body || {}
    if (!name || !description || price == null || !categoryId || stock == null)
      return err(res, 400, 'name, description, price, categoryId, and stock are required')

    const newProduct = {
      id: nextId(products), name, description,
      price: Number(price), categoryId, stock: Number(stock),
      images: images || [], sku: sku || null, weight: weight || null,
      createdAt: new Date().toISOString(),
    }
    products.push(newProduct)
    return ok(res, newProduct, 201)
  }

  return err(res, 405, 'Method not allowed')
}
