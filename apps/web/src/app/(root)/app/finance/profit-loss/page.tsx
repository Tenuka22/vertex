'use client';

import {
  AlertCircle,
  ChevronDown,
  Filter,
  Loader2,
  Plus,
  TrendingDown,
  TrendingUp,
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
import { useProfitLossData, useProfitLossSummary } from '@/hooks/profit-loss';

const PROFIT_THRESHOLD = 0;

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = ({ title }: { title: string }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="border-dashed">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="w-fit">
          <H2 className="font-semibold text-xl">No Profit & Loss Data</H2>
          <P>Start by adding your first revenue or expense entry.</P>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add First Entry
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = () => (
  <Card className="border-destructive">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="w-fit">
          <H2 className="font-semibold text-xl">Error Loading Data</H2>
          <P>
            There was an error loading your profit and loss data. Please try
            refreshing the page.
          </P>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    </CardContent>
  </Card>
);

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const getProfitLossStatus = (revenue: number, expenses: number) => {
  const profit = revenue - expenses;
  if (profit < PROFIT_THRESHOLD) {
    return { color: 'bg-red-100 text-red-800', text: 'Loss' };
  }
  return { color: 'bg-green-100 text-green-800', text: 'Profit' };
};

const PROFIT_LOSS_PAGE = () => {
  const {
    data: profitLossData,
    isFetching: isFetchingData,
    error: errorData,
  } = useProfitLossData();
  const {
    data: summary,
    isFetching: isFetchingSummary,
    error: errorSummary,
  } = useProfitLossSummary();

  const isFetching = isFetchingData || isFetchingSummary;
  const hasError = errorData || errorSummary;

  const { totalRevenue, totalExpenses, netProfit } = summary || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
  };

  if (isFetching) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Profit &amp; Loss</H2>
            <Muted>
              Track your revenue, expenses, and overall financial performance
            </Muted>
          </div>
          <div className="flex items-center gap-2">
            <Button disabled size="sm" variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button disabled size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-3">
          <LoadingCard title="Loading Revenue..." />
          <LoadingCard title="Loading Expenses..." />
          <LoadingCard title="Loading Net Profit..." />
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_) => (
            <LoadingCard
              key={crypto.randomUUID()}
              title="Loading Category..."
            />
          ))}
        </div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Profit &amp; Loss</H2>
            <Muted>
              Track your revenue, expenses, and overall financial performance
            </Muted>
          </div>
        </div>

        <Separator />

        <ErrorState />
      </main>
    );
  }

  if (!profitLossData || profitLossData.length === 0) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Profit &amp; Loss</H2>
            <Muted>
              Track your revenue, expenses, and overall financial performance
            </Muted>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        <Separator />

        <EmptyState />
      </main>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H2>Profit &amp; Loss</H2>
          <Muted>
            Track your revenue, expenses, and overall financial performance
          </Muted>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>This Quarter</DropdownMenuItem>
              <DropdownMenuItem>This Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <P className="font-semibold text-lg">
              {formatCurrency(totalRevenue)}
            </P>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <P className="font-semibold text-lg">
              {formatCurrency(totalExpenses)}
            </P>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <P
              className={`font-semibold text-lg ${
                netProfit >= PROFIT_THRESHOLD
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(netProfit)}
            </P>
            {netProfit >= PROFIT_THRESHOLD ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profitLossData.map((item) => {
          const status = getProfitLossStatus(item.revenue, item.expenses);
          return (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{item.category}</CardTitle>
                <Badge className={status.color}>{status.text}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <Muted>Revenue</Muted>
                  <P>{formatCurrency(item.revenue)}</P>
                </div>
                <div className="flex items-center justify-between">
                  <Muted>Expenses</Muted>
                  <P>{formatCurrency(item.expenses)}</P>
                </div>
                <div className="flex items-center justify-between">
                  <Muted>Net</Muted>
                  <P
                    className={
                      item.revenue - item.expenses >= PROFIT_THRESHOLD
                        ? 'font-semibold text-green-600'
                        : 'font-semibold text-red-600'
                    }
                  >
                    {formatCurrency(item.revenue - item.expenses)}
                  </P>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PROFIT_LOSS_PAGE;
