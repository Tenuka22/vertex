import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  Filter,
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

const TRANSACTIONS_PAGE = () => {
  const transactions = [
    {
      id: 't1',
      type: 'Incoming',
      description: 'Customer Payment - Order #1234',
      amount: 1200,
      status: 'completed',
      method: 'Credit Card (Visa ****1234)',
      date: '2025-08-29',
    },
    {
      id: 't2',
      type: 'Outgoing',
      description: 'Supplier Payment - Global Supplies Inc.',
      amount: 320,
      status: 'pending',
      method: 'Bank Transfer (Chase ****5678)',
      date: '2025-08-28',
    },
    {
      id: 't3',
      type: 'Incoming',
      description: 'Customer Payment - Order #1235',
      amount: 480,
      status: 'completed',
      method: 'PayPal',
      date: '2025-08-27',
    },
    {
      id: 't4',
      type: 'Outgoing',
      description: 'Supplier Payment - Fresh Produce Co.',
      amount: 500,
      status: 'failed',
      method: 'Credit Card (Visa ****1234)',
      date: '2025-08-25',
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
      case 'completed':
        return { color: 'bg-green-100 text-green-800', text: 'Completed' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
      case 'failed':
        return { color: 'bg-red-100 text-red-800', text: 'Failed' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'Incoming' ? (
      <ArrowDownCircle className="h-5 w-5 text-white" />
    ) : (
      <ArrowUpCircle className="h-5 w-5 text-white" />
    );
  };

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Transactions</H2>
          <Muted>
            View all incoming payments and outgoing supplier payouts.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <Separator />

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {transactions.map((tx) => {
          const statusInfo = getStatusBadge(tx.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={tx.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        tx.type === 'Incoming' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tx.type}</CardTitle>
                      <Muted className="text-sm">{tx.method}</Muted>
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
                  <Muted className="text-sm">{formatDate(tx.date)}</Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {tx.description}
                </p>
                <div className="flex items-center justify-between font-medium text-sm">
                  <span className="font-semibold text-lg">
                    {tx.type === 'Incoming' ? '+' : '-'}${tx.amount}
                  </span>
                  <Receipt className="h-4 w-4" />
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
              <H2 className="font-semibold text-xl">Add New Transaction</H2>
              <P>
                Record a new payment or payout to keep your financials updated.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default TRANSACTIONS_PAGE;
