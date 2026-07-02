import { ok, err, handleOptions } from '../_lib/helpers.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return err(res, 405, 'Method not allowed')

  const { token, newPassword, confirmPassword } = req.body || {}
  if (!token || !newPassword || !confirmPassword)
    return err(res, 400, 'token, newPassword, and confirmPassword are required')

  if (newPassword !== confirmPassword)
    return err(res, 400, 'Passwords do not match')

  if (newPassword.length < 8)
    return err(res, 400, 'Password must be at least 8 characters')

  // In production: validate token from database, update password
  // For demo: accept any token value
  if (token.length < 4) return err(res, 400, 'Invalid reset token')

  return ok(res, { message: 'Password reset successfully. Please log in with your new password.' })
}
