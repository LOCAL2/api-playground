import { books } from '../_lib/db.js'
import { ok, handleOptions, paginate } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { page, limit, genre, author, search } = req.query
  let list = [...books]
  if (genre)  list = list.filter(b => b.genre.toLowerCase() === genre.toLowerCase())
  if (author) list = list.filter(b => b.author.toLowerCase().includes(author.toLowerCase()))
  if (search) list = list.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search))

  return ok(res, paginate(list, page, limit))
}
