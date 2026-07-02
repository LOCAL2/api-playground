import { countries } from '../_lib/db.js'
import { ok, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return

  const { region, search } = req.query
  let list = [...countries]
  if (region) list = list.filter(c => c.region.toLowerCase() === region.toLowerCase())
  if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return ok(res, { data: list, total: list.length })
}
