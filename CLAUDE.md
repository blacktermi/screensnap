# CLAUDE.md — ScreenSnap

## Project Description

ScreenSnap is an open-source CleanShot X alternative for macOS, built with **Electron + React + TypeScript + Swift native addons**. It provides screen capture, screen recording, annotation, and OCR capabilities with a native macOS look and feel.

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev mode (main + renderer in parallel)
pnpm build                # Production build (renderer + main + preload)
pnpm build:native         # Build Swift native addons
pnpm start                # Build and launch Electron app
pnpm test                 # Run tests with Vitest
pnpm test:watch           # Run tests in watch mode
pnpm lint                 # Lint TypeScript/React files
pnpm lint:fix             # Lint and auto-fix
pnpm format               # Format with Prettier
pnpm type-check           # TypeScript type checking (no emit)
pnpm build:dmg            # Build macOS DMG installer
pnpm clean                # Remove dist, out, cache, coverage
```

## Architecture

```
src/
  main/                   # Electron main process (Node.js)
    capture/              # Screenshot capture logic
    recording/            # Screen recording (ffmpeg integration)
    storage/              # Local file storage (better-sqlite3)
    cloud/                # Cloud upload service
    ocr/                  # OCR via native macOS Vision framework
  renderer/               # React UI (Vite-bundled)
    components/           # React components
    stores/               # Zustand state stores
    hooks/                # Custom React hooks
    pages/                # Page-level components
    styles/               # Tailwind CSS styles
  preload/                # Electron preload scripts (context bridge)
  native/                 # Swift native addons (screen capture, permissions, OCR)
  locales/                # i18n translation files (fr default, en)

assets/
  icons/                  # App icons (.icns, .png)
  backgrounds/            # Screenshot background templates
  sounds/                 # Capture sound effects

tests/                    # Test files (mirrors src/ structure)
scripts/                  # Build and utility scripts
```

## Key Patterns

### IPC Communication
- All main/renderer communication goes through typed IPC channels defined in preload scripts.
- Use `contextBridge.exposeInMainWorld()` to expose APIs to the renderer.
- Channel names follow the pattern: `screensnap:<domain>:<action>` (e.g., `screensnap:capture:screenshot`).

### State Management
- **Zustand** stores for all client-side state.
- Stores are in `src/renderer/stores/` with the naming convention `use<Name>Store.ts`.
- Keep stores small and domain-specific (capture, editor, settings, history).

### Internationalization (i18n)
- French is the default language.
- Translation files live in `src/locales/{lang}/`.
- Use `react-i18next` with the `useTranslation()` hook in components.
- Namespace translations by feature: `capture.json`, `editor.json`, `settings.json`.

### Annotation Editor
- Uses **Fabric.js** canvas for annotations (arrows, text, shapes, blur).
- Editor state managed via a dedicated Zustand store.

### Native Addons (Swift)
- Swift code in `src/native/` compiled as native Node.js addons (.node files).
- Used for: screen capture permissions, native screenshot API, OCR (Vision framework).
- Build with `pnpm build:native`.

### Database
- **better-sqlite3** for local capture history and metadata.
- Schema migrations in `src/main/storage/`.

### Settings
- **electron-store** for user preferences (persisted JSON).
- Type-safe schema defined in the main process.

## Code Conventions

- **Formatting:** Prettier — no semicolons, single quotes, 100 char width, trailing commas.
- **TypeScript:** Strict mode. Prefer `type` imports. No `any` unless justified.
- **Components:** Functional components only, with TypeScript props interfaces.
- **Files:** kebab-case for files, PascalCase for components, camelCase for utilities.

## Conventional Commits

Use conventional commits with these scopes:

```
feat(capture): add area selection mode
fix(editor): correct arrow rendering on retina displays
feat(recording): implement GIF export
fix(main): resolve tray icon memory leak
chore(deps): update electron to 33.x
feat(i18n): add English translations
refactor(store): split capture store into sub-stores
test(capture): add unit tests for region selection
build(native): update Swift package dependencies
docs: update architecture diagram
```

## Deployment

- macOS only. Build DMG with `pnpm build:dmg`.
- electron-builder config in `electron-builder.yml`.
- Code signing and notarization require Apple Developer credentials (see `scripts/notarize.js`).
- Supported architectures: x64 (Intel) and arm64 (Apple Silicon) via universal build.
