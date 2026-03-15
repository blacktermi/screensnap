import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { GeneralSettings } from './GeneralSettings'
import { ShortcutSettings } from './ShortcutSettings'
import { CaptureSettings } from './CaptureSettings'

type SettingsSection =
  | 'general'
  | 'shortcuts'
  | 'capture'
  | 'recording'
  | 'annotation'
  | 'overlay'
  | 'ocr'
  | 'history'
  | 'cloud'
  | 'advanced'
  | 'about'

interface SectionItem {
  id: SettingsSection
  labelKey: string
  icon: React.ReactNode
}

const SECTIONS: SectionItem[] = [
  {
    id: 'general',
    labelKey: 'settings.sections.general',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'shortcuts',
    labelKey: 'settings.sections.shortcuts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
      </svg>
    ),
  },
  {
    id: 'capture',
    labelKey: 'settings.sections.capture',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    id: 'recording',
    labelKey: 'settings.sections.recording',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'annotation',
    labelKey: 'settings.sections.annotation',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
  },
  {
    id: 'overlay',
    labelKey: 'settings.sections.overlay',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'ocr',
    labelKey: 'settings.sections.ocr',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: 'history',
    labelKey: 'settings.sections.history',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'cloud',
    labelKey: 'settings.sections.cloud',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
  },
  {
    id: 'advanced',
    labelKey: 'settings.sections.advanced',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    id: 'about',
    labelKey: 'settings.sections.about',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
]

export function SettingsWindow() {
  const { t } = useTranslation()
  const setView = useAppStore((state) => state.setView)
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />
      case 'shortcuts':
        return <ShortcutSettings />
      case 'capture':
        return <CaptureSettings />
      case 'about':
        return <AboutSection />
      default:
        return <PlaceholderSection section={activeSection} />
    }
  }

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950">
      {/* Sidebar */}
      <div
        className={[
          'w-52 shrink-0 flex flex-col',
          'bg-surface-100/80 dark:bg-surface-900/80',
          'border-r border-surface-200 dark:border-surface-700',
          'window-draggable',
        ].join(' ')}
      >
        {/* Header avec bouton fermer */}
        <div className="flex items-center gap-2 px-4 pt-5 pb-3">
          <button
            onClick={() => setView('hidden')}
            className={[
              'window-no-drag w-3 h-3 rounded-full bg-red-500',
              'hover:bg-red-600 active:bg-red-700 transition-fast',
              'group relative',
            ].join(' ')}
            aria-label={t('common.close')}
          >
            <svg
              className="absolute inset-0 w-3 h-3 opacity-0 group-hover:opacity-100 text-red-900/70"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </div>

        <h2 className="px-4 pb-3 text-lg font-semibold text-surface-800 dark:text-surface-100 window-draggable">
          {t('settings.title')}
        </h2>

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-4 overflow-y-auto scrollbar-thin window-no-drag">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={[
                'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg',
                'text-sm text-left transition-fast mb-0.5',
                activeSection === section.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-200/60 dark:hover:bg-surface-800/60',
              ].join(' ')}
            >
              <span className="shrink-0 opacity-80">{section.icon}</span>
              <span>{t(section.labelKey)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">{renderSection()}</div>
    </div>
  )
}

/** Section A propos */
function AboutSection() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-surface-800 dark:text-surface-100">ScreenSnap</h3>
        <p className="text-sm text-surface-500 mt-1">
          {t('settings.about.version')} 0.1.0
        </p>
      </div>
      <p className="text-sm text-surface-600 dark:text-surface-400 max-w-xs">
        {t('settings.about.openSource')}
      </p>
      <p className="text-xs text-surface-400 dark:text-surface-500">
        {t('settings.about.madeBy')}
      </p>
      <p className="text-xs text-surface-400 dark:text-surface-500">
        {t('settings.about.license')}: MIT
      </p>
    </div>
  )
}

/** Section placeholder pour les sections non encore implementees */
function PlaceholderSection({ section }: { section: string }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-2">
      <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-400">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>
      <p className="text-sm text-surface-500 dark:text-surface-400">
        {t(`settings.sections.${section}`)} - Bientot disponible
      </p>
    </div>
  )
}
