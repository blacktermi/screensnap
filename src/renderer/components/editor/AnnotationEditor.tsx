import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { useEditorStore } from '@renderer/stores/editor.store'
import { useCaptureStore } from '@renderer/stores/capture.store'
import { useIPC } from '@renderer/hooks/useIPC'
import { useShortcuts } from '@renderer/hooks/useShortcuts'
import { Toolbar } from './Toolbar'
import { ToolOptions } from './ToolOptions'
import { Button } from '@renderer/components/common/Button'
import { IconButton } from '@renderer/components/common/IconButton'

export function AnnotationEditor() {
  const { t } = useTranslation()
  const { invoke } = useIPC()
  const setView = useAppStore((state) => state.setView)
  const lastCapturePath = useCaptureStore((state) => state.lastCapturePath)
  const { undoStack, redoStack, undo, redo, clear } = useEditorStore()

  const handleSave = useCallback(async () => {
    await invoke('screensnap:editor:save', lastCapturePath)
    setView('hidden')
  }, [invoke, lastCapturePath, setView])

  const handleCopy = useCallback(async () => {
    await invoke('screensnap:editor:copy')
  }, [invoke])

  const handleExport = useCallback(async () => {
    await invoke('screensnap:editor:export')
  }, [invoke])

  const handleClose = useCallback(() => {
    setView('hidden')
  }, [setView])

  // Raccourcis clavier de l'editeur
  useShortcuts([
    { keys: 'CommandOrControl+z', handler: undo },
    { keys: 'CommandOrControl+Shift+z', handler: redo },
    { keys: 'CommandOrControl+s', handler: () => void handleSave() },
    { keys: 'CommandOrControl+c', handler: () => void handleCopy() },
    { keys: 'Escape', handler: handleClose },
  ])

  return (
    <div className="flex flex-col h-screen bg-surface-50 dark:bg-surface-950">
      {/* Barre superieure : toolbar + actions */}
      <div
        className={[
          'flex items-center justify-between px-3 py-2',
          'bg-white dark:bg-surface-900',
          'border-b border-surface-200 dark:border-surface-700',
          'window-draggable',
        ].join(' ')}
      >
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 window-no-drag">
          <IconButton
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
            }
            tooltip={`${t('editor.actions.undo')} (⌘Z)`}
            onClick={undo}
            disabled={undoStack.length === 0}
            size="sm"
          />
          <IconButton
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
            }
            tooltip={`${t('editor.actions.redo')} (⌘⇧Z)`}
            onClick={redo}
            disabled={redoStack.length === 0}
            size="sm"
          />
        </div>

        {/* Toolbar central */}
        <div className="window-no-drag">
          <Toolbar direction="horizontal" />
        </div>

        {/* Actions de sauvegarde */}
        <div className="flex items-center gap-2 window-no-drag">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            {t('common.close')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void handleCopy()}
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            }
          >
            {t('editor.actions.copy')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => void handleSave()}
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            }
          >
            {t('editor.actions.save')}
          </Button>
        </div>
      </div>

      {/* Zone principale : canvas + options */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas central */}
        <div className="flex-1 flex items-center justify-center bg-surface-100 dark:bg-surface-900 p-4 overflow-auto">
          <div className="relative bg-white dark:bg-surface-800 rounded-lg shadow-capture overflow-hidden">
            {lastCapturePath ? (
              <img
                src={`file://${lastCapturePath}`}
                alt="Capture"
                className="max-w-full max-h-[calc(100vh-140px)] object-contain select-none"
                draggable={false}
              />
            ) : (
              <div className="w-[640px] h-[400px] flex items-center justify-center text-surface-400">
                {t('common.loading')}
              </div>
            )}

            {/* Fabric.js canvas sera monte ici */}
            <canvas
              id="annotation-canvas"
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'auto' }}
            />
          </div>
        </div>

        {/* Panneau d'options lateraux */}
        <ToolOptions />
      </div>

      {/* Barre inferieure : zoom + info */}
      <div
        className={[
          'flex items-center justify-between px-4 py-1.5',
          'bg-white dark:bg-surface-900',
          'border-t border-surface-200 dark:border-surface-700',
          'text-xs text-surface-500',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => void handleExport()}
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-fast"
          >
            {t('editor.actions.export')}
          </button>
          <button
            onClick={clear}
            className="text-surface-400 hover:text-red-500 transition-fast"
          >
            {t('common.reset')}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="tabular-nums">100%</span>
        </div>
      </div>
    </div>
  )
}
