/**
 * Apple-styled input and textarea components
 */

import { useId } from 'react'
import './Input.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

export function Input({ label, error, helpText, className = '', ...props }: InputProps) {
  const id = useId()
  const errorId = useId()
  const helpTextId = useId()

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helpText ? helpTextId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="input-error-text" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpTextId} className="input-help-text">
          {helpText}
        </p>
      )}
    </div>
  )
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
}

export function Textarea({ label, error, helpText, className = '', ...props }: TextareaProps) {
  const id = useId()
  const errorId = useId()
  const helpTextId = useId()

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`textarea ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helpText ? helpTextId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="input-error-text" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpTextId} className="input-help-text">
          {helpText}
        </p>
      )}
    </div>
  )
}
