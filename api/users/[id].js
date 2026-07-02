import bcrypt from 'bcryptjs'
import { users } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth, safeUser } from '../_lib/helpers.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  const { id } = req.query
  const userIndex = users.findIndex(u => u.id === id)
  if (userIndex === -1) return err(res, 404, 'User not found')

  // GET /api/users/:id
  if (req.method === 'GET') {
    const auth = requireAuth(req, res)
    if (!auth) return
    return ok(res, safeUser(users[userIndex]))
  }

  // PUT /api/users/:id — full update
  if (req.method === 'PUT') {
    const auth = requireAuth(req, res)
    if (!auth) return

    if (auth.sub !== id && auth.role !== 'admin')
      return err(res, 403, 'Cannot update another user\'s profile')

    const { name, email, avatar, bio } = req.body || {}
    if (!name || !email) return err(res, 400, 'name and email are required')

    users[userIndex] = { ...users[userIndex], name, email, avatar, bio }
    return ok(res, safeUser(users[userIndex]))
  }

  // PATCH /api/users/:id — partial update
  if (req.method === 'PATCH') {
    const auth = requireAuth(req, res)
    if (!auth) return

    if (auth.sub !== id && auth.role !== 'admin')
      return err(res, 403, 'Cannot update another user\'s profile')

    const allowed = ['name', 'avatar', 'bio']
    const updates = {}
    for (const key of allowed) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key]
    }
    users[userIndex] = { ...users[userIndex], ...updates }
    return ok(res, safeUser(users[userIndex]))
  }

  // DELETE /api/users/:id — admin only
  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res)
    if (!auth) return
    if (auth.role !== 'admin') return err(res, 403, 'Admin role required')

    users.splice(userIndex, 1)
    return res.status(204).end()
  }

  return err(res, 405, 'Method not allowed')
}
