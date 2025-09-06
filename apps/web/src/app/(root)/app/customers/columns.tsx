import type { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  ExternalLink,
  Hash,
  Mail,
  MoreHorizontal,
  Phone,
  User,
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

const CONTACT_ID_DISPLAY_LENGTH = 12;
const ID_SUBSTRING_LENGTH = 8;

type CustomerApiData = {
  id: string;
  businessProfileId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  title: string | null;
  department: string | null;
  contactType: 'CUSTOMER' | 'LEAD' | 'VENDOR' | 'PARTNER';
  isActive: boolean;
  isPrimary: boolean;
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
          aria-label="Select all contacts"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select contact ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'contactId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/customers/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, CONTACT_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Contact ID',
        placeholder: 'Search by contact ID...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          <span className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </span>
        </div>
      ),
      meta: {
        label: 'Name',
        placeholder: 'Search by name...',
        variant: 'text',
        icon: User,
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
          <span className="font-medium">{row.original.email}</span>
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
      id: 'phone',
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.phone}</span>
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
      id: 'title',
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
      meta: {
        label: 'Title',
        placeholder: 'Search by title...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'department',
      accessorKey: 'department',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.department}</span>
      ),
      meta: {
        label: 'Department',
        placeholder: 'Search by department...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'contactType',
      accessorKey: 'contactType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.contactType}</Badge>
      ),
      meta: {
        label: 'Contact Type',
        variant: 'multiSelect',
        options: [
          { label: 'Customer', value: 'CUSTOMER' },
          { label: 'Lead', value: 'LEAD' },
          { label: 'Vendor', value: 'VENDOR' },
          { label: 'Partner', value: 'PARTNER' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'status',
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        const isPrimary = row.original.isPrimary;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'outline';
        let displayText = 'Inactive';

        if (isPrimary) {
          variant = 'default';
          displayText = 'Primary';
        } else if (isActive) {
          variant = 'secondary';
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
          { label: 'Primary', value: 'primary' },
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
              <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this contact from your
                records. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Contact</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing contact from records...',
                      success: () => 'Contact successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete contact. Please try again.',
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
                <span className="sr-only">Open contact actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/customers/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/customers/${row.original.id}/edit`}>
                  Edit Contact
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Contact
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<CustomerApiData>[];
