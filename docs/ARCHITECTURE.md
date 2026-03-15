# Architecture de ScreenSnap

## Vue d'ensemble

ScreenSnap est une application macOS de capture d'ecran et d'enregistrement video construite sur Electron. Elle combine une interface utilisateur React moderne avec des modules natifs Swift pour exploiter les frameworks macOS (ScreenCaptureKit, Vision, CoreAudio) a leur plein potentiel.

L'architecture suit le modele multi-processus d'Electron en separant strictement le processus principal (Node.js), le renderer (React) et les modules natifs (Swift), avec un pont IPC type-safe comme unique canal de communication.

## Stack technique

| Couche | Technologie | Role |
|--------|------------|------|
| **Runtime** | Electron 33 | Shell applicatif, gestion des fenetres, acces systeme |
| **Interface** | React 18 + TypeScript | Composants UI, editeur d'annotations |
| **Style** | Tailwind CSS 3.4 | Styling utilitaire, theme macOS natif |
| **Etat** | Zustand 5 | Gestion d'etat cote client |
| **Annotations** | Fabric.js 6 | Canvas d'edition (fleches, texte, formes, flou) |
| **Base de donnees** | better-sqlite3 | Historique des captures, metadonnees |
| **Preferences** | electron-store | Reglages utilisateur persistes (JSON) |
| **Video** | FFmpeg (statique) | Encodage video, conversion GIF |
| **OCR** | Vision (Swift) | Reconnaissance de texte native |
| **Capture** | ScreenCaptureKit (Swift) | Capture d'ecran haute performance |
| **Audio** | CoreAudio (Swift) | Capture audio systeme |
| **i18n** | i18next | Internationalisation (FR/EN) |
| **Build** | Vite 6 + TypeScript | Bundling renderer, compilation |
| **Tests** | Vitest | Tests unitaires et d'integration |
| **Distribution** | electron-builder | Packaging DMG, signature, notarisation |

## Architecture Electron

L'application utilise l'architecture multi-processus d'Electron avec isolation de contexte activee :

```
+-------------------------------------------------------------------+
|                        macOS                                       |
|                                                                    |
|  +---------------------+    IPC     +-------------------------+   |
|  |  Processus Principal |<--------->|  Processus Renderer     |   |
|  |  (Node.js)           |  (bridge) |  (Chromium)             |   |
|  |                      |           |                         |   |
|  |  - Capture d'ecran   |           |  - Interface React      |   |
|  |  - Enregistrement    |           |  - Editeur Fabric.js    |   |
|  |  - Stockage SQLite   |           |  - Stores Zustand       |   |
|  |  - Raccourcis globaux|           |  - Historique UI        |   |
|  |  - Menu tray         |           |  - Reglages UI          |   |
|  |  - Upload cloud      |           |  - Overlay de capture   |   |
|  +----------+-----------+           +-------------------------+   |
|             |                                                      |
|             | N-API                                                 |
|             |                                                      |
|  +----------+-----------+                                          |
|  |  Addons Natifs Swift  |                                         |
|  |                       |                                         |
|  |  - ScreenCaptureKit   |                                         |
|  |  - Vision (OCR)       |                                         |
|  |  - CoreAudio          |                                         |
|  +-----------------------+                                         |
+-------------------------------------------------------------------+
```

### Processus Principal (`src/main/`)

Le processus principal est le coeur de l'application. Il :

- Gere le cycle de vie de l'application Electron
- Enregistre les raccourcis clavier globaux (fonctionnent meme sans focus)
- Affiche l'icone et le menu dans la barre de menu macOS (tray)
- Execute les captures d'ecran via les addons natifs Swift
- Gere l'enregistrement video via FFmpeg
- Stocke l'historique et les metadonnees dans SQLite
- Repond aux requetes IPC du renderer

L'application fonctionne comme une "menu bar app" : pas d'icone dans le Dock, uniquement dans la barre de menu.

### Processus Renderer (`src/renderer/`)

Le renderer est une application React classique empaquetee par Vite :

- Composants fonctionnels TypeScript avec Tailwind CSS
- Etat gere par des stores Zustand specifiques a chaque domaine
- Editeur d'annotations base sur Fabric.js (canvas HTML5)
- Communication avec le main via `window.electronAPI` (expose par le preload)

### Preload (`src/preload/`)

Le script preload est le gardien de la securite. Il :

- Expose une API type-safe via `contextBridge.exposeInMainWorld()`
- Convertit les appels de methodes en `ipcRenderer.invoke()`
- Empeche l'acces direct a Node.js depuis le renderer (contextIsolation = true)
- Definit le contrat TypeScript entre main et renderer

## Addons natifs Swift

### Pourquoi des addons natifs ?

Les APIs macOS de capture d'ecran (ScreenCaptureKit), de reconnaissance de texte (Vision) et de capture audio (CoreAudio) ne sont pas accessibles depuis JavaScript/Node.js. Les addons natifs permettent :

1. **Performance** : Capture d'ecran a la vitesse native, sans passer par des processus externes
2. **Qualite** : Acces direct aux buffers d'image haute resolution (Retina)
3. **Fonctionnalites** : OCR natif, capture audio systeme, liste des fenetres
4. **Integration** : Gestion native des autorisations macOS (Privacy & Security)

### Architecture des modules

```
src/native/
  ScreenCapture/
    ScreenCapture.swift     # Wrapper ScreenCaptureKit
  VisionOCR/
    TextRecognition.swift   # Reconnaissance de texte Vision
  AudioCapture/
    AudioCapture.swift      # Capture audio CoreAudio
  binding.gyp               # Configuration de build N-API
  index.ts                  # Wrapper TypeScript avec fallback
```

Chaque module Swift est compile en fichier `.node` (bibliotheque dynamique) chargeable par Node.js via N-API. Le fichier `index.ts` charge les modules avec gestion d'erreur et fournit des stubs si la compilation native n'est pas disponible.

### Compilation

```bash
# Compiler tous les modules
pnpm build:native
# ou
bash scripts/build-native.sh

# Compiler un module specifique
bash scripts/build-native.sh capture
bash scripts/build-native.sh ocr
bash scripts/build-native.sh audio
```

## Communication IPC

Toute communication entre le renderer et le processus principal passe par des canaux IPC nommes. Le flux est toujours initie par le renderer :

```
Renderer                    Preload                     Main
   |                           |                          |
   |  window.electronAPI.      |                          |
   |  capture.area()           |                          |
   |-------------------------->|                          |
   |                           |  ipcRenderer.invoke(     |
   |                           |  'screensnap:capture:    |
   |                           |   area', options)        |
   |                           |------------------------->|
   |                           |                          |
   |                           |                          | Appel addon
   |                           |                          | natif Swift
   |                           |                          |
   |                           |       Promise<result>    |
   |                           |<-------------------------|
   |       Promise<result>     |                          |
   |<--------------------------|                          |
   |                           |                          |
```

Pour les evenements du main vers le renderer (raccourcis, tray) :

```
Main                        Preload                     Renderer
   |                           |                          |
   | webContents.send(         |                          |
   | 'shortcut:triggered',     |                          |
   |  { action })              |                          |
   |-------------------------->|                          |
   |                           | electronAPI.on(          |
   |                           | 'shortcut:triggered',    |
   |                           |  callback)               |
   |                           |------------------------->|
   |                           |                          |
```

### Convention de nommage des canaux

Format : `screensnap:<domaine>:<action>`

| Domaine | Exemples |
|---------|----------|
| `capture` | `screensnap:capture:area`, `screensnap:capture:window` |
| `recording` | `screensnap:recording:start`, `screensnap:recording:stop` |
| `ocr` | `screensnap:ocr:recognize` |
| `overlay` | `screensnap:overlay:show`, `screensnap:overlay:hide` |
| `history` | `screensnap:history:get-all`, `screensnap:history:delete` |
| `settings` | `screensnap:settings:get`, `screensnap:settings:set` |
| `pin` | `screensnap:pin:create`, `screensnap:pin:close` |
| `clipboard` | `screensnap:clipboard:copy-image`, `screensnap:clipboard:copy-text` |
| `file` | `screensnap:file:save`, `screensnap:file:open-dialog` |
| `app` | `screensnap:app:get-displays`, `screensnap:app:get-version` |

## Stockage

### Base de donnees SQLite

L'historique des captures et les metadonnees sont stockes dans une base SQLite locale via `better-sqlite3`. La base est creee dans le dossier de donnees de l'application (`app.getPath('userData')`).

```
~/Library/Application Support/ScreenSnap/
  screensnap.db              # Base SQLite
  captures/                  # Fichiers de capture
    2026-03-15/
      screenshot-2026-03-15-143052.png
      screenshot-2026-03-15-143052-thumb.png
  recordings/                # Enregistrements video
    recording-2026-03-15-150000.mp4
```

### Schema principal

```sql
CREATE TABLE captures (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,        -- 'area', 'window', 'fullscreen', 'scrolling'
  path        TEXT NOT NULL,
  thumbnail_path TEXT,
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  file_size   INTEGER NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  tags        TEXT DEFAULT '[]'
);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

### Preferences utilisateur

Les preferences sont gerees par `electron-store` et persistees en JSON :

```
~/Library/Application Support/ScreenSnap/
  config.json                # Preferences utilisateur
```

## Structure des repertoires

```
screensnap/
├── src/
│   ├── main/                       # Processus principal Electron
│   │   ├── index.ts                # Point d'entree, cycle de vie
│   │   ├── tray.ts                 # Menu barre de menu
│   │   ├── shortcuts.ts            # Raccourcis clavier globaux
│   │   ├── types.ts                # Types partages
│   │   ├── ipc-handlers.ts         # Gestionnaires IPC
│   │   ├── capture/                # Logique de capture d'ecran
│   │   ├── recording/              # Enregistrement video (FFmpeg)
│   │   ├── storage/                # SQLite, gestion des fichiers
│   │   ├── cloud/                  # Upload et partage cloud
│   │   └── ocr/                    # Bridge vers l'addon OCR
│   │
│   ├── renderer/                   # Interface React (Vite)
│   │   ├── index.html              # Point d'entree HTML
│   │   ├── components/             # Composants React
│   │   │   ├── capture/            # UI de capture
│   │   │   ├── editor/             # Editeur d'annotations
│   │   │   ├── history/            # Historique des captures
│   │   │   ├── settings/           # Ecran de reglages
│   │   │   ├── overlay/            # Overlay post-capture
│   │   │   └── common/             # Composants partages
│   │   ├── stores/                 # Stores Zustand
│   │   ├── hooks/                  # Hooks React custom
│   │   └── styles/                 # Styles Tailwind
│   │
│   ├── preload/                    # Bridge IPC securise
│   │   ├── index.ts                # contextBridge.exposeInMainWorld
│   │   └── types.ts                # Types de l'API exposee
│   │
│   ├── native/                     # Modules Swift natifs
│   │   ├── ScreenCapture/          # ScreenCaptureKit wrapper
│   │   ├── VisionOCR/              # Vision OCR wrapper
│   │   ├── AudioCapture/           # CoreAudio wrapper
│   │   ├── binding.gyp             # Config de build N-API
│   │   └── index.ts                # Chargement TypeScript
│   │
│   └── locales/                    # Fichiers de traduction i18n
│       ├── fr/                     # Francais (langue par defaut)
│       └── en/                     # Anglais
│
├── assets/                         # Ressources statiques
│   ├── icons/                      # Icones de l'application
│   ├── backgrounds/                # Templates de fond
│   └── sounds/                     # Sons de capture
│
├── tests/                          # Tests (miroir de src/)
├── scripts/                        # Scripts de build et utilitaires
│   ├── build-native.sh             # Compilation des addons Swift
│   ├── notarize.js                 # Notarisation macOS
│   └── release.js                  # Automatisation de release
│
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md             # Ce fichier
│   ├── DEVELOPMENT.md              # Guide de developpement
│   └── API.md                      # Documentation IPC
│
├── .github/                        # GitHub (CI/CD, templates)
│   ├── workflows/                  # Actions GitHub
│   ├── CONTRIBUTING.md             # Guide de contribution
│   └── ISSUE_TEMPLATE/             # Templates d'issues
│
├── electron-builder.yml            # Config electron-builder
├── vite.config.ts                  # Config Vite (renderer)
├── tsconfig.json                   # Config TypeScript racine
├── tsconfig.main.json              # TS config processus principal
├── tsconfig.preload.json           # TS config preload
├── tsconfig.renderer.json          # TS config renderer
├── tailwind.config.ts              # Config Tailwind CSS
└── package.json                    # Dependances et scripts
```
