import {
  Banknote,
  ChevronDown,
  CreditCard,
  Filter,
  Plus,
  Wallet,
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

const PAYMENT_METHODS_PAGE = () => {
  const paymentMethods = [
    {
      id: 'pm1',
      type: 'Credit Card',
      provider: 'Visa',
      last4: '1234',
      status: 'active',
      lastUsed: '2025-08-29',
      description: 'Primary business credit card for supplier transactions.',
    },
    {
      id: 'pm2',
      type: 'Bank Transfer',
      provider: 'Chase Bank',
      last4: '5678',
      status: 'active',
      lastUsed: '2025-08-27',
      description: 'Main business checking account for large orders.',
    },
    {
      id: 'pm3',
      type: 'PayPal',
      provider: 'PayPal Business',
      last4: '',
      status: 'inactive',
      lastUsed: '2025-08-20',
      description: 'Alternative online payment method.',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? { color: 'bg-green-100 text-green-800', text: 'Active' }
      : { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'Credit Card':
        return <CreditCard className="h-5 w-5 text-white" />;
      case 'Bank Transfer':
        return <Banknote className="h-5 w-5 text-white" />;
      default:
        return <Wallet className="h-5 w-5 text-white" />;
    }
  };

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Payment Methods</H2>
          <Muted>
            Manage how you pay suppliers and receive payments from customers.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Method
          </Button>
        </div>
      </div>

      <Separator />

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((method) => {
          const statusInfo = getStatusBadge(method.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={method.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-500 p-2">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.type}</CardTitle>
                      <Muted className="text-sm">{method.provider}</Muted>
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
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Used: {formatDate(method.lastUsed)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {method.description}
                </p>
                <div className="flex items-center justify-between font-medium text-sm">
                  <div className="flex items-center gap-1">
                    {method.last4 ? `**** **** **** ${method.last4}` : 'N/A'}
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
              <H2 className="font-semibold text-xl">Add New Payment Method</H2>
              <P>
                Add a credit card, bank account, or digital payment option for
                easier transactions.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PAYMENT_METHODS_PAGE;
