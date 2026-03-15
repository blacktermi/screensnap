import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@renderer/stores/app.store'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useIPC } from '@renderer/hooks/useIPC'
import { Select } from '@renderer/components/common/Select'
import { Toggle } from '@renderer/components/common/Toggle'
import { Button } from '@renderer/components/common/Button'

const LANGUAGE_OPTIONS = [
  { value: 'fr', label: 'Francais' },
  { value: 'en', label: 'English' },
]

const THEME_OPTIONS = [
  { value: 'light', label: '' }, // Labels set via translation
  { value: 'dark', label: '' },
  { value: 'system', label: '' },
]

export function GeneralSettings() {
  const { t, i18n } = useTranslation()
  const { invoke } = useIPC()
  const { theme, language, setTheme, setLanguage } = useAppStore()
  const {
    savePath,
    launchAtLogin,
    checkUpdates,
    playSound,
    updateSetting,
  } = useSettingsStore()

  const themeOptions = THEME_OPTIONS.map((opt) => ({
    ...opt,
    label: t(`settings.general.theme${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`),
  }))

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang)
      void i18n.changeLanguage(lang)
    },
    [setLanguage, i18n],
  )

  const handleChoosePath = useCallback(async () => {
    const result = await invoke<string | null>('screensnap:settings:choose-save-path')
    if (result) {
      updateSetting('savePath', result)
    }
  }, [invoke, updateSetting])

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-6">
        {t('settings.sections.general')}
      </h3>

      <div className="flex flex-col gap-6">
        {/* Langue */}
        <Select
          label={t('settings.general.language')}
          value={language}
          options={LANGUAGE_OPTIONS}
          onChange={handleLanguageChange}
        />

        {/* Theme */}
        <Select
          label={t('settings.general.theme')}
          value={theme}
          options={themeOptions}
          onChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
        />

        {/* Emplacement de sauvegarde */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-surface-600 dark:text-surface-400">
            {t('settings.general.defaultSaveLocation')}
          </label>
          <div className="flex items-center gap-2">
            <div
              className={[
                'flex-1 px-3 py-1.5 text-sm rounded-lg truncate',
                'bg-surface-100 dark:bg-surface-800',
                'text-surface-600 dark:text-surface-400',
                'border border-surface-200 dark:border-surface-700',
              ].join(' ')}
              title={savePath}
            >
              {savePath}
            </div>
            <Button variant="secondary" size="sm" onClick={() => void handleChoosePath()}>
              {t('settings.general.choosePath')}
            </Button>
          </div>
        </div>

        {/* Separateur */}
        <hr className="border-surface-200 dark:border-surface-700" />

        {/* Toggles */}
        <Toggle
          checked={launchAtLogin}
          onChange={(v) => updateSetting('launchAtLogin', v)}
          label={t('settings.general.launchAtLogin')}
        />

        <Toggle
          checked={checkUpdates}
          onChange={(v) => updateSetting('checkUpdates', v)}
          label={t('settings.general.checkUpdates')}
        />

        <Toggle
          checked={playSound}
          onChange={(v) => updateSetting('playSound', v)}
          label={t('settings.general.playSound')}
        />
      </div>
    </div>
  )
}
