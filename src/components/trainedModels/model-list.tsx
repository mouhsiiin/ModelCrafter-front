import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserModels, downloadModel } from "@/services/models";
import { ModelData } from "@/lib/types/models";
import { toast } from "@/hooks/use-toast";

export function ModelList(): JSX.Element {
  const [models, setModels] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const data = await getUserModels();
      setModels(data);
    } catch (err) {
      toast({
        title: "Error fetching models",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDownloadModel = async (modelId: string | number): Promise<void> => {
    try {
      setIsDownloading(String(modelId));
      await downloadModel(modelId);
      toast({ title: "Model downloaded successfully" });
    } catch (err) {
      toast({
        title: "Error downloading model",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const getMetricDisplay = (model: ModelData) => {
    if (model.performance_metrics.accuracy) {
      return `${(model.performance_metrics.accuracy * 100).toFixed(2)}%`;
    }
    if (model.performance_metrics.r2_score) {
      return `R² ${model.performance_metrics.r2_score.toFixed(3)}`;
    }
    return '-';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto mt-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trained Models</h1>
        <Button asChild>
          <Link to="/projects/new">Train New Model</Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Algorithm</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.algorithm_name}</TableCell>
              <TableCell>{getMetricDisplay(model)}</TableCell>
              <TableCell>{new Date(model.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadModel(model.id)}
                    disabled={isDownloading === String(model.id)}
                  >
                    {isDownloading === String(model.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {models.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No models found. Train a new model to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ModelList;