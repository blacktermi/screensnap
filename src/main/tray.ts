import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron'
import path from 'node:path'

/**
 * Gestion du tray (barre de menu) de ScreenSnap.
 * Affiche un menu contextuel avec toutes les actions de capture et d'enregistrement.
 */
export class TrayManager {
  private tray: Tray | null = null
  private timerDelay = 0

  /**
   * Crée l'icone dans la barre de menu et attache le menu contextuel.
   */
  create(): void {
    const iconPath = path.join(__dirname, '..', '..', 'assets', 'tray-icon.png')
    const icon = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 })
    icon.setTemplateImage(true)

    this.tray = new Tray(icon)
    this.tray.setToolTip('ScreenSnap')
    this.tray.setContextMenu(this.buildMenu())
  }

  /**
   * Reconstruit et réapplique le menu contextuel.
   */
  refresh(): void {
    if (!this.tray) return
    this.tray.setContextMenu(this.buildMenu())
  }

  /**
   * Détruit le tray proprement.
   */
  destroy(): void {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }

  // ─── Construction du menu ───────────────────────────────────────────────

  private buildMenu(): Menu {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'Tout-en-Un',
        accelerator: 'CmdOrCtrl+Shift+5',
        click: () => this.emit('capture:all-in-one'),
      },
      {
        label: 'Capturer une Zone',
        accelerator: 'CmdOrCtrl+Shift+4',
        click: () => this.emit('capture:area'),
      },
      {
        label: 'Capturer la Zone Précédente',
        accelerator: 'CmdOrCtrl+Shift+L',
        click: () => this.emit('capture:previous-area'),
      },
      {
        label: "Capturer l'Écran Entier",
        accelerator: 'CmdOrCtrl+Shift+3',
        click: () => this.emit('capture:fullscreen'),
      },
      {
        label: 'Capturer une Fenêtre',
        accelerator: 'CmdOrCtrl+Shift+W',
        click: () => this.emit('capture:window'),
      },
      {
        label: 'Capture Défilante',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => this.emit('capture:scrolling'),
      },
      { type: 'separator' },
      {
        label: 'Retardateur',
        submenu: [
          {
            label: 'Aucun',
            type: 'radio',
            checked: this.timerDelay === 0,
            click: () => this.setTimerDelay(0),
          },
          {
            label: '3 secondes',
            type: 'radio',
            checked: this.timerDelay === 3,
            click: () => this.setTimerDelay(3),
          },
          {
            label: '5 secondes',
            type: 'radio',
            checked: this.timerDelay === 5,
            click: () => this.setTimerDelay(5),
          },
          {
            label: '10 secondes',
            type: 'radio',
            checked: this.timerDelay === 10,
            click: () => this.setTimerDelay(10),
          },
        ],
      },
      {
        label: 'Reconnaître le Texte (OCR)',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: () => this.emit('ocr:recognize'),
      },
      { type: 'separator' },
      {
        label: "Enregistrer l'Écran",
        accelerator: 'CmdOrCtrl+Shift+R',
        click: () => this.emit('recording:start'),
      },
      { type: 'separator' },
      {
        label: 'Masquer les Icônes du Bureau',
        type: 'checkbox',
        checked: false,
        click: (item) => this.emit('desktop:toggle-icons', { hidden: item.checked }),
      },
      { type: 'separator' },
      {
        label: 'Ouvrir\u2026',
        click: () => this.emit('file:open'),
      },
      {
        label: "Épingler à l'Écran\u2026",
        click: () => this.emit('pin:create'),
      },
      { type: 'separator' },
      {
        label: 'Historique des Captures\u2026',
        accelerator: 'CmdOrCtrl+Shift+H',
        click: () => this.emit('history:show'),
      },
      {
        label: 'Réglages\u2026',
        accelerator: 'CmdOrCtrl+,',
        click: () => this.emit('settings:show'),
      },
      { type: 'separator' },
      {
        label: 'Quitter ScreenSnap',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit(),
      },
    ]

    return Menu.buildFromTemplate(template)
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  private setTimerDelay(seconds: number): void {
    this.timerDelay = seconds
    this.emit('settings:timer-delay', { delay: seconds })
    this.refresh()
  }

  /**
   * Emet un événement vers toutes les fenêtres du renderer.
   */
  private emit(channel: string, data?: Record<string, unknown>): void {
    const windows = BrowserWindow.getAllWindows()
    for (const win of windows) {
      if (!win.isDestroyed()) {
        win.webContents.send(channel, data ?? {})
      }
    }
    console.log(`[Tray] ${channel}`, data ?? '')
  }
}
