import Papa from 'papaparse'

// Parses raw CSV text (imported via Vite's `?raw` suffix) into an array of
// plain row objects keyed by the header row. Numeric-looking strings are
// left as strings here -- callers are responsible for coercing the specific
// fields they care about, since some "numeric" looking ids (e.g. R001) must
// stay as strings.
export function parseCsv(rawText) {
  const result = Papa.parse(rawText.trim(), {
    header: true,
    skipEmptyLines: true,
  })
  return result.data
}

// Splits a comma-separated id list cell (e.g. "DT06,DT05") into a clean
// array of trimmed, non-empty ids.
export function splitIds(cell) {
  if (!cell) return []
  return String(cell)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function toNumber(cell, fallback = 0) {
  if (cell === undefined || cell === null || cell === '') return fallback
  const n = Number(cell)
  return Number.isFinite(n) ? n : fallback
}

export function toBool(cell, fallback = false) {
  if (cell === undefined || cell === null || cell === '') return fallback
  return String(cell).trim().toLowerCase() === 'true'
}
