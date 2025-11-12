/**
 * Image picker component with drag & drop, paste, and click support
 */

import { useRef, useState } from 'react'
import './ImagePicker.css'

export interface ImagePickerProps {
  onImageSelect: (file: File) => void
  multiple?: boolean
  disabled?: boolean
}

export function ImagePicker({ onImageSelect, multiple = false, disabled = false }: ImagePickerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))

    if (multiple) {
      validFiles.forEach((file) => onImageSelect(file))
    } else if (validFiles.length > 0) {
      onImageSelect(validFiles[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    const files = e.clipboardData.files
    handleFileSelect(files)
  }

  return (
    <div
      className={`image-picker ${isDragging ? 'image-picker-dragging' : ''} ${disabled ? 'image-picker-disabled' : ''}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="选择图片"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="image-picker-input"
        disabled={disabled}
      />

      <div className="image-picker-content">
        <svg
          className="image-picker-icon"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M38 38H10C8.89543 38 8 37.1046 8 36V12C8 10.8954 8.89543 10 10 10H38C39.1046 10 40 10.8954 40 12V36C40 37.1046 39.1046 38 38 38Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 21C18.6569 21 20 19.6569 20 18C20 16.3431 18.6569 15 17 15C15.3431 15 14 16.3431 14 18C14 19.6569 15.3431 21 17 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40 29L32 21L10 38"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="image-picker-text">
          <p className="image-picker-title">
            {multiple ? '选择或拖拽多张图片' : '选择或拖拽图片'}
          </p>
          <p className="image-picker-subtitle">
            支持粘贴图片 (Cmd/Ctrl + V)
          </p>
          <p className="image-picker-hint">
            请选择需要水印的证件,本程序不存储任何证件信息
          </p>
        </div>
      </div>
    </div>
  )
}
