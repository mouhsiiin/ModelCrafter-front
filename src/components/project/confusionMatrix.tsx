import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfusionMatrixProps {
  confusion_matrix: number[][];
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ confusion_matrix }) => {
  // Parse the confusion matrix data into a structured format
  const data = [
    { actual: 0, predicted: 0, value: confusion_matrix[0][0] }, // True Negative
    { actual: 0, predicted: 1, value: confusion_matrix[0][1] }, // False Positive
    { actual: 1, predicted: 0, value: confusion_matrix[1][0] }, // False Negative
    { actual: 1, predicted: 1, value: confusion_matrix[1][1] }, // True Positive
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  // Function to get color intensity based on value
  const getColor = (value: number) => {
    const intensity = Math.floor((value / maxValue) * 255);
    return `rgb(0, 0, ${intensity})`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Confusion Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Labels */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90">
            <span className="text-sm font-medium">Actual Class</span>
          </div>
          <div className="text-center mb-2">
            <span className="text-sm font-medium">Predicted Class</span>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-2 gap-1">
            {data.map((cell, i) => (
              <div key={i} className="relative aspect-square">
                <div
                  className="absolute inset-0 flex items-center justify-center text-white"
                  style={{ backgroundColor: getColor(cell.value) }}
                >
                  <span className="text-lg font-bold">{cell.value}</span>
                  <div className="absolute bottom-0 left-0 right-0 text-xs text-center bg-black/30 py-1">
                    {cell.actual === cell.predicted
                      ? cell.actual === 0
                        ? "TN"
                        : "TP"
                      : cell.actual === 0
                      ? "FP"
                      : "FN"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Axis Labels */}
          <div className="grid grid-cols-2 mt-1 text-center text-xs">
            <div>Negative (0)</div>
            <div>Positive (1)</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 text-xs">
          <div className="flex justify-center space-x-4">
            <span>TN: True Negative</span>
            <span>FP: False Positive</span>
            <span>FN: False Negative</span>
            <span>TP: True Positive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfusionMatrix;
