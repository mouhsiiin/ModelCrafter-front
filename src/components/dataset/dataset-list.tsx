import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsersDatasets, deleteDataset as deleteDatasetApi } from "@/services/datasets";
import { Dataset } from "@/lib/types/dataset";
import { toast } from "@/hooks/use-toast";

export function DatasetList(): JSX.Element {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDatasets = async () => {
    try {
      setIsLoading(true);
      const data = await getUsersDatasets();
      setDatasets(data);
    } catch (err) {
      toast({
        title: "Error fetching datasets",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDeleteDataset = async (id: string): Promise<void> => {
    try {
      setIsDeleting(id);
      // await deleteDatasetApi(id);
      setDatasets(datasets.filter(dataset => dataset.id !== id));
      toast({ title: "Dataset deleted successfully" });
    } catch (err) {
      toast({
        title: "Error deleting dataset",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const formatSize = (bytes: number): string => 
    `${(bytes * 0.000001).toFixed(2)} MB`;

  return (
    <div className="p-6 max-w-7xl mx-auto mt-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Datasets</h1>
        <Button asChild>
          <Link to="/datasets/upload">Upload Dataset</Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Shape</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow key={dataset.id}>
              <TableCell className="font-medium">{dataset.name}</TableCell>
              <TableCell>{`${dataset.shape[0]} × ${dataset.shape[1]}`}</TableCell>
              <TableCell>{formatSize(dataset.size)}</TableCell>
              <TableCell>{new Date(dataset.uploadedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                  >
                    <Link to={`/datasets/${dataset.id}`}>View</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDataset(dataset.id)}
                    disabled={isDeleting === dataset.id}
                  >
                    {isDeleting === dataset.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {datasets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No datasets found. Upload a new dataset to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}