import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select } from 'antd';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import _ from 'lodash';
import { parseFile } from '@/utils/fileParser';

interface DataTableProps {
  file?: File;
  pageSize?: number;
}

interface DataRow {
  [key: string]: any;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  file,
  pageSize = 10
}) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{column: string; direction: 'asc' | 'desc'} | null>(null);
  const [filterValues, setFilterValues] = useState<{[key: string]: string}>({});
  const [uniqueValues, setUniqueValues] = useState<{[key: string]: string[]}>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load and parse data
  useEffect(() => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    setCurrentPage(1);
    setSortConfig(null);
    setFilterValues({});

    const loadData = async () => {
      try {
        const result = await parseFile(file);
        if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
          throw new Error('Invalid data format or empty file');
        }

        setData(result.data);
        const cols = Object.keys(result.data[0] || {});
        setColumns(cols);
        
        // Generate unique values for each column for filters
        const uniqueColumnValues = cols.reduce((acc, column) => {
          const values = _.uniq(result.data.map(row => String(row[column] || '')))
            .filter(Boolean)
            .sort();
          return { ...acc, [column]: values };
        }, {} as {[key: string]: string[]});
        
        setUniqueValues(uniqueColumnValues);
        setLoading(false);
      } catch (err) {
        setError('Error parsing file: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };

    loadData();
  }, [file]);

  // Process data with sorting and filtering
  const processedData = React.useMemo(() => {
    if (!data.length) return [];
    
    let result = [...data];

    // Apply filters
    Object.entries(filterValues).forEach(([column, filterValue]) => {
      if (filterValue.trim()) {
        result = result.filter(row => {
          const cellValue = String(row[column] || '').toLowerCase();
          return cellValue === filterValue.toLowerCase();
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result = _.orderBy(
        result,
        [sortConfig.column],
        [sortConfig.direction]
      );
    }

    return result;
  }, [data, filterValues, sortConfig]);

  // Sort data
  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.column === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ column, direction });
  };

  // Filter data
  const handleFilterChange = (column: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize);

  const FilterSelect = ({ column }: { column: string }) => (
    <Select
      showSearch
      allowClear
      placeholder={`Filter ${column}...`}
      value={filterValues[column] || undefined}
      onChange={value => handleFilterChange(column, value || '')}
      options={(uniqueValues[column] || []).map(value => ({
        label: value,
        value: value
      }))}
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          Loading data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!file || columns.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          Upload a CSV file to view your dataset
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Dataset View</span>
          <span className="text-sm font-normal">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, processedData.length)} of {processedData.length} entries
          </span>
          <span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter inputs */}
          <div className="grid grid-cols-4 gap-2">
            {columns.map(column => (
              <FilterSelect key={column} column={column} />
            ))}
          </div>

          {/* Data table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(column => (
                    <TableHead key={column}>
                      <Button
                        variant="ghost"
                        className="h-8 p-0 hover:bg-transparent"
                        onClick={() => handleSort(column)}
                      >
                        {column}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map(column => (
                      <TableCell key={column}>
                        {String(row[column])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;