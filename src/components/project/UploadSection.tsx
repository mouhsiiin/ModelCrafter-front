import React, { useState, useCallback, ChangeEvent, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle } from "lucide-react";
import { getProjectDatasets, downloadDataset, createDataset } from "@/services/datasets";
import { Loader2 } from "lucide-react";

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

type SupportedFileTypes = "text/csv" | "application/json";

interface DataUploadProps {
  onFileAccepted?: (file: File) => void;
  maxSize?: number;
  supportedTypes?: SupportedFileTypes[];
  projectId?: string;
}

const DEFAULT_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_SUPPORTED_TYPES: SupportedFileTypes[] = [
  "text/csv",
  "application/json",
];

export const DataUploadSection: React.FC<DataUploadProps> = ({
  onFileAccepted,
  projectId,
  maxSize = DEFAULT_MAX_SIZE,
  supportedTypes = DEFAULT_SUPPORTED_TYPES,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectsDatasets = async () => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      const datasets = await getProjectDatasets(projectId);
      if (datasets && datasets.length > 0) {
        // Download the actual file using downloadDataset
        const downloadedFile = await downloadDataset(datasets[0].id);
        if (downloadedFile) {
          setFile(downloadedFile);
          onFileAccepted?.(downloadedFile);
        }
      }
      setError("");
    } catch (err) {
      setError("Failed to fetch dataset. Please try again later.");
      console.error("Error fetching dataset:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendDataset = async (file: File) => {
    if (!projectId) return;
    
    try {
      setUploading(true);
      await createDataset(projectId, file);
      setFile(file);
      onFileAccepted?.(file);
      setError("");
    } catch (err) {
      setError("Failed to upload dataset. Please try again later.");
      console.error("Error uploading dataset:", err);
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    fetchProjectsDatasets();
  }, [projectId]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): FileValidationResult => {
    if (!supportedTypes.includes(file.type as SupportedFileTypes)) {
      return {
        isValid: false,
        error: `Please upload a ${supportedTypes
          .map((type) => type.split("/")[1])
          .join(" or ")} file`,
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
      };
    }

    return { isValid: true };
  };

  const handleFile = async (file: File): Promise<void> => {
    const validation = validateFile(file);
    if (validation.isValid) {
      setUploading(true);
      try {
        setFile(file);
        onFileAccepted?.(file);
        await sendDataset(file);
        setError("");
      } catch (err) {
        setError("Error processing file");
      } finally {
        setUploading(false);
      }
    } else {
      setError(validation.error || "Invalid file");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleRemove = (): void => {
    setFile(null);
    setError("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
            ${dragActive ? "border-primary bg-primary/5" : "border-border"}
            ${error ? "border-destructive" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="File upload area"
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-lg">
                <Upload className="w-8 h-8 text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <button
                  onClick={handleRemove}
                  className="p-1 hover:bg-secondary rounded-full"
                  aria-label="Remove file"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload
                className={`w-16 h-16 mx-auto ${
                  dragActive ? "text-primary animate-bounce" : "text-muted-foreground"
                }`}
                strokeWidth={1.5}
              />
              <div className="space-y-2">
                <p className="text-xl font-medium">Drop your file here</p>
                <p className="text-muted-foreground">
                  or browse from your computer
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept={supportedTypes.join(",")}
                    onChange={handleChange}
                    disabled={uploading}
                  />
                  <Button
                    variant="secondary"
                    className="mx-auto"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-muted-foreground">
                  Supported formats:{" "}
                  {supportedTypes
                    .map((type) => type.split("/")[1].toUpperCase())
                    .join(", ")}
                  <br />
                  Maximum size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DataUploadSection;