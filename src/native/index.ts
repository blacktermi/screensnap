/**
 * Wrapper TypeScript pour les addons natifs Swift de ScreenSnap.
 *
 * Charge les modules .node compiles et expose des interfaces typees.
 * Si un addon natif n'est pas disponible (non compile ou plateforme
 * non supportee), un stub est fourni qui leve une erreur descriptive.
 */

import path from 'node:path'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NativeScreenCapture {
  captureArea(x: number, y: number, width: number, height: number): Buffer
  captureWindow(windowId: number): Buffer
  captureFullscreen(displayId: number): Buffer
  getWindowList(): Array<{
    id: number
    name: string
    ownerName: string
    x: number
    y: number
    width: number
    height: number
    isOnScreen: boolean
  }>
  hasPermission(): boolean
  requestPermission(): void
}

export interface NativeOCR {
  recognizeText(imageData: Buffer): string[]
  recognizeTextWithRegions(imageData: Buffer): Array<{
    text: string
    confidence: number
    bounds: { x: number; y: number; width: number; height: number }
  }>
  supportedLanguages(): string[]
}

export interface NativeAudioCapture {
  startSystemAudioCapture(): void
  stopCapture(): string | null
  getAudioDevices(): Array<{
    id: number
    label: string
    kind: 'audioinput' | 'audiooutput'
    uid: string
  }>
  isCapturing(): boolean
}

// ─── Chargement des addons natifs ────────────────────────────────────────────

function loadNativeAddon<T>(moduleName: string): T | null {
  if (process.platform !== 'darwin') {
    console.warn(
      `[Native] Le module "${moduleName}" n'est disponible que sur macOS.`,
    )
    return null
  }

  const possiblePaths = [
    // Build de developpement
    path.join(__dirname, '..', '..', 'build', 'Release', `${moduleName}.node`),
    // Build de production (dans les ressources de l'app Electron)
    path.join(
      process.resourcesPath ?? __dirname,
      'native',
      `${moduleName}.node`,
    ),
    // Chemin relatif depuis src/native
    path.join(__dirname, `${moduleName}.node`),
  ]

  for (const addonPath of possiblePaths) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const addon = require(addonPath) as T
      console.log(`[Native] Module "${moduleName}" charge depuis ${addonPath}`)
      return addon
    } catch {
      // Essayer le chemin suivant
    }
  }

  console.warn(
    `[Native] Module "${moduleName}" introuvable. ` +
      'Executez "pnpm build:native" ou "bash scripts/build-native.sh" pour le compiler.',
  )
  return null
}

// ─── Stubs (fallback quand les addons ne sont pas disponibles) ───────────────

function createCaptureStub(): NativeScreenCapture {
  const error = () => {
    throw new Error(
      '[ScreenSnap] Le module natif de capture n\'est pas disponible. ' +
        'Compilez les addons Swift avec "pnpm build:native". ' +
        'Prerequis : macOS 12.3+, Xcode Command Line Tools, Swift 5.9+.',
    )
  }

  return {
    captureArea: error,
    captureWindow: error,
    captureFullscreen: error,
    getWindowList: error,
    hasPermission: () => false,
    requestPermission: error,
  }
}

function createOCRStub(): NativeOCR {
  const error = () => {
    throw new Error(
      '[ScreenSnap] Le module natif OCR n\'est pas disponible. ' +
        'Compilez les addons Swift avec "pnpm build:native". ' +
        'Prerequis : macOS 12.0+, Xcode Command Line Tools, Swift 5.9+.',
    )
  }

  return {
    recognizeText: error,
    recognizeTextWithRegions: error,
    supportedLanguages: () => [],
  }
}

function createAudioStub(): NativeAudioCapture {
  const error = () => {
    throw new Error(
      '[ScreenSnap] Le module natif de capture audio n\'est pas disponible. ' +
        'Compilez les addons Swift avec "pnpm build:native". ' +
        'Prerequis : macOS 12.0+, Xcode Command Line Tools, Swift 5.9+.',
    )
  }

  return {
    startSystemAudioCapture: error,
    stopCapture: error,
    getAudioDevices: error,
    isCapturing: () => false,
  }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export const screenCapture: NativeScreenCapture =
  loadNativeAddon<NativeScreenCapture>('screensnap_capture') ?? createCaptureStub()

export const ocr: NativeOCR =
  loadNativeAddon<NativeOCR>('screensnap_ocr') ?? createOCRStub()

export const audioCapture: NativeAudioCapture =
  loadNativeAddon<NativeAudioCapture>('screensnap_audio') ?? createAudioStub()

/**
 * Verifie si tous les addons natifs sont disponibles.
 */
export function areNativeAddonsAvailable(): boolean {
  try {
    screenCapture.hasPermission()
    return true
  } catch {
    return false
  }
}
