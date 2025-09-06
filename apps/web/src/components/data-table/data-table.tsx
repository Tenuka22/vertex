import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { type ComponentProps, type ReactNode, useRef } from 'react';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';
import { Scroller } from '../ui/scroller';

interface DataTableProps<TData> extends ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: ReactNode;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const containerRes = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-hidden', className)}
      ref={containerRes}
      {...props}
    >
      {children}
      <div
        className="flex size-full p-5"
        style={{
          width: `${containerRes.current?.clientWidth}px`,
        }}
      >
        <Scroller asChild className="w-full p-4" orientation="horizontal">
          <div className="flex-1 rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        colSpan={header.colSpan}
                        key={header.id}
                        style={{
                          ...getCommonPinningStyles({ column: header.column }),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-24 text-center"
                      colSpan={table.getAllColumns().length}
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Scroller>
      </div>
      <div className="flex flex-col gap-2.5 px-5 pb-2">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
