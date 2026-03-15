import React, { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { useIPC } from '@renderer/hooks/useIPC'
import { useCaptureStore } from '@renderer/stores/capture.store'
import { Slider } from '@renderer/components/common/Slider'

export function FloatingScreenshot() {
  const { t } = useTranslation()
  const { invoke } = useIPC()
  const setView = useAppStore((state) => state.setView)
  const lastCapturePath = useCaptureStore((state) => state.lastCapturePath)

  const [opacity, setOpacity] = useState(100)
  const [showControls, setShowControls] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setView('hidden')
    void invoke('screensnap:pin:close')
  }, [setView, invoke])

  const handleCopy = useCallback(async () => {
    if (!lastCapturePath) return
    await invoke('screensnap:capture:copy-to-clipboard', lastCapturePath)
    setShowContextMenu(false)
  }, [invoke, lastCapturePath])

  const handleSaveAs = useCallback(async () => {
    if (!lastCapturePath) return
    await invoke('screensnap:capture:save-as', lastCapturePath)
    setShowContextMenu(false)
  }, [invoke, lastCapturePath])

  const handleOpacityChange = useCallback(
    (value: number) => {
      setOpacity(value)
      void invoke('screensnap:pin:set-opacity', value / 100)
    },
    [invoke],
  )

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full window-transparent"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false)
        setShowContextMenu(false)
      }}
      onContextMenu={handleContextMenu}
      onClick={() => setShowContextMenu(false)}
    >
      {/* Image */}
      <div
        className="w-full h-full rounded-lg overflow-hidden shadow-float"
        style={{ opacity: opacity / 100 }}
      >
        {lastCapturePath ? (
          <img
            src={`file://${lastCapturePath}`}
            alt={t('pin.title')}
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center">
            <span className="text-sm text-surface-400">{t('common.loading')}</span>
          </div>
        )}
      </div>

      {/* Controles au survol */}
      {showControls && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Bouton fermer (coin superieur gauche, macOS-style) */}
          <button
            onClick={handleClose}
            className={[
              'pointer-events-auto absolute top-2 left-2',
              'w-4 h-4 rounded-full bg-red-500',
              'hover:bg-red-600 active:bg-red-700',
              'flex items-center justify-center',
              'transition-fast shadow-sm',
              'group',
            ].join(' ')}
            aria-label={t('pin.close')}
          >
            <svg
              className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-red-900/80"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 2l6 6M8 2l-6 6" />
            </svg>
          </button>

          {/* Slider d'opacite (bas) */}
          <div
            className={[
              'pointer-events-auto absolute bottom-2 left-3 right-3',
              'glass rounded-lg px-3 py-2',
              'animate-fade-in',
            ].join(' ')}
          >
            <Slider
              value={opacity}
              min={10}
              max={100}
              step={5}
              label={t('pin.opacity')}
              onChange={handleOpacityChange}
              valueFormatter={(v) => `${v}%`}
            />
          </div>

          {/* Indicateur de redimensionnement (coin inferieur droit) */}
          <div
            className={[
              'pointer-events-auto absolute bottom-0 right-0',
              'w-4 h-4 cursor-nwse-resize',
            ].join(' ')}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              className="absolute bottom-1 right-1 text-surface-400/60"
            >
              <path d="M7 1v6H1" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M7 4v3H4" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
      )}

      {/* Menu contextuel */}
      {showContextMenu && (
        <div
          className={[
            'fixed z-50 py-1 min-w-[140px]',
            'bg-white dark:bg-surface-800',
            'border border-surface-200 dark:border-surface-700',
            'rounded-lg shadow-xl animate-fade-in',
          ].join(' ')}
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => void handleCopy()}
            className="w-full text-left px-3 py-1.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-fast"
          >
            {t('pin.copyImage')}
          </button>
          <button
            onClick={() => void handleSaveAs()}
            className="w-full text-left px-3 py-1.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-fast"
          >
            {t('pin.saveAs')}
          </button>
          <hr className="my-1 border-surface-200 dark:border-surface-700" />
          <button
            onClick={handleClose}
            className="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-fast"
          >
            {t('pin.close')}
          </button>
        </div>
      )}
    </div>
  )
}
