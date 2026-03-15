import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useShortcutRecorder } from '@renderer/hooks/useShortcuts'
import { Button } from '@renderer/components/common/Button'

interface ShortcutEntry {
  action: string
  labelKey: string
}

const SHORTCUT_ENTRIES: ShortcutEntry[] = [
  { action: 'captureArea', labelKey: 'settings.shortcuts.captureArea' },
  { action: 'captureWindow', labelKey: 'settings.shortcuts.captureWindow' },
  { action: 'captureFullscreen', labelKey: 'settings.shortcuts.captureFullscreen' },
  { action: 'captureScrolling', labelKey: 'settings.shortcuts.captureScrolling' },
  { action: 'capturePreviousArea', labelKey: 'settings.shortcuts.previousArea' },
  { action: 'recordScreen', labelKey: 'settings.shortcuts.recordScreen' },
  { action: 'recordGif', labelKey: 'settings.shortcuts.recordGif' },
  { action: 'ocrCapture', labelKey: 'settings.shortcuts.ocrCapture' },
  { action: 'openHistory', labelKey: 'settings.shortcuts.openHistory' },
  { action: 'pinScreenshot', labelKey: 'settings.shortcuts.pinScreenshot' },
]

/**
 * Convertit une combinaison de touches en format affichable macOS.
 * Ex: "CommandOrControl+Shift+4" -> "⌘⇧4"
 */
function formatShortcut(keys: string): string {
  return keys
    .replace(/CommandOrControl/gi, '\u2318')
    .replace(/Ctrl/gi, '\u2303')
    .replace(/Shift/gi, '\u21E7')
    .replace(/Alt|Option/gi, '\u2325')
    .replace(/Meta|Super/gi, '\u2318')
    .replace(/\+/g, '')
}

export function ShortcutSettings() {
  const { t } = useTranslation()
  const { shortcuts, updateShortcut, resetDefaults } = useSettingsStore()
  const [recordingAction, setRecordingAction] = useState<string | null>(null)

  const handleRecord = useCallback(
    (keys: string) => {
      if (!recordingAction) return

      // Verifier les conflits
      const conflict = Object.entries(shortcuts).find(
        ([action, existingKeys]) => action !== recordingAction && existingKeys === keys,
      )

      if (conflict) {
        // On pourrait afficher une notification, pour l'instant on ignore
        console.warn(`Conflit de raccourci avec ${conflict[0]}`)
      }

      updateShortcut(recordingAction, keys)
      setRecordingAction(null)
    },
    [recordingAction, shortcuts, updateShortcut],
  )

  useShortcutRecorder(handleRecord, recordingAction !== null)

  const handleStartRecording = (action: string) => {
    setRecordingAction(action)
  }

  const handleCancelRecording = () => {
    setRecordingAction(null)
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
          {t('settings.shortcuts.title')}
        </h3>
        <Button variant="ghost" size="sm" onClick={resetDefaults}>
          {t('settings.shortcuts.resetDefaults')}
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {SHORTCUT_ENTRIES.map((entry) => {
          const isRecording = recordingAction === entry.action
          const currentKeys = shortcuts[entry.action] ?? ''

          return (
            <div
              key={entry.action}
              className={[
                'flex items-center justify-between px-3 py-2.5 rounded-lg',
                'transition-fast',
                isRecording
                  ? 'bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500/30'
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800/50',
              ].join(' ')}
            >
              <span className="text-sm text-surface-700 dark:text-surface-300">
                {t(entry.labelKey)}
              </span>

              {isRecording ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-500 dark:text-brand-400 animate-pulse-ring">
                    {t('settings.shortcuts.pressKeys')}
                  </span>
                  <button
                    onClick={handleCancelRecording}
                    className="text-xs text-surface-400 hover:text-surface-600 transition-fast"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartRecording(entry.action)}
                  className={[
                    'px-2.5 py-1 rounded-md text-xs font-mono',
                    'bg-surface-100 dark:bg-surface-800',
                    'text-surface-600 dark:text-surface-300',
                    'border border-surface-200 dark:border-surface-700',
                    'hover:border-brand-400 hover:text-brand-600',
                    'dark:hover:border-brand-500 dark:hover:text-brand-400',
                    'transition-fast cursor-pointer',
                    'min-w-[80px] text-center',
                  ].join(' ')}
                  title={t('settings.shortcuts.clickToRecord')}
                >
                  {formatShortcut(currentKeys)}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
