'use client';

import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  Filter,
  Loader2,
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
import { useUserTransactions } from '@/hooks/payments';

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Transaction...
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const EmptyStateCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" /> No Transactions
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven’t recorded any transactions yet. Click "Add Transaction" to
        get started.
      </p>
    </CardContent>
  </Card>
);

const TRANSACTIONS_PAGE = () => {
  const { data: transactions, isFetching, error } = useUserTransactions();

  const getTransactionIcon = (type: string) =>
    type === 'PAYMENT' ? (
      <ArrowDownCircle className="h-5 w-5 text-white" />
    ) : (
      <ArrowUpCircle className="h-5 w-5 text-white" />
    );

  const getStatusBadge = (amount: number) =>
    amount >= 0
      ? { color: 'bg-green-100 text-green-800', text: 'Income' }
      : { color: 'bg-red-100 text-red-800', text: 'Expense' };

  const formatDate = (date?: string | Date) => {
    if (!date) {
      return 'N/A';
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | string) =>
    `$${Number(amount).toLocaleString()}`;

  if (isFetching) {
    return (
      <main className="space-y-8 p-6">
        <H2 className="font-bold text-3xl">Transactions</H2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, () => crypto.randomUUID()).map((k) => (
            <LoadingCard key={k} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Could not load transactions. Please refresh the page.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6">
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

      {transactions?.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transactions?.map((tx) => {
            const txAmount = Number(tx.amount);
            const statusInfo = getStatusBadge(
              tx.type === 'PAYMENT' ? txAmount : -txAmount
            );

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
                          tx.type === 'PAYMENT' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex flex-col">
                        <CardTitle className="text-lg">
                          {tx.type === 'PAYMENT' ? 'Incoming' : 'Outgoing'}
                        </CardTitle>
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
                  <div className="flex items-center justify-between pt-2">
                    <Badge className={statusInfo.color}>
                      {statusInfo.text}
                    </Badge>
                    <Muted className="text-sm">
                      {formatDate(tx.transactionDate)}
                    </Muted>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-2">
                  <p className="line-clamp-2 text-muted-foreground">
                    {tx.description || 'No description'}
                  </p>
                  {tx.reference && (
                    <P className="text-sm">Reference: {tx.reference}</P>
                  )}
                  <div className="mt-2 flex items-center justify-between font-medium text-lg">
                    <span className="font-semibold">
                      {tx.type === 'PAYMENT' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                    <Receipt className="h-5 w-5" />
                  </div>
                  <P className="mt-1 text-muted-foreground text-xs">
                    Created: {formatDate(tx.createdAt)} | Updated:{' '}
                    {formatDate(tx.updatedAt)}
                  </P>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <H2 className="font-semibold text-xl">Add New Transaction</H2>
            <P>
              Record a new payment or payout to keep your financials updated.
            </P>
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
