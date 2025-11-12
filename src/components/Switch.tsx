/**
 * Apple-styled toggle switch component with accessibility support
 */

import { useId } from 'react'
import './Switch.css'

export interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  description?: string
}

export function Switch({ label, checked, onChange, disabled = false, description }: SwitchProps) {
  const id = useId()
  const descriptionId = useId()

  return (
    <div className="switch-container">
      <div className="switch-content">
        <div className="switch-text">
          <label htmlFor={id} className="switch-label">
            {label}
          </label>
          {description && (
            <p id={descriptionId} className="switch-description">
              {description}
            </p>
          )}
        </div>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={description ? descriptionId : undefined}
          className={`switch-button ${checked ? 'switch-checked' : ''}`}
          onClick={() => onChange(!checked)}
          disabled={disabled}
        >
          <span className="switch-thumb" />
          <span className="sr-only">{checked ? '开' : '关'}</span>
        </button>
      </div>
    </div>
  )
}
