import { screen } from 'electron'
import type { CaptureOptions, DisplayInfo } from '../types'

/**
 * Module de capture plein écran.
 * Capture l'intégralité d'un ou plusieurs écrans.
 */
export class FullscreenCapture {
  /**
   * Capture l'écran complet.
   * Si displayId est fourni, capture cet écran spécifique.
   * Sinon, capture l'écran principal.
   */
  async capture(displayId?: number, _options?: CaptureOptions): Promise<Buffer | null> {
    const targetDisplay = displayId
      ? screen.getAllDisplays().find((d) => d.id === displayId)
      : screen.getPrimaryDisplay()

    if (!targetDisplay) {
      console.warn(`[FullscreenCapture] Écran introuvable : ${displayId}`)
      return null
    }

    console.log('[FullscreenCapture] Capture de l\'écran', {
      id: targetDisplay.id,
      bounds: targetDisplay.bounds,
      scaleFactor: targetDisplay.scaleFactor,
    })

    // TODO: Implémenter via addon natif Swift
    // 1. CGDisplayCreateImage(displayId) pour capturer l'écran
    // 2. Conversion en buffer PNG
    // 3. Prise en compte du scaleFactor pour les écrans Retina

    return null
  }

  /**
   * Capture tous les écrans et les assemble en une seule image.
   */
  async captureAllDisplays(_options?: CaptureOptions): Promise<Buffer | null> {
    const displays = screen.getAllDisplays()
    console.log(`[FullscreenCapture] Capture de ${displays.length} écran(s)`)

    // TODO: Capturer chaque écran et assembler les images
    // 1. Capturer chaque écran individuellement
    // 2. Calculer les dimensions totales (selon la disposition)
    // 3. Assembler les images sur un canvas

    return null
  }

  /**
   * Retourne les informations sur tous les écrans disponibles.
   */
  getDisplays(): DisplayInfo[] {
    const displays = screen.getAllDisplays()
    const primary = screen.getPrimaryDisplay()

    return displays.map((display) => ({
      id: display.id,
      label: `Écran ${display.id}`,
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primary.id,
    }))
  }
}
