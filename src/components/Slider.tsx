/**
 * Apple-styled slider component with accessibility support
 */

import { useId } from 'react'
import './Slider.css'

export interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  disabled?: boolean
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
}: SliderProps) {
  const id = useId()

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="slider-container">
      <div className="slider-header">
        <label htmlFor={id} className="slider-label">
          {label}
        </label>
        <span className="slider-value" aria-live="polite">
          {value}
          {unit && <span className="slider-unit">{unit}</span>}
        </span>
      </div>
      <div className="slider-track-container">
        <input
          id={id}
          type="range"
          className="slider-input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          aria-label={`${label}: ${value}${unit}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          style={
            {
              '--slider-percentage': `${percentage}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  )
}
