import React from 'react'
import { INGREDIENTS, UNITS } from '../../data/csvData.js'
import { makeId } from '../../lib/id.js'

function emptyItem() {
  return { id: makeId('item'), ingredientId: null, ingredientName: '', quantity: '', unit: UNITS[0]?.name || '', optional: false, notes: '' }
}

export function emptySection(name = '') {
  return { id: makeId('section'), name, items: [emptyItem()] }
}

function resolveIngredientId(name) {
  const match = INGREDIENTS.find((i) => i.name.toLowerCase() === name.trim().toLowerCase())
  return match ? match.id : null
}

export default function IngredientsEditor({ sections, onChange }) {
  function updateSection(index, patch) {
    const next = sections.slice()
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  function updateItem(sectionIdx, itemIdx, patch) {
    const section = sections[sectionIdx]
    const items = section.items.slice()
    items[itemIdx] = { ...items[itemIdx], ...patch }
    updateSection(sectionIdx, { items })
  }

  function addItem(sectionIdx) {
    const section = sections[sectionIdx]
    updateSection(sectionIdx, { items: [...section.items, emptyItem()] })
  }

  function removeItem(sectionIdx, itemIdx) {
    const section = sections[sectionIdx]
    const items = section.items.filter((_, i) => i !== itemIdx)
    updateSection(sectionIdx, { items: items.length ? items : [emptyItem()] })
  }

  function moveItem(sectionIdx, itemIdx, dir) {
    const section = sections[sectionIdx]
    const items = section.items.slice()
    const target = itemIdx + dir
    if (target < 0 || target >= items.length) return
    ;[items[itemIdx], items[target]] = [items[target], items[itemIdx]]
    updateSection(sectionIdx, { items })
  }

  function addSection() {
    onChange([...sections, emptySection('')])
  }

  function removeSection(sectionIdx) {
    onChange(sections.filter((_, i) => i !== sectionIdx))
  }

  return (
    <div className="ingredients-editor">
      {sections.map((section, sectionIdx) => (
        <div className="ingredients-editor__section" key={section.id}>
          <div className="ingredients-editor__section-header">
            <input
              className="input"
              placeholder="Section name (e.g. Main, Sauce, Garnish)"
              value={section.name}
              onChange={(e) => updateSection(sectionIdx, { name: e.target.value })}
            />
            {sections.length > 1 && (
              <button type="button" className="btn btn--subtle" onClick={() => removeSection(sectionIdx)}>
                Remove section
              </button>
            )}
          </div>

          {section.items.map((item, itemIdx) => (
            <div className="ingredient-row" key={item.id}>
              <input
                className="input"
                list="ingredient-suggestions"
                placeholder="Ingredient"
                value={item.ingredientName}
                onChange={(e) =>
                  updateItem(sectionIdx, itemIdx, {
                    ingredientName: e.target.value,
                    ingredientId: resolveIngredientId(e.target.value),
                  })
                }
              />
              <input
                className="input input--qty"
                type="number"
                step="any"
                min="0"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(sectionIdx, itemIdx, { quantity: e.target.value })}
              />
              <select className="input input--unit" value={item.unit} onChange={(e) => updateItem(sectionIdx, itemIdx, { unit: e.target.value })}>
                {UNITS.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              <label className="checkbox-label checkbox-label--tight">
                <input
                  type="checkbox"
                  checked={item.optional}
                  onChange={(e) => updateItem(sectionIdx, itemIdx, { optional: e.target.checked })}
                />
                Optional
              </label>
              <div className="ingredient-row__controls">
                <button type="button" className="btn btn--icon" onClick={() => moveItem(sectionIdx, itemIdx, -1)} aria-label="Move up" disabled={itemIdx === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  className="btn btn--icon"
                  onClick={() => moveItem(sectionIdx, itemIdx, 1)}
                  aria-label="Move down"
                  disabled={itemIdx === section.items.length - 1}
                >
                  ↓
                </button>
                <button type="button" className="btn btn--icon btn--danger" onClick={() => removeItem(sectionIdx, itemIdx)} aria-label="Remove ingredient">
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn--subtle" onClick={() => addItem(sectionIdx)}>
            + Add ingredient
          </button>
        </div>
      ))}

      <datalist id="ingredient-suggestions">
        {INGREDIENTS.map((i) => (
          <option key={i.id} value={i.name} />
        ))}
      </datalist>

      <button type="button" className="btn" onClick={addSection}>
        + Add ingredient section
      </button>
    </div>
  )
}
