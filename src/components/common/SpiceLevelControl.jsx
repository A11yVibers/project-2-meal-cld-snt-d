import React from 'react'

const LABELS = ['No spice', 'Mild', 'Medium', 'Spicy', 'Hot', 'Very spicy']
const ICONS = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️', '🌶️🌶️🌶️🌶️', '🌶️🌶️🌶️🌶️🌶️']

export default function SpiceLevelControl({ value, onChange }) {
  return (
    <div className="spice-control">
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Spice level"
      />
      <div className="spice-control__readout">
        <span className="spice-control__icons" aria-hidden="true">
          {ICONS[value] || '—'}
        </span>
        <span>{LABELS[value]}</span>
      </div>
    </div>
  )
}
