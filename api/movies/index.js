import { movies } from '../_lib/db.js'
import { ok, handleOptions, paginate } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { page, limit, genre, year, minRating, search } = req.query
  let list = [...movies]
  if (genre)     list = list.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
  if (year)      list = list.filter(m => m.year === Number(year))
  if (minRating) list = list.filter(m => m.rating >= Number(minRating))
  if (search)    list = list.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))

  return ok(res, paginate(list, page, limit))
}
