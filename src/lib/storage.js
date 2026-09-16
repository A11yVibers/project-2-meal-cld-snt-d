import { useEffect, useState } from 'react'

// Generic localStorage-backed state hook. Reads synchronously on first
// render so the UI never "flashes" empty before hydrating from storage.
export function useStoredState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw)
    } catch {
      // ignore malformed storage, fall back to initial value
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // storage may be unavailable (e.g. private mode quota) - fail silently
    }
  }, [key, state])

  return [state, setState]
}
