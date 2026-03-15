import BetterSqlite3 from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import type { CaptureRow, SettingRow } from '../types'

/**
 * Couche de persistance SQLite pour ScreenSnap.
 * Stocke l'historique des captures et les réglages utilisateur.
 */
export class Database {
  private db: BetterSqlite3.Database | null = null

  /**
   * Initialise la base de données et crée les tables si nécessaire.
   */
  init(): void {
    const dbPath = path.join(app.getPath('userData'), 'screensnap.db')

    this.db = new BetterSqlite3(dbPath)

    // Activer le WAL mode pour de meilleures performances en lecture/écriture
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('foreign_keys = ON')

    this.createTables()

    console.log('[Database] Base de données initialisée', { path: dbPath })
  }

  /**
   * Ferme proprement la connexion à la base de données.
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      console.log('[Database] Connexion fermée')
    }
  }

  // ─── Captures ─────────────────────────────────────────────────────────

  /**
   * Insère une nouvelle capture dans la base de données.
   */
  insertCapture(capture: CaptureRow): void {
    this.ensureOpen()
    const stmt = this.db!.prepare(`
      INSERT INTO captures (id, type, path, thumbnail_path, width, height, file_size, created_at, tags)
      VALUES (@id, @type, @path, @thumbnail_path, @width, @height, @file_size, @created_at, @tags)
    `)
    stmt.run(capture)
  }

  /**
   * Récupère une capture par son identifiant.
   */
  getCaptureById(id: string): CaptureRow | undefined {
    this.ensureOpen()
    const stmt = this.db!.prepare('SELECT * FROM captures WHERE id = ?')
    return stmt.get(id) as CaptureRow | undefined
  }

  /**
   * Récupère toutes les captures, triées par date de création (les plus récentes d'abord).
   */
  getAllCaptures(limit = 100): CaptureRow[] {
    this.ensureOpen()
    const stmt = this.db!.prepare(
      'SELECT * FROM captures ORDER BY created_at DESC LIMIT ?'
    )
    return stmt.all(limit) as CaptureRow[]
  }

  /**
   * Récupère les captures d'un type spécifique.
   */
  getCapturesByType(type: string, limit = 100): CaptureRow[] {
    this.ensureOpen()
    const stmt = this.db!.prepare(
      'SELECT * FROM captures WHERE type = ? ORDER BY created_at DESC LIMIT ?'
    )
    return stmt.all(type, limit) as CaptureRow[]
  }

  /**
   * Recherche les captures par nom de fichier ou tags.
   */
  searchCaptures(query: string, limit = 100): CaptureRow[] {
    this.ensureOpen()
    const pattern = `%${query}%`
    const stmt = this.db!.prepare(
      'SELECT * FROM captures WHERE path LIKE ? OR tags LIKE ? ORDER BY created_at DESC LIMIT ?'
    )
    return stmt.all(pattern, pattern, limit) as CaptureRow[]
  }

  /**
   * Supprime une capture par son identifiant.
   */
  deleteCapture(id: string): void {
    this.ensureOpen()
    const stmt = this.db!.prepare('DELETE FROM captures WHERE id = ?')
    stmt.run(id)
  }

  /**
   * Supprime les captures plus anciennes qu'un nombre de jours.
   */
  deleteOldCaptures(daysThreshold: number): number {
    this.ensureOpen()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysThreshold)

    const stmt = this.db!.prepare('DELETE FROM captures WHERE created_at < ?')
    const result = stmt.run(cutoff.toISOString())
    return result.changes
  }

  /**
   * Retourne le nombre total de captures.
   */
  getCaptureCount(): number {
    this.ensureOpen()
    const stmt = this.db!.prepare('SELECT COUNT(*) as count FROM captures')
    const row = stmt.get() as { count: number }
    return row.count
  }

  // ─── Réglages ─────────────────────────────────────────────────────────

  /**
   * Récupère la valeur d'un réglage.
   */
  getSetting(key: string): string | null {
    this.ensureOpen()
    const stmt = this.db!.prepare('SELECT value FROM settings WHERE key = ?')
    const row = stmt.get(key) as SettingRow | undefined
    return row?.value ?? null
  }

  /**
   * Définit la valeur d'un réglage (INSERT OR REPLACE).
   */
  setSetting(key: string, value: string): void {
    this.ensureOpen()
    const stmt = this.db!.prepare(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
    )
    stmt.run(key, value)
  }

  /**
   * Récupère tous les réglages sous forme de map.
   */
  getAllSettings(): Record<string, string> {
    this.ensureOpen()
    const stmt = this.db!.prepare('SELECT key, value FROM settings')
    const rows = stmt.all() as SettingRow[]
    const settings: Record<string, string> = {}
    for (const row of rows) {
      settings[row.key] = row.value
    }
    return settings
  }

  // ─── Privé ────────────────────────────────────────────────────────────

  private createTables(): void {
    this.db!.exec(`
      CREATE TABLE IF NOT EXISTS captures (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        path TEXT NOT NULL,
        thumbnail_path TEXT,
        width INTEGER NOT NULL DEFAULT 0,
        height INTEGER NOT NULL DEFAULT 0,
        file_size INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        tags TEXT DEFAULT ''
      );

      CREATE INDEX IF NOT EXISTS idx_captures_created_at ON captures(created_at);
      CREATE INDEX IF NOT EXISTS idx_captures_type ON captures(type);

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `)
  }

  private ensureOpen(): void {
    if (!this.db) {
      throw new Error('[Database] La base de données n\'est pas initialisée. Appelez init() d\'abord.')
    }
  }
}
