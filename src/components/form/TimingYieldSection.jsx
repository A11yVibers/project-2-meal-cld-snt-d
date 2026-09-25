import React from 'react'
import { SPICE_LEVELS } from '../../utils/constants.js'

export default function TimingYieldSection({ draft, patch }) {
  const totalTime = Number(draft.prepTimeMinutes || 0) + Number(draft.cookTimeMinutes || 0)

  function adjustServings(delta) {
    patch({ servings: Math.max(1, Number(draft.servings || 1) + delta) })
  }

  return (
    <fieldset className="form-section">
      <legend>Timing and yield</legend>

      <div className="form-field">
        <label htmlFor="servings">Servings</label>
        <div className="stepper">
          <button type="button" className="btn" onClick={() => adjustServings(-1)} aria-label="Decrease servings">−</button>
          <input
            id="servings"
            type="number"
            min={1}
            value={draft.servings}
            onChange={(e) => patch({ servings: Math.max(1, Number(e.target.value) || 1) })}
          />
          <button type="button" className="btn" onClick={() => adjustServings(1)} aria-label="Increase servings">+</button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="prepTime">Prep time (minutes)</label>
          <input
            id="prepTime"
            type="number"
            min={0}
            value={draft.prepTimeMinutes}
            onChange={(e) => patch({ prepTimeMinutes: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="cookTime">Cook time (minutes)</label>
          <input
            id="cookTime"
            type="number"
            min={0}
            value={draft.cookTimeMinutes}
            onChange={(e) => patch({ cookTimeMinutes: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div className="form-field">
          <label>Total time</label>
          <output className="total-time-output">{totalTime} minutes</output>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="spiceLevel">Spice level: <strong>{SPICE_LEVELS[draft.spiceLevel]?.label}</strong></label>
        <input
          id="spiceLevel"
          type="range"
          min={0}
          max={5}
          step={1}
          value={draft.spiceLevel}
          onChange={(e) => patch({ spiceLevel: Number(e.target.value) })}
        />
        <div className="range-labels">
          <span>Mild</span>
          <span>Very spicy</span>
        </div>
      </div>
    </fieldset>
  )
}
