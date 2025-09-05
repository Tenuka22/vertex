'use client';

import {
  AlertCircle,
  ChevronDown,
  Filter,
  Loader2,
  Package,
} from 'lucide-react';
import { H2, Muted, P } from '@/components/design/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useUserInventory } from '@/hooks/inventory';
import { cn } from '@/lib/utils';

const STOCK_MANAGEMENT_PAGE = () => {
  const { data: stockItems, isFetching, error } = useUserInventory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return { color: 'bg-green-100 text-green-800', text: 'In Stock' };
      case 'low_stock':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
      case 'out_of_stock':
        return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const MAX_PROGRESS = 100;

  if (isFetching) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Stock Management</H2>
            <Muted>
              Monitor inventory levels and manage restocking efficiently.
            </Muted>
          </div>
          <Button className="gap-2" disabled variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(() => (
            <Card className="shadow-md" key={crypto.randomUUID()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Item...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Stock Management</H2>
            <Muted>
              Monitor inventory levels and manage restocking efficiently.
            </Muted>
          </div>
        </div>
        <Separator />
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="w-fit">
                <H2 className="font-semibold text-xl">Error Loading Data</H2>
                <P>
                  There was an error loading your inventory items. Please try
                  refreshing the page.
                </P>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!stockItems || stockItems.length === 0) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Stock Management</H2>
            <Muted>
              Monitor inventory levels and manage restocking efficiently.
            </Muted>
          </div>
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        <Separator />
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div className="w-fit">
                <H2 className="font-semibold text-xl">No Inventory Items</H2>
                <P>Start by adding your first inventory item.</P>
              </div>
              <Button className="gap-2">
                <Package className="h-4 w-4" /> Add First Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Stock Management</H2>
          <Muted>
            Monitor inventory levels and manage restocking efficiently.
          </Muted>
        </div>
        <Button className="gap-2" variant="outline">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(stockItems || []).map((item) => {
          const statusInfo = getStatusBadge(item.product?.status || 'unknown');
          const progressAmount = `${Math.min(
            (item.quantity / ((item.quantity || 10) * 2)) * MAX_PROGRESS,
            MAX_PROGRESS
          )}%`;

          return (
            <Card
              className={cn(
                'flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg',
                item.product?.status === 'low-stock' && 'border-yellow-300',
                item.product?.status === 'out-of-stock' && 'border-red-300'
              )}
              key={item.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500 p-2">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {item.product?.name || 'Unknown Product'}
                      </CardTitle>
                      <Muted className="text-sm">Product</Muted>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Restock</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Updated: {formatDate(item.updatedAt.toISOString())}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-medium text-sm">
                    <span>Stock: {item.quantity}</span>
                    <span>
                      Price: ${item.product?.price || item.unitCost || '0'}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        item.product?.status === 'in-stock' && 'bg-green-500',
                        item.product?.status === 'low-stock' && 'bg-yellow-500',
                        item.product?.status === 'out-of-stock' && 'bg-red-500'
                      )}
                      style={{ width: progressAmount }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default STOCK_MANAGEMENT_PAGE;
