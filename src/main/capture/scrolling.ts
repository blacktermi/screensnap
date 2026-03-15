import type { CaptureRect, CaptureOptions } from '../types'

/**
 * Module de capture défilante (scrolling capture).
 * Capture automatiquement le contenu d'une fenêtre en défilant
 * et assemble les captures en une seule image longue.
 */
export class ScrollingCapture {
  private isCapturing = false

  /**
   * Démarre une capture défilante sur la zone sélectionnée.
   * Le processus :
   * 1. L'utilisateur sélectionne une zone
   * 2. ScreenSnap défile automatiquement vers le bas
   * 3. Chaque frame est capturée
   * 4. Les frames sont assemblées en supprimant les chevauchements
   */
  async start(rect: CaptureRect, _options?: CaptureOptions): Promise<Buffer | null> {
    if (this.isCapturing) {
      console.warn('[ScrollingCapture] Une capture défilante est déjà en cours')
      return null
    }

    this.isCapturing = true
    console.log('[ScrollingCapture] Démarrage de la capture défilante', rect)

    try {
      // TODO: Implémenter la capture défilante
      // 1. Capturer la zone initiale
      // 2. Simuler un scroll vers le bas (via CGEvent)
      // 3. Attendre que le contenu se stabilise
      // 4. Capturer la nouvelle zone
      // 5. Détecter le chevauchement entre les frames (image matching)
      // 6. Répéter jusqu'à la fin du contenu ou arrêt manuel
      // 7. Assembler toutes les frames en une seule image

      return null
    } finally {
      this.isCapturing = false
    }
  }

  /**
   * Arrête la capture défilante en cours.
   */
  stop(): void {
    if (!this.isCapturing) {
      console.log('[ScrollingCapture] Aucune capture défilante en cours')
      return
    }

    this.isCapturing = false
    console.log('[ScrollingCapture] Capture défilante arrêtée')
  }

  /**
   * Indique si une capture défilante est en cours.
   */
  getIsCapturing(): boolean {
    return this.isCapturing
  }
}
