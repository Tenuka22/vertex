import type { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Hash,
  MoreHorizontal,
  Percent,
  Target,
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

const GOAL_ID_DISPLAY_LENGTH = 12;
const MAX_PROGRESS = 100;
const ID_SUBSTRING_LENGTH = 8;

type GoalEntry = {
  id: string;
  businessProfileId: string;
  title: string;
  category: string;
  targetAmount: string;
  currentAmount: string;
  deadline: Date;
  status: string;
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
          aria-label="Select all goals"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select goal ${row.original.id.substring(0, ID_SUBSTRING_LENGTH)}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'goalId',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Goal ID" />
      ),
      cell: ({ row }) => (
        <Button
          asChild
          className="text-secondary-foreground hover:text-primary"
          variant="link"
        >
          <Link href={`/admin/goals/${row.original.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="font-mono text-sm">
              {row.original.id.substring(0, GOAL_ID_DISPLAY_LENGTH)}
              ...
            </span>
          </Link>
        </Button>
      ),
      meta: {
        label: 'Goal ID',
        placeholder: 'Search by goal ID...',
        variant: 'text',
        icon: Hash,
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
        <div className="flex items-center gap-2">
          <Target className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
      meta: {
        label: 'Title',
        placeholder: 'Search by title...',
        variant: 'text',
        icon: Target,
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
        <Badge variant="outline">{row.original.category}</Badge>
      ),
      meta: {
        label: 'Category',
        placeholder: 'Search by category...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'targetAmount',
      accessorKey: 'targetAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Target Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.targetAmount);
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
        label: 'Target Amount',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'currentAmount',
      accessorKey: 'currentAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Current Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.currentAmount);
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
        label: 'Current Amount',
        variant: 'range',
      },
      enableColumnFilter: true,
    },
    {
      id: 'progress',
      accessorFn: (row) => {
        const current = Number.parseFloat(row.currentAmount);
        const target = Number.parseFloat(row.targetAmount);
        return target > 0 ? (current / target) * MAX_PROGRESS : 0;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Progress" />
      ),
      cell: ({ cell }) => {
        const progress = cell.getValue<number>();
        return (
          <div className="flex items-center gap-1">
            <Percent className="size-4 text-muted-foreground" />
            <span className="font-medium">
              {Math.min(progress, MAX_PROGRESS).toFixed(0)}%
            </span>
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: 'deadline',
      accessorKey: 'deadline',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deadline" />
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
        label: 'Deadline',
        variant: 'date',
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
          case 'active':
            variant = 'default';
            break;
          case 'completed':
            variant = 'secondary';
            break;
          case 'overdue':
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
          { label: 'Active', value: 'active' },
          { label: 'Completed', value: 'completed' },
          { label: 'Overdue', value: 'overdue' },
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
              <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove this goal from your records.
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Goal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast.promise(
                    async () =>
                      await deleteRecord({
                        ids: [row.original.id],
                      }),
                    {
                      loading: 'Removing goal from records...',
                      success: () => 'Goal successfully deleted!',
                      error: (err) =>
                        err?.errors?.[0]?.message ||
                        err?.message ||
                        'Unable to delete goal. Please try again.',
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
                <span className="sr-only">Open goal actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/goals/${row.original.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/goals/${row.original.id}/edit`}>
                  Edit Goal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete Goal
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      ),
      size: 32,
      enableSorting: false,
    },
  ] satisfies ColumnDef<GoalEntry>[];
