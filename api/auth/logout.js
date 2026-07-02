import { refreshTokens } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return err(res, 405, 'Method not allowed')

  const user = requireAuth(req, res)
  if (!user) return

  // Remove all refresh tokens for this user (best-effort in memory store)
  refreshTokens.clear()
  return ok(res, { message: 'Logged out successfully' })
}
