import React from 'react'
import { emptyStep } from './formModel.js'

export default function MethodSection({ draft, patch }) {
  const steps = draft.steps

  function updateStep(index, nextStep) {
    const next = [...steps]
    next[index] = nextStep
    patch({ steps: next })
  }

  function addStep() {
    patch({ steps: [...steps, emptyStep()] })
  }

  function removeStep(index) {
    if (steps.length <= 1) return
    patch({ steps: steps.filter((_, i) => i !== index) })
  }

  function moveStep(index, direction) {
    const target = index + direction
    if (target < 0 || target >= steps.length) return
    const next = [...steps]
    ;[next[index], next[target]] = [next[target], next[index]]
    patch({ steps: next })
  }

  return (
    <fieldset className="form-section">
      <legend>Method</legend>

      {steps.map((step, index) => (
        <div key={step.id} className="step-row">
          <span className="step-row__number">{index + 1}</span>
          <div className="step-row__fields">
            <textarea
              placeholder={`Step ${index + 1} instructions…`}
              value={step.instruction}
              rows={2}
              onChange={(e) => updateStep(index, { ...step, instruction: e.target.value })}
            />
            <label className="step-row__timer">
              Timer (minutes, optional)
              <input
                type="number"
                min={0}
                value={step.timerMinutes}
                onChange={(e) => updateStep(index, { ...step, timerMinutes: Math.max(0, Number(e.target.value) || 0) })}
              />
            </label>
          </div>
          <div className="step-row__controls">
            <button type="button" disabled={index === 0} onClick={() => moveStep(index, -1)} aria-label="Move step up">
              ▲
            </button>
            <button
              type="button"
              disabled={index === steps.length - 1}
              onClick={() => moveStep(index, 1)}
              aria-label="Move step down"
            >
              ▼
            </button>
            <button type="button" className="icon-button" aria-label="Remove step" onClick={() => removeStep(index)}>
              ✕
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn--subtle" onClick={addStep}>
        + Add step
      </button>
    </fieldset>
  )
}
