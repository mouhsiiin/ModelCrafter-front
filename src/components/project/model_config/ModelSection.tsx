import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Timer, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { trainModel } from "@/services/models";

interface ModelParameter {
  label: string;
  type: "number" | "select";
  options?: { label: string; value: string }[];
  defaultValue?: number | string | null;
}

const MODEL_PARAMETERS: Record<string, ModelParameter[]> = {
  // Regression Models
  linear_regression: [
    { label: "fit_intercept", type: "select", options: [
      { label: "True", value: "true" },
      { label: "False", value: "false" }
    ], defaultValue: "true" }
  ],
  ridge_regression: [
    { label: "alpha", type: "number", defaultValue: 1.0 },
    { label: "fit_intercept", type: "select", options: [
      { label: "True", value: "true" },
      { label: "False", value: "false" }
    ], defaultValue: "true" }
  ],
  lasso_regression: [
    { label: "alpha", type: "number", defaultValue: 1.0 },
    { label: "max_iter", type: "number", defaultValue: 1000 }
  ],
  decision_tree_regressor: [
    { label: "max_depth", type: "number", defaultValue: null },
    { label: "min_samples_split", type: "number", defaultValue: 2 },
    { label: "min_samples_leaf", type: "number", defaultValue: 1 }
  ],
  random_forest_regressor: [
    { label: "n_estimators", type: "number", defaultValue: 100 },
    { label: "max_depth", type: "number", defaultValue: null },
    { label: "min_samples_split", type: "number", defaultValue: 2 }
  ],
  svr: [
    { label: "C", type: "number", defaultValue: 1.0 },
    { label: "kernel", type: "select", options: [
      { label: "Linear", value: "linear" },
      { label: "RBF", value: "rbf" },
      { label: "Polynomial", value: "poly" }
    ], defaultValue: "rbf" },
    { label: "gamma", type: "number", defaultValue: 0.1 }
  ],
  
  // Classification Models
  logistic_regression: [
    { label: "C", type: "number", defaultValue: 1.0 },
    { label: "max_iter", type: "number", defaultValue: 100 },
    { label: "solver", type: "select", options: [
      { label: "LBFGS", value: "lbfgs" },
      { label: "Liblinear", value: "liblinear" },
      { label: "Newton-CG", value: "newton-cg" }
    ], defaultValue: "lbfgs" }
  ],
  decision_tree_classifier: [
    { label: "max_depth", type: "number", defaultValue: null },
    { label: "min_samples_split", type: "number", defaultValue: 2 },
    { label: "min_samples_leaf", type: "number", defaultValue: 1 }
  ],
  random_forest_classifier: [
    { label: "n_estimators", type: "number", defaultValue: 100 },
    { label: "max_depth", type: "number", defaultValue: null },
    { label: "min_samples_split", type: "number", defaultValue: 2 }
  ],
  svc: [
    { label: "C", type: "number", defaultValue: 1.0 },
    { label: "kernel", type: "select", options: [
      { label: "Linear", value: "linear" },
      { label: "RBF", value: "rbf" },
      { label: "Polynomial", value: "poly" }
    ], defaultValue: "rbf" },
    { label: "gamma", type: "number", defaultValue: 0.1 }
  ]
};

const ModelConfiguration: React.FC = () => {
  const { projectId } = useParams();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [testSize, setTestSize] = useState<number>(0.2);
  const [scaleFeatures, setScaleFeatures] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [columns, setColumns] = useState<string[]>([]); // Available columns for target selection

  useEffect(() => {
    // Fetch available columns for the project
    const fetchColumns = async () => {
      try {
        const response = await api.get(`/projects/columns/${projectId}`);
        setColumns(response.data);
      } catch (error) {
        setError('Failed to load columns');
      }
    };
    
    if (projectId) {
      fetchColumns();
    }
  }, [projectId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingTime((prev) => prev + 1);
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
    if (!selectedModel || !targetColumn || !projectId) return;
    
    setIsTraining(true);
    setError("");
    setProgress(0);
    setTrainingTime(0);


    
    try {
      const response = await trainModel({
        projectId,
        selectedModel,
        targetColumn,
        parameters,
        testSize,
        scaleFeatures
      });

      setProgress(100);
      // Handle success response
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setProgress(0);
    } finally {
      setIsTraining(false);
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
          {/* Model Selection */}
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
                    {model.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Column Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Column
            </label>
            <Select value={targetColumn} onValueChange={setTargetColumn}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Test Size Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Size (0-1)
            </label>
            <input
              type="number"
              value={testSize}
              onChange={(e) => setTestSize(parseFloat(e.target.value))}
              min="0"
              max="1"
              step="0.1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scale Features Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="scale-features"
              checked={scaleFeatures}
              onCheckedChange={setScaleFeatures}
            />
            <Label htmlFor="scale-features">Scale Features</Label>
          </div>

          {selectedModel && (
            <>
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg">
                    Model Parameters
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
                  disabled={isTraining || !targetColumn}
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