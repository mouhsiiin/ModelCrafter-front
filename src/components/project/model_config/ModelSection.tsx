import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Timer, AlertCircle } from "lucide-react";

interface ModelParameter {
  label: string;
  type: "number" | "select";
  options?: { label: string; value: string }[];
  defaultValue?: number | string | null;
}

const MODEL_PARAMETERS: Record<string, ModelParameter[]> = {
  SVM: [
    { label: "C", type: "number", defaultValue: 1 },
    {
      label: "Kernel",
      type: "select",
      options: [
        { label: "Linear", value: "linear" },
        { label: "Polynomial", value: "poly" },
        { label: "RBF", value: "rbf" },
        { label: "Sigmoid", value: "sigmoid" },
      ],
      defaultValue: "rbf",
    },
    { label: "Gamma", type: "number", defaultValue: 0.1 },
  ],
  RandomForest: [
    { label: "Number of Trees", type: "number", defaultValue: 100 },
    { label: "Max Depth", type: "number", defaultValue: null },
    { label: "Min Samples Split", type: "number", defaultValue: 2 },
    { label: "Min Samples Leaf", type: "number", defaultValue: 1 },
  ],
  LogisticRegression: [
    { label: "C", type: "number", defaultValue: 1 },
    {
      label: "Solver",
      type: "select",
      options: [
        { label: "LBFGS", value: "lbfgs" },
        { label: "Saga", value: "saga" },
        { label: "Liblinear", value: "liblinear" },
      ],
      defaultValue: "lbfgs",
    },
    { label: "Max Iterations", type: "number", defaultValue: 100 },
  ],
  XGBoost: [
    { label: "Learning Rate", type: "number", defaultValue: 0.1 },
    { label: "Max Depth", type: "number", defaultValue: 6 },
    { label: "Number of Estimators", type: "number", defaultValue: 100 },
    { label: "Subsample", type: "number", defaultValue: 1.0 },
  ],
  NeuralNetwork: [
    { label: "Hidden Layer Sizes", type: "number", defaultValue: 100 },
    { label: "Learning Rate", type: "number", defaultValue: 0.001 },
    {
      label: "Activation",
      type: "select",
      options: [
        { label: "ReLU", value: "relu" },
        { label: "Tanh", value: "tanh" },
        { label: "Sigmoid", value: "sigmoid" },
      ],
      defaultValue: "relu",
    },
    { label: "Max Iterations", type: "number", defaultValue: 200 },
  ],
};

const ModelConfiguration: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingTime((prev) => prev + 1);
        // Simulate progress (in real implementation, this would come from backend)
        setProgress((prev) => Math.min(prev + 2, 99));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const initialParameters = MODEL_PARAMETERS[model]?.reduce((acc, param) => {
      acc[param.label] = param.defaultValue;
      return acc;
    }, {} as Record<string, any>);
    setParameters(initialParameters || {});
    setError("");
    setProgress(0);
    setTrainingTime(0);
  };

  const handleParameterChange = (label: string, value: any) => {
    setParameters((prev) => ({ ...prev, [label]: value }));
  };

  const handleTrain = async () => {
    if (!selectedModel) return;
    setIsTraining(true);
    setError("");
    setProgress(0);
    setTrainingTime(0);

    try {
      // Replace with actual API call
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          parameters: parameters,
        }),
      });

      if (!response.ok) {
        throw new Error('Training failed');
      }

      // Simulate training completion after 10 seconds
      setTimeout(() => {
        setIsTraining(false);
        setProgress(100);
      }, 10000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsTraining(false);
      setProgress(0);
    }
  };

  const renderParameters = () => {
    const paramConfig = MODEL_PARAMETERS[selectedModel] || [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paramConfig.map((param) => (
          <div key={param.label} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {param.label}
            </label>
            {param.type === "number" ? (
              <input
                type="number"
                value={parameters[param.label]}
                onChange={(e) => handleParameterChange(param.label, parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <Select
                value={parameters[param.label]}
                onValueChange={(value) => handleParameterChange(param.label, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {param.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Machine Learning Model Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MODEL_PARAMETERS).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedModel && (
            <>
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg">
                    {selectedModel} Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderParameters()}
                </CardContent>
              </Card>

              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isTraining && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Timer className="w-4 h-4" />
                      Training time: {trainingTime}s
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={handleTrain}
                  disabled={isTraining}
                  className="w-full"
                >
                  {isTraining ? 'Training...' : 'Train Model'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelConfiguration;