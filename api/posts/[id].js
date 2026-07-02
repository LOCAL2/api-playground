import { posts } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { id } = req.query
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return err(res, 404, 'Post not found')

  if (req.method === 'GET') return ok(res, posts[idx])

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res)
    if (!auth) return
    if (auth.role !== 'admin' && posts[idx].userId !== auth.sub)
      return err(res, 403, 'Not the author')

    const { title, content, tags, status } = req.body || {}
    if (!title || !content) return err(res, 400, 'title and content are required')
    posts[idx] = { ...posts[idx], title, content, tags: tags || posts[idx].tags, status: status || posts[idx].status }
    return ok(res, posts[idx])
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res)
    if (!auth) return
    if (auth.role !== 'admin' && posts[idx].userId !== auth.sub)
      return err(res, 403, 'Not the author or admin')
    posts.splice(idx, 1)
    return res.status(204).end()
  }

  return err(res, 405, 'Method not allowed')
}
