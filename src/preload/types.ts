/**
 * Types pour le bridge IPC entre le processus principal et le renderer.
 * Ce fichier definit le contrat de l'API exposee via contextBridge.
 */

// ─── Re-exports depuis le processus principal ────────────────────────────────

export type {
  CaptureRect,
  CaptureMetadata,
  CaptureType,
  CaptureFormat,
  CaptureOptions,
  RecordingMode,
  RecordingState,
  RecordingOptions,
  RecordingResult,
  AudioDevice,
  OcrResult,
  OcrRegion,
  WindowInfo,
  DisplayInfo,
  PinOptions,
  AppSettings,
  ShortcutMap,
} from '../main/types'

import type {
  CaptureMetadata,
  CaptureOptions,
  RecordingOptions,
  RecordingState,
  RecordingResult,
  OcrResult,
  DisplayInfo,
  AppSettings,
} from '../main/types'

// ─── Options et parametres ───────────────────────────────────────────────────

export interface HistoryQueryOptions {
  limit?: number
  offset?: number
  type?: string
  search?: string
  sortBy?: 'date' | 'size' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface OverlayData {
  imagePath: string
  bounds: { x: number; y: number; width: number; height: number }
  displayId?: number
}

export type OverlayActionType =
  | 'save'
  | 'copy'
  | 'edit'
  | 'upload'
  | 'pin'
  | 'close'
  | 'ocr'

export interface FileSaveOptions {
  defaultName?: string
  format?: string
  directory?: string
}

export interface FileDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>
}

export interface RecordingStartOptions extends RecordingOptions {
  outputPath?: string
}

// ─── API Surface ─────────────────────────────────────────────────────────────

export interface CaptureAPI {
  area: (options?: CaptureOptions) => Promise<CaptureMetadata>
  window: (windowId?: number, options?: CaptureOptions) => Promise<CaptureMetadata>
  fullscreen: (displayId?: number, options?: CaptureOptions) => Promise<CaptureMetadata>
  scrolling: (options?: CaptureOptions) => Promise<CaptureMetadata>
  freeze: () => Promise<void>
  previousArea: (options?: CaptureOptions) => Promise<CaptureMetadata>
}

export interface RecordingAPI {
  start: (options: RecordingStartOptions) => Promise<void>
  stop: () => Promise<RecordingResult>
  pause: () => Promise<void>
  resume: () => Promise<void>
  getState: () => Promise<RecordingState>
}

export interface OcrAPI {
  recognize: (imagePath: string) => Promise<OcrResult>
}

export interface OverlayAPI {
  show: (captureData: OverlayData) => Promise<void>
  hide: () => Promise<void>
  action: (actionType: OverlayActionType) => Promise<void>
}

export interface HistoryAPI {
  getAll: (options?: HistoryQueryOptions) => Promise<CaptureMetadata[]>
  delete: (id: string) => Promise<void>
  clear: () => Promise<void>
}

export interface SettingsAPI {
  get: <K extends keyof AppSettings>(key: K) => Promise<AppSettings[K]>
  set: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>
  getAll: () => Promise<AppSettings>
}

export interface PinAPI {
  create: (imagePath: string, options?: { opacity?: number }) => Promise<string>
  close: (id: string) => Promise<void>
}

export interface ClipboardAPI {
  copyImage: (buffer: Uint8Array) => Promise<void>
  copyText: (text: string) => Promise<void>
}

export interface FileAPI {
  save: (buffer: Uint8Array, options?: FileSaveOptions) => Promise<string>
  openDialog: (options?: FileDialogOptions) => Promise<string | null>
}

export interface AppAPI {
  getDisplays: () => Promise<DisplayInfo[]>
  getVersion: () => Promise<string>
  quit: () => Promise<void>
}

// ─── ElectronAPI globale ─────────────────────────────────────────────────────

export interface ElectronAPI {
  capture: CaptureAPI
  recording: RecordingAPI
  ocr: OcrAPI
  overlay: OverlayAPI
  history: HistoryAPI
  settings: SettingsAPI
  pin: PinAPI
  clipboard: ClipboardAPI
  file: FileAPI
  app: AppAPI
  on: (channel: string, callback: (...args: unknown[]) => void) => void
  off: (channel: string, callback: (...args: unknown[]) => void) => void
}

// ─── Declaration globale ─────────────────────────────────────────────────────

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
