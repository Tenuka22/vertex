import type { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Hash,
  MoreHorizontal,
  Receipt,
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

const ORDER_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type PurchaseOrderEntry = {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: string;
  orderDate: Date;
  expectedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
  supplier: {
    id: string;
    name: string | null;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
  };
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
          aria-label="Select all orders"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select order ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'orderId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/purchase-orders/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, ORDER_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Order ID',
        placeholder: 'Search by order ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'orderNumber',
      accessorKey: 'orderNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Number" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.orderNumber}</span>
        </div>
      ),
      meta: {
        label: 'Order Number',
        placeholder: 'Search by order number...',
        variant: 'text',
        icon: Receipt,
      },
      enableColumnFilter: true,
    },
    {
      id: 'supplierName',
      accessorFn: (row) => row.supplier?.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supplier" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.supplier?.name || 'N/A'}
        </span>
      ),
      meta: {
        label: 'Supplier',
        placeholder: 'Search by supplier name...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'totalAmount',
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.totalAmount);
        return (
          <div className="flex items-center gap-1 font-semibold tabular-nums">
            <DollarSign className="size-4" />
            {amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        );
      },
      meta: {
        label: 'Total Amount',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'outline';
        const displayText = status;

        switch (status) {
          case 'pending':
            variant = 'secondary';
            break;
          case 'shipped':
            variant = 'default';
            break;
          case 'delivered':
            variant = 'default';
            break;
          case 'canceled':
            variant = 'destructive';
            break;
          default:
            break;
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
          { label: 'Pending', value: 'pending' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Canceled', value: 'canceled' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'orderDate',
      accessorKey: 'orderDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Date" />
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
        label: 'Order Date',
        variant: 'date',
      },
      enableColumnFilter: true,
    },
    {
      id: 'expectedDelivery',
      accessorKey: 'expectedDelivery',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expected Delivery" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Date>();
        return (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="font-medium">
              {date
                ? new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
        );
      },
      meta: {
        label: 'Expected Delivery',
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
              <AlertDialogTitle>Cancel Purchase Order?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently cancel this purchase order from
                your records. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Cancelling order from records...',
                      success: () => 'Purchase order successfully cancelled!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to cancel order. Please try again.',
                    }
                  );
                }}
              >
                Cancel Order Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open order actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/purchase-orders/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/purchase-orders/${row.original.id}/edit`}>
                  Edit Order
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Cancel Order
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<PurchaseOrderEntry>[];
