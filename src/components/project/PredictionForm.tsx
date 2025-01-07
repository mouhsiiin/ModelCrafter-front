import React, { useState, ChangeEvent, FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Target, Loader2 } from "lucide-react";
import api from "@/services/api";

export interface Column_pre {
  name: string;
  type: "text" | "number";
}

interface PredictionFormProps {
  columns: Column_pre[] | null;
  modelId?: number;
  target?: string;
}

interface FormData {
  [key: string]: string;
}

interface PredictionResponse {
  predictions: any;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  columns,
  modelId,
  target,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (columnName: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [columnName]: value,
    }));
    // Clear previous prediction when form changes
    setPrediction(null);
  };

  const prepareFormDataForSubmission = (): Record<string, string | number> => {
    return Object.entries(formData).reduce((acc, [key, value]) => {
      const column = columns?.find((col) => col.name === key);
      if (column?.type === "number") {
        acc[key] = value === "" ? "" : Number(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number>);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const formDataForSubmission = prepareFormDataForSubmission();
      const response = await api.post<PredictionResponse>(
        `ml/predict/${modelId}`,
        formDataForSubmission
      );
      setPrediction(response.data);
    } catch (err) {
      setError("An error occurred while making the prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatColumnName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-500" />
          <CardTitle>Prediction Model</CardTitle>
        </div>
        <CardDescription>
          Enter the required information below to get a prediction
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {columns?.map((column) => (
              <div key={column.name} className="space-y-2">
                <Label htmlFor={column.name} className="text-sm font-medium">
                  {formatColumnName(column.name)}
                </Label>
                <Input
                  id={column.name}
                  type={column.type}
                  value={formData[column.name] || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(column.name, e.target.value)
                  }
                  required
                  placeholder={`Enter ${formatColumnName(column.name).toLowerCase()}`}
                  className="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Generate Prediction"
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="border-red-500">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {prediction && (
              <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">
                      Predicted {target ? formatColumnName(target) : "Target"}
                    </h3>
                    <p className="text-2xl font-bold text-blue-700">
                      {prediction.predictions}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;