import type { ColumnDef } from '@tanstack/react-table';
import {
  DollarSign,
  ExternalLink,
  Hash,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
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

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PROFIT_LOSS_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type ProfitLossEntry = {
  id: string;
  category: string;
  revenue: number;
  expenses: number;
};

export const getColumns = ({
  deleteRecord,
}: {
  deleteRecord: ({ ids }: { ids: string[] }) => void;
}) =>
  [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all reports"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select report ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'reportId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Report ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/profit-loss/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, PROFIT_LOSS_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Report ID',
        placeholder: 'Search by report ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{row.original.category}</span>
          </div>
        );
      },
      meta: {
        label: 'Category',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'revenue',
      accessorKey: 'revenue',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Revenue" />
      ),
      cell: ({ row }) => {
        const amount = row.original.revenue;
        return (
          <div className="flex items-center gap-1 font-semibold text-emerald-600 tabular-nums">
            <TrendingUp className="size-4" />
            {amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Revenue',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'expenses',
      accessorKey: 'expenses',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expenses" />
      ),
      cell: ({ row }) => {
        const amount = row.original.expenses;
        return (
          <div className="flex items-center gap-1 font-semibold text-red-600 tabular-nums">
            <TrendingDown className="size-4" />
            {amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Expenses',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'netProfit',
      accessorKey: 'netProfit',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Net Profit" />
      ),
      cell: ({ row }) => {
        const amount = row.original.revenue - row.original.expenses;
        const isPositive = amount >= 0;
        return (
          <div
            className={`flex items-center gap-1 font-semibold tabular-nums ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            <DollarSign className="size-4" />
            {isPositive ? '+' : '-'}
            {Math.abs(amount).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Net Profit',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Profit & Loss Report?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this profit and loss report
                from your records. This cannot be undone and may affect your
                financial reports and analytics.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Report</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing report from records...',
                      success: () =>
                        'Profit & Loss report successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete report. Please try again.',
                    }
                  );
                }}
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open report actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/profit-loss/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Full Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/profit-loss/${row.original.id}/edit`}>
                  Edit Report
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Report
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<ProfitLossEntry>[];
