import React from 'react'

// A group of toggle-able chips used for multi-select fields such as dietary
// suitability and recipe categories.
export default function MultiSelect({ options, selectedIds, onChange, name }) {
  function toggle(id) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((v) => v !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="chip-group" role="group" aria-label={name}>
      {options.map((opt) => {
        const active = selectedIds.includes(opt.id)
        return (
          <button
            key={opt.id}
            type="button"
            className={`chip ${active ? 'chip--active' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(opt.id)}
          >
            {opt.name}
          </button>
        )
      })}
    </div>
  )
}
