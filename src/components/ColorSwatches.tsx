/**
 * Color swatches component with preset colors and custom color picker
 */

import { useState } from 'react'
import './ColorSwatches.css'

export interface ColorSwatchesProps {
  label: string
  selectedColor: string
  onChange: (color: string) => void
  disabled?: boolean
}

// Preset watermark colors from design tokens
const PRESET_COLORS = [
  { name: '白色', value: '#ffffff' },
  { name: '浅灰', value: '#e5e7eb' },
  { name: '深灰', value: '#6b7280' },
  { name: '黑色', value: '#000000' },
  { name: '红色', value: '#ff3b30' },
  { name: '粉色', value: '#ff2d55' },
  { name: '浅粉', value: '#ff99b4' },
  { name: '橙色', value: '#ff9500' },
]

export function ColorSwatches({ label, selectedColor, onChange, disabled = false }: ColorSwatchesProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customColor, setCustomColor] = useState(selectedColor)

  const handlePresetClick = (color: string) => {
    onChange(color)
    setShowCustomPicker(false)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    onChange(color)
  }

  const isCustomColor = !PRESET_COLORS.some((preset) => preset.value.toLowerCase() === selectedColor.toLowerCase())

  return (
    <div className="color-swatches-container">
      <div className="color-swatches-header">
        <label className="color-swatches-label">{label}</label>
      </div>
      <div className="color-swatches-grid">
        {PRESET_COLORS.map((color) => {
          const isSelected = color.value.toLowerCase() === selectedColor.toLowerCase()
          return (
            <button
              key={color.value}
              type="button"
              className={`color-swatch ${isSelected ? 'color-swatch-selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handlePresetClick(color.value)}
              disabled={disabled}
              aria-label={`选择 ${color.name}`}
              aria-pressed={isSelected}
              title={color.name}
            >
              {isSelected && (
                <svg
                  className="color-swatch-check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M13.3334 4L6.00002 11.3333L2.66669 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )
        })}

        {/* Custom color picker button */}
        <button
          type="button"
          className={`color-swatch color-swatch-custom ${isCustomColor || showCustomPicker ? 'color-swatch-selected' : ''}`}
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          disabled={disabled}
          aria-label="自定义颜色"
          aria-pressed={showCustomPicker}
          title="自定义颜色"
        >
          <div className="color-swatch-custom-gradient" />
          {(isCustomColor || showCustomPicker) && (
            <svg
              className="color-swatch-check"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M13.3334 4L6.00002 11.3333L2.66669 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Custom color picker */}
      {showCustomPicker && (
        <div className="color-picker-container">
          <input
            type="color"
            className="color-picker-input"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            disabled={disabled}
            aria-label="选择自定义颜色"
          />
          <input
            type="text"
            className="color-picker-text"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            disabled={disabled}
            placeholder="#000000"
            aria-label="输入颜色代码"
          />
        </div>
      )}
    </div>
  )
}
