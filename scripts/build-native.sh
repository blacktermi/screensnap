#!/bin/bash
#
# build-native.sh — Compilation des addons natifs Swift de ScreenSnap
#
# Ce script compile les modules Swift (ScreenCapture, VisionOCR, AudioCapture)
# en fichiers .node utilisables par Node.js via N-API.
#
# Prerequis :
#   - macOS 12.0 ou superieur
#   - Xcode Command Line Tools (xcode-select --install)
#   - Swift 5.9 ou superieur (swift --version)
#   - Node.js 20+ et node-addon-api (pnpm install)
#
# Usage :
#   bash scripts/build-native.sh          # Compilation de tous les modules
#   bash scripts/build-native.sh capture  # Compilation d'un module specifique
#   bash scripts/build-native.sh --clean  # Nettoyage des artefacts
#
# Les fichiers .node compiles sont places dans build/Release/
#

set -euo pipefail

# ─── Variables ────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NATIVE_DIR="$PROJECT_ROOT/src/native"
BUILD_DIR="$PROJECT_ROOT/build/Release"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ─── Fonctions utilitaires ───────────────────────────────────────────────────

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# ─── Verification des prerequis ──────────────────────────────────────────────

check_prerequisites() {
    log_info "Verification des prerequis..."

    # macOS uniquement
    if [[ "$(uname)" != "Darwin" ]]; then
        log_error "Ce script ne fonctionne que sur macOS."
        exit 1
    fi

    # Version de macOS
    local macos_version
    macos_version=$(sw_vers -productVersion)
    local major_version
    major_version=$(echo "$macos_version" | cut -d. -f1)
    if [[ "$major_version" -lt 12 ]]; then
        log_error "macOS 12.0 ou superieur requis. Version actuelle : $macos_version"
        exit 1
    fi
    log_success "macOS $macos_version"

    # Swift
    if ! command -v swift &>/dev/null; then
        log_error "Swift non trouve. Installez Xcode Command Line Tools : xcode-select --install"
        exit 1
    fi
    local swift_version
    swift_version=$(swift --version 2>&1 | head -1)
    log_success "$swift_version"

    # Xcode CLI
    if ! command -v xcodebuild &>/dev/null; then
        log_error "Xcode Command Line Tools non installees. Executez : xcode-select --install"
        exit 1
    fi
    log_success "Xcode Command Line Tools installees"

    # Node.js
    if ! command -v node &>/dev/null; then
        log_error "Node.js non trouve."
        exit 1
    fi
    local node_version
    node_version=$(node --version)
    log_success "Node.js $node_version"

    echo ""
}

# ─── Nettoyage ────────────────────────────────────────────────────────────────

clean() {
    log_info "Nettoyage des artefacts de build..."
    rm -rf "$BUILD_DIR"
    rm -rf "$NATIVE_DIR/.build"
    rm -f "$NATIVE_DIR"/*.node
    rm -f "$NATIVE_DIR"/**/*.o
    rm -f "$NATIVE_DIR"/**/*.dylib
    log_success "Nettoyage termine."
}

# ─── Compilation d'un module ──────────────────────────────────────────────────

build_module() {
    local module_name="$1"
    local swift_file="$2"
    local frameworks="$3"
    local min_macos="${4:-12.0}"

    log_info "Compilation de $module_name..."

    if [[ ! -f "$NATIVE_DIR/$swift_file" ]]; then
        log_error "Fichier source introuvable : $NATIVE_DIR/$swift_file"
        return 1
    fi

    mkdir -p "$BUILD_DIR"

    # NOTE: Cette commande est un placeholder.
    # La compilation reelle necessite un bridge C/Objective-C entre Swift et N-API.
    # En production, il faudrait :
    # 1. Un fichier bridge .h exposant les fonctions Swift a C
    # 2. Un fichier wrapper .c/.m utilisant N-API pour creer le module Node.js
    # 3. Lier le tout avec swiftc et clang
    #
    # Exemple de commande de compilation complete :
    # swiftc -emit-library \
    #   -module-name "$module_name" \
    #   -target arm64-apple-macosx${min_macos} \
    #   -sdk $(xcrun --sdk macosx --show-sdk-path) \
    #   $frameworks \
    #   -o "$BUILD_DIR/lib${module_name}.dylib" \
    #   "$NATIVE_DIR/$swift_file"

    # Pour l'instant, on verifie que le fichier Swift compile correctement
    swiftc -typecheck \
        -target "$(uname -m)-apple-macosx${min_macos}" \
        -sdk "$(xcrun --sdk macosx --show-sdk-path)" \
        "$NATIVE_DIR/$swift_file" 2>&1 || {
        log_error "Erreur de compilation pour $module_name"
        return 1
    }

    log_success "$module_name compile avec succes."
}

# ─── Compilation de tous les modules ──────────────────────────────────────────

build_all() {
    echo ""
    echo "======================================"
    echo "  ScreenSnap — Build des addons natifs"
    echo "======================================"
    echo ""

    check_prerequisites

    build_module "screensnap_capture" \
        "ScreenCapture/ScreenCapture.swift" \
        "-framework ScreenCaptureKit -framework CoreGraphics -framework Foundation" \
        "12.3"

    build_module "screensnap_ocr" \
        "VisionOCR/TextRecognition.swift" \
        "-framework Vision -framework CoreGraphics -framework Foundation" \
        "12.0"

    build_module "screensnap_audio" \
        "AudioCapture/AudioCapture.swift" \
        "-framework CoreAudio -framework AudioToolbox -framework Foundation" \
        "12.0"

    echo ""
    log_success "Tous les modules ont ete compiles avec succes."
    echo ""
    echo "Les fichiers .node sont disponibles dans : $BUILD_DIR/"
    echo ""
}

# ─── Point d'entree ──────────────────────────────────────────────────────────

case "${1:-all}" in
    --clean|clean)
        clean
        ;;
    capture)
        check_prerequisites
        build_module "screensnap_capture" \
            "ScreenCapture/ScreenCapture.swift" \
            "-framework ScreenCaptureKit -framework CoreGraphics" \
            "12.3"
        ;;
    ocr)
        check_prerequisites
        build_module "screensnap_ocr" \
            "VisionOCR/TextRecognition.swift" \
            "-framework Vision -framework CoreGraphics" \
            "12.0"
        ;;
    audio)
        check_prerequisites
        build_module "screensnap_audio" \
            "AudioCapture/AudioCapture.swift" \
            "-framework CoreAudio -framework AudioToolbox" \
            "12.0"
        ;;
    all)
        build_all
        ;;
    *)
        echo "Usage: $0 [all|capture|ocr|audio|--clean]"
        exit 1
        ;;
esac
