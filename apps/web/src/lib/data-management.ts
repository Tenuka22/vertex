import type { Table } from '@tanstack/react-table';
import { ZodObject, type ZodRawShape, type z } from 'zod';
import { csvToObjects } from './server-data-management';

export const csvFileToObjects = <T extends Record<string, unknown>>(
  file: File,
  options?: Parameters<typeof csvToObjects>[1]
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const csvContent = event.target?.result as string;
        const result = await csvToObjects<T>(csvContent, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
};

// Helper function to extract headers from schema
const extractHeadersFromSchema = <T extends ZodRawShape>(
  schema: ZodObject<T>
): string[] => {
  if (schema.keyof && typeof schema.keyof === 'function') {
    try {
      return [...schema.keyof().options] as string[];
    } catch {
      return Object.keys(schema.shape || schema);
    }
  }

  if (schema.shape) {
    return Object.keys(schema.shape);
  }

  return Object.keys(schema);
};

export function getHeadersFromZodSchema(
  schema: z.ZodType,
  excludeFields: string[] = ['id', 'createdAt', 'updatedAt']
) {
  if (!(schema instanceof ZodObject)) {
    return [];
  }

  if (!schema || typeof schema !== 'object') {
    return [];
  }

  const headers = extractHeadersFromSchema(schema);
  return headers.filter((header) => !excludeFields.includes(header));
}

/**
 * Convert an array of objects to a 2D array format
 */
export function objectsToArray<T extends Record<string, unknown>>(
  objects: T[],
  keys?: (keyof T)[] | null
): { headers: string[]; data: unknown[][] } {
  if (objects.length === 0) {
    return { headers: [], data: [] };
  }

  const headers = keys
    ? keys.map((key) => String(key))
    : Object.keys(objects[0]);

  const data = objects.map((obj) =>
    headers.map((header) => obj[header as keyof T])
  );

  return { headers, data };
}

/**
 * Generic function to export data to CSV
 */
export function exportDataToCSV(
  headers: string[],
  data: unknown[][],
  filename = 'export'
): void {
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      row
        .map((cellValue) => {
          return typeof cellValue === 'string'
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export TanStack table to CSV
 */
export function exportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | 'select' | 'actions')[];
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = 'table',
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter(
      (id) => !excludeColumns.includes(id as keyof TData | 'select' | 'actions')
    );

  const rows = onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getRowModel().rows;

  const data = rows.map((row) => headers.map((header) => row.getValue(header)));

  exportDataToCSV(headers, data, filename);
}

/**
 * Delete selected table records
 */
export const deleteTableRecords = async <TData, TId>(
  table: Table<TData>,
  deleteFn: ({ ids }: { ids: TId[] }) => Promise<void>,
  getId: (row: TData) => TId
) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const failedToDelete: TId[] = [];

  const deletePromises = selectedRows.map((row) =>
    deleteFn({ ids: [getId(row.original)] }).catch(() => {
      failedToDelete.push(getId(row.original));
    })
  );

  await Promise.all(deletePromises);
  return { failedToDelete };
};
