import type { paymentMethods } from '@repo/db/schema/primary';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Banknote,
  Calendar,
  CreditCard,
  ExternalLink,
  Hash,
  MoreHorizontal,
  Wallet,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PAYMENT_METHOD_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type PaymentMethodEntry = typeof paymentMethods.$inferSelect & {
  details: Record<string, string | number | boolean | Date | null> | null;
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
          aria-label="Select all payment methods"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select payment method ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'methodId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Method ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/payment-methods/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, PAYMENT_METHOD_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Method ID',
        placeholder: 'Search by method ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = row.original.type;
        let Icon = Wallet;
        switch (type) {
          case 'CARD_CREDIT':
            Icon = CreditCard;
            break;
          case 'BANK':
            Icon = Banknote;
            break;
          default:
            break;
        }
        return (
          <Badge className="gap-1" variant="outline">
            <Icon className="size-3" />
            {type.replace('_', ' ')}
          </Badge>
        );
      },
      meta: {
        label: 'Type',
        variant: 'multiSelect',
        options: [
          { label: 'Credit Card', value: 'CARD_CREDIT' },
          { label: 'Bank Account', value: 'BANK' },
          { label: 'Digital Wallet', value: 'DIGITAL_WALLET' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'provider',
      accessorFn: (row) => row.details?.provider,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Provider" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.details?.provider || 'N/A'}
        </span>
      ),
      meta: {
        label: 'Provider',
        placeholder: 'Search by provider...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'last4',
      accessorFn: (row) => row.details?.last4,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last 4 Digits" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.details?.last4 || 'N/A'}
        </span>
      ),
      meta: {
        label: 'Last 4 Digits',
        placeholder: 'Search by last 4 digits...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'accountNumber',
      accessorFn: (row) => row.details?.accountNumber,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Number" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.details?.accountNumber || 'N/A'}
        </span>
      ),
      meta: {
        label: 'Account Number',
        placeholder: 'Search by account number...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'outline';
        let displayText = 'Inactive';

        if (isActive) {
          variant = 'default';
          displayText = 'Active';
        }

        return (
          <Badge className="gap-1 font-medium" variant={variant}>
            {displayText}
          </Badge>
        );
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
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
              <AlertDialogTitle>Delete Payment Method?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this payment method from
                your records. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Method</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing payment method from records...',
                      success: () => 'Payment method successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete payment method. Please try again.',
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
                <span className="sr-only">
                  Open payment method actions menu
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/payment-methods/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/payment-methods/${row.original.id}/edit`}>
                  Edit Method
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Method
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<PaymentMethodEntry>[];
