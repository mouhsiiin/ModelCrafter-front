import { useState, useCallback, useEffect } from "react";
import { Upload, ChartNetwork, Gauge, Database, Cog } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper } from "../ui/stepper";

import { DataPreparationSection } from "./DataPreparation";
import DataUploadSection from "./UploadSection";
import { VisualizationSection } from "./visualize/VisualizationSection";
import EvaluationSection from "./EvaluationSection";
import ModelConfiguration from "./model_config/ModelSection";
import { DataTable } from "./DataTable";
import { Slider } from "../ui/slider";
import { PreprocessingOptions ,FileStats, Column } from "@/lib/types/preprocessing";
import { parseFile } from "@/utils/fileParser";
import { useParams } from "react-router-dom";
import PredictionForm from "./PredictionForm";
import { getModel } from "@/services/models";
import { ModelData } from "@/lib/types/models";
import { Column_pre } from "./PredictionForm";
import api from "@/services/api";


import Navigation from "../nav-bar/ModelCrafterSteps";



export const ProjectDetails = ( ) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<number>(20);
  const [fileStats, setFileStats] = useState<FileStats | undefined>();
  const [fileSize, setFileSize] = useState<number>(0);
  const [processedStats, setProcessedStats] = useState<FileStats | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [columns, setColumns] = useState<Column_pre[] | null>(null);
  
  useEffect(() => {
    const fetchModel = async () => {
      try {
        const model = await getModel(projectId ? projectId : "");
        setModelData(model);

        // Transform feature_names into columns
        const generatedColumns: Column_pre[] = model.feature_names.map(
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
    {
      title: "Predict",
      icon: <Gauge className="w-4 h-4" />,
    }
  ];

  const handleNext = () => {

    // if in the last step, redirect to dashboard
    if (currentStep === steps.length - 1) {
      window.location.href = "/dashboard";
    }

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
      data: currentStats.data
    };
  }, [pageSize]);

  const onPreprocessingChange = async (options: PreprocessingOptions) => {
    if (!fileStats) return;

    setIsProcessing(true);
    
    setIsProcessing(false);

  };


  const onPreprocessingApply = async (options: PreprocessingOptions) => {
    if (!fileStats) return;

    setIsProcessing(true);
    try {
      // Generate preview of processed stats
      const preview = generateProcessedStats(fileStats, options);
      setProcessedStats(preview);

      // Send configuration to backend
      const response = await api.post(`/preprocessing/process/${projectId}`, {
        options: options,
        preview_stats: {
          columns: preview.columns
        },
      }); 

      if (response.status === 200) {
        throw new Error('Failed to apply preprocessing');
      }
    } catch (error) {
      console.error('Error in preprocessing:', error);
    } finally {
      setIsProcessing(false);
    }
  }



  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <DataUploadSection onFileAccepted={handelFileAccepted} projectId={projectId} />;
      case 1:
        return <DataPreparationSection
          onPreprocessingChange={onPreprocessingChange}
          onPreprocessingApply={onPreprocessingApply}
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
        return <EvaluationSection modelData={modelData} Columns={columns} />;
      case 5:
        return <PredictionForm columns={columns} modelId={modelData?.id} target={modelData?.target_column} />;
      default:
        return <DataUploadSection onFileAccepted={handelFileAccepted} projectId={projectId} />;
    }
  };
  const handlePageSizeChange = ([value]: number[]) => {
    setPageSize(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl relative py-20 px-4">
      <header>
        <h1 className="text-3xl font-bold">ML Analysis Dashboard</h1>
      </header>

      {/* Navigation */}
      <Navigation steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />

      {/* Dynamic Section Rendering */}
      <main>{renderCurrentSection()}</main>


      {currentStep == 0 && 
        <div>
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
      </div>}
    </div>
  );
};
