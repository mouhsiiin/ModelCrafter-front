import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Dataset {
  id: number;
  name: string;
  description: string;
  size: string;
  uploadedAt: string;
}

const initialDatasets: Dataset[] = [
  {
    id: 1,
    name: "MNIST",
    description: "Handwritten digit dataset",
    size: "11.5 MB",
    uploadedAt: "2023-05-01",
  },
  {
    id: 2,
    name: "CIFAR-10",
    description: "Image classification dataset",
    size: "170 MB",
    uploadedAt: "2023-04-15",
  },
  {
    id: 3,
    name: "IMDb Reviews",
    description: "Movie review sentiment dataset",
    size: "80 MB",
    uploadedAt: "2023-05-10",
  },
];

export function DatasetList(): JSX.Element {
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);

  const deleteDataset = (id: number): void => {
    setDatasets(datasets.filter(dataset => dataset.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative py-20 px-4 text-center">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Datasets</h1>
        <Button asChild>
          <Link to="/datasets/upload">Upload Dataset</Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow key={dataset.id}>
              <TableCell className="font-medium">{dataset.name}</TableCell>
              <TableCell>{dataset.description}</TableCell>
              <TableCell>{dataset.size}</TableCell>
              <TableCell>{new Date(dataset.uploadedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                  >
                    <Link to={`/datasets/${dataset.id}`}>
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDataset(dataset.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {datasets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No datasets found. Upload a new dataset to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}