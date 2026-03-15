import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const sizeConfig = {
  sm: {
    track: 'w-8 h-[18px]',
    thumb: 'w-3.5 h-3.5',
    translate: 'translate-x-[14px]',
  },
  md: {
    track: 'w-10 h-[22px]',
    thumb: 'w-[18px] h-[18px]',
    translate: 'translate-x-[18px]',
  },
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: ToggleProps) {
  const config = sizeConfig[size]

  return (
    <label
      className={[
        'inline-flex items-center gap-3 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          'relative inline-flex shrink-0 items-center rounded-full transition-smooth',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2',
          config.track,
          checked
            ? 'bg-brand-500 dark:bg-brand-600'
            : 'bg-surface-300 dark:bg-surface-600',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block rounded-full bg-white shadow-sm transition-transform duration-200',
            'transform',
            config.thumb,
            checked ? config.translate : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-surface-500 dark:text-surface-400">{description}</span>
          )}
        </div>
      )}
    </label>
  )
}
