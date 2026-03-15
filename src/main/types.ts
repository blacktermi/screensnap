/**
 * Types partagés pour le processus principal de ScreenSnap.
 */

// ─── Capture ────────────────────────────────────────────────────────────────

export interface CaptureRect {
  x: number
  y: number
  width: number
  height: number
}

export interface CaptureMetadata {
  id: string
  type: CaptureType
  path: string
  thumbnailPath: string | null
  dimensions: { width: number; height: number }
  fileSize: number
  createdAt: string
  tags: string[]
}

export type CaptureType =
  | 'area'
  | 'window'
  | 'fullscreen'
  | 'scrolling'
  | 'previous-area'

export type CaptureFormat = 'png' | 'jpg' | 'webp' | 'tiff'

export interface CaptureOptions {
  format?: CaptureFormat
  quality?: number
  delay?: number
  displayId?: number
  captureRect?: CaptureRect
  hideCursor?: boolean
}

// ─── Recording ──────────────────────────────────────────────────────────────

export type RecordingMode = 'video' | 'gif'

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

export interface RecordingOptions {
  mode: RecordingMode
  area?: CaptureRect
  fps: number
  quality: 'low' | 'medium' | 'high' | 'lossless'
  includeSystemAudio: boolean
  includeMicrophone: boolean
  microphoneDeviceId?: string
  showCursor: boolean
  showClicks: boolean
  showKeystrokes: boolean
  webcamEnabled: boolean
  webcamShape?: WebcamShape
  maxDuration?: number
}

export type WebcamShape = 'circle' | 'square' | 'rounded'

export interface RecordingResult {
  path: string
  duration: number
  fileSize: number
  dimensions: { width: number; height: number }
}

// ─── Audio ──────────────────────────────────────────────────────────────────

export interface AudioDevice {
  id: string
  label: string
  kind: 'audioinput' | 'audiooutput'
}

// ─── OCR ────────────────────────────────────────────────────────────────────

export interface OcrResult {
  text: string
  confidence: number
  regions: OcrRegion[]
}

export interface OcrRegion {
  text: string
  bounds: CaptureRect
  confidence: number
}

// ─── Window ─────────────────────────────────────────────────────────────────

export interface WindowInfo {
  id: number
  name: string
  ownerName: string
  bounds: CaptureRect
  isOnScreen: boolean
}

// ─── Display ────────────────────────────────────────────────────────────────

export interface DisplayInfo {
  id: number
  label: string
  bounds: CaptureRect
  scaleFactor: number
  isPrimary: boolean
}

// ─── Storage ────────────────────────────────────────────────────────────────

export interface CaptureRow {
  id: string
  type: CaptureType
  path: string
  thumbnail_path: string | null
  width: number
  height: number
  file_size: number
  created_at: string
  tags: string
}

export interface SettingRow {
  key: string
  value: string
}

// ─── Cloud ──────────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string
  deleteUrl?: string
  expiresAt?: string
}

export interface ShareLink {
  id: string
  url: string
  captureId: string
  createdAt: string
  expiresAt?: string
  password?: string
}

// ─── Pin ────────────────────────────────────────────────────────────────────

export interface PinOptions {
  imagePath: string
  bounds?: CaptureRect
  opacity?: number
  alwaysOnTop?: boolean
}

// ─── Settings ───────────────────────────────────────────────────────────────

export interface AppSettings {
  captureFormat: CaptureFormat
  captureQuality: number
  savePath: string
  playSound: boolean
  showNotification: boolean
  autoSave: boolean
  copyToClipboard: boolean
  timerDelay: number
  shortcuts: ShortcutMap
}

export interface ShortcutMap {
  [action: string]: string
}

// ─── Effects ────────────────────────────────────────────────────────────────

export interface ClickHighlightOptions {
  color: string
  radius: number
  duration: number
}

export interface KeystrokeOptions {
  fontSize: number
  backgroundColor: string
  textColor: string
  position: 'bottom-left' | 'bottom-center' | 'bottom-right'
  duration: number
}
