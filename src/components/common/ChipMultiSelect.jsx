import React from 'react'

// A set of toggleable chip buttons for multi-select fields (dietary tags,
// recipe categories). Kept simple/accessible rather than a dropdown since
// the option lists are short.
export default function ChipMultiSelect({ options, selectedIds, onChange }) {
  function toggle(id) {
    if (selectedIds.includes(id)) onChange(selectedIds.filter((x) => x !== id))
    else onChange([...selectedIds, id])
  }

  return (
    <div className="chip-row" role="group">
      {options.map((opt) => {
        const active = selectedIds.includes(opt.id)
        return (
          <button
            key={opt.id}
            type="button"
            className={`chip ${active ? 'chip-active' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(opt.id)}
          >
            {active ? '✓ ' : ''}{opt.name}
          </button>
        )
      })}
    </div>
  )
}
