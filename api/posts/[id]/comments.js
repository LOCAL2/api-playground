import { comments, posts, nextId } from '../../_lib/db.js'
import { ok, err, handleOptions, requireAuth, paginate } from '../../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { id: postId } = req.query
  const post = posts.find(p => p.id === postId)
  if (!post) return err(res, 404, 'Post not found')

  if (req.method === 'GET') {
    const { page, limit } = req.query
    const list = comments.filter(c => c.postId === postId)
    return ok(res, paginate(list, page, limit))
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res)
    if (!auth) return

    const { content, parentId } = req.body || {}
    if (!content?.trim()) return err(res, 400, 'content is required')
    if (content.length > 1000) return err(res, 400, 'content must not exceed 1000 characters')

    if (parentId && !comments.find(c => c.id === parentId))
      return err(res, 400, 'Parent comment not found')

    const newComment = {
      id: nextId(comments), postId, userId: auth.sub,
      content: content.trim(), parentId: parentId || null,
      createdAt: new Date().toISOString(),
    }
    comments.push(newComment)
    return ok(res, newComment, 201)
  }

  return err(res, 405, 'Method not allowed')
}
