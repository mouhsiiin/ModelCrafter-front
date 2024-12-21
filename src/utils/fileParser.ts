import Papa from 'papaparse';
import _ from 'lodash';
import { Column, FileStats } from '@/lib/types/preprocessing';



const detectColumnType = (values: any[]): string => {
  const nonNullValues = values.filter(v => v !== null && v !== '');
  if (nonNullValues.length === 0) return 'unknown';

  const allNumbers = nonNullValues.every(v => !isNaN(Number(v)));
  if (allNumbers) return 'numeric';

  const datePattern = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/;
  const allDates = nonNullValues.every(v => datePattern.test(String(v)));
  if (allDates) return 'date';

  return 'categorical';
};

const analyzeColumn = (name: string, values: any[]): Column => {
  const type = detectColumnType(values);
  const nonNullValues = values.filter(v => v !== null && v !== '');

  const column: Column = {
    name,
    type,
    uniqueValues: new Set(values).size,
    missingValues: values.length - nonNullValues.length,
    sample: _.take(values, 5),
  };

  if (type === 'numeric') {
    const numbers = nonNullValues.map(Number);
    column.min = Math.min(...numbers);
    column.max = Math.max(...numbers);
    column.mean = _.mean(numbers);
  }

  return column;
};

export const parseFile = (file: File): Promise<FileStats> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error parsing file: ' + results.errors[0].message));
          return;
        }

        const data = results.data as any[];
        const columns = Object.keys(data[0] || {}).map((colName) => {
          const values = data.map((row) => row[colName]);
          return analyzeColumn(colName, values);
        });

        resolve({ columns, data });
      },
      error: (error) => {
        reject(new Error('Error reading file: ' + error.message));
      },
    });
  });
};
