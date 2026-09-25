import React from 'react'

function ToggleItem({ label, checked, onChange }) {
  return (
    <button type="button" className={`options-menu__item ${checked ? 'options-menu__item--active' : ''}`} onClick={() => onChange(!checked)} role="menuitemcheckbox" aria-checked={checked}>
      <span className="options-menu__check">{checked ? '✓' : ''}</span>
      {label}
    </button>
  )
}

function RadioItem({ label, checked, onChange }) {
  return (
    <button type="button" className={`options-menu__item ${checked ? 'options-menu__item--active' : ''}`} onClick={onChange} role="menuitemradio" aria-checked={checked}>
      <span className="options-menu__check options-menu__check--radio">{checked ? '●' : ''}</span>
      {label}
    </button>
  )
}

export default function OptionsMenu({ draft, patch }) {
  const options = draft.options

  function patchOptions(fields) {
    patch({ options: { ...options, ...fields } })
  }

  return (
    <fieldset className="form-section">
      <legend>Recipe options menu</legend>
      <details className="options-menu">
        <summary>⚙ Recipe options</summary>
        <div className="options-menu__panel" role="menu">
          <div className="options-menu__group">
            <ToggleItem
              label="Include ingredients in generated shopping lists"
              checked={options.includeInShoppingList}
              onChange={(v) => patchOptions({ includeInShoppingList: v })}
            />
            <ToggleItem label="Show nutrition information" checked={options.showNutrition} onChange={(v) => patchOptions({ showNutrition: v })} />
            <ToggleItem
              label="Allow ingredient substitutions"
              checked={options.allowSubstitutions}
              onChange={(v) => patchOptions({ allowSubstitutions: v })}
            />
          </div>
          <div className="options-menu__divider" />
          <div className="options-menu__group">
            <RadioItem
              label="US customary measurements"
              checked={options.measurementSystem === 'us'}
              onChange={() => patchOptions({ measurementSystem: 'us' })}
            />
            <RadioItem
              label="Metric measurements"
              checked={options.measurementSystem === 'metric'}
              onChange={() => patchOptions({ measurementSystem: 'metric' })}
            />
          </div>
        </div>
      </details>
    </fieldset>
  )
}
