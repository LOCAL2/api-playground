import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'api-playground-dev-secret-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'api-playground-refresh-secret'

/** Standard CORS + JSON headers */
export function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json')
  return res
}

/** Send JSON response */
export function json(res, status, data) {
  withCors(res)
  return res.status(status).json(data)
}

/** Success response wrapper */
export function ok(res, data, status = 200) {
  return json(res, status, { success: true, data })
}

/** Error response wrapper */
export function err(res, status, message, details = undefined) {
  return json(res, status, { success: false, error: { message, ...(details && { details }) } })
}

/** Paginate an array */
export function paginate(arr, page = 1, limit = 20) {
  const p = Math.max(1, Number(page))
  const l = Math.min(100, Math.max(1, Number(limit)))
  const total = arr.length
  const totalPages = Math.ceil(total / l)
  const data = arr.slice((p - 1) * l, p * l)
  return { data, pagination: { page: p, limit: l, total, totalPages } }
}

/** Sign JWT access token (15 min) */
export function signAccess(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

/** Sign JWT refresh token (7 days) */
export function signRefresh(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

/** Verify access token — returns payload or null */
export function verifyAccess(token) {
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

/** Verify refresh token — returns payload or null */
export function verifyRefresh(token) {
  try { return jwt.verify(token, JWT_REFRESH_SECRET) } catch { return null }
}

/** Extract Bearer token from Authorization header */
export function extractToken(req) {
  const auth = req.headers['authorization'] || ''
  if (!auth.startsWith('Bearer ')) return null
  return auth.slice(7)
}

/** Middleware: require valid JWT. Returns user payload or sends 401. */
export function requireAuth(req, res) {
  const token = extractToken(req)
  if (!token) { err(res, 401, 'Missing Authorization header'); return null }
  const payload = verifyAccess(token)
  if (!payload) { err(res, 401, 'Invalid or expired token'); return null }
  return payload
}

/** Middleware: require admin role */
export function requireAdmin(req, res) {
  const user = requireAuth(req, res)
  if (!user) return null
  if (user.role !== 'admin') { err(res, 403, 'Admin role required'); return null }
  return user
}

/** Strip password from user object */
export function safeUser(u) {
  const { password, ...rest } = u
  return rest
}

/** Handle OPTIONS preflight */
export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res)
    res.status(204).end()
    return true
  }
  return false
}
