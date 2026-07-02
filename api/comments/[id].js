import { comments } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'DELETE') return err(res, 405, 'Method not allowed')

  const auth = requireAuth(req, res)
  if (!auth) return

  const { id } = req.query
  const idx = comments.findIndex(c => c.id === id)
  if (idx === -1) return err(res, 404, 'Comment not found')

  if (auth.role !== 'admin' && comments[idx].userId !== auth.sub)
    return err(res, 403, 'Not the comment author or admin')

  comments.splice(idx, 1)
  return res.status(204).end()
}
