import type { cashFlows } from '@repo/db/schema/primary';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Copy,
  DollarSign,
  Hash,
  MoreHorizontal,
  Pen,
  X,
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

const TRANSACTION_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type CashFlowEntry = typeof cashFlows.$inferSelect & {
  type: 'PAYMENT' | 'PAYOUT';
  transactionDate: string | Date;
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
          aria-label="Select all transactions"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select transaction ${row.original.transactionId.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'transactionId',
      accessorKey: 'transactionId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction ID" />
      ),
      cell: ({ row }) => (
        <Button variant="ghost">
          <span className="font-mono text-sm">
            {row.original.transactionId.substring(
              0,
              TRANSACTION_ID_DISPLAY_LENGTH
            )}
            ...
          </span>
        </Button>
      ),
      meta: {
        label: 'Transaction ID',
        placeholder: 'Search by transaction ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'direction',
      accessorKey: 'direction',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cash Flow Direction" />
      ),
      cell: ({ row }) => {
        const direction = row.original.direction;
        const Icon = direction === 'INCOMING' ? ArrowDownCircle : ArrowUpCircle;
        const displayText = direction === 'INCOMING' ? 'Money In' : 'Money Out';

        return (
          <div className="flex size-full items-center justify-start gap-2">
            <Icon className="size-4" />
            {displayText}
          </div>
        );
      },
      meta: {
        label: 'Cash Flow Direction',
        variant: 'multiSelect',
        options: [
          {
            label: 'Incoming Funds',
            value: 'INCOMING',
            icon: ArrowDownCircle,
          },
          {
            label: 'Outgoing Payments',
            value: 'OUTGOING',
            icon: ArrowUpCircle,
          },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.amount);
        const direction = row.original.direction;
        const isIncoming = direction === 'INCOMING';

        return (
          <div
            className={`flex items-center gap-1 font-semibold tabular-nums ${
              isIncoming ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            <DollarSign className="size-4" />
            {isIncoming ? '+' : '-'}
            {amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Transaction Amount',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'flowDate',
      accessorKey: 'flowDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction Date" />
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
        label: 'Transaction Date',
        variant: 'date',
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
              <AlertDialogTitle>Delete Cash Flow Transaction?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this transaction from your
                cash flow records. This cannot be undone and may affect your
                financial reports and analytics.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Transaction</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing transaction from records...',
                      success: () =>
                        'Transaction successfully deleted from your cash flow!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete transaction. Please try again.',
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
                <span className="sr-only">Open transaction actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/app/transactions/${row.original.transactionId}/edit`}
                >
                  <Pen className="mr-2 h-4 w-4" />
                  Edit Transaction
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    row.original.transactionId
                  );
                  toast.success('Transaction ID copied!');
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Transaction ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(row.original.amount);
                  toast.success('Transaction amount copied!');
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Copy Amount
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  const date = new Date(
                    row.original.flowDate
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  await navigator.clipboard.writeText(date);
                  toast.success('Transaction date copied!');
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Copy Transaction Date
              </DropdownMenuItem>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Delete Transaction
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<CashFlowEntry>[];
