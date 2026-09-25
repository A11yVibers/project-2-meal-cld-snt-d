let counter = 0

export function makeId(prefix = 'id') {
  counter += 1
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${counter}`
}
