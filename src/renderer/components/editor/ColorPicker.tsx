import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  recentColors?: string[]
  className?: string
}

const PRESET_COLORS = [
  '#ff3b30', // Rouge
  '#ff9500', // Orange
  '#ffcc00', // Jaune
  '#34c759', // Vert
  '#007aff', // Bleu
  '#5856d6', // Indigo
  '#af52de', // Violet
  '#ff2d55', // Rose
  '#000000', // Noir
  '#8e8e93', // Gris
  '#ffffff', // Blanc
  '#00c7be', // Turquoise
]

export function ColorPicker({
  value,
  onChange,
  recentColors = [],
  className = '',
}: ColorPickerProps) {
  const { t } = useTranslation()
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className={['flex flex-col gap-2', className].join(' ')}>
      <label className="text-xs font-medium text-surface-600 dark:text-surface-400">
        {t('editor.options.color')}
      </label>

      {/* Couleurs predefinies */}
      <div className="grid grid-cols-6 gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={[
              'w-6 h-6 rounded-md border-2 transition-fast',
              'hover:scale-110 active:scale-95',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
              value === color
                ? 'border-brand-500 dark:border-brand-400 ring-2 ring-brand-500/30'
                : 'border-surface-200 dark:border-surface-600',
            ].join(' ')}
            style={{ backgroundColor: color }}
            aria-label={color}
            title={color}
          />
        ))}
      </div>

      {/* Couleurs recentes */}
      {recentColors.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-surface-500 dark:text-surface-500">Récentes</span>
          <div className="flex gap-1.5">
            {recentColors.slice(0, 6).map((color, index) => (
              <button
                key={`${color}-${index}`}
                onClick={() => onChange(color)}
                className={[
                  'w-5 h-5 rounded border transition-fast',
                  'hover:scale-110',
                  value === color
                    ? 'border-brand-500'
                    : 'border-surface-200 dark:border-surface-600',
                ].join(' ')}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Couleur personnalisee */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-fast"
        >
          {showCustom ? 'Masquer' : 'Personnalisée'}
        </button>
        {showCustom && (
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                  onChange(val)
                }
              }}
              className={[
                'w-20 px-2 py-0.5 text-xs font-mono rounded',
                'border border-surface-200 dark:border-surface-700',
                'bg-white dark:bg-surface-800',
                'text-surface-700 dark:text-surface-300',
                'focus:outline-none focus:border-brand-500',
              ].join(' ')}
              placeholder="#000000"
            />
          </div>
        )}
      </div>
    </div>
  )
}
