# ScreenSnap -- Charte Graphique & Identite de Marque

> **Version :** 1.0
> **Date :** 15 mars 2026
> **Projet :** ScreenSnap -- Alternative open-source a CleanShot X pour macOS
> **Stack :** Electron + React + TypeScript + Swift

---

## Table des matieres

1. [Philosophie de la marque](#1-philosophie-de-la-marque)
2. [Principes de design](#2-principes-de-design)
3. [Logo -- Concept & Construction](#3-logo--concept--construction)
4. [Variantes du logo](#4-variantes-du-logo)
5. [Regles d'utilisation du logo](#5-regles-dutilisation-du-logo)
6. [Systeme de couleurs](#6-systeme-de-couleurs)
7. [Typographie](#7-typographie)
8. [Specification du degradé](#8-specification-du-degrade)
9. [Applications & Exemples d'utilisation](#9-applications--exemples-dutilisation)

---

## 1. Philosophie de la marque

ScreenSnap est ne d'une conviction simple : la capture d'ecran sur macOS merite un outil **puissant, rapide et accessible a tous**. En tant qu'alternative open-source a CleanShot X, ScreenSnap porte les valeurs de transparence, de qualite et de communaute.

Le nom **ScreenSnap** fusionne deux idees :

- **Screen** -- l'ecran, le territoire de travail
- **Snap** -- la capture instantanee, le declenchement eclair

Cette dualite se retrouve dans toute l'identite visuelle : la **precision** du bleu professionnel et la **vivacite** de l'eclair jaune.

---

## 2. Principes de design

Cinq principes fondamentaux guident chaque decision de design dans ScreenSnap :

### 2.1 Esprit natif macOS

L'interface s'integre naturellement dans l'ecosysteme Apple. On utilise les polices systeme, les formes squircle natives, les boutons feu tricolore et les effets de vibrancy. L'utilisateur ne doit jamais sentir qu'il utilise une app etrangere au systeme.

### 2.2 Propre & Minimal

Aucune decoration superflue. L'interface s'efface pour laisser place au contenu. Chaque pixel a une raison d'exister.

### 2.3 Le bleu comme confiance

La palette bleue communique fiabilite et professionnalisme. C'est la couleur d'un outil sur lequel on peut compter au quotidien.

### 2.4 Snap = Vitesse

L'accent jaune eclair represente l'experience de capture instantanee. Tout dans ScreenSnap doit etre rapide -- du lancement a l'export.

### 2.5 Esprit Open Source

Transparent, accessible, porte par la communaute. L'identite visuelle doit rester approchable et ne jamais paraitre fermee ou elitiste.

---

## 3. Logo -- Concept & Construction

### 3.1 Description du concept

L'icone ScreenSnap est construite autour de trois elements symboliques superposes :

```
+------------------------------------------+
|                                          |
|  [Cadre fenetre macOS]                   |
|   - Boutons feu tricolore               |
|     (rouge / jaune / vert)              |
|                                          |
|  [Viseur / Reticule]                     |
|   - Outil de selection de capture        |
|   - Croisement de lignes centrales       |
|                                          |
|  [Eclair jaune "Snap"]                   |
|   - Accent dynamique                     |
|   - Symbolise la rapidite               |
|                                          |
|  [Fond degrade bleu]                     |
|   - Identite principale                  |
|                                          |
+------------------------------------------+
```

**Element 1 -- Le cadre fenetre macOS**
Un cadre de fenetre stylise avec les trois boutons feu tricolore (rouge, jaune, vert) ancre immediatement l'app dans l'univers macOS.

**Element 2 -- Le viseur / reticule**
Au centre de la fenetre, un reticule de selection represente la fonctionnalite principale : la capture d'ecran par selection de zone.

**Element 3 -- L'eclair jaune**
Un eclair jaune vif traverse le viseur, apportant dynamisme et symbolisant la rapidite de la capture -- le "snap".

**Element 4 -- Le fond degrade bleu**
L'arriere-plan utilise le degrade bleu signature de la marque, donnant profondeur et identite a l'ensemble.

### 3.2 Logotype

Le mot-symbole **ScreenSnap** utilise une approche typographique a deux poids :

- **"Screen"** en **Bold (700)** -- stabilite, solidite, l'ecran comme fondation
- **"Snap"** en **Regular (400)** -- legerete, vitesse, l'instant de la capture

Cette difference de graisse cree un rythme visuel qui reflecte la dualite du produit.

---

## 4. Variantes du logo

Le systeme de logo comprend 8 variantes pour couvrir tous les contextes d'utilisation :

| Fichier | Description | Dimensions | Usage |
|---------|-------------|------------|-------|
| `icon.svg` | Icone complete de l'application | 1024x1024 | Generation du fichier .icns macOS |
| `icon-simple.svg` | Icone simplifiee | 512x512 | Reseaux sociaux, previews |
| `icon-monochrome.svg` | Icone monochrome | 64x64 | Petits contextes, favicon |
| `wordmark.svg` | Logo texte seul | Variable | Usage textuel uniquement |
| `logo-full.svg` | Icone + mot-symbole horizontal | Variable | Sites web, README, fonds clairs |
| `logo-full-white.svg` | Icone + mot-symbole blanc | Variable | Fonds sombres |
| `tray-icon.svg` | Icone barre de menus macOS | 22x22 | Menu bar (template image) |
| `tray-icon-recording.svg` | Icone barre de menus + point rouge | 22x22 | Menu bar pendant un enregistrement |

---

## 5. Regles d'utilisation du logo

### 5.1 Zone de protection

L'espace libre minimum autour du logo est egal a **1x la hauteur de l'icone** sur les quatre cotes. Aucun element graphique ou textuel ne doit empieter sur cette zone.

```
          <-- 1x -->
     +---+----------+---+
     |   |          |   |  ^
     |   |  [LOGO]  |   |  1x
     |   |          |   |  v
     +---+----------+---+
          <-- 1x -->
```

### 5.2 Tailles minimales

| Variante | Taille minimale |
|----------|----------------|
| Icone couleur | 32x32 px |
| Icone monochrome | 16x16 px |
| Logo complet (icone + texte) | 120 px de largeur |

> **Regle :** En dessous de 32x32 px, utiliser systematiquement la variante monochrome (`icon-monochrome.svg`).

### 5.3 Interdictions

Les actions suivantes sont **strictement interdites** :

- Etirer ou deformer le logo (ratio non respecte)
- Faire pivoter le logo
- Modifier les couleurs du degrade
- Ajouter des ombres portees ou des effets non prevus
- Placer le logo sur un fond complexe sans contraste suffisant
- Utiliser le mot-symbole couleur sur fond sombre (utiliser `logo-full-white.svg`)

### 5.4 Fond sombre vs fond clair

| Contexte | Variante a utiliser |
|----------|---------------------|
| Fond clair (blanc, gris clair) | `logo-full.svg` |
| Fond sombre (noir, bleu fonce) | `logo-full-white.svg` |
| Standalone (sans texte) | `icon.svg` ou `icon-simple.svg` (utilisables sur tous fonds) |

---

## 6. Systeme de couleurs

### 6.1 Couleurs primaires -- Bleu ScreenSnap

La palette bleue constitue le coeur de l'identite. Elle decline 7 nuances pour couvrir tous les besoins d'interface et de communication.

| Nom | Code hex | Apercu | Usage |
|-----|----------|--------|-------|
| **Blue 900** (le plus profond) | `#1e3a8a` | ![#1e3a8a](https://via.placeholder.com/24/1e3a8a/1e3a8a) | Titres, texte sur fond clair, degrade (depart) |
| **Blue 700** | `#1d4ed8` | ![#1d4ed8](https://via.placeholder.com/24/1d4ed8/1d4ed8) | Liens, elements interactifs (hover) |
| **Blue 600** (primaire) | `#2563eb` | ![#2563eb](https://via.placeholder.com/24/2563eb/2563eb) | **Couleur principale** -- boutons, accents, CTA |
| **Blue 500** | `#3b82f6` | ![#3b82f6](https://via.placeholder.com/24/3b82f6/3b82f6) | Etat actif, selection, degrade (fin) |
| **Blue 400** (clair) | `#60a5fa` | ![#60a5fa](https://via.placeholder.com/24/60a5fa/60a5fa) | Icones secondaires, bordures actives |
| **Blue 100** | `#dbeafe` | ![#dbeafe](https://via.placeholder.com/24/dbeafe/dbeafe) | Fonds clairs, badges, tags |
| **Blue 50** | `#eff6ff` | ![#eff6ff](https://via.placeholder.com/24/eff6ff/eff6ff) | Fonds subtils, survol en mode clair |

### 6.2 Couleurs d'accent -- Jaune Snap

L'eclair jaune est l'element distinctif de la marque. Il s'utilise avec parcimonie pour un impact maximal.

| Nom | Code hex | Apercu | Usage |
|-----|----------|--------|-------|
| **Snap Yellow** | `#fbbf24` | ![#fbbf24](https://via.placeholder.com/24/fbbf24/fbbf24) | Eclair du logo, indicateur "snap", notifications |
| **Snap Amber** | `#f59e0b` | ![#f59e0b](https://via.placeholder.com/24/f59e0b/f59e0b) | Etat hover de l'accent jaune |

### 6.3 Couleurs semantiques

Ces couleurs vehiculent un sens fonctionnel precis. Elles correspondent egalement aux boutons feu tricolore de la fenetre macOS.

| Nom | Code hex | Apercu | Usage |
|-----|----------|--------|-------|
| **Success / Vert** | `#28c840` | ![#28c840](https://via.placeholder.com/24/28c840/28c840) | Succes, confirmation, bouton vert feu tricolore |
| **Warning / Jaune** | `#febc2e` | ![#febc2e](https://via.placeholder.com/24/febc2e/febc2e) | Avertissement, bouton jaune feu tricolore |
| **Danger / Rouge** | `#ff3b30` | ![#ff3b30](https://via.placeholder.com/24/ff3b30/ff3b30) | Erreur, bouton rouge feu tricolore, indicateur d'enregistrement |

### 6.4 Couleurs de surface -- Mode clair

| Element | Code hex | Apercu |
|---------|----------|--------|
| Background | `#ffffff` | ![#ffffff](https://via.placeholder.com/24/ffffff/ffffff) |
| Surface secondaire | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/24/f4f4f5/f4f4f5) |
| Surface tertiaire | `#e4e4e7` | ![#e4e4e7](https://via.placeholder.com/24/e4e4e7/e4e4e7) |
| Texte principal | `#18181b` | ![#18181b](https://via.placeholder.com/24/18181b/18181b) |
| Texte secondaire | `#52525b` | ![#52525b](https://via.placeholder.com/24/52525b/52525b) |
| Bordure | `#e4e4e7` | ![#e4e4e7](https://via.placeholder.com/24/e4e4e7/e4e4e7) |

### 6.5 Couleurs de surface -- Mode sombre

| Element | Code hex | Apercu |
|---------|----------|--------|
| Background | `#18181b` | ![#18181b](https://via.placeholder.com/24/18181b/18181b) |
| Surface secondaire | `#27272a` | ![#27272a](https://via.placeholder.com/24/27272a/27272a) |
| Surface tertiaire | `#3f3f46` | ![#3f3f46](https://via.placeholder.com/24/3f3f46/3f3f46) |
| Texte principal | `#fafafa` | ![#fafafa](https://via.placeholder.com/24/fafafa/fafafa) |
| Texte secondaire | `#a1a1aa` | ![#a1a1aa](https://via.placeholder.com/24/a1a1aa/a1a1aa) |
| Bordure | `#3f3f46` | ![#3f3f46](https://via.placeholder.com/24/3f3f46/3f3f46) |

---

## 7. Typographie

### 7.1 Police principale

**SF Pro Display** est la police systeme macOS. Son utilisation renforce l'integration native de ScreenSnap.

```css
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

### 7.2 Police monospace

Pour le code, les chemins de fichiers et les elements techniques :

```css
font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
```

### 7.3 Echelle typographique

| Niveau | Taille | Poids | Line-height | Usage |
|--------|--------|-------|-------------|-------|
| Display | 48px | Bold (700) | 1.1 | Hero, landing page |
| H1 | 36px | Bold (700) | 1.2 | Titres de page |
| H2 | 28px | Semibold (600) | 1.3 | Sections principales |
| H3 | 22px | Semibold (600) | 1.4 | Sous-sections |
| H4 | 18px | Medium (500) | 1.4 | Titres de cartes |
| Body | 16px | Regular (400) | 1.6 | Texte courant |
| Body Small | 14px | Regular (400) | 1.5 | Texte secondaire, descriptions |
| Caption | 12px | Regular (400) | 1.4 | Labels, metadonnees |
| Code | 14px | Regular (400) | 1.5 | Blocs de code, chemins |

### 7.4 Logotype -- Regles typographiques

Le mot-symbole **ScreenSnap** s'ecrit toujours en un seul mot avec un S majuscule pour chaque partie :

- **"Screen"** -- SF Pro Display, **Bold (700)**, couleur Blue 900 (`#1e3a8a`) sur fond clair ou blanc (`#ffffff`) sur fond sombre
- **"Snap"** -- SF Pro Display, **Regular (400)**, meme couleur que "Screen"

> Ne jamais ecrire "Screen Snap", "screensnap", "SCREENSNAP" ou "Screen-Snap". La seule graphie acceptee est **ScreenSnap**.

---

## 8. Specification du degrade

Le degrade bleu signature est utilise sur le fond de l'icone et dans les elements de marque.

### 8.1 Parametres

| Propriete | Valeur |
|-----------|--------|
| Direction | 135 degres (haut-gauche vers bas-droite) |
| Stop 1 (0%) | `#1e3a8a` -- Blue 900 |
| Stop 2 (50%) | `#2563eb` -- Blue 600 |
| Stop 3 (100%) | `#3b82f6` -- Blue 500 |

### 8.2 Implementation CSS

```css
background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
```

### 8.3 Implementation SVG

```xml
<linearGradient id="screensnap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1e3a8a" />
  <stop offset="50%" stop-color="#2563eb" />
  <stop offset="100%" stop-color="#3b82f6" />
</linearGradient>
```

### 8.4 Regles d'utilisation du degrade

- Utiliser **exclusivement** sur les elements de marque (icone, hero, OG image)
- Ne jamais modifier les couleurs ou les positions des stops
- Ne jamais utiliser comme fond de texte sans overlay suffisant pour la lisibilite
- Pour les grands aplats UI, privilegier une couleur unie (Blue 600) plutot que le degrade

---

## 9. Applications & Exemples d'utilisation

### 9.1 Tableau de reference rapide

| Contexte | Fichier a utiliser | Notes |
|----------|-------------------|-------|
| Icone de l'application macOS | `icon.svg` | Exporter en `.icns` via le script de build |
| Site web / README | `logo-full.svg` | Logo horizontal complet sur fond clair |
| Surfaces sombres | `logo-full-white.svg` | Mot-symbole en blanc |
| Barre de menus macOS | `tray-icon.svg` | Template image 22x22 |
| Barre de menus (enregistrement) | `tray-icon-recording.svg` | Point rouge actif |
| Favicon | `icon-monochrome.svg` | Exporter en 32x32 px |
| Open Graph / Social | `icon-simple.svg` | Centre sur fond degrade de marque |
| Petits contextes (< 32px) | `icon-monochrome.svg` | Variante simplifiee |

### 9.2 Icone de l'application

L'icone principale `icon.svg` (1024x1024) est le point d'entree visuel de ScreenSnap. Elle s'exporte en `.icns` pour macOS et contient tous les elements du logo : cadre fenetre, feu tricolore, viseur et eclair jaune, sur fond degrade bleu.

```bash
# Generation de l'icone macOS
pnpm build:icons  # Convertit icon.svg en icon.icns (toutes les tailles requises)
```

### 9.3 Barre de menus macOS

L'icone tray (`tray-icon.svg`) est un **template image** macOS : elle doit etre en noir pur avec transparence, le systeme gere automatiquement l'adaptation aux modes clair et sombre.

Pendant un enregistrement d'ecran, `tray-icon-recording.svg` ajoute un point rouge anime pour indiquer visuellement l'etat d'enregistrement en cours.

### 9.4 Images Open Graph & Reseaux sociaux

Pour les images de partage social (1200x630 pour OG, 1080x1080 pour les posts) :

- Fond : degrade bleu signature (135 degres)
- Logo : `icon-simple.svg` centre
- Texte optionnel : mot-symbole en blanc en dessous de l'icone
- Marge : minimum 10% de la dimension sur chaque bord

### 9.5 Documentation & README

Pour les fichiers de documentation du projet :

- Utiliser `logo-full.svg` en haut du README
- Taille recommandee : 280px de largeur
- Le logo doit etre suivi d'une description concise en texte

```markdown
<p align="center">
  <img src="assets/logo-full.svg" alt="ScreenSnap" width="280" />
</p>
<p align="center">
  Alternative open-source a CleanShot X pour macOS
</p>
```

---

## Annexe -- Tokens CSS

Pour une integration rapide dans le code, voici les tokens CSS correspondant a l'ensemble du systeme :

```css
:root {
  /* Couleurs primaires */
  --color-blue-900: #1e3a8a;
  --color-blue-700: #1d4ed8;
  --color-blue-600: #2563eb;
  --color-blue-500: #3b82f6;
  --color-blue-400: #60a5fa;
  --color-blue-100: #dbeafe;
  --color-blue-50: #eff6ff;

  /* Couleurs d'accent */
  --color-snap-yellow: #fbbf24;
  --color-snap-amber: #f59e0b;

  /* Couleurs semantiques */
  --color-success: #28c840;
  --color-warning: #febc2e;
  --color-danger: #ff3b30;

  /* Surfaces -- Mode clair */
  --color-bg: #ffffff;
  --color-surface-secondary: #f4f4f5;
  --color-surface-tertiary: #e4e4e7;
  --color-text-primary: #18181b;
  --color-text-secondary: #52525b;
  --color-border: #e4e4e7;

  /* Degrade signature */
  --gradient-brand: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);

  /* Typographie */
  --font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'SF Mono', Menlo, Monaco, Consolas, monospace;
}

/* Surfaces -- Mode sombre */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #18181b;
    --color-surface-secondary: #27272a;
    --color-surface-tertiary: #3f3f46;
    --color-text-primary: #fafafa;
    --color-text-secondary: #a1a1aa;
    --color-border: #3f3f46;
  }
}
```

---

> **ScreenSnap** -- Capture d'ecran reimaginee, open-source, pour macOS.
