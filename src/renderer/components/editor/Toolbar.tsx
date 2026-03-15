import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEditorStore, type AnnotationTool } from '@renderer/stores/editor.store'
import { IconButton } from '@renderer/components/common/IconButton'

interface ToolDefinition {
  id: AnnotationTool
  labelKey: string
  icon: React.ReactNode
  group: 'drawing' | 'text' | 'effects' | 'utility'
}

const TOOLS: ToolDefinition[] = [
  {
    id: 'arrow',
    labelKey: 'editor.tools.arrow',
    group: 'drawing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  },
  {
    id: 'rectangle',
    labelKey: 'editor.tools.rectangle',
    group: 'drawing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 'ellipse',
    labelKey: 'editor.tools.ellipse',
    group: 'drawing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="8" />
      </svg>
    ),
  },
  {
    id: 'line',
    labelKey: 'editor.tools.line',
    group: 'drawing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="4" y1="20" x2="20" y2="4" />
      </svg>
    ),
  },
  {
    id: 'pencil',
    labelKey: 'editor.tools.pencil',
    group: 'drawing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
  },
  {
    id: 'highlighter',
    labelKey: 'editor.tools.highlighter',
    group: 'drawing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l-6 6v3h9l3-3" />
        <path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" />
      </svg>
    ),
  },
  {
    id: 'text',
    labelKey: 'editor.tools.text',
    group: 'text',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: 'counter',
    labelKey: 'editor.tools.counter',
    group: 'text',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="12"
          fontWeight="bold"
        >
          1
        </text>
      </svg>
    ),
  },
  {
    id: 'pixelate',
    labelKey: 'editor.tools.pixelate',
    group: 'effects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="5" height="5" />
        <rect x="9" y="2" width="5" height="5" opacity="0.6" />
        <rect x="16" y="2" width="5" height="5" />
        <rect x="2" y="9" width="5" height="5" opacity="0.6" />
        <rect x="9" y="9" width="5" height="5" />
        <rect x="16" y="9" width="5" height="5" opacity="0.6" />
        <rect x="2" y="16" width="5" height="5" />
        <rect x="9" y="16" width="5" height="5" opacity="0.6" />
        <rect x="16" y="16" width="5" height="5" />
      </svg>
    ),
  },
  {
    id: 'blur',
    labelKey: 'editor.tools.blur',
    group: 'effects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" opacity="0.3" />
        <circle cx="12" cy="12" r="7" opacity="0.5" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: 'spotlight',
    labelKey: 'editor.tools.spotlight',
    group: 'effects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    id: 'crop',
    labelKey: 'editor.tools.crop',
    group: 'utility',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.13 1L6 16a2 2 0 002 2h15" />
        <path d="M1 6.13L16 6a2 2 0 012 2v15" />
      </svg>
    ),
  },
]

interface ToolbarProps {
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function Toolbar({ direction = 'horizontal', className = '' }: ToolbarProps) {
  const { t } = useTranslation()
  const activeTool = useEditorStore((state) => state.activeTool)
  const setTool = useEditorStore((state) => state.setTool)

  const groups = {
    drawing: TOOLS.filter((t) => t.group === 'drawing'),
    text: TOOLS.filter((t) => t.group === 'text'),
    effects: TOOLS.filter((t) => t.group === 'effects'),
    utility: TOOLS.filter((t) => t.group === 'utility'),
  }

  const isVertical = direction === 'vertical'

  const renderGroup = (tools: ToolDefinition[]) => (
    <div className={['flex gap-0.5', isVertical ? 'flex-col' : ''].join(' ')}>
      {tools.map((tool) => (
        <IconButton
          key={tool.id}
          icon={tool.icon}
          tooltip={t(tool.labelKey)}
          tooltipPosition={isVertical ? 'right' : 'bottom'}
          active={activeTool === tool.id}
          onClick={() => setTool(tool.id)}
          variant="ghost"
          size="md"
        />
      ))}
    </div>
  )

  const separator = (
    <div
      className={[
        'shrink-0',
        isVertical
          ? 'w-6 h-px mx-auto bg-surface-200 dark:bg-surface-700'
          : 'h-6 w-px my-auto bg-surface-200 dark:bg-surface-700',
      ].join(' ')}
    />
  )

  return (
    <div
      className={[
        'flex items-center gap-1 p-1.5',
        'bg-white dark:bg-surface-900',
        'border border-surface-200 dark:border-surface-700',
        'rounded-xl shadow-toolbar',
        isVertical ? 'flex-col' : '',
        className,
      ].join(' ')}
      role="toolbar"
      aria-label={t('editor.title')}
    >
      {renderGroup(groups.drawing)}
      {separator}
      {renderGroup(groups.text)}
      {separator}
      {renderGroup(groups.effects)}
      {separator}
      {renderGroup(groups.utility)}
    </div>
  )
}
