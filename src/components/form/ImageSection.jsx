import React, { useEffect, useRef, useState } from 'react'
import { APPROVED_IMAGES } from '../../approved-images.js'
import { seedCoverImageUrls } from '../../data/seedRecipes.js'

const GALLERY = [APPROVED_IMAGES.placeholder, ...seedCoverImageUrls]

const ACCENT_SWATCHES = ['#D97757', '#8A9A5B', '#4E7BB3', '#C2554D', '#9C6ADE', '#2F9E8F', '#D9A63D', '#6B7280']

export default function ImageSection({ draft, patch }) {
  const fileInputRef = useRef(null)
  const [localPreview, setLocalPreview] = useState(null)

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setLocalPreview(url)
  }

  return (
    <fieldset className="form-section">
      <legend>Image and appearance</legend>

      <div className="image-picker">
        <div className="image-picker__preview">
          <img src={localPreview || draft.coverImageUrl || APPROVED_IMAGES.placeholder} alt="Cover preview" />
        </div>
        <div className="image-picker__controls">
          <label className="form-label-block">
            Cover image upload
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {localPreview && (
            <p className="hint">
              This is a temporary preview only. Pick one of the gallery images below to actually save a cover image for this
              recipe.
            </p>
          )}

          <p className="form-label-block">Or choose a cover image</p>
          <div className="image-gallery">
            {GALLERY.map((url) => (
              <button
                key={url}
                type="button"
                className={`image-gallery__item ${draft.coverImageUrl === url ? 'image-gallery__item--active' : ''}`}
                onClick={() => {
                  patch({ coverImageUrl: url })
                }}
              >
                <img src={url} alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="form-label-block">
        Recipe card accent color
        <div className="color-picker">
          {ACCENT_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${draft.accentColor === color ? 'color-swatch--active' : ''}`}
              style={{ backgroundColor: color }}
              aria-label={`Accent color ${color}`}
              onClick={() => patch({ accentColor: color })}
            />
          ))}
          <input
            type="color"
            value={draft.accentColor}
            onChange={(e) => patch({ accentColor: e.target.value })}
            aria-label="Custom accent color"
          />
        </div>
      </label>
    </fieldset>
  )
}
