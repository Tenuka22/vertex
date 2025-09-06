import type { ColumnDef } from '@tanstack/react-table';
import {
  Building2,
  Calendar,
  ExternalLink,
  Hash,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
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

const LOCATION_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type BusinessLocationEntry = {
  id: string;
  businessProfileId: string;
  locationName: string;
  locationType: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  latitude: string | null;
  longitude: string | null;
  isHeadquarters: boolean;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
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
          aria-label="Select all locations"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select location ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'locationId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/business-locations/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, LOCATION_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Location ID',
        placeholder: 'Search by location ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'locationName',
      accessorKey: 'locationName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.locationName}</span>
        </div>
      ),
      meta: {
        label: 'Location Name',
        placeholder: 'Search by location name...',
        variant: 'text',
        icon: Building2,
      },
      enableColumnFilter: true,
    },
    {
      id: 'locationType',
      accessorKey: 'locationType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.locationType}</Badge>
      ),
      meta: {
        label: 'Location Type',
        variant: 'multiSelect',
        options: [
          { label: 'Office', value: 'Office' },
          { label: 'Warehouse', value: 'Warehouse' },
          { label: 'Retail Store', value: 'Retail Store' },
          { label: 'Remote', value: 'Remote' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'address',
      accessorFn: (row) =>
        [row.addressLine1, row.city, row.state, row.country]
          .filter(Boolean)
          .join(', '),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 text-muted-foreground" />
          <span className="font-medium">
            {[
              row.original.addressLine1,
              row.original.city,
              row.original.state,
              row.original.country,
            ]
              .filter(Boolean)
              .join(', ') || 'N/A'}
          </span>
        </div>
      ),
      meta: {
        label: 'Address',
        placeholder: 'Search by address...',
        variant: 'text',
        icon: MapPin,
      },
      enableColumnFilter: true,
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.phone || 'N/A'}</span>
        </div>
      ),
      meta: {
        label: 'Phone',
        placeholder: 'Search by phone...',
        variant: 'text',
        icon: Phone,
      },
      enableColumnFilter: true,
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.email || 'N/A'}</span>
        </div>
      ),
      meta: {
        label: 'Email',
        placeholder: 'Search by email...',
        variant: 'text',
        icon: Mail,
      },
      enableColumnFilter: true,
    },
    {
      id: 'isHeadquarters',
      accessorKey: 'isHeadquarters',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Headquarters" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.isHeadquarters ? 'default' : 'outline'}>
          {row.original.isHeadquarters ? 'Yes' : 'No'}
        </Badge>
      ),
      meta: {
        label: 'Headquarters',
        variant: 'multiSelect',
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
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
              <AlertDialogTitle>Delete Business Location?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this business location from
                your records. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Location</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing business location from records...',
                      success: () => 'Business location successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete business location. Please try again.',
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
                <span className="sr-only">Open location actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/business-locations/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/business-locations/${row.original.id}/edit`}
                >
                  Edit Location
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Location
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<BusinessLocationEntry>[];
