import { orders } from '../../_lib/db.js'
import { ok, err, handleOptions, requireAdmin } from '../../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'PATCH') return err(res, 405, 'Method not allowed')

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { id } = req.query
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return err(res, 404, 'Order not found')

  const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled']
  const { status, trackingNumber } = req.body || {}
  if (!status || !validStatuses.includes(status))
    return err(res, 400, `status must be one of: ${validStatuses.join(', ')}`)

  orders[idx] = { ...orders[idx], status, ...(trackingNumber && { trackingNumber }) }
  return ok(res, orders[idx])
}
