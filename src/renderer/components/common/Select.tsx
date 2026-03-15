import React, { useState, useRef, useEffect, useCallback } from 'react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export function Select({
  value,
  options,
  onChange,
  label,
  placeholder = 'Choisir...',
  disabled = false,
  size = 'md',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((o) => o.value === value)

  const closeDropdown = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') closeDropdown()
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeDropdown])

  return (
    <div className={['relative', className].join(' ')} ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={[
          'w-full flex items-center justify-between rounded-lg',
          'border border-surface-200 dark:border-surface-700',
          'bg-white dark:bg-surface-800',
          'text-surface-800 dark:text-surface-200',
          'hover:border-surface-300 dark:hover:border-surface-600',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-fast',
          sizeClasses[size],
        ].join(' ')}
      >
        <span className={selectedOption ? '' : 'text-surface-400 dark:text-surface-500'}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          className={[
            'w-4 h-4 text-surface-400 transition-transform duration-150',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={[
            'absolute z-50 w-full mt-1 py-1',
            'bg-white dark:bg-surface-800',
            'border border-surface-200 dark:border-surface-700',
            'rounded-lg shadow-lg',
            'animate-fade-in',
            'max-h-48 overflow-y-auto scrollbar-thin',
          ].join(' ')}
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              disabled={option.disabled}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={[
                'w-full text-left px-3 py-1.5 text-sm transition-fast',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                option.value === value
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                  : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
