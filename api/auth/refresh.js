import { refreshTokens } from '../_lib/db.js'
import { ok, err, handleOptions, verifyRefresh, signAccess } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return err(res, 405, 'Method not allowed')

  const { refreshToken } = req.body || {}
  if (!refreshToken) return err(res, 400, 'refreshToken is required')

  if (!refreshTokens.has(refreshToken)) return err(res, 401, 'Invalid or expired refresh token')

  const payload = verifyRefresh(refreshToken)
  if (!payload) return err(res, 401, 'Invalid or expired refresh token')

  // Token rotation
  refreshTokens.delete(refreshToken)
  const newAccess = signAccess({ sub: payload.sub, email: payload.email, role: payload.role })

  return ok(res, { accessToken: newAccess, tokenType: 'Bearer', expiresIn: 900 })
}
