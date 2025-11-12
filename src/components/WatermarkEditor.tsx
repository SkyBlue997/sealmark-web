/**
 * Main watermark editor component for single image
 */

import { useState, useEffect, useRef } from 'react'
import { ImagePicker } from './ImagePicker'
import { Slider } from './Slider'
import { Switch } from './Switch'
import { ColorSwatches } from './ColorSwatches'
import { Textarea } from './Input'
import { Button } from './Button'
import { useToast } from './Toaster'
import { useWatermarkState } from '../hooks/useWatermarkState'
import { loadImageWithOrientation, type ImageWithOrientation } from '../lib/canvas/exif'
import { applyWatermark, downloadCanvas } from '../lib/canvas/watermark'
import { formatFileSize } from '../lib/zip'
import './WatermarkEditor.css'

export function WatermarkEditor() {
  const [imageInfo, setImageInfo] = useState<ImageWithOrientation | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const toast = useToast()
  const watermarkState = useWatermarkState()

  // Load image when file is selected
  const handleImageSelect = async (file: File) => {
    try {
      setIsProcessing(true)
      const imageData = await loadImageWithOrientation(file)
      setImageInfo(imageData)
      setOriginalFile(file)
      toast.success('图片加载成功')
    } catch (error) {
      console.error('Failed to load image:', error)
      toast.error('图片加载失败,请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  // Apply watermark when settings change
  useEffect(() => {
    if (!imageInfo) return

    const applyWatermarkDebounced = setTimeout(() => {
      try {
        const canvas = applyWatermark(imageInfo.image, imageInfo.orientation, {
          text: watermarkState.text,
          tiled: watermarkState.tiled,
          spacing: watermarkState.spacing,
          lineHeight: watermarkState.lineHeight,
          fontSize: watermarkState.fontSize,
          opacity: watermarkState.opacity,
          angle: watermarkState.angle,
          color: watermarkState.color,
          strokeWidth: watermarkState.strokeWidth,
          strokeColor: watermarkState.strokeColor,
        })
        setPreviewCanvas(canvas)
      } catch (error) {
        console.error('Failed to apply watermark:', error)
        toast.error('水印应用失败')
      }
    }, 150) // Debounce for performance

    return () => clearTimeout(applyWatermarkDebounced)
  }, [imageInfo, watermarkState, toast])

  // Render preview canvas
  useEffect(() => {
    if (!previewCanvas || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Scale canvas to fit container while maintaining aspect ratio
    const maxWidth = canvasRef.current.parentElement?.clientWidth || 800
    const maxHeight = 500
    const scale = Math.min(maxWidth / previewCanvas.width, maxHeight / previewCanvas.height, 1)

    canvasRef.current.width = previewCanvas.width * scale
    canvasRef.current.height = previewCanvas.height * scale

    ctx.drawImage(previewCanvas, 0, 0, canvasRef.current.width, canvasRef.current.height)
  }, [previewCanvas])

  const handleSave = async () => {
    if (!previewCanvas || !originalFile) return

    try {
      setIsProcessing(true)
      const originalName = originalFile.name.replace(/\.[^/.]+$/, '')
      const filename = `${originalName}_watermarked.png`
      await downloadCanvas(previewCanvas, filename, 'image/png')
      toast.success('图片已保存')
    } catch (error) {
      console.error('Failed to save image:', error)
      toast.error('保存失败,请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setImageInfo(null)
    setOriginalFile(null)
    setPreviewCanvas(null)
    watermarkState.reset()
  }

  return (
    <div className="watermark-editor">
      {!imageInfo ? (
        <ImagePicker onImageSelect={handleImageSelect} disabled={isProcessing} />
      ) : (
        <>
          {/* Preview Section */}
          <div className="preview-section">
            <div className="preview-container">
              <canvas ref={canvasRef} className="preview-canvas" />
            </div>
            {originalFile && (
              <div className="image-info">
                <span className="image-info-item">
                  {imageInfo.width} × {imageInfo.height}
                </span>
                <span className="image-info-item">{formatFileSize(originalFile.size)}</span>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            {/* Text Input */}
            <Textarea
              label="文字"
              placeholder="仅供办理XX业务使用,他用无效"
              value={watermarkState.text}
              onChange={(e) => watermarkState.setText(e.target.value)}
              rows={3}
            />

            {/* Tiled Switch */}
            <Switch
              label="铺满"
              description="开启后水印将平铺整张图片"
              checked={watermarkState.tiled}
              onChange={watermarkState.setTiled}
            />

            {/* Sliders */}
            {watermarkState.tiled && (
              <Slider
                label="间距"
                value={watermarkState.spacing}
                min={8}
                max={80}
                unit="px"
                onChange={watermarkState.setSpacing}
              />
            )}

            <Slider
              label="行高"
              value={watermarkState.lineHeight}
              min={16}
              max={120}
              unit="px"
              onChange={watermarkState.setLineHeight}
            />

            <Slider
              label="大小"
              value={watermarkState.fontSize}
              min={10}
              max={64}
              unit="px"
              onChange={watermarkState.setFontSize}
            />

            <Slider
              label="透明"
              value={watermarkState.opacity}
              min={0}
              max={100}
              unit="%"
              onChange={watermarkState.setOpacity}
            />

            <Slider
              label="角度"
              value={watermarkState.angle}
              min={0}
              max={60}
              unit="°"
              onChange={watermarkState.setAngle}
            />

            {/* Color Swatches */}
            <ColorSwatches
              label="颜色"
              selectedColor={watermarkState.color}
              onChange={watermarkState.setColor}
            />

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button variant="secondary" onClick={handleReset} fullWidth>
                重新选择
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isProcessing}
                fullWidth
              >
                {isProcessing ? '处理中...' : '保存'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
