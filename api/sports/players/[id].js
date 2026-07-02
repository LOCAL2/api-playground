import { players } from '../../_lib/db.js'
import { ok, err, handleOptions } from '../../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return err(res, 405, 'Method not allowed')

  const { id } = req.query
  const player = players.find(p => p.id === id)
  if (!player) return err(res, 404, 'Player not found')

  return ok(res, player)
}
