/**
 * Core watermark canvas rendering logic
 * Handles tiled and single watermark modes with full customization
 */

import { type ExifOrientation, applyOrientationTransform, getOrientedDimensions } from './exif'

export interface WatermarkOptions {
  text: string
  tiled: boolean // 铺满模式
  spacing: number // 间距 (px)
  lineHeight: number // 行高 (px)
  fontSize: number // 字体大小 (px)
  opacity: number // 透明度 (0-100)
  angle: number // 角度 (degrees)
  color: string // 颜色 (hex or rgba)
  strokeWidth?: number // 描边宽度 (可选,增强可读性)
  strokeColor?: string // 描边颜色
}

/**
 * Apply watermark to image and return new canvas
 */
export function applyWatermark(
  image: HTMLImageElement,
  orientation: ExifOrientation,
  options: WatermarkOptions
): HTMLCanvasElement {
  const { width, height } = getOrientedDimensions(
    image.naturalWidth,
    image.naturalHeight,
    orientation
  )

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  // Apply orientation transformation
  ctx.save()
  applyOrientationTransform(ctx, width, height, orientation)

  // Draw original image
  ctx.drawImage(image, 0, 0, width, height)

  ctx.restore()

  // Draw watermark
  drawWatermark(ctx, width, height, options)

  return canvas
}

/**
 * Draw watermark on canvas context
 */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: WatermarkOptions
): void {
  const {
    text,
    tiled,
    spacing,
    lineHeight,
    fontSize,
    opacity,
    angle,
    color,
    strokeWidth = 0,
    strokeColor = 'rgba(255, 255, 255, 0.5)',
  } = options

  if (!text.trim()) return

  // 自适应缩放：根据图片尺寸调整水印参数
  // 基准宽度设为 1280px（低分辨率标准），小图不缩小（最小1.0），大图按比例放大
  const baseWidth = 1280
  const scaleFactor = Math.max(1.0, Math.min(width, height) / baseWidth)

  // 缩放后的实际参数
  const scaledFontSize = fontSize * scaleFactor
  const scaledSpacing = spacing * scaleFactor
  const scaledLineHeight = lineHeight * scaleFactor
  const scaledStrokeWidth = strokeWidth * scaleFactor

  // Process text - replace date/time placeholders
  const processedText = replaceDateTimePlaceholders(text)
  const lines = processedText.split('\n').filter((line) => line.trim())

  if (lines.length === 0) return

  // Setup text rendering (使用缩放后的字体大小)
  ctx.font = `${scaledFontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif`
  ctx.fillStyle = color
  ctx.globalAlpha = opacity / 100
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (scaledStrokeWidth > 0) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = scaledStrokeWidth
  }

  if (tiled) {
    drawTiledWatermark(ctx, width, height, lines, {
      spacing: scaledSpacing,
      lineHeight: scaledLineHeight,
      angle,
      strokeWidth: scaledStrokeWidth,
    })
  } else {
    drawCenteredWatermark(ctx, width, height, lines, {
      lineHeight: scaledLineHeight,
      angle,
      strokeWidth: scaledStrokeWidth,
    })
  }

  // Reset context
  ctx.globalAlpha = 1
}

/**
 * Draw tiled watermark pattern
 */
function drawTiledWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lines: string[],
  options: {
    spacing: number
    lineHeight: number
    angle: number
    strokeWidth: number
  }
): void {
  const { spacing, lineHeight, angle, strokeWidth } = options

  // Calculate text block dimensions
  const textHeight = lines.length * lineHeight
  const maxTextWidth = Math.max(...lines.map((line) => ctx.measureText(line).width))

  // Calculate grid spacing with padding
  const gridSpacingX = maxTextWidth + spacing
  const gridSpacingY = textHeight + spacing

  // Rotate canvas
  const angleRad = (angle * Math.PI) / 180
  const diagonal = Math.sqrt(width * width + height * height)

  // Calculate how many repetitions we need (with extra margin for rotation)
  const numCols = Math.ceil(diagonal / gridSpacingX) + 2
  const numRows = Math.ceil(diagonal / gridSpacingY) + 2

  ctx.save()

  // Move to center and rotate
  ctx.translate(width / 2, height / 2)
  ctx.rotate(angleRad)

  // Calculate starting position (top-left of grid)
  const startX = -(numCols * gridSpacingX) / 2
  const startY = -(numRows * gridSpacingY) / 2

  // Draw grid
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const x = startX + col * gridSpacingX
      const y = startY + row * gridSpacingY

      drawTextBlock(ctx, lines, x, y, lineHeight, strokeWidth)
    }
  }

  ctx.restore()
}

/**
 * Draw centered watermark (single instance)
 */
function drawCenteredWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lines: string[],
  options: {
    lineHeight: number
    angle: number
    strokeWidth: number
  }
): void {
  const { lineHeight, angle, strokeWidth } = options

  ctx.save()

  // Move to center and rotate
  ctx.translate(width / 2, height / 2)
  ctx.rotate((angle * Math.PI) / 180)

  drawTextBlock(ctx, lines, 0, 0, lineHeight, strokeWidth)

  ctx.restore()
}

/**
 * Draw a block of text lines
 */
function drawTextBlock(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  strokeWidth: number
): void {
  const totalHeight = lines.length * lineHeight
  const startY = y - totalHeight / 2 + lineHeight / 2

  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight

    // Draw stroke first (if enabled)
    if (strokeWidth > 0) {
      ctx.strokeText(line, x, lineY)
    }

    // Draw fill text
    ctx.fillText(line, x, lineY)
  })
}

/**
 * Replace date/time placeholders in text
 * Supports: {YYYY}, {MM}, {DD}, {HH}, {mm}, {ss}, {YYYY-MM-DD}, {HH:mm}
 */
function replaceDateTimePlaceholders(text: string): string {
  const now = new Date()

  const replacements: Record<string, string> = {
    '{YYYY}': now.getFullYear().toString(),
    '{MM}': String(now.getMonth() + 1).padStart(2, '0'),
    '{DD}': String(now.getDate()).padStart(2, '0'),
    '{HH}': String(now.getHours()).padStart(2, '0'),
    '{mm}': String(now.getMinutes()).padStart(2, '0'),
    '{ss}': String(now.getSeconds()).padStart(2, '0'),
    '{YYYY-MM-DD}': `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    '{HH:mm}': `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    '{YYYY-MM-DD HH:mm}': `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
  }

  let result = text
  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(placeholder, 'g'), value)
  })

  return result
}

/**
 * Export canvas to Blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob from canvas'))
        }
      },
      format,
      quality
    )
  })
}

/**
 * Download canvas as image file
 */
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.95
): Promise<void> {
  const blob = await canvasToBlob(canvas, format, quality)
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

/**
 * Resize canvas while maintaining aspect ratio
 */
export function resizeCanvas(
  sourceCanvas: HTMLCanvasElement,
  maxDimension: number
): HTMLCanvasElement {
  const { width, height } = sourceCanvas

  // Calculate new dimensions
  let newWidth = width
  let newHeight = height

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      newWidth = maxDimension
      newHeight = (height / width) * maxDimension
    } else {
      newHeight = maxDimension
      newWidth = (width / height) * maxDimension
    }
  }

  // Create new canvas with resized dimensions
  const canvas = document.createElement('canvas')
  canvas.width = newWidth
  canvas.height = newHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  // Use high quality scaling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight)

  return canvas
}
