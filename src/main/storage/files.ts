import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import type { CaptureFormat } from '../types'

/**
 * Gestionnaire du système de fichiers pour les captures.
 * Gère la sauvegarde, l'organisation et le nettoyage des fichiers.
 */
export class FileManager {
  private readonly baseDir: string
  private readonly captureDir: string
  private readonly thumbnailDir: string

  constructor() {
    // ~/Pictures/ScreenSnap/
    this.baseDir = path.join(app.getPath('pictures'), 'ScreenSnap')
    this.captureDir = path.join(this.baseDir, 'captures')
    this.thumbnailDir = path.join(this.baseDir, 'thumbnails')
  }

  /**
   * Crée les répertoires nécessaires s'ils n'existent pas.
   */
  ensureDirectories(): void {
    const dirs = [this.baseDir, this.captureDir, this.thumbnailDir]
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log('[Files] Répertoire créé', { dir })
      }
    }
  }

  /**
   * Sauvegarde une capture sur le disque.
   * Retourne le chemin complet du fichier sauvegardé.
   */
  saveCapture(buffer: Buffer, format: CaptureFormat, filename?: string): string {
    this.ensureDirectories()

    const name = filename ?? this.generateFilename(format)
    const filePath = path.join(this.captureDir, name)

    fs.writeFileSync(filePath, buffer)
    console.log('[Files] Capture sauvegardée', { path: filePath, size: buffer.length })

    return filePath
  }

  /**
   * Retourne le chemin par défaut pour une nouvelle capture.
   */
  getCapturePath(format: CaptureFormat, filename?: string): string {
    const name = filename ?? this.generateFilename(format)
    return path.join(this.captureDir, name)
  }

  /**
   * Retourne le chemin pour une miniature.
   */
  getThumbnailPath(captureId: string): string {
    return path.join(this.thumbnailDir, `${captureId}_thumb.jpg`)
  }

  /**
   * Retourne le répertoire de base des captures.
   */
  getBaseDir(): string {
    return this.baseDir
  }

  /**
   * Retourne le répertoire des captures.
   */
  getCaptureDir(): string {
    return this.captureDir
  }

  /**
   * Supprime les fichiers plus anciens qu'un nombre de jours.
   */
  cleanupOldFiles(daysThreshold: number): number {
    const cutoff = Date.now() - daysThreshold * 24 * 60 * 60 * 1000
    let deletedCount = 0

    const dirs = [this.captureDir, this.thumbnailDir]
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue

      const files = fs.readdirSync(dir)
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stats = fs.statSync(filePath)

        if (stats.mtimeMs < cutoff) {
          fs.unlinkSync(filePath)
          deletedCount++
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`[Files] ${deletedCount} fichier(s) ancien(s) supprimé(s)`)
    }

    return deletedCount
  }

  /**
   * Calcule l'espace disque utilisé par les captures (en octets).
   */
  getDiskUsage(): number {
    let totalSize = 0

    const dirs = [this.captureDir, this.thumbnailDir]
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue

      const files = fs.readdirSync(dir)
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stats = fs.statSync(filePath)
        totalSize += stats.size
      }
    }

    return totalSize
  }

  // ─── Privé ─────────────────────────────────────────────────────────────

  /**
   * Génère un nom de fichier unique basé sur la date.
   * Format : ScreenSnap_2026-03-15_14-30-45.png
   */
  private generateFilename(format: CaptureFormat): string {
    const now = new Date()
    const date = now.toISOString().slice(0, 10) // 2026-03-15
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-') // 14-30-45

    return `ScreenSnap_${date}_${time}.${format}`
  }
}
