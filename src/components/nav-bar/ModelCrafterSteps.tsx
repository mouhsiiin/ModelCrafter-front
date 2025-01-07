import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';


interface NavigationProps {
  steps: any[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  steps,
  currentStep,
  setCurrentStep,
}) => {
  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }if (currentStep === steps.length - 1) {
    //  if in last step, redirect to the dashboard
        window.location.href = "/dashboard";
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Model Crafting Process</CardTitle>
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
          </p>
        </CardHeader>
        
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${index < currentStep ? 'bg-green-500 text-white' : ''}
                    ${index === currentStep ? 'bg-blue-500 text-white' : ''}
                    ${index > currentStep ? 'bg-gray-200 text-gray-500' : ''}
                    ${index <= currentStep ? 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-500' : 'cursor-not-allowed'}
                  `}
                  disabled={index > currentStep}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                  type="button"
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </button>
                
                {index < steps.length - 1 && (
                  <div 
                    className={`h-1 w-full mt-5 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    role="presentation"
                  />
                )}
                
                <span className={`mt-2 text-sm font-medium ${
                  index === currentStep ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          
          {steps[currentStep]?.content}
        </CardContent>

        <CardFooter className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
            variant="default"
            type="button"
          >
            {isLastStep ? "Complete" : "Next"}
            {!isLastStep && <ArrowRight className="w-4 h-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Navigation;