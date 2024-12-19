import React from 'react'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepProps } from '@/lib/types/stepper'

interface StepComponentProps extends StepProps {
  index: number
  currentStep: number
  isLast: boolean
  orientation: 'horizontal' | 'vertical'
  variant: 'default' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  showStepNumber: boolean
  onClick?: () => void
  isClickable: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

const contentSizeClasses = {
  sm: 'ml-2',
  md: 'ml-3',
  lg: 'ml-4',
}

export const Step: React.FC<StepComponentProps> = ({
  title,
  icon,
  index,
  currentStep,
  isLast,
  orientation,
  variant,
  size,
  showStepNumber,
  onClick,
  isClickable,
}) => {
  const isCompleted = index < currentStep
  const isCurrent = index === currentStep

  const stepClasses = cn(
    'rounded-full flex items-center justify-center transition-colors duration-200',
    sizeClasses[size],
    {
      'bg-primary text-primary-foreground': isCompleted,
      'border-2 border-primary text-primary': isCurrent && variant !== 'ghost',
      'border-2 border-muted text-muted-foreground': !isCompleted && !isCurrent && variant !== 'ghost',
      'bg-muted text-muted-foreground hover:bg-muted/80': variant === 'ghost' && !isCompleted && !isCurrent,
      'cursor-pointer': isClickable,
    }
  )

  const lineClasses = cn(
    'transition-colors duration-200',
    {
      'bg-primary': isCompleted,
      'bg-muted': !isCompleted,
    },
    orientation === 'vertical' ? 'w-px h-full' : 'w-full h-px'
  )

  return (
    <div
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center'
      )}
    >
      <div className="flex items-center" onClick={isClickable ? onClick : undefined}>
        <div className={stepClasses}>
          {isCompleted ? (
            <CheckIcon className={cn('w-4 h-4', { 'w-5 h-5': size === 'lg' })} />
          ) : icon ? (
            icon
          ) : showStepNumber ? (
            <span>{index + 1}</span>
          ) : null}
        </div>
        {!isLast && (
          <div
            className={cn(
              lineClasses,
              orientation === 'vertical' ? 'ml-4 -my-2' : 'mx-2',
              {
                'w-8': size === 'sm' && orientation === 'horizontal',
                'w-12': size === 'md' && orientation === 'horizontal',
                'w-16': size === 'lg' && orientation === 'horizontal',
              }
            )}
          />
        )}
      </div>
      <div className={cn('flex flex-col', contentSizeClasses[size], orientation === 'vertical' ? 'mb-8' : '')}>
        <span className={cn('font-medium', { 'text-primary': isCurrent, 'text-muted-foreground': !isCurrent && !isCompleted })}>
          {title}
        </span>
      </div>
    </div>
  )
}

