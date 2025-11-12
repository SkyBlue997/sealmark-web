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
  applyExifRotation: false, // 默认关闭自动旋转，保持图片原始方向
}

export const useImageSettings = create<ImageSettings>((set) => ({
  ...defaultSettings,

  setApplyExifRotation: (apply) => set({ applyExifRotation: apply }),
  reset: () => set(defaultSettings),
}))
