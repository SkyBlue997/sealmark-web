/**
 * ZIP file creation for batch export
 */

import JSZip from 'jszip'

export interface BatchExportItem {
  blob: Blob
  filename: string
}

/**
 * Create ZIP file from multiple images
 */
export async function createZipFromImages(
  items: BatchExportItem[],
  zipFilename = 'watermarked_images.zip'
): Promise<void> {
  const zip = new JSZip()

  // Add each file to the ZIP
  items.forEach((item) => {
    zip.file(item.filename, item.blob)
  })

  // Generate ZIP file
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6, // Balance between speed and compression
    },
  })

  // Download the ZIP
  downloadBlob(blob, zipFilename)
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Generate filename for watermarked image
 * Supports templates: {basename}, {date}, {time}, {index}
 */
export function generateFilename(
  originalFilename: string,
  template = '{basename}_watermarked_{date}',
  index?: number
): string {
  const now = new Date()

  // Extract basename (filename without extension)
  const lastDotIndex = originalFilename.lastIndexOf('.')
  const basename = lastDotIndex !== -1 ? originalFilename.slice(0, lastDotIndex) : originalFilename
  const extension = lastDotIndex !== -1 ? originalFilename.slice(lastDotIndex) : '.png'

  // Date/time formatting
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

  // Replace template variables
  let filename = template
    .replace(/{basename}/g, basename)
    .replace(/{date}/g, dateStr)
    .replace(/{time}/g, timeStr)
    .replace(/{index}/g, index !== undefined ? String(index + 1).padStart(3, '0') : '001')

  return filename + extension
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
