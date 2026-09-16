import React from 'react'
import { makeId } from '../../lib/id.js'

export function emptyStep() {
  return { id: makeId('step'), instruction: '', timerMinutes: '' }
}

export default function StepsEditor({ steps, onChange }) {
  function updateStep(idx, patch) {
    const next = steps.slice()
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  function addStep() {
    onChange([...steps, emptyStep()])
  }

  function removeStep(idx) {
    const next = steps.filter((_, i) => i !== idx)
    onChange(next.length ? next : [emptyStep()])
  }

  function moveStep(idx, dir) {
    const next = steps.slice()
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  return (
    <div className="steps-editor">
      {steps.map((step, idx) => (
        <div className="step-row" key={step.id}>
          <div className="step-row__number">{idx + 1}</div>
          <textarea
            className="input"
            rows={2}
            placeholder="Instruction"
            value={step.instruction}
            onChange={(e) => updateStep(idx, { instruction: e.target.value })}
          />
          <input
            className="input input--timer"
            type="number"
            min="0"
            placeholder="Timer (min)"
            value={step.timerMinutes}
            onChange={(e) => updateStep(idx, { timerMinutes: e.target.value })}
          />
          <div className="step-row__controls">
            <button type="button" className="btn btn--icon" onClick={() => moveStep(idx, -1)} aria-label="Move up" disabled={idx === 0}>
              ↑
            </button>
            <button
              type="button"
              className="btn btn--icon"
              onClick={() => moveStep(idx, 1)}
              aria-label="Move down"
              disabled={idx === steps.length - 1}
            >
              ↓
            </button>
            <button type="button" className="btn btn--icon btn--danger" onClick={() => removeStep(idx)} aria-label="Remove step">
              ✕
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn--subtle" onClick={addStep}>
        + Add step
      </button>
    </div>
  )
}
