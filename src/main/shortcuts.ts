import { globalShortcut, BrowserWindow } from 'electron'
import type { ShortcutMap } from './types'

/**
 * Gestion des raccourcis globaux de ScreenSnap.
 * Les raccourcis sont enregistrés au niveau du système et fonctionnent
 * même lorsque l'application n'a pas le focus.
 */
export class ShortcutManager {
  private registeredShortcuts: string[] = []

  /**
   * Raccourcis par défaut.
   */
  private readonly defaultShortcuts: ShortcutMap = {
    'capture:all-in-one': 'CommandOrControl+Shift+5',
    'capture:area': 'CommandOrControl+Shift+4',
    'capture:fullscreen': 'CommandOrControl+Shift+3',
    'capture:previous-area': 'CommandOrControl+Shift+L',
    'capture:window': 'CommandOrControl+Shift+W',
    'capture:scrolling': 'CommandOrControl+Shift+S',
    'ocr:recognize': 'CommandOrControl+Shift+O',
    'recording:start': 'CommandOrControl+Shift+R',
    'history:show': 'CommandOrControl+Shift+H',
  }

  private shortcuts: ShortcutMap

  constructor() {
    this.shortcuts = { ...this.defaultShortcuts }
  }

  /**
   * Enregistre tous les raccourcis globaux.
   */
  registerAll(): void {
    for (const [action, accelerator] of Object.entries(this.shortcuts)) {
      this.register(accelerator, action)
    }
    console.log(`[Shortcuts] ${this.registeredShortcuts.length} raccourcis enregistrés`)
  }

  /**
   * Désenregistre tous les raccourcis globaux.
   */
  unregisterAll(): void {
    globalShortcut.unregisterAll()
    this.registeredShortcuts = []
    console.log('[Shortcuts] Tous les raccourcis désenregistrés')
  }

  /**
   * Met à jour les raccourcis depuis les réglages utilisateur.
   * Désenregistre les anciens, applique les nouveaux.
   */
  updateFromSettings(newShortcuts: Partial<ShortcutMap>): void {
    this.unregisterAll()
    this.shortcuts = { ...this.defaultShortcuts, ...newShortcuts }
    this.registerAll()
  }

  /**
   * Retourne la liste des raccourcis actuels.
   */
  getShortcuts(): ShortcutMap {
    return { ...this.shortcuts }
  }

  /**
   * Vérifie si un raccourci est disponible (non utilisé par une autre app).
   */
  isAvailable(accelerator: string): boolean {
    const available = globalShortcut.isRegistered(accelerator) === false
    return available
  }

  // ─── Privé ─────────────────────────────────────────────────────────────

  private register(accelerator: string, action: string): void {
    const success = globalShortcut.register(accelerator, () => {
      this.emitAction(action)
    })

    if (success) {
      this.registeredShortcuts.push(accelerator)
    } else {
      console.warn(
        `[Shortcuts] Impossible d'enregistrer le raccourci "${accelerator}" pour "${action}"`
      )
    }
  }

  /**
   * Emet l'action vers toutes les fenêtres du renderer.
   */
  private emitAction(action: string): void {
    const windows = BrowserWindow.getAllWindows()
    for (const win of windows) {
      if (!win.isDestroyed()) {
        win.webContents.send('shortcut:triggered', { action })
      }
    }
    console.log(`[Shortcuts] Action déclenchée : ${action}`)
  }
}
