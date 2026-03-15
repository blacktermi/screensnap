# Guide de developpement

Ce guide couvre tout ce qu'il faut savoir pour developper sur ScreenSnap.

## Prerequis

| Outil | Version | Verification | Installation |
|-------|---------|-------------|-------------|
| **macOS** | 12.3+ (Monterey) | `sw_vers` | - |
| **Node.js** | 20.x ou superieur | `node --version` | [nodejs.org](https://nodejs.org) |
| **pnpm** | 8.15 ou superieur | `pnpm --version` | `npm install -g pnpm` |
| **Xcode CLI** | Derniere version | `xcode-select -p` | `xcode-select --install` |
| **Swift** | 5.9 ou superieur | `swift --version` | Inclus avec Xcode CLI |
| **FFmpeg** | 6.x ou superieur | `ffmpeg -version` | `brew install ffmpeg` |
| **Git** | Derniere version | `git --version` | Inclus avec Xcode CLI |

> **Note :** FFmpeg statique est inclus via la dependance `ffmpeg-static`. L'installation globale de FFmpeg est optionnelle mais utile pour le debug.

## Installation

```bash
# 1. Cloner le repository
git clone https://github.com/tribal-enterprises/screensnap.git
cd screensnap

# 2. Installer les dependances
pnpm install

# 3. (Optionnel) Compiler les addons natifs Swift
bash scripts/build-native.sh

# 4. Lancer en mode developpement
pnpm dev
```

L'application demarre en mode developpement avec :
- Hot reload du renderer (Vite sur le port 5173)
- Recompilation automatique du processus principal (tsc --watch)
- DevTools Electron accessibles

## Commandes de developpement

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le dev (main + renderer en parallele) |
| `pnpm dev:main` | Lance uniquement le processus principal (watch) |
| `pnpm dev:renderer` | Lance uniquement le renderer Vite |
| `pnpm build` | Build de production complet |
| `pnpm build:main` | Build du processus principal |
| `pnpm build:renderer` | Build du renderer (Vite) |
| `pnpm build:preload` | Build du script preload |
| `pnpm build:native` | Build des addons natifs Swift |
| `pnpm start` | Build + lance l'application Electron |
| `pnpm test` | Lance les tests avec Vitest |
| `pnpm test:watch` | Tests en mode watch |
| `pnpm test:coverage` | Tests avec rapport de couverture |
| `pnpm lint` | Verifie le code avec ESLint |
| `pnpm lint:fix` | Corrige automatiquement les erreurs ESLint |
| `pnpm format` | Formate le code avec Prettier |
| `pnpm type-check` | Verification TypeScript (sans emission) |
| `pnpm build:dmg` | Build le DMG macOS pour distribution |
| `pnpm clean` | Supprime dist, out, cache, coverage |

## Architecture des fichiers

### Processus principal (`src/main/`)

Le processus principal est ecrit en TypeScript et compile en CommonJS pour Node.js :

```
src/main/
├── index.ts              # Point d'entree — cycle de vie Electron
├── tray.ts               # Menu de la barre de menu macOS
├── shortcuts.ts          # Raccourcis clavier globaux
├── types.ts              # Types TypeScript partages
├── ipc-handlers.ts       # Gestionnaires de canaux IPC
├── capture/              # Logique de capture d'ecran
├── recording/            # Enregistrement video et GIF
├── storage/              # SQLite + gestion des fichiers
├── cloud/                # Upload et liens de partage
└── ocr/                  # Bridge vers le module Vision natif
```

### Renderer (`src/renderer/`)

Le renderer est une application React empaquetee par Vite :

```
src/renderer/
├── index.html            # Page HTML racine
├── components/           # Composants React
│   ├── capture/          # Selection de zone, fenetre, etc.
│   ├── editor/           # Editeur d'annotations (Fabric.js)
│   ├── history/          # Liste de l'historique
│   ├── settings/         # Interface de reglages
│   ├── overlay/          # Overlay post-capture
│   └── common/           # Boutons, icones, modales
├── stores/               # Stores Zustand
├── hooks/                # Hooks React custom
└── styles/               # Fichiers CSS Tailwind
```

### Preload (`src/preload/`)

Le script preload expose l'API IPC au renderer :

```
src/preload/
├── index.ts              # contextBridge — expose electronAPI
└── types.ts              # Types de l'API + declaration Window
```

### Addons natifs (`src/native/`)

Modules Swift compiles en addons Node.js :

```
src/native/
├── ScreenCapture/        # ScreenCaptureKit (capture d'ecran)
├── VisionOCR/            # Vision (reconnaissance de texte)
├── AudioCapture/         # CoreAudio (capture audio systeme)
├── binding.gyp           # Configuration de build N-API
└── index.ts              # Chargement TypeScript avec fallback
```

## Ajouter une fonctionnalite

Voici les etapes pour ajouter une nouvelle fonctionnalite a ScreenSnap. Exemple : ajouter un mode "capture retardee".

### 1. Definir les types

Dans `src/main/types.ts`, ajouter les types necessaires :

```typescript
export interface TimerCaptureOptions {
  delay: number       // Delai en secondes (3, 5, 10)
  type: CaptureType   // Type de capture apres le delai
}
```

### 2. Ajouter le canal IPC

Dans `src/preload/types.ts`, etendre l'interface `CaptureAPI` :

```typescript
export interface CaptureAPI {
  // ... existant
  timed: (options: TimerCaptureOptions) => Promise<CaptureMetadata>
}
```

Dans `src/preload/index.ts`, ajouter l'implementation :

```typescript
capture: {
  // ... existant
  timed: (options) => invoke('screensnap:capture:timed', options),
}
```

### 3. Implementer le handler IPC

Dans `src/main/ipc-handlers.ts` (ou le fichier de handlers concerne) :

```typescript
ipcMain.handle('screensnap:capture:timed', async (_event, options) => {
  // Implementation de la capture retardee
})
```

### 4. Creer le composant UI

Dans `src/renderer/components/capture/`, creer le composant React :

```typescript
// TimerCapture.tsx
export function TimerCapture() {
  const handleCapture = async () => {
    const result = await window.electronAPI.capture.timed({
      delay: 5,
      type: 'area',
    })
    // Traiter le resultat
  }
  // ...
}
```

### 5. Ajouter les tests

Dans `tests/`, creer le fichier de test correspondant :

```typescript
// tests/capture/timer-capture.test.ts
import { describe, it, expect } from 'vitest'

describe('TimerCapture', () => {
  it('devrait respecter le delai configure', () => {
    // ...
  })
})
```

### 6. Ajouter les traductions

Dans `src/locales/fr/capture.json` et `src/locales/en/capture.json` :

```json
{
  "timer": {
    "label": "Capture retardee",
    "countdown": "Capture dans {{seconds}}s..."
  }
}
```

## Ajouter un raccourci clavier

### 1. Declarer le raccourci

Dans `src/main/shortcuts.ts`, ajouter le raccourci dans `defaultShortcuts` :

```typescript
private readonly defaultShortcuts: ShortcutMap = {
  // ... existant
  'capture:timed': 'CommandOrControl+Shift+T',
}
```

### 2. Ajouter au menu tray

Dans `src/main/tray.ts`, ajouter l'entree de menu :

```typescript
{
  label: 'Capture Retardee',
  accelerator: 'CmdOrCtrl+Shift+T',
  click: () => this.emit('capture:timed'),
}
```

### 3. Reagir dans le renderer

Ecouter l'evenement dans le composant ou le store :

```typescript
window.electronAPI.on('shortcut:triggered', ({ action }) => {
  if (action === 'capture:timed') {
    // Declencher la capture retardee
  }
})
```

## Tests

### Ecrire des tests

Les tests utilisent Vitest et sont places dans `tests/` en miroir de `src/` :

```
tests/
├── main/
│   ├── shortcuts.test.ts
│   └── storage/
│       └── database.test.ts
├── renderer/
│   └── stores/
│       └── capture-store.test.ts
└── shared/
    └── utils.test.ts
```

### Structure d'un test

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('NomDuModule', () => {
  beforeEach(() => {
    // Setup
  })

  it('devrait faire quelque chose de specifique', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = transform(input)

    // Assert
    expect(result).toBe('expected')
  })
})
```

### Lancer les tests

```bash
# Tous les tests
pnpm test

# Mode watch (relance automatique)
pnpm test:watch

# Avec couverture de code
pnpm test:coverage

# Un fichier specifique
pnpm exec vitest run tests/main/shortcuts.test.ts

# Tests correspondant a un pattern
pnpm exec vitest run -t "capture"
```

### Mocking

Pour tester les modules Electron, utilisez des mocks :

```typescript
import { vi } from 'vitest'

// Mock d'Electron
vi.mock('electron', () => ({
  app: { getPath: vi.fn(() => '/tmp/test') },
  ipcMain: { handle: vi.fn() },
  BrowserWindow: vi.fn(),
}))
```

## Debugging

### Electron DevTools

En mode developpement, les DevTools Chromium sont accessibles :

- **Raccourci :** `Cmd+Option+I` (dans une fenetre de l'app)
- **Console :** Logs du renderer
- **Network :** Requetes reseau
- **Application :** localStorage, IndexedDB

### Logs du processus principal

Les logs du processus principal s'affichent dans le terminal ou `pnpm dev` est lance :

```
[ScreenSnap] Application prete
[Tray] capture:area
[Shortcuts] Action declenchee : capture:area
```

### Debugging des addons natifs

Pour debugger les modules Swift :

1. **Logs :** Ajouter des `print()` dans le code Swift, visibles dans le terminal
2. **Xcode :** Ouvrir un projet Xcode pointant vers `src/native/` pour le debug avance
3. **lldb :** Attacher lldb au processus Electron pour debugger les crashs natifs :
   ```bash
   lldb -p $(pgrep -f "Electron")
   ```

### Variables d'environnement utiles

| Variable | Effet |
|----------|-------|
| `ELECTRON_ENABLE_LOGGING=1` | Active les logs verbeux d'Electron |
| `NODE_ENV=development` | Mode developpement (active par defaut avec `pnpm dev`) |
| `DEBUG=screensnap:*` | Active les logs de debug granulaires |

## Build de production

### Build local

```bash
# Build complet (renderer + main + preload)
pnpm build

# Build du DMG macOS
pnpm build:dmg
```

Le DMG est genere dans `out/`.

### Signature et notarisation

Pour distribuer l'application :

1. **Certificat :** Installez un certificat "Developer ID Application" depuis le portail Apple Developer
2. **Variables d'environnement :**
   ```bash
   export APPLE_ID="votre@email.com"
   export APPLE_ID_PASSWORD="xxxx-xxxx-xxxx-xxxx"
   export APPLE_TEAM_ID="XXXXXXXXXX"
   ```
3. **Activer la notarisation :** Decommentez `afterSign: scripts/notarize.js` dans `electron-builder.yml`
4. **Lancer le build :** `pnpm build:dmg`

### Release automatisee

```bash
# Release interactive
node scripts/release.js

# Bump patch directement
node scripts/release.js patch

# Simulation
node scripts/release.js --dry-run
```

Le script cree un tag git qui declenche le workflow de release GitHub Actions.

## FAQ developpeur

### L'application ne demarre pas en dev

```bash
# Verifier que toutes les dependances sont installees
pnpm install

# Nettoyer et reconstruire
pnpm clean
pnpm install
pnpm dev
```

### Les raccourcis globaux ne fonctionnent pas

- Verifiez que l'application a l'autorisation "Accessibilite" dans Preferences Systeme > Confidentialite & Securite
- Certains raccourcis peuvent etre en conflit avec d'autres applications
- Consultez les logs du terminal pour les avertissements de registration

### Les addons natifs ne se chargent pas

```bash
# Recompiler les addons
bash scripts/build-native.sh --clean
bash scripts/build-native.sh

# Verifier la version de Swift
swift --version

# Verifier que ScreenCaptureKit est disponible (macOS 12.3+)
sw_vers
```

### L'OCR ne detecte pas de texte

- Verifiez que l'application a l'autorisation "Enregistrement d'ecran" dans Preferences Systeme
- L'OCR fonctionne mieux avec du texte net et contrastee
- Les langues supportees dependent de la version de macOS

### Le build DMG echoue

```bash
# Verifier la configuration
cat electron-builder.yml

# Build avec logs detailles
DEBUG=electron-builder pnpm build:dmg
```

### Comment tester sur Apple Silicon et Intel ?

- **Apple Silicon (arm64) :** Tester nativement sur un Mac M1/M2/M3
- **Intel (x64) :** Utiliser Rosetta 2 ou un Mac Intel
- **Universal :** Le build DMG genere des binaires pour les deux architectures
