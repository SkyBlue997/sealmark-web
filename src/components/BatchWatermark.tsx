/**
 * Batch watermark component for multiple images
 */

import { useState } from 'react'
import { ImagePicker } from './ImagePicker'
import { Button } from './Button'
import { Switch } from './Switch'
import { useToast } from './Toaster'
import { useWatermarkOptions } from '../hooks/useWatermarkState'
import { useImageSettings } from '../hooks/useImageSettings'
import { loadImageWithOrientation, type ImageWithOrientation } from '../lib/canvas/exif'
import { applyWatermark, canvasToBlob } from '../lib/canvas/watermark'
import { createZipFromImages, generateFilename, formatFileSize } from '../lib/zip'
import './BatchWatermark.css'

interface BatchImage {
  id: string
  file: File
  imageData?: ImageWithOrientation
  previewUrl?: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export function BatchWatermark() {
  const [images, setImages] = useState<BatchImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const toast = useToast()
  const watermarkOptions = useWatermarkOptions()
  const imageSettings = useImageSettings()

  const handleImageSelect = async (file: File) => {
    const id = Math.random().toString(36).substring(7)
    const newImage: BatchImage = {
      id,
      file,
      status: 'pending',
    }

    setImages((prev) => [...prev, newImage])

    try {
      const imageData = await loadImageWithOrientation(file, imageSettings.applyExifRotation)
      const previewUrl = URL.createObjectURL(file)

      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, imageData, previewUrl, status: 'pending' } : img
        )
      )
    } catch (error) {
      console.error('Failed to load image:', error)
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, status: 'error', error: '加载失败' }
            : img
        )
      )
    }
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const handleBatchProcess = async () => {
    if (images.length === 0) {
      toast.error('请先添加图片')
      return
    }

    setIsProcessing(true)
    const exportItems = []

    try {
      for (const image of images) {
        if (!image.imageData || image.status === 'error') continue

        setImages((prev) =>
          prev.map((img) => (img.id === image.id ? { ...img, status: 'processing' } : img))
        )

        try {
          // Apply watermark
          const canvas = applyWatermark(
            image.imageData.image,
            image.imageData.orientation,
            watermarkOptions
          )

          // Convert to blob
          const blob = await canvasToBlob(canvas, 'image/png')

          // Generate filename
          const filename = generateFilename(image.file.name, '{basename}_watermarked_{date}')

          exportItems.push({ blob, filename })

          setImages((prev) =>
            prev.map((img) => (img.id === image.id ? { ...img, status: 'completed' } : img))
          )
        } catch (error) {
          console.error('Failed to process image:', error)
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, status: 'error', error: '处理失败' }
                : img
            )
          )
        }
      }

      // Create and download ZIP
      if (exportItems.length > 0) {
        await createZipFromImages(exportItems, 'watermarked_images.zip')
        toast.success(`成功导出 ${exportItems.length} 张图片`)
      } else {
        toast.error('没有可导出的图片')
      }
    } catch (error) {
      console.error('Batch processing failed:', error)
      toast.error('批量处理失败')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    images.forEach((img) => {
      if (img.previewUrl) {
        URL.revokeObjectURL(img.previewUrl)
      }
    })
    setImages([])
  }

  const completedCount = images.filter((img) => img.status === 'completed').length
  const errorCount = images.filter((img) => img.status === 'error').length
  const pendingCount = images.filter(
    (img) => img.status === 'pending' || img.status === 'processing'
  ).length

  return (
    <div className="batch-watermark">
      {images.length === 0 ? (
        <ImagePicker onImageSelect={handleImageSelect} multiple disabled={isProcessing} />
      ) : (
        <>
          {/* Image Grid */}
          <div className="batch-grid">
            {images.map((image) => (
              <div key={image.id} className="batch-image-card">
                {image.previewUrl && (
                  <img
                    src={image.previewUrl}
                    alt={image.file.name}
                    className="batch-image-preview"
                  />
                )}
                <div className="batch-image-overlay">
                  <div className="batch-image-info">
                    <p className="batch-image-name">{image.file.name}</p>
                    <p className="batch-image-size">{formatFileSize(image.file.size)}</p>
                  </div>
                  <div className="batch-image-status">
                    {image.status === 'pending' && <StatusBadge status="pending" />}
                    {image.status === 'processing' && <StatusBadge status="processing" />}
                    {image.status === 'completed' && <StatusBadge status="completed" />}
                    {image.status === 'error' && <StatusBadge status="error" />}
                  </div>
                </div>
                <button
                  className="batch-image-remove"
                  onClick={() => handleRemoveImage(image.id)}
                  disabled={isProcessing}
                  aria-label="删除图片"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add More Button */}
            <div className="batch-add-more">
              <ImagePicker onImageSelect={handleImageSelect} multiple disabled={isProcessing} />
            </div>
          </div>

          {/* Status Summary */}
          {images.length > 0 && (
            <div className="batch-summary">
              <div className="batch-summary-stats">
                <span className="batch-summary-item">
                  总计: <strong>{images.length}</strong>
                </span>
                {pendingCount > 0 && (
                  <span className="batch-summary-item">
                    待处理: <strong>{pendingCount}</strong>
                  </span>
                )}
                {completedCount > 0 && (
                  <span className="batch-summary-item batch-summary-success">
                    已完成: <strong>{completedCount}</strong>
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="batch-summary-item batch-summary-error">
                    失败: <strong>{errorCount}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Image Settings */}
          <div style={{ padding: '0 var(--space-4)' }}>
            <Switch
              label="自动旋转图片"
              description="根据EXIF信息校正图片方向（手机拍摄的照片建议开启）"
              checked={imageSettings.applyExifRotation}
              onChange={imageSettings.setApplyExifRotation}
            />
          </div>

          {/* Action Buttons */}
          <div className="batch-actions">
            <Button variant="secondary" onClick={handleClear} disabled={isProcessing}>
              清空
            </Button>
            <Button variant="primary" onClick={handleBatchProcess} disabled={isProcessing} fullWidth>
              {isProcessing ? '处理中...' : '批量保存'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: BatchImage['status'] }) {
  const labels = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    error: '失败',
  }

  return <span className={`status-badge status-${status}`}>{labels[status]}</span>
}
