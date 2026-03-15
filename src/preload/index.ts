/**
 * Script preload de ScreenSnap.
 *
 * Expose une API type-safe au renderer via contextBridge.
 * Toute communication entre le renderer et le processus principal
 * passe par ce pont IPC.
 *
 * Convention de nommage des canaux : screensnap:<domaine>:<action>
 */

import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronAPI } from './types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  return ipcRenderer.invoke(channel, ...args)
}

// ─── API exposee au renderer ─────────────────────────────────────────────────

const electronAPI: ElectronAPI = {
  // ── Capture ──────────────────────────────────────────────────────────────

  capture: {
    area: (options) => invoke('screensnap:capture:area', options),
    window: (windowId, options) => invoke('screensnap:capture:window', windowId, options),
    fullscreen: (displayId, options) => invoke('screensnap:capture:fullscreen', displayId, options),
    scrolling: (options) => invoke('screensnap:capture:scrolling', options),
    freeze: () => invoke('screensnap:capture:freeze'),
    previousArea: (options) => invoke('screensnap:capture:previous-area', options),
  },

  // ── Recording ────────────────────────────────────────────────────────────

  recording: {
    start: (options) => invoke('screensnap:recording:start', options),
    stop: () => invoke('screensnap:recording:stop'),
    pause: () => invoke('screensnap:recording:pause'),
    resume: () => invoke('screensnap:recording:resume'),
    getState: () => invoke('screensnap:recording:get-state'),
  },

  // ── OCR ──────────────────────────────────────────────────────────────────

  ocr: {
    recognize: (imagePath) => invoke('screensnap:ocr:recognize', imagePath),
  },

  // ── Overlay ──────────────────────────────────────────────────────────────

  overlay: {
    show: (captureData) => invoke('screensnap:overlay:show', captureData),
    hide: () => invoke('screensnap:overlay:hide'),
    action: (actionType) => invoke('screensnap:overlay:action', actionType),
  },

  // ── History ──────────────────────────────────────────────────────────────

  history: {
    getAll: (options) => invoke('screensnap:history:get-all', options),
    delete: (id) => invoke('screensnap:history:delete', id),
    clear: () => invoke('screensnap:history:clear'),
  },

  // ── Settings ─────────────────────────────────────────────────────────────

  settings: {
    get: (key) => invoke('screensnap:settings:get', key),
    set: (key, value) => invoke('screensnap:settings:set', key, value),
    getAll: () => invoke('screensnap:settings:get-all'),
  },

  // ── Pin ──────────────────────────────────────────────────────────────────

  pin: {
    create: (imagePath, options) => invoke('screensnap:pin:create', imagePath, options),
    close: (id) => invoke('screensnap:pin:close', id),
  },

  // ── Clipboard ────────────────────────────────────────────────────────────

  clipboard: {
    copyImage: (buffer) => invoke('screensnap:clipboard:copy-image', buffer),
    copyText: (text) => invoke('screensnap:clipboard:copy-text', text),
  },

  // ── File ─────────────────────────────────────────────────────────────────

  file: {
    save: (buffer, options) => invoke('screensnap:file:save', buffer, options),
    openDialog: (options) => invoke('screensnap:file:open-dialog', options),
  },

  // ── App ──────────────────────────────────────────────────────────────────

  app: {
    getDisplays: () => invoke('screensnap:app:get-displays'),
    getVersion: () => invoke('screensnap:app:get-version'),
    quit: () => invoke('screensnap:app:quit'),
  },

  // ── Evenements ───────────────────────────────────────────────────────────

  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => {
      callback(...args)
    }
    ipcRenderer.on(channel, listener)
  },

  off: (channel: string, callback: (...args: unknown[]) => void) => {
    // Note : ipcRenderer.removeListener attend le listener exact.
    // En pratique, on supprime tous les listeners du canal.
    ipcRenderer.removeAllListeners(channel)
  },
}

// ─── Exposition via contextBridge ────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
