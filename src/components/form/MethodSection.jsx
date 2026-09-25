import React from 'react'
import { makeEmptyStep } from '../../utils/recipeDraft.js'

function moveInArray(arr, index, direction) {
  const target = index + direction
  if (target < 0 || target >= arr.length) return arr
  const copy = [...arr]
  const [moved] = copy.splice(index, 1)
  copy.splice(target, 0, moved)
  return copy
}

export default function MethodSection({ draft, patch }) {
  const steps = draft.steps

  function setSteps(next) {
    patch({ steps: next })
  }

  function patchStep(id, changes) {
    setSteps(steps.map((s) => (s.id === id ? { ...s, ...changes } : s)))
  }

  function addStep() {
    setSteps([...steps, makeEmptyStep()])
  }

  function removeStep(id) {
    setSteps(steps.filter((s) => s.id !== id))
  }

  function moveStep(id, direction) {
    const idx = steps.findIndex((s) => s.id === id)
    setSteps(moveInArray(steps, idx, direction))
  }

  return (
    <fieldset className="form-section">
      <legend>Method</legend>

      {steps.map((step, idx) => (
        <div key={step.id} className="step-row">
          <span className="step-number">{idx + 1}</span>
          <div className="step-row-fields">
            <textarea
              placeholder="Instruction text"
              value={step.instruction}
              rows={2}
              onChange={(e) => patchStep(step.id, { instruction: e.target.value })}
            />
            <label className="timer-field">
              Timer (minutes, optional)
              <input
                type="number"
                min={0}
                value={step.timerMinutes}
                onChange={(e) => patchStep(step.id, { timerMinutes: Math.max(0, Number(e.target.value) || 0) })}
              />
            </label>
          </div>
          <div className="row-actions">
            <button type="button" className="icon-btn" disabled={idx === 0} onClick={() => moveStep(step.id, -1)} aria-label="Move step up">↑</button>
            <button type="button" className="icon-btn" disabled={idx === steps.length - 1} onClick={() => moveStep(step.id, 1)} aria-label="Move step down">↓</button>
            <button type="button" className="icon-btn" disabled={steps.length <= 1} onClick={() => removeStep(step.id)} aria-label="Remove step">🗑</button>
          </div>
        </div>
      ))}

      <button type="button" className="btn" onClick={addStep}>+ Add step</button>
    </fieldset>
  )
}
