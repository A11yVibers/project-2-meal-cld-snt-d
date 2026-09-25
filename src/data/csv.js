import Papa from 'papaparse'

// Parses raw CSV text (imported via Vite's `?raw` suffix) into an array of
// plain objects keyed by the header row. Uses PapaParse so quoted fields
// containing commas (e.g. "DT06,DT05" or instructions with embedded commas)
// are handled correctly.
export function parseCsv(rawText) {
  const result = Papa.parse(rawText.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transform: (value) => (typeof value === 'string' ? value.trim() : value),
  })
  return result.data
}

export function splitIds(value) {
  if (!value) return []
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export function toNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function toBool(value) {
  return String(value).trim().toLowerCase() === 'true'
}
