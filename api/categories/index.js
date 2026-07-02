import { categories, nextId } from '../_lib/db.js'
import { ok, err, handleOptions, requireAdmin } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  if (req.method === 'GET') {
    const { parentId } = req.query
    let list = [...categories]
    if (parentId !== undefined) {
      list = list.filter(c => c.parentId === (parentId === 'null' ? null : parentId))
    }
    return ok(res, { data: list })
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req, res)
    if (!admin) return

    const { name, slug, description, parentId, image } = req.body || {}
    if (!name || !slug) return err(res, 400, 'name and slug are required')
    if (categories.find(c => c.slug === slug)) return err(res, 400, 'Slug already exists')

    const newCat = {
      id: nextId(categories), name, slug,
      description: description || null,
      parentId: parentId || null,
      image: image || null,
    }
    categories.push(newCat)
    return ok(res, newCat, 201)
  }

  return err(res, 405, 'Method not allowed')
}
