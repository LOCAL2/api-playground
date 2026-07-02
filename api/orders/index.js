import { orders, products, nextId } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth, paginate } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  // GET /api/orders
  if (req.method === 'GET') {
    const auth = requireAuth(req, res)
    if (!auth) return

    const { page, limit, status, userId } = req.query
    let list = auth.role === 'admin'
      ? [...orders]
      : orders.filter(o => o.userId === auth.sub)

    if (status) list = list.filter(o => o.status === status)
    if (userId && auth.role === 'admin') list = list.filter(o => o.userId === userId)

    return ok(res, paginate(list, page, limit))
  }

  // POST /api/orders
  if (req.method === 'POST') {
    const auth = requireAuth(req, res)
    if (!auth) return

    const { items, shippingAddressId, paymentMethodId, couponCode } = req.body || {}
    if (!items?.length || !shippingAddressId || !paymentMethodId)
      return err(res, 400, 'items, shippingAddressId, and paymentMethodId are required')

    // Validate items and compute total
    let total = 0
    const orderItems = []
    for (const item of items) {
      const product = products.find(p => p.id === String(item.productId))
      if (!product) return err(res, 400, `Product ${item.productId} not found`)
      if (product.stock < item.quantity) return err(res, 400, `Insufficient stock for ${product.name}`)
      total += product.price * item.quantity
      orderItems.push({ productId: String(item.productId), quantity: item.quantity, price: product.price })
    }

    if (couponCode === 'SAVE10') total = total * 0.9

    // Deduct stock
    for (const item of orderItems) {
      const p = products.find(pr => pr.id === item.productId)
      if (p) p.stock -= item.quantity
    }

    const newOrder = {
      id: nextId(orders), userId: auth.sub,
      items: orderItems, total: Math.round(total * 100) / 100,
      status: 'pending', trackingNumber: null,
      shippingAddressId, paymentMethodId,
      createdAt: new Date().toISOString(),
    }
    orders.push(newOrder)
    return ok(res, newOrder, 201)
  }

  return err(res, 405, 'Method not allowed')
}
