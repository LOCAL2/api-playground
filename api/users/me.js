import { users } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth, safeUser } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const payload = requireAuth(req, res)
  if (!payload) return

  const user = users.find(u => u.id === payload.sub)
  if (!user) return err(res, 404, 'User not found')

  return ok(res, safeUser(user))
}
