import bcrypt from 'bcryptjs'
import { users, refreshTokens } from '../_lib/db.js'
import { ok, err, handleOptions, signAccess, signRefresh, safeUser } from '../_lib/helpers.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return err(res, 405, 'Method not allowed')

  const { email, password } = req.body || {}
  if (!email || !password) return err(res, 400, 'email and password are required')

  const user = users.find(u => u.email === email)
  if (!user) return err(res, 401, 'Invalid email or password')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return err(res, 401, 'Invalid email or password')

  const payload = { sub: user.id, email: user.email, role: user.role }
  const accessToken  = signAccess(payload)
  const refreshToken = signRefresh(payload)
  refreshTokens.add(refreshToken)

  return ok(res, {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 900,
    user: safeUser(user),
  })
}
