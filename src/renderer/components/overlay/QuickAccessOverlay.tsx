import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { useCaptureStore } from '@renderer/stores/capture.store'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useIPC } from '@renderer/hooks/useIPC'
import { OverlayButton } from './OverlayButton'

export function QuickAccessOverlay() {
  const { t } = useTranslation()
  const { invoke } = useIPC()
  const setView = useAppStore((state) => state.setView)
  const lastCapturePath = useCaptureStore((state) => state.lastCapturePath)
  const { autoClose, autoCloseDelay } = useSettingsStore()

  const [countdown, setCountdown] = useState(autoCloseDelay)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Compte a rebours de fermeture automatique
  useEffect(() => {
    if (!autoClose || isPaused) return

    if (countdown <= 0) {
      setView('hidden')
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, autoClose, isPaused, setView])

  const handleCopy = useCallback(async () => {
    if (!lastCapturePath) return
    await invoke('screensnap:capture:copy-to-clipboard', lastCapturePath)
    setView('hidden')
  }, [invoke, lastCapturePath, setView])

  const handleSave = useCallback(async () => {
    if (!lastCapturePath) return
    await invoke('screensnap:capture:save-to-file', lastCapturePath)
    setView('hidden')
  }, [invoke, lastCapturePath, setView])

  const handleAnnotate = useCallback(() => {
    setView('editor')
  }, [setView])

  const handlePin = useCallback(async () => {
    if (!lastCapturePath) return
    await invoke('screensnap:pin:create', lastCapturePath)
    setView('hidden')
  }, [invoke, lastCapturePath, setView])

  const handleShare = useCallback(async () => {
    if (!lastCapturePath) return
    await invoke('screensnap:cloud:upload', lastCapturePath)
    setView('hidden')
  }, [invoke, lastCapturePath, setView])

  const handleClose = useCallback(() => {
    setView('hidden')
  }, [setView])

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (!lastCapturePath) return
      setIsDragging(true)
      e.dataTransfer.setData('text/plain', lastCapturePath)
      e.dataTransfer.effectAllowed = 'copy'
    },
    [lastCapturePath],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none window-transparent"
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose()
      }}
    >
      <div
        className={[
          'pointer-events-auto absolute bottom-6 right-6',
          'glass rounded-2xl shadow-xl',
          'border border-surface-200/50 dark:border-surface-700/50',
          'animate-slide-up',
          'overflow-hidden',
          isDragging ? 'opacity-70 scale-95' : '',
        ].join(' ')}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Miniature de la capture */}
        <div
          className="window-draggable px-3 pt-3 pb-2 cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          title={t('overlay.dragToMove')}
        >
          <div className="relative w-64 h-36 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800">
            {lastCapturePath ? (
              <img
                src={`file://${lastCapturePath}`}
                alt="Capture"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-surface-400 text-sm">
                {t('common.loading')}
              </div>
            )}

            {/* Bouton fermer */}
            <button
              onClick={handleClose}
              className={[
                'window-no-drag absolute top-1.5 right-1.5',
                'w-5 h-5 flex items-center justify-center rounded-full',
                'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white',
                'transition-fast text-xs',
              ].join(' ')}
              aria-label={t('overlay.close')}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M1 1L7 7M7 1L1 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-around px-2 pb-2">
          <OverlayButton
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            }
            label={t('overlay.copy')}
            tooltip={t('overlay.copyToClipboard')}
            onClick={handleCopy}
            variant="primary"
          />
          <OverlayButton
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            }
            label={t('overlay.save')}
            tooltip={t('overlay.saveToFile')}
            onClick={handleSave}
          />
          <OverlayButton
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            }
            label={t('overlay.annotate')}
            tooltip={t('overlay.openInEditor')}
            onClick={handleAnnotate}
          />
          <OverlayButton
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
            label={t('overlay.pin')}
            tooltip={t('overlay.pinToScreen')}
            onClick={handlePin}
          />
          <OverlayButton
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            }
            label={t('overlay.share')}
            tooltip={t('overlay.shareUpload')}
            onClick={handleShare}
          />
        </div>

        {/* Barre de progression de fermeture automatique */}
        {autoClose && (
          <div className="h-0.5 bg-surface-200/50 dark:bg-surface-700/50">
            <div
              className="h-full bg-brand-500/60 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / autoCloseDelay) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
