import { ok, err, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return err(res, 405, 'Method not allowed')

  const { email } = req.body || {}
  if (!email) return err(res, 400, 'email is required')

  // Always return 200 to prevent email enumeration
  // In production: send actual email with reset link
  return ok(res, { message: 'If an account with that email exists, a reset link has been sent.' })
}
