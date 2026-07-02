import { users, products, orders, posts } from '../_lib/db.js'
import { ok, err, handleOptions, requireAdmin } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { period = 'month' } = req.query

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0)
  const stats = {
    period,
    users: { total: users.length, admins: users.filter(u => u.role === 'admin').length },
    products: { total: products.length, outOfStock: products.filter(p => p.stock === 0).length },
    orders: {
      total: orders.length,
      byStatus: {
        pending:    orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped:    orders.filter(o => o.status === 'shipped').length,
        delivered:  orders.filter(o => o.status === 'delivered').length,
        cancelled:  orders.filter(o => o.status === 'cancelled').length,
      },
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    },
    posts: { total: posts.length, published: posts.filter(p => p.status === 'published').length, draft: posts.filter(p => p.status === 'draft').length },
    generatedAt: new Date().toISOString(),
  }

  return ok(res, stats)
}
