'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Download, X } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Suspense, useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import {
  DataTableActionBar,
  DataTableActionBarAction,
} from '@/components/data-table/data-table-action-bar';
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Loader } from '@/components/global/loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { deleteTableRecords, exportTableToCSV } from '@/lib/data-management';

type CustomTableProps<T extends { id: string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  entityNamePlural: string;
  getRowIdAction: (row: T) => string;
  onDelete?: (ids: string[]) => Promise<void>;
};

function Table<T extends { id: string }>({
  data,
  columns,
  entityNamePlural,
  getRowIdAction,
  onDelete,
}: CustomTableProps<T>) {
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [isDeleteActionLoading, setIsDeleteActionLoading] = useState(false);
  const [isExportActionLoading, setIsExportActionLoading] = useState(false);

  function getPageCount(total: number, selectedPerPage: number) {
    return Math.max(1, Math.ceil(total / selectedPerPage));
  }

  const pageCount = getPageCount(data.length ?? 0, perPage);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      columnPinning: {},
    },
    getRowId: getRowIdAction,
  });

  return (
    <div className="size-full">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {entityNamePlural}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete these{' '}
              {entityNamePlural.toLowerCase()}? This action cannot be undone and
              all related data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!onDelete) {
                  return;
                }

                setIsDeleteActionLoading(true);

                await deleteTableRecords(
                  table,
                  async ({ ids }) => {
                    await onDelete(ids as string[]);
                  },
                  getRowIdAction
                );

                setIsDeleteActionLoading(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <DataTable
          actionBar={
            <DataTableActionBar table={table}>
              {onDelete && (
                <AlertDialogTrigger asChild>
                  <DataTableActionBarAction
                    className={buttonVariants({
                      variant: 'destructive',
                      size: 'sm',
                    })}
                    disabled={isDeleteActionLoading}
                    tooltip="Delete selected"
                  >
                    Delete {isDeleteActionLoading ? <Loader /> : <X />}
                  </DataTableActionBarAction>
                </AlertDialogTrigger>
              )}
              <DataTableActionBarAction
                onClick={() => {
                  setIsExportActionLoading(true);
                  exportTableToCSV(table, {
                    excludeColumns: ['actions', 'select'],
                    onlySelected: true,
                    filename: `${entityNamePlural.toLowerCase()}_list_export_data_%{Date.now()}`,
                  });
                  setIsExportActionLoading(false);
                }}
                tooltip="Export selected to CSV"
              >
                Export {isExportActionLoading ? <Loader /> : <Download />}
              </DataTableActionBarAction>
            </DataTableActionBar>
          }
          table={table}
        >
          <DataTableToolbar table={table}>
            <DataTableFilterList table={table} />
          </DataTableToolbar>
        </DataTable>
      </AlertDialog>
    </div>
  );
}

const CustomTable = <T extends { id: string }>({
  data,
  columns,
  entityNamePlural,
  getRowIdAction,
  onDelete,
}: CustomTableProps<T>) => {
  return (
    <Suspense>
      <Table
        columns={columns}
        data={data}
        entityNamePlural={entityNamePlural}
        getRowIdAction={getRowIdAction}
        onDelete={onDelete}
      />
    </Suspense>
  );
};

export default CustomTable;
