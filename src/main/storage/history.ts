import { v4 as uuidv4 } from 'uuid'
import type { Database } from './database'
import type { CaptureMetadata, CaptureRow, CaptureType } from '../types'

/**
 * Gestionnaire d'historique des captures.
 * Couche de haut niveau au-dessus de la base de données,
 * avec génération de miniatures et formatage des données.
 */
export class HistoryManager {
  constructor(private readonly database: Database) {}

  /**
   * Ajoute une capture à l'historique.
   */
  addCapture(metadata: Omit<CaptureMetadata, 'id' | 'createdAt'>): CaptureMetadata {
    const id = uuidv4()
    const createdAt = new Date().toISOString()

    const row: CaptureRow = {
      id,
      type: metadata.type,
      path: metadata.path,
      thumbnail_path: metadata.thumbnailPath,
      width: metadata.dimensions.width,
      height: metadata.dimensions.height,
      file_size: metadata.fileSize,
      created_at: createdAt,
      tags: metadata.tags.join(','),
    }

    this.database.insertCapture(row)

    // TODO: Générer une miniature de la capture
    // 1. Charger l'image depuis metadata.path
    // 2. Redimensionner à 256px de large (ratio conservé)
    // 3. Sauvegarder dans le dossier des miniatures
    // 4. Mettre à jour thumbnail_path en base

    console.log('[History] Capture ajoutée', { id, type: metadata.type })

    return {
      ...metadata,
      id,
      createdAt,
    }
  }

  /**
   * Récupère les captures récentes.
   */
  getRecent(limit = 50): CaptureMetadata[] {
    const rows = this.database.getAllCaptures(limit)
    return rows.map(this.rowToMetadata)
  }

  /**
   * Recherche dans l'historique par nom de fichier ou tags.
   */
  search(query: string, limit = 50): CaptureMetadata[] {
    const rows = this.database.searchCaptures(query, limit)
    return rows.map(this.rowToMetadata)
  }

  /**
   * Récupère les captures d'un type spécifique.
   */
  getByType(type: CaptureType, limit = 50): CaptureMetadata[] {
    const rows = this.database.getCapturesByType(type, limit)
    return rows.map(this.rowToMetadata)
  }

  /**
   * Supprime les captures plus anciennes qu'un seuil en jours.
   * Supprime également les fichiers associés du disque.
   */
  deleteOld(daysThreshold: number): number {
    // TODO: Supprimer les fichiers images et miniatures du disque
    // avant de supprimer les entrées de la base

    const deletedCount = this.database.deleteOldCaptures(daysThreshold)
    console.log(`[History] ${deletedCount} capture(s) ancienne(s) supprimée(s)`)
    return deletedCount
  }

  /**
   * Supprime une capture spécifique.
   */
  delete(id: string): void {
    // TODO: Supprimer les fichiers images et miniatures du disque
    this.database.deleteCapture(id)
    console.log('[History] Capture supprimée', { id })
  }

  /**
   * Retourne le nombre total de captures dans l'historique.
   */
  getCount(): number {
    return this.database.getCaptureCount()
  }

  // ─── Privé ─────────────────────────────────────────────────────────────

  private rowToMetadata(row: CaptureRow): CaptureMetadata {
    return {
      id: row.id,
      type: row.type,
      path: row.path,
      thumbnailPath: row.thumbnail_path,
      dimensions: { width: row.width, height: row.height },
      fileSize: row.file_size,
      createdAt: row.created_at,
      tags: row.tags ? row.tags.split(',').filter(Boolean) : [],
    }
  }
}
