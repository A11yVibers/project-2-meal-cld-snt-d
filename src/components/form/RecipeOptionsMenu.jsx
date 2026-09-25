import React, { useEffect, useRef, useState } from 'react'

export default function RecipeOptionsMenu({ draft, patch }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const options = draft.options

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function patchOptions(changes) {
    patch({ options: { ...options, ...changes } })
  }

  return (
    <fieldset className="form-section">
      <legend>Recipe options menu</legend>
      <div className="options-menu" ref={ref}>
        <button type="button" className="btn options-menu-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          Recipe Options ▾
        </button>
        {open && (
          <div className="options-menu-panel">
            <button
              type="button"
              className={`options-menu-item ${options.includeInShoppingList ? 'options-menu-item-active' : ''}`}
              onClick={() => patchOptions({ includeInShoppingList: !options.includeInShoppingList })}
              aria-pressed={options.includeInShoppingList}
            >
              <span className="options-menu-check">{options.includeInShoppingList ? '✓' : ''}</span>
              Include ingredients in generated shopping lists
            </button>

            <button
              type="button"
              className={`options-menu-item ${options.showNutrition ? 'options-menu-item-active' : ''}`}
              onClick={() => patchOptions({ showNutrition: !options.showNutrition })}
              aria-pressed={options.showNutrition}
            >
              <span className="options-menu-check">{options.showNutrition ? '✓' : ''}</span>
              Show nutrition information
            </button>

            <button
              type="button"
              className={`options-menu-item ${options.allowSubstitutions ? 'options-menu-item-active' : ''}`}
              onClick={() => patchOptions({ allowSubstitutions: !options.allowSubstitutions })}
              aria-pressed={options.allowSubstitutions}
            >
              <span className="options-menu-check">{options.allowSubstitutions ? '✓' : ''}</span>
              Allow ingredient substitutions
            </button>

            <div className="options-menu-divider" />

            <button
              type="button"
              className={`options-menu-item ${options.measurementSystem === 'us' ? 'options-menu-item-active' : ''}`}
              onClick={() => patchOptions({ measurementSystem: 'us' })}
              aria-pressed={options.measurementSystem === 'us'}
            >
              <span className="options-menu-check">{options.measurementSystem === 'us' ? '●' : ''}</span>
              US customary measurements
            </button>

            <button
              type="button"
              className={`options-menu-item ${options.measurementSystem === 'metric' ? 'options-menu-item-active' : ''}`}
              onClick={() => patchOptions({ measurementSystem: 'metric' })}
              aria-pressed={options.measurementSystem === 'metric'}
            >
              <span className="options-menu-check">{options.measurementSystem === 'metric' ? '●' : ''}</span>
              Metric measurements
            </button>
          </div>
        )}
        <p className="field-hint">
          Shopping list: {options.includeInShoppingList ? 'included' : 'excluded'} · Nutrition: {options.showNutrition ? 'shown' : 'hidden'} · Substitutions: {options.allowSubstitutions ? 'allowed' : 'not noted'} · Units: {options.measurementSystem === 'metric' ? 'Metric' : 'US customary'}
        </p>
      </div>
    </fieldset>
  )
}
