import { BrowserWindow, screen } from 'electron'
import path from 'node:path'
import type { CaptureRect, CaptureOptions } from '../types'

/**
 * Module de capture de zone.
 * Affiche un overlay transparent plein écran pour permettre la sélection
 * d'une zone rectangulaire, puis capture cette zone.
 */
export class AreaCapture {
  private overlayWindow: BrowserWindow | null = null
  private lastCaptureRect: CaptureRect | null = null

  /**
   * Lance la capture de zone en affichant l'overlay de sélection.
   * Retourne le buffer de l'image capturée, ou null si annulé.
   */
  async startCapture(options?: CaptureOptions): Promise<Buffer | null> {
    const rect = await this.showSelectionOverlay()
    if (!rect) {
      console.log('[AreaCapture] Sélection annulée')
      return null
    }

    this.lastCaptureRect = rect
    return this.captureArea(rect, options)
  }

  /**
   * Recapture la dernière zone sélectionnée.
   */
  async capturePreviousArea(options?: CaptureOptions): Promise<Buffer | null> {
    if (!this.lastCaptureRect) {
      console.log('[AreaCapture] Aucune zone précédente enregistrée')
      return null
    }
    return this.captureArea(this.lastCaptureRect, options)
  }

  /**
   * Retourne la dernière zone sélectionnée.
   */
  getLastCaptureRect(): CaptureRect | null {
    return this.lastCaptureRect
  }

  /**
   * Capture une zone spécifique de l'écran.
   * TODO: Utiliser l'addon natif Swift pour une capture de meilleure qualité.
   */
  async captureArea(rect: CaptureRect, _options?: CaptureOptions): Promise<Buffer | null> {
    console.log('[AreaCapture] Capture de la zone', rect)

    // TODO: Implémenter via desktopCapturer ou addon natif Swift
    // Pour l'instant, stub qui retourne null
    // L'implémentation réelle utilisera :
    // 1. desktopCapturer.getSources() pour obtenir l'écran
    // 2. Crop de l'image selon le rectangle
    // 3. Retour du buffer PNG/JPG

    return null
  }

  // ─── Overlay de sélection ───────────────────────────────────────────────

  /**
   * Affiche une fenêtre transparente plein écran pour la sélection de zone.
   * Retourne le rectangle sélectionné par l'utilisateur, ou null si annulé.
   */
  private async showSelectionOverlay(): Promise<CaptureRect | null> {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { bounds } = primaryDisplay

    this.overlayWindow = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      fullscreenable: false,
      hasShadow: false,
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload', 'index.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    this.overlayWindow.setVisibleOnAllWorkspaces(true)

    // TODO: Charger la page HTML de l'overlay de sélection
    // await this.overlayWindow.loadFile(...)

    return new Promise<CaptureRect | null>((resolve) => {
      if (!this.overlayWindow) {
        resolve(null)
        return
      }

      // TODO: Écouter les événements IPC de l'overlay pour récupérer le rectangle
      // Pour l'instant, on ferme directement avec null
      this.overlayWindow.on('closed', () => {
        this.overlayWindow = null
        resolve(null)
      })
    })
  }

  /**
   * Ferme l'overlay de sélection.
   */
  closeOverlay(): void {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      this.overlayWindow.close()
      this.overlayWindow = null
    }
  }
}
