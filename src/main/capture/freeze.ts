import { BrowserWindow, screen } from 'electron'

/**
 * Module de gel d'écran (screen freeze).
 * Capture l'écran actuel et l'affiche dans une fenêtre plein écran
 * au-dessus de tout, donnant l'impression que l'écran est figé.
 * Utile pour capturer des menus contextuels, tooltips, etc.
 */
export class ScreenFreeze {
  private frozenWindows: BrowserWindow[] = []

  /**
   * Gèle l'écran en créant un overlay plein écran avec la capture actuelle.
   * Si displayId est fourni, gèle uniquement cet écran.
   * Sinon, gèle tous les écrans.
   */
  async freeze(displayId?: number): Promise<boolean> {
    if (this.frozenWindows.length > 0) {
      console.warn('[ScreenFreeze] L\'écran est déjà gelé')
      return false
    }

    const displays = displayId
      ? screen.getAllDisplays().filter((d) => d.id === displayId)
      : screen.getAllDisplays()

    console.log(`[ScreenFreeze] Gel de ${displays.length} écran(s)`)

    for (const display of displays) {
      const frozenWindow = new BrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
        frame: false,
        transparent: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        movable: false,
        focusable: false,
        fullscreenable: false,
        hasShadow: false,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
        },
      })

      frozenWindow.setVisibleOnAllWorkspaces(true)
      frozenWindow.setIgnoreMouseEvents(false)

      // TODO: Capturer l'écran et afficher l'image dans la fenêtre
      // 1. Capturer l'écran via desktopCapturer ou addon natif
      // 2. Convertir en data URL
      // 3. Charger dans la fenêtre : frozenWindow.loadURL(`data:text/html,...`)

      this.frozenWindows.push(frozenWindow)
    }

    return true
  }

  /**
   * Dégèle l'écran en fermant toutes les fenêtres de gel.
   */
  unfreeze(): void {
    for (const win of this.frozenWindows) {
      if (!win.isDestroyed()) {
        win.close()
      }
    }
    this.frozenWindows = []
    console.log('[ScreenFreeze] Écran dégelé')
  }

  /**
   * Indique si l'écran est actuellement gelé.
   */
  isFrozen(): boolean {
    return this.frozenWindows.length > 0
  }
}
