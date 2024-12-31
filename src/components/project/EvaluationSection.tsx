import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { downloadModel, getModel } from "@/services/models";
import { ModelData } from "@/lib/types/models";
import PredictionForm from "./PredictionForm";
import { Column } from "./PredictionForm";
import ConfusionMatrix from "./confusionMatrix";

interface EvaluationSectionProps {
  projectId: string;
}

const EvaluationSection: React.FC<EvaluationSectionProps> = ({ projectId }) => {
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [columns, setColumns] = useState<Column[] | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const model = await getModel(projectId);
        setModelData(model);

        // Transform feature_names into columns
        const generatedColumns: Column[] = model.feature_names.map(
          (feature) => ({
            name: feature,
            type: "text", // Ensure this matches the union type
          })
        );

        setColumns(generatedColumns);
      } catch (error) {
        console.error("Failed to fetch model:", error);
      }
    };

    fetchModel();
  }, [projectId]);

  if (!modelData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Model Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No evaluation results yet</p>
        </CardContent>
      </Card>
    );
  }

  const { performance_metrics, id } = modelData;
  const metrics = [
    { name: "Accuracy", value: performance_metrics.accuracy },
    { name: "Precision", value: performance_metrics.precision },
    { name: "Recall", value: performance_metrics.recall },
    { name: "F1 Score", value: performance_metrics.f1_score },
  ];

  const reg_metrics = [
    { name: "Mean Squared Error (MSE)", value: performance_metrics.mse },
    { name: "Root Mean Squared Error (RMSE)", value: performance_metrics.rmse },
    { name: "Mean Absolute Error (MAE)", value: performance_metrics.mae },
    { name: "R² Score", value: performance_metrics.r2_score },
  ];

  const handleDownload = async () => {
    try {
      await downloadModel(id);
    } catch (error) {
      console.error("Failed to download model:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Model Evaluation</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-8 h-8" />
          Download Model
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics && metrics.length > 0 && ( 
                  <div>
                    <h3 className="text-md font-bold">
                      Classification Metrics
                    </h3>
                    {metrics.map((metric) => (
                      <div
                        key={metric.name}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                        <span className="text-sm">
                          {metric.value
                            ? `${(metric.value * 100).toFixed(2)}%`
                            : "0%"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {reg_metrics && reg_metrics.length > 0 && (
                  <div>
                    <h3 className="text-md font-bold">Regression Metrics</h3>
                    {reg_metrics.map((metric) => (
                      <div
                        key={metric.name}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                        <span className="text-sm">
                          {metric.value?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {!metrics?.length && !reg_metrics?.length && (
                  <div className="text-sm text-gray-500">
                    No metrics available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {modelData.performance_metrics.confusion_matrix && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confusion Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfusionMatrix
                  confusion_matrix={
                    modelData.performance_metrics.confusion_matrix
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Classification Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <Alert>
                <AlertDescription className="font-mono text-xs whitespace-pre">
                  {performance_metrics.classification_report}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </CardContent>

      {/* prediction form */}
      <PredictionForm columns={columns || []} modelId={modelData.id} />
    </Card>
  );
};

export default EvaluationSection;
