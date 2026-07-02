import { todos, nextId } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const auth = requireAuth(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    const { completed, priority } = req.query
    let list = todos.filter(t => t.userId === auth.sub)
    if (completed !== undefined) list = list.filter(t => t.completed === (completed === 'true'))
    if (priority) list = list.filter(t => t.priority === priority)
    return ok(res, { data: list })
  }

  if (req.method === 'POST') {
    const { title, description, priority = 'medium', dueDate } = req.body || {}
    if (!title?.trim()) return err(res, 400, 'title is required')

    const newTodo = {
      id: nextId(todos), userId: auth.sub,
      title: title.trim(), description: description || null,
      priority, completed: false,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    }
    todos.push(newTodo)
    return ok(res, newTodo, 201)
  }

  return err(res, 405, 'Method not allowed')
}
