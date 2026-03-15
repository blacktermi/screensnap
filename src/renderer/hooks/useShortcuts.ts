import { useEffect, useCallback, useRef } from 'react'

interface ShortcutHandler {
  keys: string
  handler: () => void
  preventDefault?: boolean
}

/**
 * Parse une combinaison de touches au format Electron en un objet comparable.
 * Ex: "CommandOrControl+Shift+4" -> { ctrl: true, shift: true, key: '4' }
 */
function parseShortcut(shortcut: string) {
  const parts = shortcut.toLowerCase().split('+')
  return {
    ctrl: parts.includes('commandorcontrol') || parts.includes('ctrl') || parts.includes('cmd'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt') || parts.includes('option'),
    meta: parts.includes('meta') || parts.includes('super'),
    key: parts[parts.length - 1],
  }
}

/**
 * Verifie si un evenement clavier correspond a un raccourci defini.
 */
function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parsed = parseShortcut(shortcut)
  const eventKey = event.key.toLowerCase()

  const ctrlOrMeta = event.ctrlKey || event.metaKey

  return (
    parsed.ctrl === ctrlOrMeta &&
    parsed.shift === event.shiftKey &&
    parsed.alt === event.altKey &&
    parsed.key === eventKey
  )
}

/**
 * Hook pour gerer les raccourcis clavier dans les fenetres du renderer.
 *
 * @param shortcuts - Liste des raccourcis et leurs handlers
 * @param enabled - Si false, les raccourcis sont desactives
 */
export function useShortcuts(shortcuts: ShortcutHandler[], enabled = true) {
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      for (const shortcut of shortcutsRef.current) {
        if (matchesShortcut(event, shortcut.keys)) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault()
            event.stopPropagation()
          }
          shortcut.handler()
          break
        }
      }
    },
    [enabled],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleKeyDown])
}

/**
 * Hook pour enregistrer un nouveau raccourci en ecoutant les touches appuyees.
 * Retourne la combinaison de touches au format "Mod+Key".
 */
export function useShortcutRecorder(
  onRecord: (keys: string) => void,
  isRecording: boolean,
) {
  useEffect(() => {
    if (!isRecording) return

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      // Ignorer les touches modificatrices seules
      const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta']
      if (modifierKeys.includes(event.key)) return

      const parts: string[] = []
      if (event.metaKey || event.ctrlKey) parts.push('CommandOrControl')
      if (event.shiftKey) parts.push('Shift')
      if (event.altKey) parts.push('Alt')
      parts.push(event.key.length === 1 ? event.key.toUpperCase() : event.key)

      onRecord(parts.join('+'))
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isRecording, onRecord])
}
