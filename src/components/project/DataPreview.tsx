import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataPreparationSectionProps} from '@/lib/types/preprocessing';


export const DataPreview: React.FC<DataPreparationSectionProps> = ({ 
  fileStats, 
  processedStats,
  fileSize = 0, 
  SampleSize = 5,
}) => {
  if (!fileStats || fileStats.columns.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          Upload a CSV file to preview your dataset
        </CardContent>
      </Card>
    );
  }

  const { data: originalData, columns: originalColumns } = fileStats;
  const processedColumns = processedStats?.columns || [];
  const processedData = processedStats?.data || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dataset Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Dataset Summary Comparison */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Original Dataset</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded">
                  <div className="text-sm text-gray-500">Total Rows</div>
                  <div className="text-2xl font-bold">{originalData.length}</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-sm text-gray-500">Total Columns</div>
                  <div className="text-2xl font-bold">{originalColumns.length}</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-sm text-gray-500">File Size</div>
                  <div className="text-2xl font-bold">{fileSize.toFixed(2)} MB</div>
                </div>
              </div>
            </div>

            {processedStats && (
              <div className="space-y-4">
                <h3 className="font-semibold">After Processing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <div className="text-sm text-gray-500">Expected Rows</div>
                    <div className="text-2xl font-bold">{processedData.length}</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-sm text-gray-500">Total Columns</div>
                    <div className="text-2xl font-bold">{processedColumns.length}</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-sm text-gray-500">Changes</div>
                    <div className="text-2xl font-bold">
                      {originalData.length - processedData.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column Analysis Comparison */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unique Values (Original → Processed)</TableHead>
                  <TableHead>Missing Values (Original → Processed)</TableHead>
                  <TableHead>Statistics (Original → Processed)</TableHead>
                  <TableHead>Sample Values</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {originalColumns.map((originalCol, index) => {
                  const processedCol = processedColumns[index];
                  const hasChanges = processedCol && (
                    originalCol.uniqueValues !== processedCol.uniqueValues ||
                    originalCol.missingValues !== processedCol.missingValues
                  );

                  return (
                    <TableRow 
                      key={originalCol.name}
                      className={hasChanges ? "bg-muted/50" : ""}
                    >
                      <TableCell className="font-medium">{originalCol.name}</TableCell>
                      <TableCell>{originalCol.type}</TableCell>
                      <TableCell>
                        {originalCol.uniqueValues}
                        {processedCol && (
                          <span className="text-muted-foreground">
                            {" → "}{processedCol.uniqueValues}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {originalCol.missingValues}
                        {processedCol && (
                          <span className={processedCol.missingValues < originalCol.missingValues ? "text-green-600" : ""}>
                            {" → "}{processedCol.missingValues}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {originalCol.type === 'numeric' && (
                          <div className="space-y-1">
                            <div>
                              Min: {originalCol.min?.toFixed(2)}
                              {processedCol && (
                                <span className="text-muted-foreground">
                                  {" → "}{processedCol.min?.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div>
                              Max: {originalCol.max?.toFixed(2)}
                              {processedCol && (
                                <span className="text-muted-foreground">
                                  {" → "}{processedCol.max?.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div>
                              Mean: {originalCol.mean?.toFixed(2)}
                              {processedCol && (
                                <span className="text-muted-foreground">
                                  {" → "}{processedCol.mean?.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-nowrap">
                          {originalCol.sample.slice(0, SampleSize).join(', ')}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;