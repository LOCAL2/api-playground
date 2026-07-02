import { movies } from '../_lib/db.js'
import { ok, err, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const { id } = req.query
  const movie = movies.find(m => m.id === id)
  if (!movie) return err(res, 404, 'Movie not found')

  return ok(res, movie)
}
