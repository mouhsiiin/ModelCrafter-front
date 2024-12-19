import { ReactNode } from 'react'

export interface StepProps {
  title: string
  description?: string
  icon?: ReactNode
  content?: ReactNode
}

export interface StepperProps {
  steps: StepProps[]
  currentStep: number
  onStepChange?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showStepNumbers?: boolean
  allowClickableSteps?: boolean
}

