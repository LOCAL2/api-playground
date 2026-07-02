import { orders } from '../_lib/db.js'
import { ok, err, handleOptions, requireAdmin } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { from, to, groupBy = 'month' } = req.query
  if (!from || !to) return err(res, 400, 'from and to query parameters are required')

  const fromDate = new Date(from)
  const toDate = new Date(to)
  if (isNaN(fromDate) || isNaN(toDate)) return err(res, 400, 'Invalid date format. Use ISO 8601 (YYYY-MM-DD)')
  if (fromDate > toDate) return err(res, 400, 'from must be before to')

  const filtered = orders.filter(o => {
    const d = new Date(o.createdAt)
    return d >= fromDate && d <= toDate && o.status !== 'cancelled'
  })

  // Group by period
  const grouped = {}
  for (const order of filtered) {
    const d = new Date(order.createdAt)
    let key
    if (groupBy === 'day')   key = d.toISOString().slice(0, 10)
    else if (groupBy === 'week') key = `${d.getFullYear()}-W${String(Math.ceil((d.getDate()) / 7)).padStart(2, '0')}`
    else key = d.toISOString().slice(0, 7)  // month

    grouped[key] = (grouped[key] || 0) + order.total
  }

  const data = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, revenue]) => ({ period, revenue: Math.round(revenue * 100) / 100 }))

  return ok(res, { data, from, to, groupBy, totalRevenue: data.reduce((s, d) => s + d.revenue, 0) })
}
