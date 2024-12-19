import React from 'react'
import { Step } from './step'
import { StepperProps } from '@/lib/types/stepper'
import { cn } from '@/lib/utils'

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepChange,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  showStepNumbers = true,
  allowClickableSteps = false,
}) => {
  return (
    <div
      className={cn(
        'flex space-x-20',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        orientation === 'horizontal' ? 'overflow-x-auto' : ''
      )}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          {...step}
          index={index}
          currentStep={currentStep}
          isLast={index === steps.length - 1}
          orientation={orientation}
          variant={variant}
          size={size}
          showStepNumber={showStepNumbers}
          onClick={() => allowClickableSteps && onStepChange && onStepChange(index)}
          isClickable={allowClickableSteps}
        />
      ))}
    </div>
  )
}

