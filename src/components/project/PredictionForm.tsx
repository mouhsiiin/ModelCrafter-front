import React, { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "@/services/api";

export interface Column {
  name: string;
  type: "text" | "number";
}

interface PredictionFormProps {
  columns: Column[];
  modelId: number;
}

interface FormData {
  [key: string]: string;
}

interface PredictionResponse {
  predictions: any; // Update this type based on your actual response structure
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  columns,
  modelId,
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
  };

  const prepareFormDataForSubmission = (): Record<string, string | number> => {
    return Object.entries(formData).reduce((acc, [key, value]) => {
      const column = columns.find((col) => col.name === key);
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
      const error = err as AxiosError;
      setError("An error occurred while making the prediction");
    } finally {
      setLoading(false);
    }
  };

  const formatColumnName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " ");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Make a Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.map((column) => (
            <div key={column.name} className="space-y-2">
              <Label htmlFor={column.name}>
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
                placeholder={`Enter ${column.name.replace(/_/g, " ")}`}
                className="w-full"
              />
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Making Prediction..." : "Predict"}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {prediction && (
          <Alert className="mt-4 border border-blue-500 bg-blue-50 shadow-lg rounded-lg">
            <AlertDescription className="flex justify-center items-center p-6">
              <span className="whitespace-pre-wrap text-2xl font-semibold text-blue-600">
                {prediction.predictions}
              </span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
