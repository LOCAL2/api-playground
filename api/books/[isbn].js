import { books } from '../_lib/db.js'
import { ok, err, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const { isbn } = req.query
  const book = books.find(b => b.isbn === isbn)
  if (!book) return err(res, 404, 'Book not found')

  return ok(res, book)
}
