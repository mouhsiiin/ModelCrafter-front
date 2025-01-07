import React, { useEffect, useState } from 'react';
import { downloadDataset } from '@/services/datasets';
import { DataTable } from '../project';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const ViewDataset: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(30);
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const { datasetId } = useParams<{ datasetId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataset = await downloadDataset(datasetId ? datasetId : '');
        setDatasetFile(dataset);
        setError('');
      } catch (err) {
        setError('Failed to fetch dataset. Please try again later.');
        console.error('Error fetching dataset:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [datasetId]);

  const handlePageSizeChange = (value: number[]) => {
    setPageSize(value[0]);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <Card className="m-4">
      <CardContent className="p-6">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="m-24">
      <CardHeader>
        <CardTitle>Dataset Viewer</CardTitle>
        <div className="text-muted-foreground">Dataset ID: {datasetId}</div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-32">Rows per page:</div>
            <div className="flex-1">
              <Slider
                defaultValue={[pageSize]}
                min={10}
                max={100}
                step={10}
                onValueChange={handlePageSizeChange}
              />
            </div>
            <div className="w-12 text-right">{pageSize}</div>
          </div>
        </div>
        <DataTable file={datasetFile} pageSize={pageSize} />
      </CardContent>
    </Card>
  );
};

export default ViewDataset;