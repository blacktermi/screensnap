import type { WindowInfo, CaptureOptions } from '../types'

/**
 * Module de capture de fenêtre.
 * Liste les fenêtres disponibles et capture la fenêtre sélectionnée.
 */
export class WindowCapture {
  /**
   * Liste toutes les fenêtres visibles sur l'écran.
   * TODO: Utiliser l'addon natif Swift (CGWindowListCopyWindowInfo) pour
   * une liste complète et précise des fenêtres.
   */
  async getWindows(): Promise<WindowInfo[]> {
    console.log('[WindowCapture] Récupération de la liste des fenêtres')

    // TODO: Implémenter via addon natif Swift
    // L'API macOS CGWindowListCopyWindowInfo fournit :
    // - kCGWindowNumber (id)
    // - kCGWindowName (name)
    // - kCGWindowOwnerName (ownerName)
    // - kCGWindowBounds (bounds)
    // - kCGWindowIsOnscreen (isOnScreen)

    return []
  }

  /**
   * Capture une fenêtre spécifique par son identifiant.
   * TODO: Utiliser CGWindowListCreateImage pour la capture.
   */
  async captureWindow(windowId: number, _options?: CaptureOptions): Promise<Buffer | null> {
    console.log('[WindowCapture] Capture de la fenêtre', { windowId })

    // TODO: Implémenter via addon natif Swift
    // 1. CGWindowListCreateImage avec le windowId
    // 2. Conversion en PNG/JPG buffer
    // 3. Optionnel : ajouter ombre portée, coins arrondis

    return null
  }

  /**
   * Capture la fenêtre sous le curseur.
   * Détecte automatiquement quelle fenêtre se trouve sous la position donnée.
   */
  async captureWindowUnderCursor(
    cursorX: number,
    cursorY: number,
    _options?: CaptureOptions
  ): Promise<Buffer | null> {
    console.log('[WindowCapture] Capture de la fenêtre sous le curseur', { cursorX, cursorY })

    const windows = await this.getWindows()
    const targetWindow = windows.find(
      (w) =>
        w.isOnScreen &&
        cursorX >= w.bounds.x &&
        cursorX <= w.bounds.x + w.bounds.width &&
        cursorY >= w.bounds.y &&
        cursorY <= w.bounds.y + w.bounds.height
    )

    if (!targetWindow) {
      console.log('[WindowCapture] Aucune fenêtre trouvée sous le curseur')
      return null
    }

    return this.captureWindow(targetWindow.id)
  }
}
