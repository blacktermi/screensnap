import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore, type CaptureFormat } from '@renderer/stores/settings.store'
import { Select } from '@renderer/components/common/Select'
import { Slider } from '@renderer/components/common/Slider'
import { Toggle } from '@renderer/components/common/Toggle'

const FORMAT_OPTIONS: { value: CaptureFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
  { value: 'tiff', label: 'TIFF' },
]

export function CaptureSettings() {
  const { t } = useTranslation()
  const {
    captureFormat,
    captureQuality,
    showCursor,
    copyToClipboard,
    windowShadow,
    retinaResolution,
    playSound,
    updateSetting,
  } = useSettingsStore()

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-6">
        {t('settings.sections.capture')}
      </h3>

      <div className="flex flex-col gap-6">
        {/* Format */}
        <Select
          label={t('settings.capture.format')}
          value={captureFormat}
          options={FORMAT_OPTIONS}
          onChange={(v) => updateSetting('captureFormat', v as CaptureFormat)}
        />

        {/* Qualite */}
        <Slider
          label={t('settings.capture.quality')}
          value={captureQuality}
          min={10}
          max={100}
          step={5}
          onChange={(v) => updateSetting('captureQuality', v)}
          valueFormatter={(v) => `${v}%`}
        />

        {/* Separateur */}
        <hr className="border-surface-200 dark:border-surface-700" />

        {/* Toggles */}
        <Toggle
          checked={showCursor}
          onChange={(v) => updateSetting('showCursor', v)}
          label={t('settings.capture.showCursor')}
        />

        <Toggle
          checked={copyToClipboard}
          onChange={(v) => updateSetting('copyToClipboard', v)}
          label={t('settings.capture.copyToClipboard')}
        />

        <Toggle
          checked={windowShadow}
          onChange={(v) => updateSetting('windowShadow', v)}
          label={t('settings.capture.windowShadow')}
        />

        <Toggle
          checked={retinaResolution}
          onChange={(v) => updateSetting('retinaResolution', v)}
          label={t('settings.capture.retinaResolution')}
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
