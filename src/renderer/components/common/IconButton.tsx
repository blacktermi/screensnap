import React, { useState, useRef, useEffect } from 'react'

type IconButtonSize = 'sm' | 'md' | 'lg'
type IconButtonVariant = 'ghost' | 'filled' | 'outline'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  size?: IconButtonSize
  variant?: IconButtonVariant
  active?: boolean
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-7 h-7 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-10 h-10 text-lg',
}

const variantClasses: Record<IconButtonVariant, { base: string; active: string }> = {
  ghost: {
    base: 'bg-transparent text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200',
    active: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
  },
  filled: {
    base: 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700',
    active: 'bg-brand-500 text-white dark:bg-brand-600',
  },
  outline: {
    base: 'bg-transparent border border-surface-200 text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800',
    active: 'border-brand-500 bg-brand-50 text-brand-600 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-400',
  },
}

const tooltipPositionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function IconButton({
  icon,
  tooltip,
  tooltipPosition = 'top',
  size = 'md',
  variant = 'ghost',
  active = false,
  disabled,
  className = '',
  ...props
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 500)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShowTooltip(false)
  }

  const styles = variantClasses[variant]

  return (
    <div className="relative inline-flex">
      <button
        className={[
          'inline-flex items-center justify-center rounded-lg transition-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          active ? styles.active : styles.base,
          className,
        ].join(' ')}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {icon}
      </button>

      {tooltip && showTooltip && !disabled && (
        <div
          className={[
            'absolute z-50 pointer-events-none',
            'px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap',
            'bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900',
            'shadow-md animate-fade-in',
            tooltipPositionClasses[tooltipPosition],
          ].join(' ')}
          role="tooltip"
        >
          {tooltip}
        </div>
      )}
    </div>
  )
}
