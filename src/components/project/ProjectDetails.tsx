import { useState } from 'react';
import { Upload, ChartNetwork, Gauge, Database, Cog } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Stepper } from '../ui/stepper';
        

export const ProjectDetails = () => {
  
  const [currentStep, setCurrentStep] = useState(0)
  //const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  //const [variant, setVariant] = useState<'default' | 'outline' | 'ghost'>('default')
  //const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [showStepNumbers, setShowStepNumbers] = useState(true)
  const [allowClickableSteps, setAllowClickableSteps] = useState(false)

  const [activeSection, setActiveSection] = useState('upload');

  const steps = [
    { title: 'Data Upload', description: 'Upload your data', icon: <Upload className="w-4 h-4" />},
    { title: 'Data Preparation', description: 'Prepare your data', icon: <Database className="w-4 h-4" />},
    { title: 'Visualization', description: 'Add payment method', icon: <ChartNetwork className="w-4 h-4" />},
    { title: 'Build Model', description: 'Add a your build model', icon: <Cog className='w-4 h-4' />},
    { title: 'Evaluation', description: 'Complete setup', icon: <Gauge className="w-4 h-4" />},
  ]

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const Navigation = () => (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Stepper Example</CardTitle>
        </CardHeader>
        <CardContent>
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            orientation='horizontal'
            variant='outline'
            size='md'
            showStepNumbers={showStepNumbers}
            allowClickableSteps={allowClickableSteps}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const DataUploadSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">
            Drag and drop your dataset here, or click to select files
          </p>
          <p className="text-sm text-muted-foreground">
            Supported formats: CSV, JSON (max 100MB)
          </p>
          <Button className="mt-4">Select File</Button>
        </div>
      </CardContent>
    </Card>
  );

  const DataPreparationSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Data Preparation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No dataset selected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preprocessing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Handle Missing Values
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remove">Remove rows</SelectItem>
                    <SelectItem value="mean">Fill with mean</SelectItem>
                    <SelectItem value="median">Fill with median</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Feature Scaling
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scaling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="minmax">Min-Max Scaling</SelectItem>
                    <SelectItem value="standard">Standard Scaling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const AnalysisSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Algorithm Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Algorithm Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Regression</SelectItem>
                    <SelectItem value="tree">Decision Tree</SelectItem>
                    <SelectItem value="forest">Random Forest</SelectItem>
                    <SelectItem value="svm">SVM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parameters
                </label>
                <Textarea 
                  placeholder="Algorithm parameters in JSON format"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No analysis results yet</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const SettingsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            API Endpoint
          </label>
          <Input 
            type="text" 
            placeholder="http://localhost:8000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Maximum File Size (MB)
          </label>
          <Input 
            type="number" 
            defaultValue="100"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">ML Analysis Dashboard</h1>
      <Navigation />
      <div className="mt-6">
        {activeSection === 'upload' && <DataUploadSection />}
        {activeSection === 'prepare' && <DataPreparationSection />}
        {activeSection === 'analyze' && <AnalysisSection />}
        {activeSection === 'settings' && <SettingsSection />}
      </div>
    </div>
  );
};
function setCurrentStep(arg0: (prev: any) => number) {
  throw new Error('Function not implemented.');
}

