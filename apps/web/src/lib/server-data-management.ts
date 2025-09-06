'use server';

import Papa from 'papaparse';
import { z } from 'zod';

function autoTransform(value: string): unknown {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

export const csvToObjects = async <T extends Record<string, unknown>>(
  csvContent: string,
  options: {
    delimiter?: string;
    hasHeaders?: boolean;
    customHeaders?: string[];
    skipEmptyRows?: boolean;
    trimValues?: boolean;
    valueTransformer?: (
      value: string,
      header: string,
      rowIndex: number
    ) => unknown;
  } = {}
): Promise<T[]> => {
  const {
    delimiter = ',',
    hasHeaders = true,
    customHeaders,
    skipEmptyRows = true,
    trimValues = true,
    valueTransformer,
  } = options;

  if (!csvContent || csvContent.trim() === '') {
    return [];
  }

  const parseResult = await Papa.parse(csvContent, {
    delimiter,
    skipEmptyLines: skipEmptyRows,
    transform: trimValues ? (value) => value.trim() : undefined,
    header: hasHeaders,
    dynamicTyping: false,
  });

  const { data, meta } = parseResult;

  const headers: string[] = (() => {
    if (customHeaders) {
      return customHeaders;
    }

    if (hasHeaders) {
      return meta.fields ?? [];
    }

    if (data[0]) {
      return Object.keys(data[0]);
    }

    return [];
  })();

  return data.map((row, index) => {
    const parsedRow = z.record(z.string(), z.any()).parse(row);
    const obj: Record<string, unknown> = {};

    for (const header of headers) {
      let value: unknown = parsedRow[header] ?? '';

      if (valueTransformer) {
        value = valueTransformer(String(value), header, index);
      } else {
        value = autoTransform(String(value));
      }

      obj[header] = value;
    }

    return obj as T;
  });
};
