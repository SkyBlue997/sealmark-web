/**
 * EXIF orientation handling utilities
 * Automatically corrects image orientation based on EXIF data
 */

import ExifReader from 'exifreader'

/**
 * EXIF orientation values
 * 1 = Normal (0°)
 * 2 = Flip horizontal
 * 3 = Rotate 180°
 * 4 = Flip vertical
 * 5 = Rotate 90° CCW + Flip horizontal
 * 6 = Rotate 90° CW
 * 7 = Rotate 90° CW + Flip horizontal
 * 8 = Rotate 90° CCW
 */
export type ExifOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface ImageWithOrientation {
  image: HTMLImageElement
  orientation: ExifOrientation
  width: number
  height: number
}

/**
 * Read EXIF orientation from image file
 */
export async function getExifOrientation(file: File): Promise<ExifOrientation> {
  try {
    const tags = await ExifReader.load(file)
    const orientation = tags.Orientation?.value as number | undefined
    return (orientation as ExifOrientation) || 1
  } catch (error) {
    console.warn('Failed to read EXIF data:', error)
    return 1 // Default to normal orientation
  }
}

/**
 * Load image from file and read its EXIF orientation
 */
export async function loadImageWithOrientation(
  file: File,
  applyRotation = false
): Promise<ImageWithOrientation> {
  const [image, orientation] = await Promise.all([
    loadImage(file),
    getExifOrientation(file),
  ])

  // 如果不应用旋转，强制使用正常方向
  const actualOrientation = applyRotation ? orientation : 1

  const { width, height } = getOrientedDimensions(
    image.naturalWidth,
    image.naturalHeight,
    actualOrientation
  )

  return {
    image,
    orientation: actualOrientation,
    width,
    height,
  }
}

/**
 * Load image from file
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Get corrected dimensions based on EXIF orientation
 */
export function getOrientedDimensions(
  width: number,
  height: number,
  orientation: ExifOrientation
): { width: number; height: number } {
  // Orientations 5, 6, 7, 8 swap width and height
  if (orientation >= 5 && orientation <= 8) {
    return { width: height, height: width }
  }
  return { width, height }
}

/**
 * Apply EXIF orientation transformation to canvas context
 */
export function applyOrientationTransform(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  orientation: ExifOrientation
): void {
  switch (orientation) {
    case 1:
      // Normal - no transformation needed
      break
    case 2:
      // Flip horizontal
      ctx.transform(-1, 0, 0, 1, width, 0)
      break
    case 3:
      // Rotate 180°
      ctx.transform(-1, 0, 0, -1, width, height)
      break
    case 4:
      // Flip vertical
      ctx.transform(1, 0, 0, -1, 0, height)
      break
    case 5:
      // Rotate 90° CCW + Flip horizontal
      ctx.transform(0, 1, 1, 0, 0, 0)
      break
    case 6:
      // Rotate 90° CW
      ctx.transform(0, 1, -1, 0, height, 0)
      break
    case 7:
      // Rotate 90° CW + Flip horizontal
      ctx.transform(0, -1, -1, 0, height, width)
      break
    case 8:
      // Rotate 90° CCW
      ctx.transform(0, -1, 1, 0, 0, width)
      break
  }
}

/**
 * Create canvas with corrected orientation
 */
export function createOrientedCanvas(
  image: HTMLImageElement,
  orientation: ExifOrientation,
  scale = 1
): HTMLCanvasElement {
  const { width, height } = getOrientedDimensions(
    image.naturalWidth,
    image.naturalHeight,
    orientation
  )

  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context')
  }

  // Apply high DPI scaling
  if (scale !== 1) {
    ctx.scale(scale, scale)
  }

  // Apply orientation transformation
  applyOrientationTransform(ctx, width, height, orientation)

  // Draw the image
  ctx.drawImage(image, 0, 0, width, height)

  return canvas
}
