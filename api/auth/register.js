import bcrypt from 'bcryptjs'
import { users, nextId } from '../_lib/db.js'
import { ok, err, handleOptions, signAccess, signRefresh, safeUser } from '../_lib/helpers.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return err(res, 405, 'Method not allowed')

  const { name, email, password, confirmPassword } = req.body || {}
  if (!name || !email || !password || !confirmPassword)
    return err(res, 400, 'name, email, password, and confirmPassword are required')

  if (password !== confirmPassword)
    return err(res, 400, 'Passwords do not match')

  if (password.length < 8)
    return err(res, 400, 'Password must be at least 8 characters')

  if (users.find(u => u.email === email))
    return err(res, 409, 'Email already registered')

  const hashed = await bcrypt.hash(password, 10)
  const newUser = {
    id: nextId(users),
    name,
    email,
    password: hashed,
    role: 'user',
    avatar: `https://i.pravatar.cc/150?u=${email}`,
    bio: '',
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)

  const payload = { sub: newUser.id, email: newUser.email, role: newUser.role }
  return ok(res, { user: safeUser(newUser), accessToken: signAccess(payload), refreshToken: signRefresh(payload) }, 201)
}
