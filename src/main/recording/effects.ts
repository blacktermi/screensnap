import { BrowserWindow } from 'electron'
import type { ClickHighlightOptions, KeystrokeOptions } from '../types'

/**
 * Module d'effets visuels pour l'enregistrement.
 * Affiche les clics de souris et les frappes clavier à l'écran.
 */
export class CaptureEffects {
  private effectWindows: BrowserWindow[] = []

  private readonly defaultClickOptions: ClickHighlightOptions = {
    color: '#FF6B35',
    radius: 30,
    duration: 400,
  }

  private readonly defaultKeystrokeOptions: KeystrokeOptions = {
    fontSize: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    textColor: '#FFFFFF',
    position: 'bottom-center',
    duration: 1500,
  }

  /**
   * Affiche un effet visuel de clic à la position donnée.
   */
  async showClickHighlight(
    x: number,
    y: number,
    options?: Partial<ClickHighlightOptions>
  ): Promise<void> {
    const opts = { ...this.defaultClickOptions, ...options }

    console.log('[Effects] Clic affiché', { x, y, ...opts })

    const diameter = opts.radius * 2
    const effectWindow = new BrowserWindow({
      x: x - opts.radius,
      y: y - opts.radius,
      width: diameter,
      height: diameter,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      focusable: false,
      hasShadow: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    effectWindow.setVisibleOnAllWorkspaces(true)
    effectWindow.setIgnoreMouseEvents(true)

    // TODO: Charger un HTML inline avec l'animation CSS du cercle
    // Le cercle s'agrandit et disparaît progressivement (fade out)
    const html = `
      <html>
        <body style="margin:0;overflow:hidden;background:transparent;">
          <div style="
            width:${diameter}px;height:${diameter}px;
            border-radius:50%;
            background:${opts.color};
            opacity:0.5;
            animation:pulse ${opts.duration}ms ease-out forwards;
          "></div>
          <style>
            @keyframes pulse {
              0% { transform:scale(0.3); opacity:0.7; }
              100% { transform:scale(1); opacity:0; }
            }
          </style>
        </body>
      </html>
    `
    await effectWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    this.effectWindows.push(effectWindow)

    // Fermer automatiquement après la durée de l'animation
    setTimeout(() => {
      if (!effectWindow.isDestroyed()) {
        effectWindow.close()
      }
      this.effectWindows = this.effectWindows.filter((w) => w !== effectWindow)
    }, opts.duration)
  }

  /**
   * Affiche une frappe clavier à l'écran.
   */
  async showKeystroke(key: string, options?: Partial<KeystrokeOptions>): Promise<void> {
    const opts = { ...this.defaultKeystrokeOptions, ...options }

    console.log('[Effects] Touche affichée', { key, ...opts })

    // TODO: Implémenter l'affichage de la touche
    // 1. Créer une fenêtre flottante à la position spécifiée (opts.position)
    // 2. Afficher la touche avec un style de badge (opts.backgroundColor, opts.textColor)
    // 3. Animation d'apparition/disparition (opts.duration)
    // 4. Empiler les touches si plusieurs sont pressées rapidement
    void opts
  }

  /**
   * Ferme tous les effets visuels en cours.
   */
  cleanup(): void {
    for (const win of this.effectWindows) {
      if (!win.isDestroyed()) {
        win.close()
      }
    }
    this.effectWindows = []
    console.log('[Effects] Tous les effets nettoyés')
  }
}
