<p align="center">
  <img src="assets/icons/icon.png" width="128" height="128" alt="ScreenSnap">
</p>

<h1 align="center">ScreenSnap</h1>

<p align="center">
  <strong>Clone open-source de CleanShot X pour macOS</strong>
</p>

<p align="center">
  Capture d'ecran, enregistrement video, annotations et OCR — le tout dans une application native et performante.
</p>

<p align="center">
  <a href="https://github.com/tribal-enterprises/screensnap/actions/workflows/ci.yml"><img src="https://github.com/tribal-enterprises/screensnap/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/tribal-enterprises/screensnap/releases"><img src="https://img.shields.io/github/v/release/tribal-enterprises/screensnap?color=blue" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/tribal-enterprises/screensnap" alt="Licence MIT"></a>
  <a href="https://github.com/tribal-enterprises/screensnap/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://github.com/tribal-enterprises/screensnap/stargazers"><img src="https://img.shields.io/github/stars/tribal-enterprises/screensnap?style=social" alt="Stars"></a>
</p>

---

## Pourquoi ScreenSnap ?

CleanShot X est un outil fantastique, mais c'est un logiciel proprietaire avec un abonnement. ScreenSnap offre une alternative open-source qui exploite les memes APIs macOS natives pour une experience equivalente — gratuitement.

## Fonctionnalites

### Capture d'ecran

- **Capture de zone** — Selectionnez une zone precise avec le crosshair
- **Capture de fenetre** — Capturez une fenetre avec ou sans ombre
- **Capture plein ecran** — Capturez l'ecran entier en un clic
- **Capture defilante** — Capturez du contenu plus grand que l'ecran
- **Gel d'ecran** — Gelez l'ecran pour capturer avec precision
- **Recapture** — Recapturez la zone precedente instantanement
- **Retardateur** — Capture differee (3, 5 ou 10 secondes)

### Enregistrement

- **Video** — Enregistrement d'ecran en MP4 haute qualite
- **GIF** — Conversion automatique en GIF anime
- **Audio systeme** — Capture de l'audio des applications
- **Microphone** — Enregistrement avec commentaire vocal
- **Webcam** — Incrustation webcam (cercle, carre, arrondi)
- **Clics et touches** — Visualisation des interactions

### Edition et annotation

- **Fleches et lignes** — Pointez les elements importants
- **Texte** — Ajoutez des annotations textuelles
- **Formes** — Rectangles, cercles, bulles
- **Surlignage** — Mettez en evidence une zone
- **Flou et pixelisation** — Masquez les informations sensibles
- **Numerotation** — Etapes numerotees pour les tutoriels

### Outils

- **OCR** — Reconnaissance de texte native (Vision framework)
- **Epinglage** — Epinglez une capture sur l'ecran (toujours au premier plan)
- **Historique** — Retrouvez toutes vos captures
- **Presse-papiers** — Copie automatique apres capture
- **Sauvegarde** — PNG, JPG, WebP ou TIFF

<p align="center">
  <br>
  <em>Capture d'ecran a venir</em>
  <br>
  <br>
</p>

## Installation

### Depuis les releases

Telechargez le dernier DMG depuis la page [Releases](https://github.com/tribal-enterprises/screensnap/releases).

1. Ouvrez le fichier `.dmg`
2. Glissez ScreenSnap dans le dossier Applications
3. Lancez ScreenSnap — l'icone apparait dans la barre de menu

> **Note :** Au premier lancement, macOS peut demander l'autorisation d'enregistrement d'ecran dans Preferences Systeme > Confidentialite & Securite > Enregistrement d'ecran.

### Depuis les sources

```bash
# Cloner le repository
git clone https://github.com/tribal-enterprises/screensnap.git
cd screensnap

# Installer les dependances
pnpm install

# (Optionnel) Compiler les addons natifs Swift
bash scripts/build-native.sh

# Lancer en mode developpement
pnpm dev

# Ou construire et lancer
pnpm start
```

**Prerequis :** Node.js 20+, pnpm 8+, Xcode Command Line Tools, Swift 5.9+.

## Demarrage rapide

1. Installez et lancez ScreenSnap
2. L'icone apparait dans la barre de menu (en haut a droite)
3. Utilisez les raccourcis clavier ou le menu pour capturer
4. Apres la capture, l'overlay apparait avec les options (copier, sauvegarder, editer, epingler)

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Cmd + Shift + 5` | Tout-en-un (mode de capture interactif) |
| `Cmd + Shift + 4` | Capturer une zone |
| `Cmd + Shift + 3` | Capturer l'ecran entier |
| `Cmd + Shift + W` | Capturer une fenetre |
| `Cmd + Shift + S` | Capture defilante |
| `Cmd + Shift + L` | Recapturer la zone precedente |
| `Cmd + Shift + O` | Reconnaitre le texte (OCR) |
| `Cmd + Shift + R` | Enregistrer l'ecran |
| `Cmd + Shift + H` | Historique des captures |

> Tous les raccourcis sont personnalisables dans les reglages.

## Stack technique

| Technologie | Role |
|------------|------|
| **Electron 33** | Runtime applicatif macOS |
| **React 18** | Interface utilisateur |
| **TypeScript** | Typage statique |
| **Tailwind CSS** | Styling |
| **Zustand** | Gestion d'etat |
| **Fabric.js** | Editeur d'annotations |
| **Swift** | Addons natifs macOS |
| **ScreenCaptureKit** | Capture d'ecran native |
| **Vision** | OCR natif |
| **CoreAudio** | Capture audio systeme |
| **better-sqlite3** | Stockage local |
| **FFmpeg** | Encodage video/GIF |
| **Vite** | Bundler |
| **Vitest** | Tests |
| **electron-builder** | Distribution |

## Roadmap

### Phase 1 — Fondations

- [x] Structure du projet et configuration
- [x] Architecture Electron (main, renderer, preload)
- [x] Menu barre de menu (tray)
- [x] Raccourcis clavier globaux
- [ ] Capture de zone basique
- [ ] Capture de fenetre
- [ ] Capture plein ecran
- [ ] Stockage SQLite

### Phase 2 — Fonctionnalites essentielles

- [ ] Overlay post-capture
- [ ] Copie dans le presse-papiers
- [ ] Sauvegarde automatique
- [ ] Historique des captures
- [ ] Notifications macOS
- [ ] Son de capture
- [ ] Retardateur

### Phase 3 — Edition et annotation

- [ ] Editeur Fabric.js
- [ ] Fleches et lignes
- [ ] Texte et formes
- [ ] Flou et pixelisation
- [ ] Numerotation
- [ ] Backgrounds decoratifs

### Phase 4 — Enregistrement

- [ ] Enregistrement video (FFmpeg)
- [ ] Export GIF
- [ ] Capture audio systeme
- [ ] Microphone
- [ ] Incrustation webcam
- [ ] Affichage des clics et touches

### Phase 5 — Fonctionnalites avancees

- [ ] OCR (Vision framework)
- [ ] Capture defilante
- [ ] Gel d'ecran
- [ ] Epinglage sur l'ecran
- [ ] Upload cloud et liens de partage
- [ ] Internationalisation (FR/EN)

### Phase 6 — Distribution

- [ ] Build DMG universel (Intel + Apple Silicon)
- [ ] Signature de code
- [ ] Notarisation Apple
- [ ] Auto-update
- [ ] Site web

## Contribuer

Les contributions sont les bienvenues ! Consultez le guide de contribution : [CONTRIBUTING.md](.github/CONTRIBUTING.md).

En bref :

1. Forkez le repository
2. Creez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committez vos changements (Conventional Commits)
4. Ouvrez une Pull Request

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — Vue d'ensemble technique
- [Guide de developpement](docs/DEVELOPMENT.md) — Installation, commandes, workflow
- [API IPC](docs/API.md) — Reference des canaux de communication
- [Contribuer](.github/CONTRIBUTING.md) — Guide de contribution
- [Changelog](CHANGELOG.md) — Historique des versions

## Licence

[MIT](LICENSE) — Copyright 2026 [Tribal Enterprises](https://tribal.enterprises)

## Remerciements

- [CleanShot X](https://cleanshot.com) — L'inspiration pour ce projet
- [Electron](https://electronjs.org) — Le runtime applicatif
- [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) — API de capture Apple
- [Vision](https://developer.apple.com/documentation/vision) — Framework OCR Apple
- [Fabric.js](http://fabricjs.com) — Bibliotheque canvas pour les annotations
- [FFmpeg](https://ffmpeg.org) — Encodage video et GIF

---

<p align="center">
  Fait avec passion par <a href="https://tribal.enterprises">Tribal Enterprises</a>
</p>
