/**
 * Watermark state management using Zustand
 * Manages all watermark configuration and image state
 */

import { create } from 'zustand'
import type { WatermarkOptions } from '../lib/canvas/watermark'

export interface WatermarkState extends WatermarkOptions {
  // Actions
  setText: (text: string) => void
  setTiled: (tiled: boolean) => void
  setSpacing: (spacing: number) => void
  setLineHeight: (lineHeight: number) => void
  setFontSize: (fontSize: number) => void
  setOpacity: (opacity: number) => void
  setAngle: (angle: number) => void
  setColor: (color: string) => void
  reset: () => void
}

// Default watermark configuration
const defaultConfig: WatermarkOptions = {
  text: '仅供办理XX业务使用,他用无效',
  tiled: true,
  spacing: 70,
  lineHeight: 90,
  fontSize: 60,
  opacity: 60,
  angle: 30,
  color: '#000000',
  strokeWidth: 1,
  strokeColor: 'rgba(255, 255, 255, 0.5)',
}

export const useWatermarkState = create<WatermarkState>((set) => ({
  ...defaultConfig,

  setText: (text) => set({ text }),
  setTiled: (tiled) => set({ tiled }),
  setSpacing: (spacing) => set({ spacing }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  setFontSize: (fontSize) => set({ fontSize }),
  setOpacity: (opacity) => set({ opacity }),
  setAngle: (angle) => set({ angle }),
  setColor: (color) => set({ color }),

  reset: () => set(defaultConfig),
}))

/**
 * Hook to get watermark options (without actions)
 */
export function useWatermarkOptions(): WatermarkOptions {
  return useWatermarkState((state) => ({
    text: state.text,
    tiled: state.tiled,
    spacing: state.spacing,
    lineHeight: state.lineHeight,
    fontSize: state.fontSize,
    opacity: state.opacity,
    angle: state.angle,
    color: state.color,
    strokeWidth: state.strokeWidth,
    strokeColor: state.strokeColor,
  }))
}
