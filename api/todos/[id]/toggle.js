import { todos } from '../../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'PATCH') return err(res, 405, 'Method not allowed')

  const auth = requireAuth(req, res)
  if (!auth) return

  const { id } = req.query
  const idx = todos.findIndex(t => t.id === id && t.userId === auth.sub)
  if (idx === -1) return err(res, 404, 'Todo not found')

  todos[idx] = { ...todos[idx], completed: !todos[idx].completed }
  return ok(res, todos[idx])
}
