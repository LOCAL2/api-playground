import { products } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { id } = req.query
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return err(res, 404, 'Product not found')

  if (req.method === 'GET') return ok(res, products[idx])

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res)
    if (!auth) return
    const { name, description, price, categoryId, stock } = req.body || {}
    if (!name || !description || price == null || !categoryId || stock == null)
      return err(res, 400, 'name, description, price, categoryId, and stock are required')
    products[idx] = { ...products[idx], name, description, price: Number(price), categoryId, stock: Number(stock) }
    return ok(res, products[idx])
  }

  if (req.method === 'PATCH') {
    const auth = requireAuth(req, res)
    if (!auth) return
    const allowed = ['price', 'stock', 'images', 'name', 'description']
    const updates = {}
    for (const key of allowed) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key]
    }
    products[idx] = { ...products[idx], ...updates }
    return ok(res, products[idx])
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res)
    if (!auth) return
    if (auth.role !== 'admin') return err(res, 403, 'Admin role required')
    products.splice(idx, 1)
    return res.status(204).end()
  }

  return err(res, 405, 'Method not allowed')
}
