import React from 'react'
import RecipeImage from '../common/RecipeImage.jsx'
import { ACCENT_COLOR_PRESETS } from '../../utils/constants.js'

export default function ImageAppearanceSection({ draft, patch }) {
  return (
    <fieldset className="form-section">
      <legend>Image and appearance</legend>

      <div className="form-field">
        <label htmlFor="coverImageUrl">Cover image link</label>
        <input
          id="coverImageUrl"
          type="url"
          value={draft.coverImageUrl}
          onChange={(e) => patch({ coverImageUrl: e.target.value })}
          placeholder="Paste a link to an image (leave blank to use the placeholder)"
        />
        <p className="field-hint">Paste a link to an image hosted elsewhere. If left blank, a placeholder photo is used.</p>
        <div className="cover-preview">
          <RecipeImage src={draft.coverImageUrl} alt="Cover preview" />
        </div>
      </div>

      <div className="form-field">
        <label>Recipe card accent color</label>
        <div className="swatch-row" role="group">
          {ACCENT_COLOR_PRESETS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`swatch ${draft.accentColor === c.value ? 'swatch-active' : ''}`}
              style={{ backgroundColor: c.value }}
              title={c.label}
              aria-label={c.label}
              aria-pressed={draft.accentColor === c.value}
              onClick={() => patch({ accentColor: c.value })}
            />
          ))}
        </div>
      </div>
    </fieldset>
  )
}
