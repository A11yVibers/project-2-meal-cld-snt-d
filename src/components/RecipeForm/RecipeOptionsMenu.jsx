import React, { useState } from 'react'

const TOGGLES = [
  { key: 'includeInShoppingList', label: 'Include ingredients in generated shopping lists' },
  { key: 'showNutrition', label: 'Show nutrition information' },
  { key: 'allowSubstitutions', label: 'Allow ingredient substitutions' },
]

export default function RecipeOptionsMenu({ options, onChange }) {
  const [open, setOpen] = useState(false)

  function toggle(key) {
    onChange({ ...options, [key]: !options[key] })
  }

  function setSystem(system) {
    onChange({ ...options, measurementSystem: system })
  }

  return (
    <div className="options-menu">
      <button type="button" className="btn btn--subtle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        Recipe Options ▾
      </button>
      {open && (
        <div className="options-menu__panel" role="menu">
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`options-menu__item ${options[t.key] ? 'options-menu__item--selected' : ''}`}
              role="menuitemcheckbox"
              aria-checked={!!options[t.key]}
              onClick={() => toggle(t.key)}
            >
              <span className="options-menu__check">{options[t.key] ? '✓' : ''}</span>
              {t.label}
            </button>
          ))}

          <div className="options-menu__divider" />
          <div className="options-menu__label">Measurement units</div>
          <div className="segmented" role="radiogroup" aria-label="Measurement units">
            <button
              type="button"
              className={`segmented__option ${options.measurementSystem === 'us' ? 'segmented__option--selected' : ''}`}
              aria-checked={options.measurementSystem === 'us'}
              role="radio"
              onClick={() => setSystem('us')}
            >
              US customary
            </button>
            <button
              type="button"
              className={`segmented__option ${options.measurementSystem === 'metric' ? 'segmented__option--selected' : ''}`}
              aria-checked={options.measurementSystem === 'metric'}
              role="radio"
              onClick={() => setSystem('metric')}
            >
              Metric
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
