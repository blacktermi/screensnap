import { BrowserWindow } from 'electron'
import type { WebcamShape } from '../types'

/**
 * Module d'overlay webcam.
 * Affiche un flux webcam en superposition pendant l'enregistrement.
 */
export class WebcamOverlay {
  private overlayWindow: BrowserWindow | null = null
  private currentShape: WebcamShape = 'circle'

  /**
   * Démarre l'overlay webcam avec la forme spécifiée.
   */
  async start(shape: WebcamShape = 'circle'): Promise<boolean> {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      console.warn('[Webcam] L\'overlay webcam est déjà actif')
      return false
    }

    this.currentShape = shape

    const size = 160
    this.overlayWindow = new BrowserWindow({
      width: size,
      height: size,
      x: 50,
      y: 50,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: true,
      hasShadow: true,
      roundedCorners: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    this.overlayWindow.setVisibleOnAllWorkspaces(true)
    this.overlayWindow.setAspectRatio(1)

    console.log('[Webcam] Overlay webcam démarré', { shape })

    // TODO: Charger la page HTML de l'overlay webcam
    // La page HTML utilisera navigator.mediaDevices.getUserMedia()
    // pour afficher le flux webcam avec la forme CSS appropriée
    // (border-radius: 50% pour circle, etc.)

    return true
  }

  /**
   * Arrête et ferme l'overlay webcam.
   */
  async stop(): Promise<void> {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      this.overlayWindow.close()
    }
    this.overlayWindow = null
    console.log('[Webcam] Overlay webcam arrêté')
  }

  /**
   * Déplace l'overlay webcam à la position spécifiée.
   */
  setPosition(x: number, y: number): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return
    this.overlayWindow.setPosition(x, y)
  }

  /**
   * Redimensionne l'overlay webcam.
   */
  setSize(size: number): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return
    this.overlayWindow.setSize(size, size)
  }

  /**
   * Change la forme de l'overlay.
   */
  setShape(shape: WebcamShape): void {
    this.currentShape = shape
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      this.overlayWindow.webContents.send('webcam:set-shape', { shape })
    }
  }

  /**
   * Retourne la forme actuelle de l'overlay.
   */
  getShape(): WebcamShape {
    return this.currentShape
  }

  /**
   * Indique si l'overlay webcam est actif.
   */
  isActive(): boolean {
    return this.overlayWindow !== null && !this.overlayWindow.isDestroyed()
  }
}
