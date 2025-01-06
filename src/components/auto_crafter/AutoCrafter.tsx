import React, { useState } from "react";
import { Upload, FileText, AlertCircle, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Column } from "@/lib/types/preprocessing";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { VisualizationSection } from "../project/visualize";
import { ReportDialog } from ".";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AutoCrafter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setStatus("Uploading...");

      const response = await fetch("http://localhost:8000/auto/craft", {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResponse(result);
      setStatus("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Visualization function (Line chart)
  const renderChart = (data: any) => {
    if (!data) return null;

    // Assuming the data has an array of labels and values
    const chartData = {
      labels: data.labels || [],
      datasets: [
        {
          label: 'Data Analysis',
          data: data.values || [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };

    return (
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Analysis Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            
            <Line data={chartData} />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTable = (data: Record<string, any>, title = "Results") => {
    if (!data || typeof data !== "object") return null;

    const headers = Object.keys(data).filter(key => typeof data[key] !== "object");
    const nestedObjects = Object.keys(data).filter(key => typeof data[key] === "object");

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {headers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {headers.map((header) => (
                      <th key={header} className="p-3 text-left text-sm font-medium text-gray-600 border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {headers.map((header) => (
                      <td key={header} className="p-3 text-sm text-gray-700 border-b">
                        {typeof data[header] === "object"
                          ? JSON.stringify(data[header], null, 2)
                          : String(data[header])}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {nestedObjects.map((key) => (
            <div key={key} className="mt-6">
              {renderTable(data[key], key)}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CSV Analysis Tool</h1>
          <p className="mt-2 text-gray-600">Upload your CSV file to generate insights and analysis</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your CSV file here, or
                </p>
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">browse</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>

            {status && (
              <Alert className="mt-4" variant={status.includes("Error") ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            {uploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-600 mt-2 text-center">Uploading...</p>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-6">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-32"
              >
                {uploading ? "Uploading..." : "Analyze"}
              </Button>

              {response && (
                <Button
                  variant="outline"
                  className="w-32"
                >
                  <ReportDialog />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {response && (
          <div className="mt-8 space-y-6">
            {renderTable(response)}
            {renderChart(response)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoCrafter;
