# Documentation API IPC

Ce document reference tous les canaux IPC de ScreenSnap. Ces canaux constituent l'interface de communication entre le processus renderer (React) et le processus principal (Node.js/Electron).

Cote renderer, l'API est accessible via `window.electronAPI`.

## Convention de nommage

Format : `screensnap:<domaine>:<action>`

Tous les canaux utilisent `ipcRenderer.invoke()` (appel asynchrone avec reponse). Les evenements du main vers le renderer utilisent `webContents.send()`.

---

## Capture

API de capture d'ecran.

### `screensnap:capture:area`

Capture une zone rectangulaire selectionnee par l'utilisateur.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.capture.area(options?)` |
| **Parametres** | `options?: CaptureOptions` |
| **Retour** | `Promise<CaptureMetadata>` |

```typescript
interface CaptureOptions {
  format?: 'png' | 'jpg' | 'webp' | 'tiff'
  quality?: number          // 0-100 (defaut: 100)
  delay?: number            // Delai en secondes avant capture
  displayId?: number        // Ecran cible
  captureRect?: CaptureRect // Zone predeterminee (optionnel)
  hideCursor?: boolean      // Masquer le curseur (defaut: false)
}

interface CaptureMetadata {
  id: string
  type: CaptureType
  path: string
  thumbnailPath: string | null
  dimensions: { width: number; height: number }
  fileSize: number
  createdAt: string
  tags: string[]
}
```

### `screensnap:capture:window`

Capture une fenetre specifique.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.capture.window(windowId?, options?)` |
| **Parametres** | `windowId?: number`, `options?: CaptureOptions` |
| **Retour** | `Promise<CaptureMetadata>` |

Si `windowId` n'est pas fourni, l'utilisateur est invite a selectionner une fenetre.

### `screensnap:capture:fullscreen`

Capture l'ecran complet.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.capture.fullscreen(displayId?, options?)` |
| **Parametres** | `displayId?: number`, `options?: CaptureOptions` |
| **Retour** | `Promise<CaptureMetadata>` |

Si `displayId` n'est pas fourni, l'ecran principal est capture.

### `screensnap:capture:scrolling`

Capture defilante (contenu plus grand que l'ecran).

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.capture.scrolling(options?)` |
| **Parametres** | `options?: CaptureOptions` |
| **Retour** | `Promise<CaptureMetadata>` |

### `screensnap:capture:freeze`

Gele l'ecran pour permettre une capture precise.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.capture.freeze()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<void>` |

### `screensnap:capture:previous-area`

Recapture la zone precedemment selectionnee.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.capture.previousArea(options?)` |
| **Parametres** | `options?: CaptureOptions` |
| **Retour** | `Promise<CaptureMetadata>` |

---

## Enregistrement

API d'enregistrement video et GIF.

### `screensnap:recording:start`

Demarre un enregistrement d'ecran.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.recording.start(options)` |
| **Parametres** | `options: RecordingStartOptions` |
| **Retour** | `Promise<void>` |

```typescript
interface RecordingStartOptions {
  mode: 'video' | 'gif'
  area?: CaptureRect            // Zone a enregistrer (plein ecran si absent)
  fps: number                   // Images par seconde (defaut: 30)
  quality: 'low' | 'medium' | 'high' | 'lossless'
  includeSystemAudio: boolean   // Audio systeme
  includeMicrophone: boolean    // Microphone
  microphoneDeviceId?: string   // Peripherique micro specifique
  showCursor: boolean           // Afficher le curseur
  showClicks: boolean           // Mettre en surbrillance les clics
  showKeystrokes: boolean       // Afficher les touches pressees
  webcamEnabled: boolean        // Incrustation webcam
  webcamShape?: 'circle' | 'square' | 'rounded'
  maxDuration?: number          // Duree max en secondes
  outputPath?: string           // Chemin de sortie personnalise
}
```

### `screensnap:recording:stop`

Arrete l'enregistrement en cours.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.recording.stop()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<RecordingResult>` |

```typescript
interface RecordingResult {
  path: string
  duration: number              // Duree en secondes
  fileSize: number              // Taille en octets
  dimensions: { width: number; height: number }
}
```

### `screensnap:recording:pause`

Met l'enregistrement en pause.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.recording.pause()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<void>` |

### `screensnap:recording:resume`

Reprend un enregistrement en pause.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.recording.resume()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<void>` |

### `screensnap:recording:get-state`

Retourne l'etat actuel de l'enregistrement.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.recording.getState()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<RecordingState>` |

```typescript
type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'
```

---

## OCR

Reconnaissance optique de caracteres via le framework Vision de macOS.

### `screensnap:ocr:recognize`

Reconnait le texte dans une image.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.ocr.recognize(imagePath)` |
| **Parametres** | `imagePath: string` |
| **Retour** | `Promise<OcrResult>` |

```typescript
interface OcrResult {
  text: string                  // Texte complet reconnu
  confidence: number            // Confiance moyenne (0-1)
  regions: OcrRegion[]          // Regions de texte detectees
}

interface OcrRegion {
  text: string
  bounds: CaptureRect           // Position dans l'image
  confidence: number
}
```

---

## Overlay

Gestion de l'overlay affiche apres une capture.

### `screensnap:overlay:show`

Affiche l'overlay avec la capture.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.overlay.show(captureData)` |
| **Parametres** | `captureData: OverlayData` |
| **Retour** | `Promise<void>` |

```typescript
interface OverlayData {
  imagePath: string
  bounds: { x: number; y: number; width: number; height: number }
  displayId?: number
}
```

### `screensnap:overlay:hide`

Masque l'overlay.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.overlay.hide()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<void>` |

### `screensnap:overlay:action`

Execute une action sur la capture dans l'overlay.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.overlay.action(actionType)` |
| **Parametres** | `actionType: OverlayActionType` |
| **Retour** | `Promise<void>` |

```typescript
type OverlayActionType = 'save' | 'copy' | 'edit' | 'upload' | 'pin' | 'close' | 'ocr'
```

---

## Historique

Gestion de l'historique des captures.

### `screensnap:history:get-all`

Recupere la liste des captures.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.history.getAll(options?)` |
| **Parametres** | `options?: HistoryQueryOptions` |
| **Retour** | `Promise<CaptureMetadata[]>` |

```typescript
interface HistoryQueryOptions {
  limit?: number                // Nombre max de resultats (defaut: 50)
  offset?: number               // Decalage pour la pagination
  type?: string                 // Filtrer par type de capture
  search?: string               // Recherche textuelle
  sortBy?: 'date' | 'size' | 'name'
  sortOrder?: 'asc' | 'desc'
}
```

### `screensnap:history:delete`

Supprime une capture de l'historique.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.history.delete(id)` |
| **Parametres** | `id: string` |
| **Retour** | `Promise<void>` |

Supprime l'entree de la base de donnees et les fichiers associes (capture + miniature).

### `screensnap:history:clear`

Supprime tout l'historique.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.history.clear()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<void>` |

---

## Reglages

Gestion des preferences utilisateur.

### `screensnap:settings:get`

Recupere la valeur d'un reglage.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.settings.get(key)` |
| **Parametres** | `key: keyof AppSettings` |
| **Retour** | `Promise<AppSettings[K]>` |

### `screensnap:settings:set`

Modifie la valeur d'un reglage.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.settings.set(key, value)` |
| **Parametres** | `key: keyof AppSettings`, `value: AppSettings[K]` |
| **Retour** | `Promise<void>` |

### `screensnap:settings:get-all`

Recupere tous les reglages.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.settings.getAll()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<AppSettings>` |

```typescript
interface AppSettings {
  captureFormat: 'png' | 'jpg' | 'webp' | 'tiff'
  captureQuality: number
  savePath: string
  playSound: boolean
  showNotification: boolean
  autoSave: boolean
  copyToClipboard: boolean
  timerDelay: number
  shortcuts: ShortcutMap
}
```

---

## Pin

Epinglage d'images sur l'ecran.

### `screensnap:pin:create`

Cree une fenetre epinglee avec une image.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.pin.create(imagePath, options?)` |
| **Parametres** | `imagePath: string`, `options?: { opacity?: number }` |
| **Retour** | `Promise<string>` (identifiant du pin) |

### `screensnap:pin:close`

Ferme une fenetre epinglee.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.pin.close(id)` |
| **Parametres** | `id: string` |
| **Retour** | `Promise<void>` |

---

## Presse-papiers

Operations sur le presse-papiers.

### `screensnap:clipboard:copy-image`

Copie une image dans le presse-papiers.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.clipboard.copyImage(buffer)` |
| **Parametres** | `buffer: Uint8Array` (donnees PNG) |
| **Retour** | `Promise<void>` |

### `screensnap:clipboard:copy-text`

Copie du texte dans le presse-papiers.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.clipboard.copyText(text)` |
| **Parametres** | `text: string` |
| **Retour** | `Promise<void>` |

---

## Fichier

Operations sur les fichiers.

### `screensnap:file:save`

Sauvegarde un buffer dans un fichier.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.file.save(buffer, options?)` |
| **Parametres** | `buffer: Uint8Array`, `options?: FileSaveOptions` |
| **Retour** | `Promise<string>` (chemin du fichier sauvegarde) |

```typescript
interface FileSaveOptions {
  defaultName?: string          // Nom de fichier par defaut
  format?: string               // Format (png, jpg, etc.)
  directory?: string            // Dossier cible
}
```

### `screensnap:file:open-dialog`

Ouvre une boite de dialogue de selection de fichier.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.file.openDialog(options?)` |
| **Parametres** | `options?: FileDialogOptions` |
| **Retour** | `Promise<string \| null>` (chemin selectionne ou null) |

```typescript
interface FileDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>
}
```

---

## Application

Informations et controle de l'application.

### `screensnap:app:get-displays`

Retourne la liste des ecrans connectes.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.app.getDisplays()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<DisplayInfo[]>` |

```typescript
interface DisplayInfo {
  id: number
  label: string
  bounds: CaptureRect
  scaleFactor: number           // 1 (standard) ou 2 (Retina)
  isPrimary: boolean
}
```

### `screensnap:app:get-version`

Retourne la version de l'application.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.app.getVersion()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<string>` (ex: "0.1.0") |

### `screensnap:app:quit`

Quitte l'application.

| | |
|---|---|
| **Methode renderer** | `window.electronAPI.app.quit()` |
| **Parametres** | Aucun |
| **Retour** | `Promise<void>` |

---

## Evenements (Main vers Renderer)

Ces evenements sont envoyes par le processus principal via `webContents.send()`. Le renderer les ecoute via `window.electronAPI.on()`.

### `shortcut:triggered`

Emis quand un raccourci clavier global est declenche.

```typescript
window.electronAPI.on('shortcut:triggered', (data: { action: string }) => {
  // data.action : 'capture:area', 'capture:fullscreen', etc.
})
```

### Evenements du tray

Emis quand l'utilisateur clique sur un element du menu tray :

| Canal | Description |
|-------|-------------|
| `capture:all-in-one` | Mode tout-en-un |
| `capture:area` | Capture de zone |
| `capture:fullscreen` | Capture plein ecran |
| `capture:window` | Capture de fenetre |
| `capture:scrolling` | Capture defilante |
| `capture:previous-area` | Recapturer la zone precedente |
| `ocr:recognize` | Lancer l'OCR |
| `recording:start` | Demarrer l'enregistrement |
| `history:show` | Afficher l'historique |
| `settings:show` | Afficher les reglages |
| `pin:create` | Epingler une image |
| `file:open` | Ouvrir un fichier |
| `settings:timer-delay` | Changer le delai du retardateur |
| `desktop:toggle-icons` | Masquer/afficher les icones du bureau |

### Desinscription

```typescript
// Ecouter un evenement
window.electronAPI.on('shortcut:triggered', handler)

// Se desinscrire
window.electronAPI.off('shortcut:triggered', handler)
```
