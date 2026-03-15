import type { UploadResult, CaptureFormat } from '../types'

/**
 * Module d'upload cloud.
 * Permet de partager rapidement des captures via un lien court.
 * TODO: Implémenter avec un service cloud (S3, Cloudflare R2, ou serveur dédié).
 */
export class CloudUploader {
  private apiEndpoint: string | null = null
  private apiKey: string | null = null

  /**
   * Configure les identifiants pour le service cloud.
   */
  configure(endpoint: string, apiKey: string): void {
    this.apiEndpoint = endpoint
    this.apiKey = apiKey
    console.log('[Cloud] Service configuré', { endpoint })
  }

  /**
   * Upload un fichier de capture vers le cloud.
   */
  async upload(
    filePath: string,
    _format: CaptureFormat = 'png'
  ): Promise<UploadResult | null> {
    if (!this.apiEndpoint || !this.apiKey) {
      console.warn('[Cloud] Service non configuré')
      return null
    }

    console.log('[Cloud] Upload en cours', { filePath })

    // TODO: Implémenter l'upload
    // 1. Lire le fichier depuis le disque
    // 2. Envoyer via HTTP POST multipart au service cloud
    // 3. Retourner l'URL de partage

    return null
  }

  /**
   * Upload un buffer directement vers le cloud.
   */
  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    _format: CaptureFormat = 'png'
  ): Promise<UploadResult | null> {
    if (!this.apiEndpoint || !this.apiKey) {
      console.warn('[Cloud] Service non configuré')
      return null
    }

    console.log('[Cloud] Upload buffer en cours', { filename, size: buffer.length })

    // TODO: Implémenter l'upload du buffer

    return null
  }

  /**
   * Supprime un fichier du cloud via son URL de suppression.
   */
  async delete(deleteUrl: string): Promise<boolean> {
    console.log('[Cloud] Suppression', { deleteUrl })

    // TODO: Envoyer une requête DELETE au service cloud

    return false
  }

  /**
   * Vérifie si le service cloud est configuré et accessible.
   */
  isConfigured(): boolean {
    return this.apiEndpoint !== null && this.apiKey !== null
  }
}
