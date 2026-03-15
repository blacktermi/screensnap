import React from 'react'
import { useAppStore } from '@renderer/stores/app.store'
import { useTheme } from '@renderer/hooks/useTheme'
import { QuickAccessOverlay } from '@renderer/components/overlay/QuickAccessOverlay'
import { AnnotationEditor } from '@renderer/components/editor/AnnotationEditor'
import { SettingsWindow } from '@renderer/components/settings/SettingsWindow'
import { HistoryBrowser } from '@renderer/components/history/HistoryBrowser'
import { FloatingScreenshot } from '@renderer/components/pin/FloatingScreenshot'
import { VideoEditor } from '@renderer/components/video-editor/VideoEditor'

export function App() {
  const currentView = useAppStore((state) => state.currentView)
  useTheme()

  const renderView = () => {
    switch (currentView) {
      case 'overlay':
        return <QuickAccessOverlay />
      case 'editor':
        return <AnnotationEditor />
      case 'settings':
        return <SettingsWindow />
      case 'history':
        return <HistoryBrowser />
      case 'pin':
        return <FloatingScreenshot />
      case 'video-editor':
        return <VideoEditor />
      case 'capture-selection':
        return <CaptureSelectionOverlay />
      case 'hidden':
      default:
        return null
    }
  }

  return <div className="h-screen w-screen overflow-hidden">{renderView()}</div>
}

/**
 * Overlay de selection de zone de capture (plein ecran transparent avec crosshair).
 */
function CaptureSelectionOverlay() {
  const setView = useAppStore((state) => state.setView)

  return (
    <div
      className="window-transparent fixed inset-0 capture-crosshair"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setView('hidden')
        }
      }}
      tabIndex={0}
      role="application"
      aria-label="Zone de capture"
    >
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="glass rounded-xl px-4 py-2 text-sm text-surface-600 dark:text-surface-400 shadow-toolbar">
          Appuyez sur Echap pour annuler
        </div>
      </div>
    </div>
  )
}
