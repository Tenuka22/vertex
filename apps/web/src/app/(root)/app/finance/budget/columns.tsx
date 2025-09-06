import type { budgets } from '@repo/db/schema/primary';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Hash,
  MoreHorizontal,
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

const BUDGET_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type BudgetEntry = typeof budgets.$inferSelect;

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
          aria-label="Select all budgets"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select budget ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'budgetId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Budget ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/budgets/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, BUDGET_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Budget ID',
        placeholder: 'Search by budget ID...',
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
      cell: ({ row }) => (
        <span className="font-medium">{row.original.category}</span>
      ),
      meta: {
        label: 'Category',
        placeholder: 'Search by category...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'periodStart',
      accessorKey: 'periodStart',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Date>();
        return (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="font-medium">
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        );
      },
      meta: {
        label: 'Start Date',
        variant: 'date',
      },
      enableColumnFilter: true,
    },
    {
      id: 'periodEnd',
      accessorKey: 'periodEnd',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Date" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Date>();
        return (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="font-medium">
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        );
      },
      meta: {
        label: 'End Date',
        variant: 'date',
      },
      enableColumnFilter: true,
    },
    {
      id: 'allocatedAmount',
      accessorKey: 'allocatedAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Allocated Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.allocatedAmount);
        return (
          <div className="flex items-center gap-1 font-semibold text-blue-600 tabular-nums">
            <DollarSign className="size-4" />
            {amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Allocated Amount',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'spentAmount',
      accessorKey: 'spentAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Spent Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.spentAmount);
        return (
          <div className="flex items-center gap-1 font-semibold text-red-600 tabular-nums">
            <DollarSign className="size-4" />
            {amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Spent Amount',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Record Created" />
      ),
      cell: ({ cell }) => {
        const createdAt = cell.getValue<Date>();
        return (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="size-4" />
            <span>
              {new Date(createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );
      },
    },
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      cell: ({ cell }) => {
        const updatedAt = cell.getValue<Date>();
        return (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="size-4" />
            <span>
              {new Date(updatedAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Budget?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this budget from your
                records. This cannot be undone and may affect your financial
                reports and analytics.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Budget</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing budget from records...',
                      success: () => 'Budget successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete budget. Please try again.',
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
                <span className="sr-only">Open budget actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/budgets/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Full Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/budgets/${row.original.id}/edit`}>
                  Edit Budget
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Budget
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<BudgetEntry>[];
