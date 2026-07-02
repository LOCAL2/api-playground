import { orders } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { id } = req.query
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return err(res, 404, 'Order not found')

  const auth = requireAuth(req, res)
  if (!auth) return

  const order = orders[idx]
  // Non-admin can only access their own orders
  if (auth.role !== 'admin' && order.userId !== auth.sub)
    return err(res, 403, 'Cannot access another user\'s order')

  if (req.method === 'GET') return ok(res, order)

  if (req.method === 'DELETE') {
    if (!['pending', 'processing'].includes(order.status))
      return err(res, 400, 'Only pending or processing orders can be cancelled')
    orders[idx] = { ...order, status: 'cancelled' }
    return ok(res, { message: 'Order cancelled, refund will be processed within 3-5 business days' })
  }

  return err(res, 405, 'Method not allowed')
}
