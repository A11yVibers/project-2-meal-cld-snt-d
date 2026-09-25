import { useEffect, useRef, useState } from 'react'

const memoryFallback = new Map()

function readRaw(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return memoryFallback.has(key) ? memoryFallback.get(key) : null
  }
}

function writeRaw(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    memoryFallback.set(key, value)
  }
}

export function loadJson(key, fallback) {
  const raw = readRaw(key)
  if (raw == null) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJson(key, value) {
  writeRaw(key, JSON.stringify(value))
}

// React state that is initialized from (and kept in sync with) a
// localStorage key, so recipes/plan/shopping-list state survive refreshes.
export function usePersistentState(key, initialValue) {
  const isFirstRender = useRef(true)
  const [state, setState] = useState(() => loadJson(key, initialValue))

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveJson(key, state)
  }, [key, state])

  return [state, setState]
}
