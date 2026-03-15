import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { useCaptureStore, type CaptureHistoryItem } from '@renderer/stores/capture.store'
import { useIPC } from '@renderer/hooks/useIPC'
import { Button } from '@renderer/components/common/Button'
import { IconButton } from '@renderer/components/common/IconButton'

type HistoryFilter = 'all' | 'screenshots' | 'videos' | 'gifs'

interface ContextMenuState {
  x: number
  y: number
  item: CaptureHistoryItem
}

export function HistoryBrowser() {
  const { t } = useTranslation()
  const { invoke } = useIPC()
  const setView = useAppStore((state) => state.setView)
  const { captureHistory, removeFromHistory } = useCaptureStore()

  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const filteredItems = useMemo(() => {
    let items = captureHistory

    // Filtre par type
    if (filter === 'screenshots') {
      items = items.filter(
        (item) => item.type === 'area' || item.type === 'window' || item.type === 'fullscreen',
      )
    }
    // videos et gifs seront filtres quand les types seront disponibles

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter((item) => item.path.toLowerCase().includes(query))
    }

    return items
  }, [captureHistory, filter, searchQuery])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, item: CaptureHistoryItem) => {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY, item })
    },
    [],
  )

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  const handleOpen = useCallback(
    async (item: CaptureHistoryItem) => {
      await invoke('screensnap:history:open', item.path)
      closeContextMenu()
    },
    [invoke, closeContextMenu],
  )

  const handleAnnotate = useCallback(
    (item: CaptureHistoryItem) => {
      useCaptureStore.setState({ lastCapturePath: item.path })
      setView('editor')
      closeContextMenu()
    },
    [setView, closeContextMenu],
  )

  const handleDelete = useCallback(
    async (item: CaptureHistoryItem) => {
      removeFromHistory(item.id)
      await invoke('screensnap:history:delete', item.id)
      closeContextMenu()
    },
    [removeFromHistory, invoke, closeContextMenu],
  )

  const handleCopyPath = useCallback(
    async (item: CaptureHistoryItem) => {
      await invoke('screensnap:clipboard:write-text', item.path)
      closeContextMenu()
    },
    [invoke, closeContextMenu],
  )

  const tabs: { key: HistoryFilter; labelKey: string }[] = [
    { key: 'all', labelKey: 'history.tabs.all' },
    { key: 'screenshots', labelKey: 'history.tabs.screenshots' },
    { key: 'videos', labelKey: 'history.tabs.videos' },
    { key: 'gifs', labelKey: 'history.tabs.gifs' },
  ]

  return (
    <div
      className="flex flex-col h-screen bg-surface-50 dark:bg-surface-950"
      onClick={closeContextMenu}
    >
      {/* Header */}
      <div
        className={[
          'flex items-center justify-between px-4 py-3',
          'bg-white dark:bg-surface-900',
          'border-b border-surface-200 dark:border-surface-700',
          'window-draggable',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          {/* Bouton fermer */}
          <button
            onClick={() => setView('hidden')}
            className={[
              'window-no-drag w-3 h-3 rounded-full bg-red-500',
              'hover:bg-red-600 transition-fast',
            ].join(' ')}
            aria-label={t('common.close')}
          />

          <h2 className="text-base font-semibold text-surface-800 dark:text-surface-100">
            {t('history.title')}
          </h2>
        </div>

        {/* Barre de recherche */}
        <div className="window-no-drag relative w-52">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('history.search')}
            className={[
              'w-full pl-8 pr-3 py-1.5 text-sm rounded-lg',
              'bg-surface-100 dark:bg-surface-800',
              'text-surface-700 dark:text-surface-300',
              'placeholder:text-surface-400 dark:placeholder:text-surface-500',
              'border border-transparent',
              'focus:outline-none focus:border-brand-500/50 focus:bg-white dark:focus:bg-surface-800',
              'transition-fast',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Onglets de filtre */}
      <div className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={[
              'px-3 py-1 text-xs font-medium rounded-md transition-fast',
              filter === tab.key
                ? 'bg-brand-500 text-white'
                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
            ].join(' ')}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Grille de captures */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-surface-400"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
              {t('history.empty')}
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {t('history.emptyDescription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={[
                  'group relative rounded-xl overflow-hidden cursor-pointer',
                  'bg-white dark:bg-surface-800',
                  'border border-surface-200 dark:border-surface-700',
                  'hover:border-brand-400 dark:hover:border-brand-500',
                  'shadow-sm hover:shadow-md transition-all duration-200',
                ].join(' ')}
                onClick={() => void handleOpen(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                {/* Miniature */}
                <div className="aspect-video bg-surface-100 dark:bg-surface-900 overflow-hidden">
                  {item.thumbnailPath ? (
                    <img
                      src={`file://${item.thumbnailPath}`}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Badge de type */}
                <div className="absolute top-2 left-2">
                  <span
                    className={[
                      'inline-block px-1.5 py-0.5 text-[10px] font-medium rounded',
                      'bg-black/50 text-white backdrop-blur-sm',
                    ].join(' ')}
                  >
                    {item.type.toUpperCase()}
                  </span>
                </div>

                {/* Actions au survol */}
                <div
                  className={[
                    'absolute top-2 right-2 flex gap-1',
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                  ].join(' ')}
                >
                  <IconButton
                    icon={
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    }
                    size="sm"
                    variant="filled"
                    tooltip={t('history.delete')}
                    onClick={(e) => {
                      e.stopPropagation()
                      void handleDelete(item)
                    }}
                  />
                </div>

                {/* Info */}
                <div className="px-2.5 py-2">
                  <p className="text-[10px] text-surface-400 dark:text-surface-500 truncate">
                    {new Date(item.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-[10px] text-surface-400 dark:text-surface-500">
                    {item.dimensions.width} x {item.dimensions.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu contextuel */}
      {contextMenu && (
        <div
          className={[
            'fixed z-50 py-1 min-w-[160px]',
            'bg-white dark:bg-surface-800',
            'border border-surface-200 dark:border-surface-700',
            'rounded-lg shadow-xl',
            'animate-fade-in',
          ].join(' ')}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { label: t('history.open'), handler: () => void handleOpen(contextMenu.item) },
            {
              label: t('history.annotate'),
              handler: () => handleAnnotate(contextMenu.item),
            },
            {
              label: t('history.copyPath'),
              handler: () => void handleCopyPath(contextMenu.item),
            },
            { separator: true },
            {
              label: t('history.delete'),
              handler: () => void handleDelete(contextMenu.item),
              danger: true,
            },
          ].map((entry, index) =>
            'separator' in entry ? (
              <hr
                key={index}
                className="my-1 border-surface-200 dark:border-surface-700"
              />
            ) : (
              <button
                key={index}
                onClick={() => entry.handler()}
                className={[
                  'w-full text-left px-3 py-1.5 text-sm transition-fast',
                  'danger' in entry && entry.danger
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700',
                ].join(' ')}
              >
                {entry.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
