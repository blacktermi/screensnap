import type { AudioDevice } from '../types'

/**
 * Module de capture audio.
 * Gère la capture du micro et de l'audio système (via ScreenCaptureKit sur macOS).
 */
export class AudioCapture {
  private isMicCapturing = false
  private isSystemCapturing = false
  private currentMicDeviceId: string | null = null

  /**
   * Liste les microphones disponibles sur le système.
   * TODO: Utiliser l'API native macOS pour lister les devices CoreAudio.
   */
  async getMicrophones(): Promise<AudioDevice[]> {
    console.log('[Audio] Récupération de la liste des microphones')

    // TODO: Implémenter via addon natif Swift (AVCaptureDevice.DiscoverySession)
    // ou via le renderer avec navigator.mediaDevices.enumerateDevices()

    return []
  }

  /**
   * Démarre la capture du microphone.
   */
  async startMicCapture(deviceId: string): Promise<boolean> {
    if (this.isMicCapturing) {
      console.warn('[Audio] Le microphone est déjà en cours de capture')
      return false
    }

    this.isMicCapturing = true
    this.currentMicDeviceId = deviceId
    console.log('[Audio] Capture microphone démarrée', { deviceId })

    // TODO: Implémenter la capture micro
    // 1. Ouvrir le device audio via CoreAudio ou AVAudioEngine
    // 2. Encoder le flux audio en AAC ou PCM
    // 3. Fournir le flux au recorder pour le muxing

    return true
  }

  /**
   * Démarre la capture de l'audio système.
   * Nécessite macOS 13+ (ScreenCaptureKit) pour capturer l'audio système
   * sans extension kernel.
   */
  async startSystemCapture(): Promise<boolean> {
    if (this.isSystemCapturing) {
      console.warn('[Audio] L\'audio système est déjà en cours de capture')
      return false
    }

    this.isSystemCapturing = true
    console.log('[Audio] Capture audio système démarrée')

    // TODO: Implémenter via ScreenCaptureKit (macOS 13+)
    // 1. Créer un SCStreamConfiguration avec audio activé
    // 2. Configurer les canaux audio (stéréo, sample rate)
    // 3. Fournir le flux au recorder pour le muxing

    return true
  }

  /**
   * Arrête toutes les captures audio en cours.
   */
  async stop(): Promise<void> {
    if (this.isMicCapturing) {
      this.isMicCapturing = false
      this.currentMicDeviceId = null
      console.log('[Audio] Capture microphone arrêtée')
    }

    if (this.isSystemCapturing) {
      this.isSystemCapturing = false
      console.log('[Audio] Capture audio système arrêtée')
    }

    // TODO: Fermer les flux audio et libérer les ressources
  }

  /**
   * Indique si le micro est en cours de capture.
   */
  getIsMicCapturing(): boolean {
    return this.isMicCapturing
  }

  /**
   * Indique si l'audio système est en cours de capture.
   */
  getIsSystemCapturing(): boolean {
    return this.isSystemCapturing
  }

  /**
   * Retourne l'identifiant du micro actuellement utilisé.
   */
  getCurrentMicDeviceId(): string | null {
    return this.currentMicDeviceId
  }
}
