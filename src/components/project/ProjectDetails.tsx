import { useState, useCallback } from "react";
import { Upload, ChartNetwork, Gauge, Database, Cog } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "../ui/stepper";

import { DataPreparationSection } from "./DataPreparation";
import DataUploadSection from "./UploadSection";
import { VisualizationSection } from "./visualize/VisualizationSection";
import ModelConfiguration from "./model_config/ModelSection";
import { DataTable } from "./DataTable";
import { Slider } from "../ui/slider";
import { PreprocessingOptions ,FileStats, Column } from "@/lib/types/preprocessing";
import { parseFile } from "@/utils/fileParser";
import { data, useParams } from "react-router-dom";



export const ProjectDetails = ( ) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<number>(20);
  const [fileStats, setFileStats] = useState<FileStats | undefined>();
  const [fileSize, setFileSize] = useState<number>(0);
  const [processedStats, setProcessedStats] = useState<FileStats | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();


  

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [jsonParameters, setJsonParameters] = useState('');

  type AlgorithmParameters = {
    bayesian: { alpha: number; fit_prior: boolean; };
    linear: { fit_intercept: boolean; normalize: boolean; copy_X: boolean; };
    tree: { criterion: string; max_depth: null | number; min_samples_split: number; };
    forest: { n_estimators: number; max_features: string; };
    svm: { kernel: string; C: number; };
  };
  
  const algorithmParameters: AlgorithmParameters = {
    bayesian: { alpha: 0.1, fit_prior: true },
    linear: { fit_intercept: true, normalize: false, copy_X: true },
    tree: { criterion: "gini", max_depth: null, min_samples_split: 2 },
    forest: { n_estimators: 100, max_features: "auto" },
    svm: { kernel: "rbf", C: 1.0 },
  };
  
  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value);
    setJsonParameters(JSON.stringify(algorithmParameters[value as keyof AlgorithmParameters], null, 2));
  };
  

  const handelFileAccepted = async (file: File) => {
    setUploadedFile(file);

    try {
      const stats = await parseFile(file);
      setFileStats(stats);
      setFileSize(file.size / (1024 * 1024)); // Convert to MB
    } catch (error) {
      console.error("Error parsing file", error);
    }

  };

  const steps = [
    {
      title: "Upload",
      icon: <Upload className="w-4 h-4" />,
    },
    {
      title: "Prepare",
      icon: <Database className="w-4 h-4" />,
    },
    {
      title: "Visualize",
      icon: <ChartNetwork className="w-4 h-4" />,
    },
    {
      title: "Model",
      icon: <Cog className="w-4 h-4" />,
    },
    {
      title: "Evaluate",
      icon: <Gauge className="w-4 h-4" />,
    },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const generateProcessedStats = useCallback((currentStats: FileStats, options: PreprocessingOptions): FileStats => {
    const processedColumns = currentStats.columns.map(column => {
      const processedColumn: Column = {
        ...column,
        missingValues: options.missing_values_handling ? 0 : column.missingValues,
      };
      return processedColumn;
    });

    // Calculate expected data length after preprocessing
    let expectedDataLength = currentStats.data.length;
    
    // Adjust for duplicate removal
    if (options.handling_duplicates) {
      expectedDataLength = new Set(currentStats.data.map(row => JSON.stringify(row))).size;
    }

    // Adjust for sampling
    if (options.sampling_method && options.sampling_ratio < 1) {
      expectedDataLength = Math.floor(expectedDataLength * options.sampling_ratio);
    }

    console.log('Expected preview length:', expectedDataLength);
    // Create processed stats

    return {
      columns: processedColumns,
      data: currentStats.data.slice(0, Math.min(pageSize, expectedDataLength)) // Preview sample
    };
  }, [pageSize]);

  const onPreprocessingChange = async (options: PreprocessingOptions) => {
    if (!fileStats) return;

    setIsProcessing(true);
    try {
      // Generate preview of processed stats
      const preview = generateProcessedStats(fileStats, options);
      setProcessedStats(preview);

      // Send configuration to backend
      const response = await fetch('/api/preprocessing/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          options
        })
      });

      if (!response.ok) {
        throw new Error('Failed to configure preprocessing');
      }
    } catch (error) {
      console.error('Error in preprocessing:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
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
              <p className="text-muted-foreground">
                Train model to see results
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <DataUploadSection onFileAccepted={handelFileAccepted} projectId={projectId} />;
      case 1:
        return <DataPreparationSection
          onPreprocessingChange={onPreprocessingChange}
          fileStats = {fileStats}
          fileSize={fileSize}
          processedStats={processedStats}
          isProcessing={isProcessing}
        />;
      case 2:
        return <VisualizationSection columns={fileStats?.columns} projectId={projectId} />;
      case 3:
        return <ModelConfiguration />;
      case 4:
        return <EvaluationSection />;
      default:
        return <DataUploadSection onFileAccepted={handelFileAccepted} projectId={projectId} />;
    }
  };
  const handlePageSizeChange = ([value]: number[]) => {
    setPageSize(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <header>
        <h1 className="text-3xl font-bold">ML Analysis Dashboard</h1>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Dynamic Section Rendering */}
      <main>{renderCurrentSection()}</main>

      {/* File Upload Controls */}
      {uploadedFile ? (
        <section aria-label="Data Controls">
          <div className="slider-container my-4">
            <label htmlFor="page-size" className="text-sm font-medium">
              Page Size
            </label>
            <Slider
              className="mt-2"
              value={[pageSize]}
              onValueChange={handlePageSizeChange}
              min={5}
              max={200}
              step={5}
              aria-label="Adjust Page Size"
            />
          </div>
          <div className="data-table-container">
            <DataTable file={uploadedFile} pageSize={pageSize} />
          </div>
        </section>
      ) : (
        <p className="text-gray-500">
          No file uploaded. Please upload a file to view data.
        </p>
      )}
    </div>
  );
};
