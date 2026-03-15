import type { OcrResult, OcrRegion } from '../types'

/**
 * Module de reconnaissance de texte (OCR).
 * Utilise l'API Vision de macOS (VNRecognizeTextRequest) via l'addon natif Swift.
 */
export class TextRecognition {
  /**
   * Reconnaît le texte dans une image à partir du chemin du fichier.
   */
  async recognizeFromImage(imagePath: string): Promise<OcrResult> {
    console.log('[OCR] Reconnaissance depuis le fichier', { imagePath })

    // TODO: Implémenter via addon natif Swift
    // 1. Charger l'image via NSImage ou CGImage
    // 2. Créer un VNRecognizeTextRequest
    // 3. Exécuter via VNImageRequestHandler
    // 4. Extraire le texte et les bounding boxes des résultats
    // 5. Retourner le résultat structuré

    return this.createEmptyResult()
  }

  /**
   * Reconnaît le texte dans une image à partir d'un buffer.
   */
  async recognizeFromBuffer(buffer: Buffer): Promise<OcrResult> {
    console.log('[OCR] Reconnaissance depuis un buffer', { size: buffer.length })

    // TODO: Implémenter via addon natif Swift
    // 1. Convertir le buffer en CGImage
    // 2. Utiliser le même pipeline que recognizeFromImage

    return this.createEmptyResult()
  }

  /**
   * Reconnaît le texte et le copie directement dans le presse-papiers.
   */
  async recognizeAndCopy(imagePath: string): Promise<string> {
    const result = await this.recognizeFromImage(imagePath)

    // TODO: Copier dans le presse-papiers via clipboard.writeText()

    return result.text
  }

  /**
   * Fusionne les régions OCR en un texte cohérent.
   * Trie les régions par position (haut en bas, gauche à droite)
   * et joint le texte avec des sauts de ligne appropriés.
   */
  mergeRegions(regions: OcrRegion[]): string {
    if (regions.length === 0) return ''

    const sorted = [...regions].sort((a, b) => {
      const yDiff = a.bounds.y - b.bounds.y
      if (Math.abs(yDiff) > 5) return yDiff
      return a.bounds.x - b.bounds.x
    })

    return sorted.map((r) => r.text).join('\n')
  }

  // ─── Privé ─────────────────────────────────────────────────────────────

  private createEmptyResult(): OcrResult {
    return {
      text: '',
      confidence: 0,
      regions: [],
    }
  }
}
