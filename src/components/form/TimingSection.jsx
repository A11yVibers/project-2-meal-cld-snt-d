import React from 'react'
import SpiceLevelControl from '../common/SpiceLevelControl.jsx'

export default function TimingSection({ draft, patch }) {
  const total = (Number(draft.prepTimeMinutes) || 0) + (Number(draft.cookTimeMinutes) || 0)

  return (
    <fieldset className="form-section">
      <legend>Timing and yield</legend>

      <label>
        Servings
        <div className="stepper">
          <button
            type="button"
            onClick={() => patch({ servings: Math.max(1, Number(draft.servings) - 1) })}
            aria-label="Decrease servings"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={draft.servings}
            onChange={(e) => patch({ servings: Math.max(1, Number(e.target.value) || 1) })}
          />
          <button type="button" onClick={() => patch({ servings: Number(draft.servings) + 1 })} aria-label="Increase servings">
            +
          </button>
        </div>
      </label>

      <div className="form-grid-3">
        <label>
          Prep time (minutes)
          <input
            type="number"
            min={0}
            value={draft.prepTimeMinutes}
            onChange={(e) => patch({ prepTimeMinutes: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
        <label>
          Cook time (minutes)
          <input
            type="number"
            min={0}
            value={draft.cookTimeMinutes}
            onChange={(e) => patch({ cookTimeMinutes: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
        <label>
          Total time
          <input type="text" value={`${total} minutes`} readOnly disabled />
        </label>
      </div>

      <label className="form-label-block">
        Spice level
        <SpiceLevelControl value={draft.spiceLevel} onChange={(v) => patch({ spiceLevel: v })} />
      </label>
    </fieldset>
  )
}
