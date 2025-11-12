/**
 * Image settings state management
 * Controls image processing options like EXIF rotation
 */

import { create } from 'zustand'

export interface ImageSettings {
  applyExifRotation: boolean
  setApplyExifRotation: (apply: boolean) => void
  reset: () => void
}

const defaultSettings = {
  applyExifRotation: true, // 默认开启自动旋转，确保图片按拍摄方向显示
}

export const useImageSettings = create<ImageSettings>((set) => ({
  ...defaultSettings,

  setApplyExifRotation: (apply) => set({ applyExifRotation: apply }),
  reset: () => set(defaultSettings),
}))
