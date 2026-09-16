// Minimal RFC4180-ish CSV parser (handles quoted fields, embedded commas,
// escaped quotes and newlines inside quotes). Used to read the project's
// seed data CSVs without duplicating them elsewhere in the app.
export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const s = String(text).replace(/\r\n/g, '\n')

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const nonEmptyRows = rows.filter((r) => !(r.length === 1 && r[0] === ''))
  if (nonEmptyRows.length === 0) return []
  const header = nonEmptyRows[0]
  return nonEmptyRows.slice(1).map((r) => {
    const obj = {}
    header.forEach((h, idx) => {
      obj[h.trim()] = r[idx] !== undefined ? r[idx] : ''
    })
    return obj
  })
}

export function splitList(value) {
  if (!value) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}
