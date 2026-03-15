import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { TrayManager } from './tray'
import { ShortcutManager } from './shortcuts'
import { registerIpcHandlers } from './ipc-handlers'
import { Database } from './storage/database'

// ─── Configuration ──────────────────────────────────────────────────────────

app.setName('ScreenSnap')

// Menu bar app : pas d'icone dans le Dock
if (app.dock) {
  app.dock.hide()
}

// ─── Instance unique ────────────────────────────────────────────────────────

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
}

// ─── Etat global ────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null
let trayManager: TrayManager | null = null
let shortcutManager: ShortcutManager | null = null
let database: Database | null = null

// ─── Fenetre principale (cachée) ────────────────────────────────────────────

function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1,
    height: 1,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  const isDev = !app.isPackaged

  if (isDev) {
    void win.loadURL('http://localhost:5173')
  } else {
    void win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
  }

  return win
}

// ─── Initialisation ─────────────────────────────────────────────────────────

function initDatabase(): Database {
  const db = new Database()
  db.init()
  return db
}

function initTray(): TrayManager {
  const manager = new TrayManager()
  manager.create()
  return manager
}

function initShortcuts(): ShortcutManager {
  const manager = new ShortcutManager()
  manager.registerAll()
  return manager
}

// ─── Cycle de vie ───────────────────────────────────────────────────────────

app.on('ready', () => {
  database = initDatabase()
  mainWindow = createMainWindow()
  trayManager = initTray()
  shortcutManager = initShortcuts()
  registerIpcHandlers(database)

  console.log('[ScreenSnap] Application prête')
})

app.on('window-all-closed', () => {
  // Sur macOS, l'app reste active dans la barre de menu
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null || mainWindow.isDestroyed()) {
    mainWindow = createMainWindow()
  }
})

app.on('before-quit', () => {
  shortcutManager?.unregisterAll()
  database?.close()
  console.log('[ScreenSnap] Fermeture propre')
})

app.on('second-instance', () => {
  // Si une seconde instance est lancée, on focus la fenêtre existante
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

// ─── Exports (pour les tests) ──────────────────────────────────────────────

export { mainWindow, trayManager, shortcutManager, database }
