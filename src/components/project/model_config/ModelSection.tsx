import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputNumber, Select as AntSelect, Button } from "antd";

interface ModelParameter {
  label: string;
  type: "number" | "select";
  options?: { label: string; value: string }[]; // For select type
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
    { label: "Max Depth", type: "number", defaultValue: null }, // Null means no limit
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
  ],
};

const ModelConfiguration: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const initialParameters = MODEL_PARAMETERS[model]?.reduce((acc, param) => {
      acc[param.label] = param.defaultValue;
      return acc;
    }, {} as Record<string, any>);
    setParameters(initialParameters || {});
  };

  const handleParameterChange = (label: string, value: any) => {
    setParameters((prev) => ({ ...prev, [label]: value }));
  };

  const handleEvaluate = async () => {
    if (!selectedModel) return;
    setLoading(true);

    try {
      // Replace this with the actual evaluation logic
      console.log("Evaluating model:", selectedModel, "with parameters:", parameters);
      alert("Model evaluated successfully!");
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Error during evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const renderParameters = () => {
    const paramConfig = MODEL_PARAMETERS[selectedModel] || [];
    return paramConfig.map((param) => (
      <div key={param.label} className="space-y-2">
        <label className="block text-sm font-medium">{param.label}</label>
        {param.type === "number" ? (
          <InputNumber
            value={parameters[param.label]}
            onChange={(value) => handleParameterChange(param.label, value)}
            style={{ width: "100%" }}
          />
        ) : (
          <AntSelect
            value={parameters[param.label]}
            onChange={(value) => handleParameterChange(param.label, value)}
            style={{ width: "100%" }}
            options={param.options}
          />
        )}
      </div>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Model</label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger>
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
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedModel} Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">{renderParameters()}</CardContent>
              </Card>
            </div>
          )}

          <Button type="primary" onClick={handleEvaluate} loading={loading} disabled={!selectedModel}>
            Evaluate Model
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConfiguration;
