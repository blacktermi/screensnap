# Changelog

Toutes les modifications notables de ce projet sont documentees dans ce fichier.

Le format est base sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhere au [Versionnement Semantique](https://semver.org/lang/fr/).

## [Unreleased]

## [0.1.0] - 2026-03-15

### Added

- Structure initiale du projet (Electron + React + TypeScript)
- Configuration Vite pour le bundling du renderer
- Configuration TypeScript (main, preload, renderer)
- Configuration ESLint et Prettier
- Configuration electron-builder (DMG, signature, notarisation)
- Configuration Tailwind CSS
- Workflows GitHub Actions (CI, release, CodeQL)
- Templates d'issues et de pull requests
- Guide de contribution (CONTRIBUTING.md)
- Processus principal Electron avec cycle de vie complet
- Menu barre de menu macOS (tray) avec toutes les actions
- Raccourcis clavier globaux personnalisables
- Types TypeScript pour la capture, l'enregistrement, l'OCR et les reglages
- Script preload avec API IPC type-safe via contextBridge
- Types et declarations pour l'API electronAPI
- Stubs des addons natifs Swift (ScreenCaptureKit, Vision OCR, CoreAudio)
- Configuration de build N-API pour les modules Swift (binding.gyp)
- Wrapper TypeScript pour les addons natifs avec fallback gracieux
- Script de compilation des addons natifs (build-native.sh)
- Script de notarisation macOS (notarize.js)
- Script d'automatisation de release (release.js)
- Documentation d'architecture (ARCHITECTURE.md)
- Guide de developpement (DEVELOPMENT.md)
- Documentation de l'API IPC (API.md)
- README complet avec roadmap

[Unreleased]: https://github.com/tribal-enterprises/screensnap/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tribal-enterprises/screensnap/releases/tag/v0.1.0
