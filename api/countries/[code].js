import { countries } from '../_lib/db.js'
import { ok, err, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const { code } = req.query
  const country = countries.find(c => c.code.toUpperCase() === code.toUpperCase())
  if (!country) return err(res, 404, 'Country not found')

  return ok(res, country)
}
