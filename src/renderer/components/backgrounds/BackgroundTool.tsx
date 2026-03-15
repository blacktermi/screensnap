import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useIPC } from '@renderer/hooks/useIPC'
import { Button } from '@renderer/components/common/Button'
import { Slider } from '@renderer/components/common/Slider'
import { Select } from '@renderer/components/common/Select'

interface GradientPreset {
  id: string
  name: string
  css: string
}

const GRADIENT_PRESETS: GradientPreset[] = [
  { id: 'ocean', name: 'Ocean', css: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'sunset', name: 'Coucher', css: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'forest', name: 'Foret', css: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { id: 'sky', name: 'Ciel', css: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
  { id: 'midnight', name: 'Minuit', css: 'linear-gradient(135deg, #0c0c1d, #1a1a3e)' },
  { id: 'peach', name: 'Peche', css: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { id: 'aurora', name: 'Aurore', css: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { id: 'fire', name: 'Feu', css: 'linear-gradient(135deg, #f12711, #f5af19)' },
  { id: 'ice', name: 'Glace', css: 'linear-gradient(135deg, #e0eafc, #cfdef3)' },
  { id: 'neon', name: 'Neon', css: 'linear-gradient(135deg, #00f5a0, #00d9f5)' },
  { id: 'royal', name: 'Royal', css: 'linear-gradient(135deg, #141e30, #243b55)' },
  { id: 'candy', name: 'Bonbon', css: 'linear-gradient(135deg, #ff6a95, #ff9a76)' },
]

const SOLID_COLORS = [
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#1a1a1a',
  '#000000',
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#eab308',
  '#a855f7',
  '#ec4899',
  '#06b6d4',
]

const ASPECT_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '16:9', label: '16:9' },
  { value: '16:10', label: '16:10' },
  { value: '3:2', label: '3:2' },
]

export function BackgroundTool() {
  const { t } = useTranslation()
  const { invoke } = useIPC()

  const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'image' | 'none'>(
    'gradient',
  )
  const [padding, setPadding] = useState(40)
  const [aspectRatio, setAspectRatio] = useState('auto')
  const [cornerRadius, setCornerRadius] = useState(12)

  const handleSelectGradient = useCallback((preset: GradientPreset) => {
    setBackgroundType('gradient')
    setSelectedBackground(preset.css)
  }, [])

  const handleSelectSolid = useCallback((color: string) => {
    setBackgroundType('solid')
    setSelectedBackground(color)
  }, [])

  const handleUploadImage = useCallback(async () => {
    const result = await invoke<string | null>('screensnap:backgrounds:choose-image')
    if (result) {
      setBackgroundType('image')
      setSelectedBackground(`url(file://${result})`)
    }
  }, [invoke])

  const handleRemoveBackground = useCallback(() => {
    setBackgroundType('none')
    setSelectedBackground(null)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-100 dark:bg-surface-900">
        <div
          className="relative flex items-center justify-center rounded-2xl transition-all duration-300"
          style={{
            background:
              backgroundType === 'none' || !selectedBackground
                ? 'transparent'
                : backgroundType === 'solid'
                  ? selectedBackground
                  : selectedBackground,
            padding: `${padding}px`,
          }}
        >
          <div
            className="bg-white dark:bg-surface-800 shadow-xl overflow-hidden"
            style={{ borderRadius: `${cornerRadius}px` }}
          >
            <div className="w-80 h-52 bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-400 text-sm">
              Apercu de la capture
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de controles */}
      <div
        className={[
          'p-4 space-y-5',
          'bg-white dark:bg-surface-900',
          'border-t border-surface-200 dark:border-surface-700',
          'max-h-[45vh] overflow-y-auto scrollbar-thin',
        ].join(' ')}
      >
        {/* Degrades */}
        <div>
          <h4 className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-2">
            {t('backgrounds.gradients')}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectGradient(preset)}
                className={[
                  'w-full aspect-square rounded-lg transition-fast',
                  'hover:scale-105 active:scale-95',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
                  selectedBackground === preset.css && backgroundType === 'gradient'
                    ? 'ring-2 ring-brand-500'
                    : 'ring-1 ring-surface-200 dark:ring-surface-700',
                ].join(' ')}
                style={{ background: preset.css }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Couleurs unies */}
        <div>
          <h4 className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-2">
            {t('backgrounds.solidColors')}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {SOLID_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleSelectSolid(color)}
                className={[
                  'w-full aspect-square rounded-lg transition-fast',
                  'hover:scale-105 active:scale-95',
                  selectedBackground === color && backgroundType === 'solid'
                    ? 'ring-2 ring-brand-500'
                    : 'ring-1 ring-surface-200 dark:ring-surface-700',
                ].join(' ')}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => void handleUploadImage()}>
            {t('backgrounds.uploadImage')}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRemoveBackground}>
            {t('backgrounds.noBackground')}
          </Button>
        </div>

        {/* Reglages */}
        <div className="space-y-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <Slider
            label={t('backgrounds.padding')}
            value={padding}
            min={0}
            max={120}
            step={4}
            onChange={setPadding}
            valueFormatter={(v) => `${v}px`}
          />

          <Slider
            label="Rayon des coins"
            value={cornerRadius}
            min={0}
            max={32}
            step={2}
            onChange={setCornerRadius}
            valueFormatter={(v) => `${v}px`}
          />

          <Select
            label={t('backgrounds.aspectRatio')}
            value={aspectRatio}
            options={ASPECT_RATIO_OPTIONS}
            onChange={setAspectRatio}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}
