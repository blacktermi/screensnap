import React from 'react'

interface SliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  valueFormatter?: (value: number) => string
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueFormatter,
  onChange,
  disabled = false,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100
  const displayValue = valueFormatter ? valueFormatter(value) : String(value)

  return (
    <div className={['flex flex-col gap-1.5', className].join(' ')}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="text-surface-600 dark:text-surface-400 font-medium">{label}</span>
          )}
          {showValue && (
            <span className="text-surface-500 dark:text-surface-500 tabular-nums">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center h-5">
        <div className="absolute inset-x-0 h-1 rounded-full bg-surface-200 dark:bg-surface-700" />
        <div
          className="absolute left-0 h-1 rounded-full bg-brand-500 dark:bg-brand-400"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={[
            'relative w-full h-5 appearance-none bg-transparent cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-webkit-slider-thumb]:active:scale-95',
          ].join(' ')}
        />
      </div>
    </div>
  )
}
