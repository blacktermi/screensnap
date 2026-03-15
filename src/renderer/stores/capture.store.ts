import { create } from 'zustand'

export type CaptureMode = 'area' | 'window' | 'fullscreen' | 'scrolling' | 'previous-area'

export interface CaptureRect {
  x: number
  y: number
  width: number
  height: number
}

export interface CaptureHistoryItem {
  id: string
  type: CaptureMode
  path: string
  thumbnailPath: string | null
  dimensions: { width: number; height: number }
  fileSize: number
  createdAt: string
}

interface CaptureState {
  isCapturing: boolean
  captureMode: CaptureMode
  lastCaptureRect: CaptureRect | null
  lastCapturePath: string | null
  captureHistory: CaptureHistoryItem[]
}

interface CaptureActions {
  startCapture: (mode: CaptureMode) => void
  endCapture: (path: string, rect?: CaptureRect) => void
  setMode: (mode: CaptureMode) => void
  setLastRect: (rect: CaptureRect | null) => void
  addToHistory: (item: CaptureHistoryItem) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
}

const MAX_RECENT_HISTORY = 50

export const useCaptureStore = create<CaptureState & CaptureActions>((set) => ({
  isCapturing: false,
  captureMode: 'area',
  lastCaptureRect: null,
  lastCapturePath: null,
  captureHistory: [],

  startCapture: (mode) =>
    set({
      isCapturing: true,
      captureMode: mode,
    }),

  endCapture: (path, rect) =>
    set({
      isCapturing: false,
      lastCapturePath: path,
      lastCaptureRect: rect ?? null,
    }),

  setMode: (mode) => set({ captureMode: mode }),

  setLastRect: (rect) => set({ lastCaptureRect: rect }),

  addToHistory: (item) =>
    set((state) => ({
      captureHistory: [item, ...state.captureHistory].slice(0, MAX_RECENT_HISTORY),
    })),

  removeFromHistory: (id) =>
    set((state) => ({
      captureHistory: state.captureHistory.filter((item) => item.id !== id),
    })),

  clearHistory: () => set({ captureHistory: [] }),
}))
