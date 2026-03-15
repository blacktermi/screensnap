import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { useIPC } from '@renderer/hooks/useIPC'
import { Button } from '@renderer/components/common/Button'
import { Slider } from '@renderer/components/common/Slider'
import { Select } from '@renderer/components/common/Select'
import { IconButton } from '@renderer/components/common/IconButton'

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Basse (720p)' },
  { value: 'medium', label: 'Moyenne (1080p)' },
  { value: 'high', label: 'Haute (1440p)' },
  { value: 'lossless', label: 'Sans perte' },
]

const SPEED_OPTIONS = [
  { value: '0.25', label: '0.25x' },
  { value: '0.5', label: '0.5x' },
  { value: '1', label: '1x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
]

export function VideoEditor() {
  const { t } = useTranslation()
  const { invoke } = useIPC()
  const setView = useAppStore((state) => state.setView)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [quality, setQuality] = useState('high')
  const [speed, setSpeed] = useState('1')
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(100)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(30) // Duree en secondes (sera dynamique)
  const [isExporting, setIsExporting] = useState(false)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      await invoke('screensnap:video:export', {
        trimStart: (trimStart / 100) * duration,
        trimEnd: (trimEnd / 100) * duration,
        quality,
        speed: parseFloat(speed),
        volume: isMuted ? 0 : volume,
      })
    } finally {
      setIsExporting(false)
    }
  }, [invoke, trimStart, trimEnd, duration, quality, speed, isMuted, volume])

  return (
    <div className="flex flex-col h-screen bg-surface-950">
      {/* Header */}
      <div
        className={[
          'flex items-center justify-between px-4 py-2',
          'bg-surface-900 border-b border-surface-700',
          'window-draggable',
        ].join(' ')}
      >
        <div className="flex items-center gap-3 window-no-drag">
          <button
            onClick={() => setView('hidden')}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-fast"
            aria-label={t('common.close')}
          />
          <h2 className="text-sm font-semibold text-surface-100">{t('video.title')}</h2>
        </div>

        <div className="flex items-center gap-2 window-no-drag">
          <Button
            variant="primary"
            size="sm"
            onClick={() => void handleExport()}
            loading={isExporting}
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            }
          >
            {isExporting ? t('video.exporting') : t('video.export')}
          </Button>
        </div>
      </div>

      {/* Zone de preview */}
      <div className="flex-1 flex items-center justify-center bg-black p-4">
        <div className="relative max-w-full max-h-full aspect-video bg-surface-900 rounded-lg flex items-center justify-center">
          <div className="text-surface-500 text-sm">{t('common.loading')}</div>

          {/* Overlay play/pause */}
          <button
            onClick={handlePlayPause}
            className={[
              'absolute inset-0 flex items-center justify-center',
              'bg-transparent hover:bg-black/20 transition-fast',
              'group',
            ].join(' ')}
          >
            <div
              className={[
                'w-14 h-14 rounded-full glass flex items-center justify-center',
                'opacity-0 group-hover:opacity-100 transition-fast',
              ].join(' ')}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="8,4 20,12 8,20" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-3 bg-surface-900 border-t border-surface-700">
        {/* Barre de progression */}
        <div className="relative h-8 bg-surface-800 rounded-lg overflow-hidden mb-2">
          {/* Zone de trim */}
          <div
            className="absolute h-full bg-brand-500/20"
            style={{
              left: `${trimStart}%`,
              width: `${trimEnd - trimStart}%`,
            }}
          />
          {/* Poignee de lecture */}
          <div
            className="absolute top-0 w-0.5 h-full bg-white shadow-lg"
            style={{ left: `${currentTime}%` }}
          />
          {/* Poignees de trim */}
          <div
            className="absolute top-0 w-1 h-full bg-brand-500 cursor-ew-resize hover:bg-brand-400 rounded-l"
            style={{ left: `${trimStart}%` }}
          />
          <div
            className="absolute top-0 w-1 h-full bg-brand-500 cursor-ew-resize hover:bg-brand-400 rounded-r"
            style={{ left: `${trimEnd}%` }}
          />
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <IconButton
              icon={
                isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="8,4 20,12 8,20" />
                  </svg>
                )
              }
              tooltip={isPlaying ? t('video.pause') : t('video.play')}
              onClick={handlePlayPause}
              variant="filled"
              size="md"
            />

            {/* Temps */}
            <span className="text-xs text-surface-400 tabular-nums font-mono">
              {formatTime((currentTime / 100) * duration)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <IconButton
                icon={
                  isMuted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  )
                }
                tooltip={isMuted ? t('video.unmute') : t('video.mute')}
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="sm"
              />
              <div className="w-20">
                <Slider
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={100}
                  onChange={(v) => {
                    setVolume(v)
                    if (v > 0) setIsMuted(false)
                  }}
                  showValue={false}
                />
              </div>
            </div>

            {/* Vitesse */}
            <Select
              value={speed}
              options={SPEED_OPTIONS}
              onChange={setSpeed}
              size="sm"
              className="w-24"
            />

            {/* Qualite */}
            <Select
              value={quality}
              options={QUALITY_OPTIONS}
              onChange={setQuality}
              size="sm"
              className="w-40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
