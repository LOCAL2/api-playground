import { posts, nextId } from '../_lib/db.js'
import { ok, err, handleOptions, requireAuth, paginate, extractToken, verifyAccess } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  if (req.method === 'GET') {
    const { page, limit, userId, tag, search, status } = req.query

    // Check if requester is authenticated (for draft visibility)
    const token = extractToken(req)
    const authUser = token ? verifyAccess(token) : null

    let list = posts.filter(p => {
      if (p.status === 'draft') {
        // Only show drafts to the author or admin
        if (!authUser) return false
        if (authUser.role !== 'admin' && p.userId !== authUser.sub) return false
      }
      return true
    })

    if (userId)                list = list.filter(p => p.userId === userId)
    if (tag)                   list = list.filter(p => p.tags?.includes(tag))
    if (status && authUser)    list = list.filter(p => p.status === status)
    if (search)                list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))

    return ok(res, paginate(list, page, limit))
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res)
    if (!auth) return

    const { title, content, excerpt, tags, status = 'draft', coverImage } = req.body || {}
    if (!title || !content) return err(res, 400, 'title and content are required')

    const newPost = {
      id: nextId(posts), title, content,
      excerpt: excerpt || content.slice(0, 150) + '...',
      tags: tags || [], status, userId: auth.sub,
      coverImage: coverImage || null,
      createdAt: new Date().toISOString(),
    }
    posts.push(newPost)
    return ok(res, newPost, 201)
  }

  return err(res, 405, 'Method not allowed')
}
