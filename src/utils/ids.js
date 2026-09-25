let counter = 0

// Generates a reasonably unique id without pulling in an extra dependency.
// Uses crypto.randomUUID when available (all modern browsers) and falls
// back to a counter + timestamp otherwise.
export function makeId(prefix = 'id') {
  counter += 1
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${counter}`
}
