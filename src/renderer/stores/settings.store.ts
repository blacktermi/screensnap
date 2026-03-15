import { create } from 'zustand'

export type CaptureFormat = 'png' | 'jpg' | 'webp' | 'tiff'

export type OverlayPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

export interface ShortcutMap {
  captureArea: string
  captureWindow: string
  captureFullscreen: string
  captureScrolling: string
  capturePreviousArea: string
  recordScreen: string
  recordGif: string
  ocrCapture: string
  openHistory: string
  pinScreenshot: string
  [key: string]: string
}

interface SettingsState {
  shortcuts: ShortcutMap
  captureFormat: CaptureFormat
  captureQuality: number
  savePath: string
  showOverlay: boolean
  overlayPosition: OverlayPosition
  autoClose: boolean
  autoCloseDelay: number
  playSound: boolean
  showCursor: boolean
  copyToClipboard: boolean
  windowShadow: boolean
  retinaResolution: boolean
  launchAtLogin: boolean
  checkUpdates: boolean
  hardwareAcceleration: boolean
  debugMode: boolean
}

interface SettingsActions {
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
  updateShortcut: (action: string, keys: string) => void
  resetDefaults: () => void
  loadSettings: (settings: Partial<SettingsState>) => void
}

const defaultShortcuts: ShortcutMap = {
  captureArea: 'CommandOrControl+Shift+4',
  captureWindow: 'CommandOrControl+Shift+5',
  captureFullscreen: 'CommandOrControl+Shift+3',
  captureScrolling: 'CommandOrControl+Shift+6',
  capturePreviousArea: 'CommandOrControl+Shift+R',
  recordScreen: 'CommandOrControl+Shift+8',
  recordGif: 'CommandOrControl+Shift+9',
  ocrCapture: 'CommandOrControl+Shift+O',
  openHistory: 'CommandOrControl+Shift+H',
  pinScreenshot: 'CommandOrControl+Shift+P',
}

const defaultSettings: SettingsState = {
  shortcuts: { ...defaultShortcuts },
  captureFormat: 'png',
  captureQuality: 90,
  savePath: '~/Desktop',
  showOverlay: true,
  overlayPosition: 'bottom-right',
  autoClose: true,
  autoCloseDelay: 5,
  playSound: true,
  showCursor: false,
  copyToClipboard: true,
  windowShadow: true,
  retinaResolution: true,
  launchAtLogin: false,
  checkUpdates: true,
  hardwareAcceleration: true,
  debugMode: false,
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  ...defaultSettings,

  updateSetting: (key, value) => set({ [key]: value }),

  updateShortcut: (action, keys) =>
    set((state) => ({
      shortcuts: { ...state.shortcuts, [action]: keys },
    })),

  resetDefaults: () => set(defaultSettings),

  loadSettings: (settings) => set(settings),
}))
