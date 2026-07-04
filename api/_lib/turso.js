import { createClient } from '@libsql/client'

export const db = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

/** Parse JSON fields back to arrays/objects */
export function parseRow(row, jsonFields = []) {
  const obj = { ...row }
  for (const f of jsonFields) {
    if (obj[f] && typeof obj[f] === 'string') {
      try { obj[f] = JSON.parse(obj[f]) } catch { obj[f] = [] }
    }
  }
  return obj
}

/** Convert snake_case DB row to camelCase */
export function toCamel(row, jsonFields = []) {
  const obj = {}
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    obj[camel] = v
  }
  return parseRow(obj, jsonFields)
}

/** Simple paginate helper */
export function paginate(rows, page = 1, limit = 9999) {
  const p = Math.max(1, Number(page))
  const l = Math.max(1, Number(limit))
  const total = rows.length
  const data  = rows.slice((p - 1) * l, p * l)
  return { data, pagination: { page: p, limit: l, total } }
}

/** Get next auto-increment id for a table */
export async function nextId(table) {
  const res = await db.execute(`SELECT MAX(CAST(id AS INTEGER)) as mx FROM ${table}`)
  const mx  = res.rows[0]?.mx ?? 0
  return String(Number(mx) + 1)
}
