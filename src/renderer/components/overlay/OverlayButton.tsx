import React, { useState } from 'react'

interface OverlayButtonProps {
  icon: React.ReactNode
  label: string
  tooltip?: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'danger'
  disabled?: boolean
  className?: string
}

const variantClasses = {
  default: [
    'text-surface-600 dark:text-surface-300',
    'hover:bg-surface-100/80 dark:hover:bg-surface-700/80',
    'active:bg-surface-200/80 dark:active:bg-surface-600/80',
  ].join(' '),
  primary: [
    'text-brand-600 dark:text-brand-400',
    'hover:bg-brand-50/80 dark:hover:bg-brand-900/30',
    'active:bg-brand-100/80 dark:active:bg-brand-800/30',
  ].join(' '),
  danger: [
    'text-red-500 dark:text-red-400',
    'hover:bg-red-50/80 dark:hover:bg-red-900/30',
    'active:bg-red-100/80 dark:active:bg-red-800/30',
  ].join(' '),
}

export function OverlayButton({
  icon,
  label,
  tooltip,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
}: OverlayButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={[
          'window-no-drag',
          'flex flex-col items-center gap-1 px-3 py-2 rounded-lg',
          'transition-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantClasses[variant],
          className,
        ].join(' ')}
        aria-label={tooltip ?? label}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-[10px] font-medium leading-tight">{label}</span>
      </button>

      {tooltip && showTooltip && !disabled && (
        <div
          className={[
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
            'px-2 py-1 text-[10px] font-medium rounded-md whitespace-nowrap',
            'bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900',
            'shadow-md animate-fade-in pointer-events-none',
          ].join(' ')}
          role="tooltip"
        >
          {tooltip}
        </div>
      )}
    </div>
  )
}
