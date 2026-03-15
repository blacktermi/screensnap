import { ipcMain, screen } from 'electron'
import type { Database } from './storage/database'
import type {
  CaptureRect,
  CaptureOptions,
  RecordingOptions,
  DisplayInfo,
  CaptureMetadata,
  PinOptions,
} from './types'

/**
 * Enregistre tous les handlers IPC pour la communication main <-> renderer.
 * Chaque handler est un stub qui log l'action et retourne un placeholder.
 */
export function registerIpcHandlers(database: Database): void {
  registerCaptureHandlers()
  registerRecordingHandlers()
  registerOcrHandlers()
  registerOverlayHandlers()
  registerHistoryHandlers(database)
  registerSettingsHandlers(database)
  registerPinHandlers()
  registerClipboardHandlers()
  registerFileHandlers()
  registerAppHandlers()

  console.log('[IPC] Tous les handlers enregistrés')
}

// ─── Capture ────────────────────────────────────────────────────────────────

function registerCaptureHandlers(): void {
  ipcMain.handle(
    'capture:area',
    async (_event, options?: CaptureOptions): Promise<Buffer | null> => {
      console.log('[IPC] capture:area', options)
      // TODO: Implémenter la capture de zone
      return null
    }
  )

  ipcMain.handle(
    'capture:window',
    async (_event, windowId?: number): Promise<Buffer | null> => {
      console.log('[IPC] capture:window', { windowId })
      // TODO: Implémenter la capture de fenêtre
      return null
    }
  )

  ipcMain.handle(
    'capture:fullscreen',
    async (_event, displayId?: number): Promise<Buffer | null> => {
      console.log('[IPC] capture:fullscreen', { displayId })
      // TODO: Implémenter la capture plein écran
      return null
    }
  )

  ipcMain.handle('capture:scrolling', async (): Promise<Buffer | null> => {
    console.log('[IPC] capture:scrolling')
    // TODO: Implémenter la capture défilante
    return null
  })

  ipcMain.handle(
    'capture:freeze',
    async (_event, displayId?: number): Promise<boolean> => {
      console.log('[IPC] capture:freeze', { displayId })
      // TODO: Implémenter le gel d'écran
      return false
    }
  )

  ipcMain.handle(
    'capture:previous-area',
    async (_event, rect?: CaptureRect): Promise<Buffer | null> => {
      console.log('[IPC] capture:previous-area', rect)
      // TODO: Recapturer la zone précédente
      return null
    }
  )
}

// ─── Enregistrement ─────────────────────────────────────────────────────────

function registerRecordingHandlers(): void {
  ipcMain.handle(
    'recording:start',
    async (_event, options?: RecordingOptions): Promise<boolean> => {
      console.log('[IPC] recording:start', options)
      // TODO: Démarrer l'enregistrement
      return false
    }
  )

  ipcMain.handle('recording:stop', async (): Promise<string | null> => {
    console.log('[IPC] recording:stop')
    // TODO: Arrêter l'enregistrement et retourner le chemin du fichier
    return null
  })

  ipcMain.handle('recording:pause', async (): Promise<boolean> => {
    console.log('[IPC] recording:pause')
    // TODO: Mettre en pause l'enregistrement
    return false
  })

  ipcMain.handle('recording:resume', async (): Promise<boolean> => {
    console.log('[IPC] recording:resume')
    // TODO: Reprendre l'enregistrement
    return false
  })
}

// ─── OCR ────────────────────────────────────────────────────────────────────

function registerOcrHandlers(): void {
  ipcMain.handle(
    'ocr:recognize',
    async (_event, source?: string | Buffer): Promise<string | null> => {
      console.log('[IPC] ocr:recognize', typeof source)
      // TODO: Lancer la reconnaissance de texte
      return null
    }
  )
}

// ─── Overlay ────────────────────────────────────────────────────────────────

function registerOverlayHandlers(): void {
  ipcMain.handle(
    'overlay:show',
    async (_event, type?: string): Promise<boolean> => {
      console.log('[IPC] overlay:show', { type })
      // TODO: Afficher l'overlay de capture
      return false
    }
  )

  ipcMain.handle('overlay:hide', async (): Promise<boolean> => {
    console.log('[IPC] overlay:hide')
    // TODO: Masquer l'overlay de capture
    return false
  })

  ipcMain.handle(
    'overlay:action',
    async (_event, action: string, data?: unknown): Promise<boolean> => {
      console.log('[IPC] overlay:action', { action, data })
      // TODO: Exécuter une action sur l'overlay
      return false
    }
  )
}

// ─── Historique ─────────────────────────────────────────────────────────────

function registerHistoryHandlers(database: Database): void {
  ipcMain.handle(
    'history:get-all',
    async (_event, limit?: number): Promise<CaptureMetadata[]> => {
      console.log('[IPC] history:get-all', { limit })
      const rows = database.getAllCaptures(limit ?? 100)
      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        path: row.path,
        thumbnailPath: row.thumbnail_path,
        dimensions: { width: row.width, height: row.height },
        fileSize: row.file_size,
        createdAt: row.created_at,
        tags: row.tags ? row.tags.split(',') : [],
      }))
    }
  )

  ipcMain.handle(
    'history:delete',
    async (_event, id: string): Promise<boolean> => {
      console.log('[IPC] history:delete', { id })
      database.deleteCapture(id)
      return true
    }
  )

  ipcMain.handle('history:clear', async (): Promise<boolean> => {
    console.log('[IPC] history:clear')
    // TODO: Supprimer tout l'historique
    return true
  })
}

// ─── Réglages ───────────────────────────────────────────────────────────────

function registerSettingsHandlers(database: Database): void {
  ipcMain.handle(
    'settings:get',
    async (_event, key: string): Promise<string | null> => {
      console.log('[IPC] settings:get', { key })
      return database.getSetting(key)
    }
  )

  ipcMain.handle(
    'settings:set',
    async (_event, key: string, value: string): Promise<boolean> => {
      console.log('[IPC] settings:set', { key, value })
      database.setSetting(key, value)
      return true
    }
  )
}

// ─── Épingle ────────────────────────────────────────────────────────────────

function registerPinHandlers(): void {
  ipcMain.handle(
    'pin:create',
    async (_event, options: PinOptions): Promise<boolean> => {
      console.log('[IPC] pin:create', options)
      // TODO: Créer une fenêtre épinglée avec l'image
      return false
    }
  )

  ipcMain.handle(
    'pin:close',
    async (_event, pinId?: string): Promise<boolean> => {
      console.log('[IPC] pin:close', { pinId })
      // TODO: Fermer la fenêtre épinglée
      return false
    }
  )
}

// ─── Presse-papiers ─────────────────────────────────────────────────────────

function registerClipboardHandlers(): void {
  ipcMain.handle(
    'clipboard:copy-image',
    async (_event, imagePath: string): Promise<boolean> => {
      console.log('[IPC] clipboard:copy-image', { imagePath })
      // TODO: Copier l'image dans le presse-papiers
      return false
    }
  )

  ipcMain.handle(
    'clipboard:copy-text',
    async (_event, text: string): Promise<boolean> => {
      console.log('[IPC] clipboard:copy-text', { text: text.substring(0, 50) })
      // TODO: Copier le texte dans le presse-papiers
      return false
    }
  )
}

// ─── Fichiers ───────────────────────────────────────────────────────────────

function registerFileHandlers(): void {
  ipcMain.handle(
    'file:save',
    async (_event, buffer: Buffer, format: string, filename?: string): Promise<string | null> => {
      console.log('[IPC] file:save', { format, filename })
      // TODO: Sauvegarder le fichier sur le disque
      return null
    }
  )

  ipcMain.handle(
    'file:export',
    async (_event, captureId: string, format: string): Promise<string | null> => {
      console.log('[IPC] file:export', { captureId, format })
      // TODO: Exporter une capture dans un format spécifique
      return null
    }
  )
}

// ─── Application ────────────────────────────────────────────────────────────

function registerAppHandlers(): void {
  ipcMain.handle('app:get-displays', async (): Promise<DisplayInfo[]> => {
    console.log('[IPC] app:get-displays')
    const displays = screen.getAllDisplays()
    const primary = screen.getPrimaryDisplay()

    return displays.map((display) => ({
      id: display.id,
      label: `Écran ${display.id}`,
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primary.id,
    }))
  })
}
