import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEditorStore, type AnnotationTool } from '@renderer/stores/editor.store'
import { ColorPicker } from './ColorPicker'
import { Slider } from '@renderer/components/common/Slider'
import { Select } from '@renderer/components/common/Select'

const FONT_OPTIONS = [
  { value: '-apple-system, BlinkMacSystemFont, sans-serif', label: 'System' },
  { value: 'SF Mono, Menlo, monospace', label: 'Monospace' },
  { value: 'Georgia, serif', label: 'Serif' },
  { value: 'Helvetica Neue, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Futura, sans-serif', label: 'Futura' },
]

/** Outils qui utilisent l'epaisseur du trait */
const STROKE_TOOLS: AnnotationTool[] = [
  'arrow',
  'rectangle',
  'ellipse',
  'line',
  'pencil',
  'highlighter',
]

/** Outils qui utilisent les options de texte */
const TEXT_TOOLS: AnnotationTool[] = ['text', 'counter']

/** Outils d'effets */
const EFFECT_TOOLS: AnnotationTool[] = ['blur', 'pixelate', 'spotlight']

export function ToolOptions() {
  const { t } = useTranslation()
  const {
    activeTool,
    color,
    strokeWidth,
    fontSize,
    fontFamily,
    opacity,
    blurIntensity,
    pixelSize,
    setColor,
    setStrokeWidth,
    setFontSize,
    setFontFamily,
    setOpacity,
    setBlurIntensity,
    setPixelSize,
  } = useEditorStore()

  const showStroke = STROKE_TOOLS.includes(activeTool)
  const showText = TEXT_TOOLS.includes(activeTool)
  const showEffects = EFFECT_TOOLS.includes(activeTool)

  return (
    <div
      className={[
        'flex flex-col gap-4 p-3',
        'bg-white dark:bg-surface-900',
        'border-l border-surface-200 dark:border-surface-700',
        'w-56 overflow-y-auto scrollbar-thin',
      ].join(' ')}
    >
      {/* Couleur — toujours visible sauf pour les effets */}
      {!showEffects && activeTool !== 'crop' && <ColorPicker value={color} onChange={setColor} />}

      {/* Epaisseur du trait */}
      {showStroke && (
        <Slider
          label={t('editor.options.strokeWidth')}
          value={strokeWidth}
          min={1}
          max={20}
          step={1}
          onChange={setStrokeWidth}
          valueFormatter={(v) => `${v}px`}
        />
      )}

      {/* Options de texte */}
      {showText && (
        <>
          <Slider
            label={t('editor.options.fontSize')}
            value={fontSize}
            min={8}
            max={72}
            step={1}
            onChange={setFontSize}
            valueFormatter={(v) => `${v}px`}
          />
          <Select
            label={t('editor.options.fontFamily')}
            value={fontFamily}
            options={FONT_OPTIONS}
            onChange={setFontFamily}
            size="sm"
          />
        </>
      )}

      {/* Options d'effets */}
      {activeTool === 'blur' && (
        <Slider
          label={t('editor.options.blurIntensity')}
          value={blurIntensity}
          min={1}
          max={30}
          step={1}
          onChange={setBlurIntensity}
          valueFormatter={(v) => `${v}px`}
        />
      )}

      {activeTool === 'pixelate' && (
        <Slider
          label={t('editor.options.pixelSize')}
          value={pixelSize}
          min={2}
          max={30}
          step={1}
          onChange={setPixelSize}
          valueFormatter={(v) => `${v}px`}
        />
      )}

      {/* Opacite — disponible pour tous sauf crop */}
      {activeTool !== 'crop' && (
        <Slider
          label={t('editor.options.opacity')}
          value={Math.round(opacity * 100)}
          min={10}
          max={100}
          step={5}
          onChange={(v) => setOpacity(v / 100)}
          valueFormatter={(v) => `${v}%`}
        />
      )}
    </div>
  )
}
