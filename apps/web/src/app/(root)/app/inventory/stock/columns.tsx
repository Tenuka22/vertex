import type { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Hash,
  MoreHorizontal,
  Package,
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

const STOCK_ITEM_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type InventoryEntry = {
  id: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string | null;
    type: string;
    price: string | null;
    category: string;
    status: string;
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
          aria-label="Select all stock items"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select stock item ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'stockItemId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock Item ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/inventory/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, STOCK_ITEM_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Stock Item ID',
        placeholder: 'Search by stock item ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'productName',
      accessorFn: (row) => row.product?.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <span className="font-medium">
            {row.original.product?.name || 'N/A'}
          </span>
        </div>
      ),
      meta: {
        label: 'Product Name',
        placeholder: 'Search by product name...',
        variant: 'text',
        icon: Package,
      },
      enableColumnFilter: true,
    },
    {
      id: 'quantity',
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.quantity.toLocaleString()}
        </span>
      ),
      meta: {
        label: 'Quantity',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'unitCost',
      accessorKey: 'unitCost',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit Cost" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.unitCost || '0');
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
        label: 'Unit Cost',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'productPrice',
      accessorFn: (row) => row.product?.price,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Price" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.product?.price || '0');
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
        label: 'Product Price',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'status',
      accessorFn: (row) => row.product?.status,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.product?.status;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'outline';
        let displayText = status;

        switch (status) {
          case 'in_stock':
            variant = 'default';
            displayText = 'In Stock';
            break;
          case 'low_stock':
            variant = 'secondary';
            displayText = 'Low Stock';
            break;
          case 'out_of_stock':
            variant = 'destructive';
            displayText = 'Out of Stock';
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
          { label: 'In Stock', value: 'in_stock' },
          { label: 'Low Stock', value: 'low_stock' },
          { label: 'Out of Stock', value: 'out_of_stock' },
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
              <AlertDialogTitle>Delete Stock Item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this stock item from your
                inventory. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Item</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing stock item from inventory...',
                      success: () => 'Stock item successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete stock item. Please try again.',
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
                <span className="sr-only">Open stock item actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/inventory/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/inventory/${row.original.id}/edit`}>
                  Edit Stock Item
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Restock</DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Stock Item
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<InventoryEntry>[];
