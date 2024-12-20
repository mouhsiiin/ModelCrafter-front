import { useState } from 'react';
import { Upload, ChartNetwork, Gauge, Database, Cog } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Stepper } from '../ui/stepper';

export const ProjectDetails = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preprocessingOptions, setPreprocessingOptions] = useState({
    missing_values_handling: '',
    handling_duplicates: false,
    scaling_method: '',
    feature_selection: '',
    encoding_method: '',
    data_split: ''
  });

  // Rest of your existing steps and navigation code remains the same
  const steps = [
    { 
      title: 'Upload', 
      icon: <Upload className="w-4 h-4" />
    },
    { 
      title: 'Prepare', 
      icon: <Database className="w-4 h-4" />
    },
    { 
      title: 'Visualize', 
      icon: <ChartNetwork className="w-4 h-4" />
    },
    { 
      title: 'Model', 
      icon: <Cog className="w-4 h-4" />
    },
    { 
      title: 'Evaluate', 
      icon: <Gauge className="w-4 h-4" />
    }
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePreprocessingChange = (option: string, value: string | boolean) => {
    setPreprocessingOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Your existing Navigation component remains the same
  const Navigation = () => (
    <div className="w-full">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Model Crafting Process</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            orientation="horizontal"
            variant="outline"
            size="md"
            showStepNumbers={true}
            allowClickableSteps={true}
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t">
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
              {/* Missing Values Handling (MVH) */}
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Handle Missing Values
                </Label>
                <Select 
                  value={preprocessingOptions.missing_values_handling}
                  onValueChange={(value) => handlePreprocessingChange('missing_values_handling', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remove">Remove rows</SelectItem>
                    <SelectItem value="mean">Fill with mean</SelectItem>
                    <SelectItem value="median">Fill with median</SelectItem>
                    <SelectItem value="mode">Fill with mode</SelectItem>
                    <SelectItem value="constant">Fill with constant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Handle Duplicates</Label>
                <Switch
                  checked={preprocessingOptions.handling_duplicates}
                  onCheckedChange={(checked) => handlePreprocessingChange('handling_duplicates', checked)}
                />
              </div>

    
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Feature Scaling
                </Label>
                <Select
                  value={preprocessingOptions.scaling_method}
                  onValueChange={(value) => handlePreprocessingChange('scaling_method', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scaling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="minmax">Min-Max Scaling</SelectItem>
                    <SelectItem value="standard">Standard Scaling</SelectItem>
                    <SelectItem value="robust">Robust Scaling</SelectItem>
                    <SelectItem value="normalizer">Normalizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

             
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Feature Selection
                </Label>
                <Select
                  value={preprocessingOptions.feature_selection}
                  onValueChange={(value) => handlePreprocessingChange('feature_selection', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feature selection method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="variance">Chi_Square</SelectItem>
                    <SelectItem value="rfe">RFE</SelectItem>
                    <SelectItem value="anova">Anova</SelectItem>
                    <SelectItem value="kbest">Select K Best</SelectItem>
                    <SelectItem value="rfe">Recursive Feature Elimination</SelectItem>
                    <SelectItem value="lasso">Lasso Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Encoding Method
                </Label>
                <Select
                  value={preprocessingOptions.encoding_method}
                  onValueChange={(value) => handlePreprocessingChange('encoding_method', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select encoding method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="label">Label Encoding</SelectItem>
                    <SelectItem value="onehot">One-Hot Encoding</SelectItem>
                    <SelectItem value="ordinal">Ordinal Encoding</SelectItem>
                    <SelectItem value="binary">Binary Encoding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Data Split Ratio
                </Label>
                <Select
                  value={preprocessingOptions.data_split}
                  onValueChange={(value) => handlePreprocessingChange('data_split', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select split ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70-30">70% Train - 30% Test</SelectItem>
                    <SelectItem value="80-20">80% Train - 20% Test</SelectItem>
                    <SelectItem value="90-10">90% Train - 10% Test</SelectItem>
                    <SelectItem value="custom">Custom Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const VisualizationSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chart Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                  <SelectItem value="histogram">Histogram</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Feature: X
                </label>
                <Input type="text" placeholder="Name a the first feature" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Feature: Y
                </label>
                <Input type="text" placeholder="Name a the second feature" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a chart type to preview</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const ModelBuildSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Build Model</CardTitle>
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
                    <SelectItem value="bayesian">Naive Bayes</SelectItem>
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
              <CardTitle className="text-lg">Training Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Train/Test Split
                </label>
                <Input type="number" placeholder="80" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Random Seed
                </label>
                <Input type="number" placeholder="42" /> 
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const EvaluationSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Model Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No evaluation results yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Train model to see results</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <DataUploadSection />;
      case 1:
        return <DataPreparationSection />;
      case 2:
        return <VisualizationSection />;
      case 3:
        return <ModelBuildSection />;
      case 4:
        return <EvaluationSection />;
      default:
        return <DataUploadSection />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">ML Analysis Dashboard</h1>
      <Navigation />
      {renderCurrentSection()}
    </div>
  );
};

export default ProjectDetails;