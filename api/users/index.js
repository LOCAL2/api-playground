import { users } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth, requireAdmin, safeUser, paginate, nextId } from '../_lib/helpers.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  // GET /api/users — list all (admin only)
  if (req.method === 'GET') {
    const admin = requireAdmin(req, res)
    if (!admin) return

    const { page, limit, sort = 'createdAt', order = 'desc' } = req.query
    let list = [...users].map(safeUser)

    list.sort((a, b) => {
      const v = String(a[sort] ?? '').localeCompare(String(b[sort] ?? ''))
      return order === 'desc' ? -v : v
    })

    return ok(res, paginate(list, page, limit))
  }

  // POST /api/users — create user (admin only)
  if (req.method === 'POST') {
    const admin = requireAdmin(req, res)
    if (!admin) return

    const { name, email, password, role = 'user', avatar } = req.body || {}
    if (!name || !email || !password)
      return err(res, 400, 'name, email, and password are required')

    if (users.find(u => u.email === email))
      return err(res, 409, 'Email already exists')

    const hashed = await bcrypt.hash(password, 10)
    const newUser = {
      id: nextId(users), name, email,
      password: hashed, role,
      avatar: avatar || `https://i.pravatar.cc/150?u=${email}`,
      bio: '', createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    return ok(res, safeUser(newUser), 201)
  }

  return err(res, 405, 'Method not allowed')
}
