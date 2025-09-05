'use client';

import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Filter,
  Loader2,
  Package,
  Plus,
  Receipt,
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
import { useUserPurchaseOrders } from '@/hooks/purchase-orders';

type PurchaseOrder = {
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
    name: string;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
  };
};

const ORDERS_PAGE = () => {
  const { data: orders, isFetching, error } = useUserPurchaseOrders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
      case 'shipped':
        return { color: 'bg-blue-100 text-blue-800', text: 'Shipped' };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', text: 'Delivered' };
      case 'canceled':
        return { color: 'bg-red-100 text-red-800', text: 'Canceled' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  if (isFetching) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Supplier Orders</H2>
            <Muted>
              Track orders placed with suppliers and follow up on delivery
              status.
            </Muted>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" disabled variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button className="gap-2" disabled>
              <Plus className="h-4 w-4" /> New Order
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(() => (
            <Card className="shadow-md" key={crypto.randomUUID()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Order...
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
            <H2 className="font-bold text-3xl">Supplier Orders</H2>
            <Muted>
              Track orders placed with suppliers and follow up on delivery
              status.
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
                  There was an error loading your purchase orders. Please try
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

  if (!orders || orders.length === 0) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Supplier Orders</H2>
            <Muted>
              Track orders placed with suppliers and follow up on delivery
              status.
            </Muted>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Order
            </Button>
          </div>
        </div>
        <Separator />
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div className="w-fit">
                <H2 className="font-semibold text-xl">No Purchase Orders</H2>
                <P>Start by creating your first purchase order.</P>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create First Order
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
          <H2 className="font-bold text-3xl">Supplier Orders</H2>
          <Muted>
            Track orders placed with suppliers and follow up on delivery status.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Order
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(orders || []).map((order: PurchaseOrder) => {
          const statusInfo = getStatusBadge(order.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={order.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-500 p-2">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.toUpperCase()}
                      </CardTitle>
                      <Muted className="text-sm">
                        Supplier: {order.supplier?.name || 'Unknown Supplier'}
                      </Muted>
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
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Updated: {formatDate(order.updatedAt.toISOString())}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  Order #{order.orderNumber || order.id}
                </p>
                <div className="flex items-center justify-between font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" /> ${order.totalAmount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {order.expectedDelivery
                      ? formatDate(order.expectedDelivery.toISOString())
                      : 'TBD'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">Create New Order</H2>
              <P>
                Place a new order with a supplier and keep track of its
                progress.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ORDERS_PAGE;
