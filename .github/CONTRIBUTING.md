# Contribuer a ScreenSnap

Merci de votre interet pour contribuer a ScreenSnap ! Ce guide vous aidera a demarrer.

## Comment contribuer

Il existe plusieurs facons de contribuer :

- **Signaler des bugs** via les [Issues](https://github.com/anthropics/screensnap/issues)
- **Proposer des fonctionnalites** via les [Feature Requests](https://github.com/anthropics/screensnap/issues/new?template=feature_request.yml)
- **Soumettre du code** via des Pull Requests
- **Ameliorer la documentation**
- **Participer aux discussions**

## Prerequis

Avant de commencer, assurez-vous d'avoir installe :

| Outil | Version | Verification |
|-------|---------|-------------|
| **Node.js** | 20.x ou superieur | `node --version` |
| **pnpm** | 8.x ou superieur | `pnpm --version` |
| **Xcode Command Line Tools** | Derniere version | `xcode-select --install` |
| **Swift** | 5.9 ou superieur | `swift --version` |
| **Git** | Derniere version | `git --version` |

> **Note :** ScreenSnap est une application macOS native. Le developpement necessite un Mac.

## Installation

1. **Forkez** le repository sur GitHub

2. **Clonez** votre fork :
   ```bash
   git clone https://github.com/VOTRE_USERNAME/screensnap.git
   cd screensnap
   ```

3. **Installez les dependances** :
   ```bash
   pnpm install
   ```

4. **Lancez en mode developpement** :
   ```bash
   pnpm dev
   ```

5. **Verifiez que tout fonctionne** :
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

## Structure du projet

```
screensnap/
├── src/
│   ├── main/           # Process principal Electron
│   ├── renderer/        # Interface React (Vite)
│   ├── preload/         # Scripts preload (bridge IPC)
│   ├── shared/          # Types et utilitaires partages
│   └── native/          # Modules Swift natifs
├── tests/               # Tests Vitest
├── assets/              # Icones, images
├── scripts/             # Scripts de build et utilitaires
├── docs/                # Documentation
└── .github/             # CI/CD, templates, contributing
```

## Workflow Git

### Branches

| Branche | Usage |
|---------|-------|
| `main` | Production stable |
| `develop` | Branche de developpement |
| `feature/xxx` | Nouvelles fonctionnalites |
| `fix/xxx` | Corrections de bugs |
| `refactor/xxx` | Refactoring |

### Processus

1. **Forkez** le repository
2. **Creez une branche** depuis `develop` :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/ma-fonctionnalite
   ```
3. **Developpez** vos changements
4. **Committez** en suivant les conventions (voir ci-dessous)
5. **Poussez** votre branche :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
6. **Ouvrez une Pull Request** vers `develop`
7. **Attendez la review** et repondez aux commentaires

## Convention de commits

Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | Nouvelle fonctionnalite |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Formatage, point-virgules manquants, etc. |
| `refactor` | Refactoring sans changement fonctionnel |
| `perf` | Amelioration des performances |
| `test` | Ajout ou modification de tests |
| `chore` | Maintenance, configuration, CI |
| `build` | Changements au systeme de build |

### Scopes

| Scope | Description |
|-------|-------------|
| `capture` | Capture d'ecran |
| `recorder` | Enregistrement video |
| `editor` | Editeur d'annotations |
| `shortcuts` | Raccourcis clavier |
| `tray` | Menu bar |
| `storage` | Stockage et historique |
| `cloud` | Partage cloud |
| `native` | Modules Swift natifs |
| `ui` | Interface utilisateur |
| `ipc` | Communication inter-process |

### Exemples

```
feat(capture): ajouter la capture de zone avec selection
fix(editor): corriger le rendu des fleches sur Retina
refactor(storage): migrer vers SQLite pour l'historique
docs: mettre a jour le guide d'installation
chore(ci): ajouter le cache pnpm dans le workflow
```

## Standards de code

### ESLint

Le projet utilise une configuration ESLint stricte. Verifiez votre code :

```bash
pnpm lint        # Verifier
pnpm lint:fix    # Corriger automatiquement
```

### Prettier

Le formatage est gere par Prettier :

```bash
pnpm format        # Formater
pnpm format:check  # Verifier sans modifier
```

Configuration :
- Pas de point-virgules
- Guillemets simples
- Largeur maximale : 100 caracteres
- Virgule finale (trailing commas)

### TypeScript

Le mode strict est active. Regles importantes :

- **Pas de `any`** — utilisez des types precis ou `unknown`
- **Pas de `@ts-ignore`** — corrigez le probleme de typage
- **Interfaces pour les objets publics** — types pour les unions/intersections
- **Generics quand pertinent** — evitez la duplication de types

Verifiez la compilation :

```bash
pnpm exec tsc --noEmit
```

## Tests

### Ecrire des tests

- Placez les tests dans `tests/` en miroir de la structure `src/`
- Nommez les fichiers `*.test.ts` ou `*.spec.ts`
- Utilisez `describe` / `it` pour organiser les tests
- Visez une couverture significative pour la logique metier

### Lancer les tests

```bash
pnpm test              # Lancer tous les tests
pnpm test -- --watch   # Mode watch
pnpm test -- --coverage # Avec couverture
```

### Exemple de test

```typescript
import { describe, it, expect } from 'vitest'
import { formatFilename } from '../src/shared/utils'

describe('formatFilename', () => {
  it('should generate a filename with timestamp', () => {
    const result = formatFilename('png')
    expect(result).toMatch(/^screenshot-\d{4}-\d{2}-\d{2}.*\.png$/)
  })
})
```

## Soumettre une Pull Request

### Avant de soumettre

1. Assurez-vous que votre code suit les standards (`pnpm lint && pnpm format:check`)
2. Ajoutez des tests pour vos changements
3. Verifiez que tous les tests passent (`pnpm test`)
4. Verifiez la compilation TypeScript (`pnpm exec tsc --noEmit`)
5. Testez le build (`pnpm build`)
6. Testez sur macOS (Apple Silicon et/ou Intel si possible)

### Template de PR

Utilisez le template fourni et remplissez toutes les sections pertinentes. Une PR bien documentee sera reviewee plus rapidement.

### Review

- Un mainteneur reviewera votre PR
- Repondez aux commentaires et apportez les modifications demandees
- Une fois approuvee, un mainteneur mergera votre PR

### Bonnes pratiques

- **Une PR = un sujet** — evitez les PRs qui touchent a plusieurs fonctionnalites
- **Commits atomiques** — chaque commit doit compiler et passer les tests
- **Description claire** — expliquez le "pourquoi", pas seulement le "quoi"
- **Petites PRs** — les PRs courtes sont reviewees plus rapidement

---

Merci de contribuer a ScreenSnap !
