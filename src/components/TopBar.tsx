/**
 * Top navigation bar component
 */

import './TopBar.css'

export interface TopBarProps {
  title: string
  leftAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  rightAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    disabled?: boolean
  }
}

export function TopBar({ title, leftAction, rightAction }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar-content">
        {leftAction ? (
          <button
            className="top-bar-action top-bar-left"
            onClick={leftAction.onClick}
            aria-label={leftAction.label}
          >
            {leftAction.icon || leftAction.label}
          </button>
        ) : (
          <div className="top-bar-spacer" />
        )}

        <h1 className="top-bar-title">{title}</h1>

        {rightAction ? (
          <button
            className="top-bar-action top-bar-right"
            onClick={rightAction.onClick}
            disabled={rightAction.disabled}
            aria-label={rightAction.label}
          >
            {rightAction.icon || rightAction.label}
          </button>
        ) : (
          <div className="top-bar-spacer" />
        )}
      </div>
    </header>
  )
}
