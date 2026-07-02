import { teams } from '../_lib/db.js'
import { ok, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { sport, country, league } = req.query
  let list = [...teams]
  if (sport)   list = list.filter(t => t.sport.toLowerCase() === sport.toLowerCase())
  if (country) list = list.filter(t => t.country.toUpperCase() === country.toUpperCase())
  if (league)  list = list.filter(t => t.league.toLowerCase().includes(league.toLowerCase()))

  return ok(res, { data: list, total: list.length })
}
