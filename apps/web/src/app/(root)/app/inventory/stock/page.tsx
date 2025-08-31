import { ChevronDown, Filter, Package } from 'lucide-react';
import { H2, Muted } from '@/components/design/typography';
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
import { cn } from '@/lib/utils';

const STOCK_MANAGEMENT_PAGE = () => {
  const stockItems = [
    {
      id: 'p3',
      name: 'E-commerce Template',
      stock: 12,
      reorderLevel: 5,
      status: 'in_stock',
      lastUpdated: '2025-08-24',
    },
    {
      id: 'p4',
      name: 'Branding Kit',
      stock: 2,
      reorderLevel: 5,
      status: 'low_stock',
      lastUpdated: '2025-08-22',
    },
    {
      id: 'p5',
      name: 'Custom Business Cards',
      stock: 0,
      reorderLevel: 10,
      status: 'out_of_stock',
      lastUpdated: '2025-08-20',
    },
  ];

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

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
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

      {/* Stock Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stockItems.map((item) => {
          const statusInfo = getStatusBadge(item.status);
          const progressAmount = `${Math.min(
            (item.stock / (item.reorderLevel * 2)) * MAX_PROGRESS,
            MAX_PROGRESS
          )}%`;

          return (
            <Card
              className={cn(
                'flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg',
                item.status === 'low_stock' && 'border-yellow-300',
                item.status === 'out_of_stock' && 'border-red-300'
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
                      <CardTitle className="text-lg">{item.name}</CardTitle>
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
                    Updated: {formatDate(item.lastUpdated)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-medium text-sm">
                    <span>Stock: {item.stock}</span>
                    <span>Reorder Level: {item.reorderLevel}</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        item.status === 'in_stock' && 'bg-green-500',
                        item.status === 'low_stock' && 'bg-yellow-500',
                        item.status === 'out_of_stock' && 'bg-red-500'
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
