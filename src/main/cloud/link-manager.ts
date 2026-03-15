import type { ShareLink } from '../types'

/**
 * Gestionnaire de liens de partage.
 * Crée, gère et invalide les liens de partage pour les captures.
 * TODO: Connecter au service cloud pour la génération de liens réels.
 */
export class LinkManager {
  private links: Map<string, ShareLink> = new Map()

  /**
   * Crée un lien de partage pour une capture.
   */
  async createLink(
    captureId: string,
    options?: { expiresInHours?: number; password?: string }
  ): Promise<ShareLink | null> {
    console.log('[LinkManager] Création du lien', { captureId, options })

    // TODO: Implémenter via le service cloud
    // 1. Vérifier que la capture existe
    // 2. Uploader la capture si ce n'est pas déjà fait
    // 3. Générer un identifiant court
    // 4. Créer le lien avec les options (expiration, mot de passe)
    // 5. Sauvegarder en base de données

    return null
  }

  /**
   * Récupère un lien de partage par son identifiant.
   */
  getLink(linkId: string): ShareLink | null {
    return this.links.get(linkId) ?? null
  }

  /**
   * Récupère tous les liens de partage pour une capture.
   */
  getLinksByCaptureId(captureId: string): ShareLink[] {
    const result: ShareLink[] = []
    for (const link of this.links.values()) {
      if (link.captureId === captureId) {
        result.push(link)
      }
    }
    return result
  }

  /**
   * Invalide (supprime) un lien de partage.
   */
  async revokeLink(linkId: string): Promise<boolean> {
    console.log('[LinkManager] Révocation du lien', { linkId })

    const link = this.links.get(linkId)
    if (!link) {
      console.warn('[LinkManager] Lien introuvable', { linkId })
      return false
    }

    // TODO: Supprimer le fichier du service cloud
    this.links.delete(linkId)

    return true
  }

  /**
   * Supprime tous les liens expirés.
   */
  cleanupExpired(): number {
    const now = new Date().toISOString()
    let cleaned = 0

    for (const [id, link] of this.links.entries()) {
      if (link.expiresAt && link.expiresAt < now) {
        this.links.delete(id)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`[LinkManager] ${cleaned} lien(s) expiré(s) supprimé(s)`)
    }

    return cleaned
  }

  /**
   * Retourne le nombre total de liens actifs.
   */
  getActiveCount(): number {
    return this.links.size
  }
}
