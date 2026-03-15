import type { RecordingState, RecordingOptions, RecordingResult } from '../types'

/**
 * Moteur d'enregistrement vidéo/GIF de ScreenSnap.
 * Machine à états : idle -> recording -> paused -> recording -> stopped.
 */
export class ScreenRecorder {
  private state: RecordingState = 'idle'
  private currentOptions: RecordingOptions | null = null
  private startTime: number | null = null
  private pausedDuration = 0
  private pauseStartTime: number | null = null
  private outputPath: string | null = null

  /**
   * Démarre un enregistrement avec les options spécifiées.
   */
  async start(options: RecordingOptions): Promise<boolean> {
    if (this.state !== 'idle') {
      console.warn(`[Recorder] Impossible de démarrer : état actuel "${this.state}"`)
      return false
    }

    this.currentOptions = options
    this.state = 'recording'
    this.startTime = Date.now()
    this.pausedDuration = 0
    this.pauseStartTime = null

    console.log('[Recorder] Enregistrement démarré', {
      mode: options.mode,
      fps: options.fps,
      quality: options.quality,
      area: options.area,
    })

    // TODO: Implémenter l'enregistrement réel
    // Pour le mode vidéo :
    //   1. Utiliser desktopCapturer pour obtenir le flux MediaStream
    //   2. Encoder via ffmpeg-static en MP4/WebM
    //   3. Si audio système : utiliser ScreenCaptureKit (macOS 13+)
    //   4. Si micro : ajouter le flux audio
    // Pour le mode GIF :
    //   1. Capturer les frames à l'intervalle spécifié (fps)
    //   2. Assembler les frames en GIF via ffmpeg ou gifsicle

    return true
  }

  /**
   * Met en pause l'enregistrement en cours.
   */
  async pause(): Promise<boolean> {
    if (this.state !== 'recording') {
      console.warn(`[Recorder] Impossible de mettre en pause : état actuel "${this.state}"`)
      return false
    }

    this.state = 'paused'
    this.pauseStartTime = Date.now()

    console.log('[Recorder] Enregistrement en pause')

    // TODO: Suspendre l'encodage ffmpeg

    return true
  }

  /**
   * Reprend l'enregistrement après une pause.
   */
  async resume(): Promise<boolean> {
    if (this.state !== 'paused') {
      console.warn(`[Recorder] Impossible de reprendre : état actuel "${this.state}"`)
      return false
    }

    if (this.pauseStartTime) {
      this.pausedDuration += Date.now() - this.pauseStartTime
      this.pauseStartTime = null
    }

    this.state = 'recording'

    console.log('[Recorder] Enregistrement repris')

    // TODO: Reprendre l'encodage ffmpeg

    return true
  }

  /**
   * Arrête l'enregistrement et retourne le résultat.
   */
  async stop(): Promise<RecordingResult | null> {
    if (this.state !== 'recording' && this.state !== 'paused') {
      console.warn(`[Recorder] Impossible d'arrêter : état actuel "${this.state}"`)
      return null
    }

    const duration = this.getElapsedTime()
    this.state = 'stopped'

    console.log('[Recorder] Enregistrement arrêté', { duration })

    // TODO: Finaliser l'encodage ffmpeg
    // 1. Fermer le flux d'entrée
    // 2. Attendre la fin de l'encodage
    // 3. Si GIF : optimiser avec gifsicle
    // 4. Retourner les métadonnées du fichier

    const result: RecordingResult = {
      path: this.outputPath ?? '',
      duration,
      fileSize: 0,
      dimensions: {
        width: this.currentOptions?.area?.width ?? 0,
        height: this.currentOptions?.area?.height ?? 0,
      },
    }

    // Réinitialiser l'état
    this.reset()

    return result
  }

  /**
   * Retourne l'état actuel de l'enregistreur.
   */
  getState(): RecordingState {
    return this.state
  }

  /**
   * Retourne le temps écoulé en millisecondes (hors pauses).
   */
  getElapsedTime(): number {
    if (!this.startTime) return 0

    const now = Date.now()
    let elapsed = now - this.startTime - this.pausedDuration

    if (this.pauseStartTime) {
      elapsed -= now - this.pauseStartTime
    }

    return Math.max(0, elapsed)
  }

  /**
   * Retourne les options de l'enregistrement en cours.
   */
  getCurrentOptions(): RecordingOptions | null {
    return this.currentOptions
  }

  // ─── Privé ─────────────────────────────────────────────────────────────

  private reset(): void {
    this.state = 'idle'
    this.currentOptions = null
    this.startTime = null
    this.pausedDuration = 0
    this.pauseStartTime = null
    this.outputPath = null
  }
}
