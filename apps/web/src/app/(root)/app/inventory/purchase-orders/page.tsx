import {
  Calendar,
  ChevronDown,
  Filter,
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

const ORDERS_PAGE = () => {
  const orders = [
    {
      id: 'o1',
      supplier: 'Global Supplies Inc.',
      items: ['Packaging Boxes', 'Labels'],
      totalCost: 320,
      status: 'pending',
      expectedDelivery: '2025-09-05',
      lastUpdated: '2025-08-29',
    },
    {
      id: 'o2',
      supplier: 'Fresh Produce Co.',
      items: ['Organic Apples', 'Wheat Flour'],
      totalCost: 480,
      status: 'shipped',
      expectedDelivery: '2025-09-01',
      lastUpdated: '2025-08-28',
    },
    {
      id: 'o3',
      supplier: 'TechParts Warehouse',
      items: ['Microchips', 'Power Adapters'],
      totalCost: 1200,
      status: 'delivered',
      expectedDelivery: '2025-08-25',
      lastUpdated: '2025-08-26',
    },
    {
      id: 'o4',
      supplier: 'Local Artisan Collective',
      items: ['Handmade Mugs', 'Custom Packaging'],
      totalCost: 250,
      status: 'canceled',
      expectedDelivery: '2025-08-23',
      lastUpdated: '2025-08-22',
    },
  ];

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

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
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

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
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
                        Supplier: {order.supplier}
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
                    Updated: {formatDate(order.lastUpdated)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {order.items.join(', ')}
                </p>
                <div className="flex items-center justify-between font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" /> ${order.totalCost}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.expectedDelivery)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create CTA */}
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
