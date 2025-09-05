'use client';

import type { CashFlow } from '@repo/db/schema/primary';
import {
  AlertCircle,
  Calendar,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useUserCashFlows } from '@/hooks/finance';

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

const EmptyStateCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" /> No Cash Flow Entries
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven't recorded any cash flow entries yet. Click "Add Entry" to get
        started.
      </p>
    </CardContent>
  </Card>
);

const ErrorCard = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) => (
  <Card className="border-destructive shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        Error Loading Cash Flow Data
      </CardTitle>
      <CardDescription>
        {error?.message ||
          'An unexpected error occurred while loading your cash flow information.'}
      </CardDescription>
    </CardHeader>
    {onRetry && (
      <CardContent>
        <Button className="gap-2" onClick={onRetry} variant="outline">
          <Loader2 className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    )}
  </Card>
);

const getTypeBadge = (direction: string) => {
  switch (direction) {
    case 'INCOMING':
      return { color: 'bg-green-100 text-green-800', text: 'Income' };
    case 'OUTGOING':
      return { color: 'bg-red-100 text-red-800', text: 'Expense' };
    default:
      return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
  }
};

const formatDate = (date?: string | Date) => {
  if (!date) {
    return 'N/A';
  }
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

const CashFlowCard = ({ cashFlow }: { cashFlow: CashFlow }) => {
  const typeInfo = getTypeBadge(cashFlow.direction);

  const formatCurrency = (amount: number | string) => {
    try {
      const num = Number(amount);
      if (Number.isNaN(num)) {
        return '0';
      }
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return '0';
    }
  };

  return (
    <Card
      className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
      key={cashFlow.id}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 ${
                cashFlow.direction === 'INCOMING'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            >
              {cashFlow.direction === 'INCOMING' ? (
                <TrendingUp className="h-5 w-5 text-white" />
              ) : (
                <TrendingDown className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {cashFlow.direction === 'INCOMING' ? 'Income' : 'Expense'}
              </CardTitle>
              {cashFlow.transactionId && (
                <Muted className="text-sm">
                  Transaction ID: {cashFlow.transactionId}
                </Muted>
              )}
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
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Badge className={typeInfo.color}>{typeInfo.text}</Badge>
          <Muted className="text-sm">{formatDate(cashFlow.flowDate)}</Muted>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          {formatDate(cashFlow.flowDate)}
        </div>
        <div className="flex items-center justify-between font-semibold text-lg">
          <span
            className={
              cashFlow.direction === 'INCOMING'
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {cashFlow.direction === 'INCOMING' ? '+' : '-'}$
            {formatCurrency(cashFlow.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const CASH_FLOW_PAGE = () => {
  const {
    data: cashFlows = [],

    error,
    refetch,
    isFetching,
  } = useUserCashFlows();

  if (isFetching) {
    return (
      <main className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <LoadingSkeleton className="mb-2 h-9 w-48" />
            <LoadingSkeleton className="h-5 w-64" />
          </div>
          <div className="flex gap-2">
            <LoadingSkeleton className="h-10 w-20" />
            <LoadingSkeleton className="h-10 w-28" />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, () => crypto.randomUUID()).map((i) => (
            <LoadingCard key={i} title="Loading Cash Flow Entry..." />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Cash Flow</H2>
            <Muted>Track incoming and outgoing cash over time.</Muted>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" disabled variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button className="gap-2" disabled>
              <Plus className="h-4 w-4" /> Add Entry
            </Button>
          </div>
        </div>

        <Separator />

        <ErrorCard error={error} onRetry={refetch} />
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Cash Flow</H2>
          <Muted>Track incoming and outgoing cash over time.</Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Entry
          </Button>
        </div>
      </div>

      <Separator />

      {!cashFlows || cashFlows.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Income
                    </p>
                    <p className="font-bold text-2xl text-green-600">
                      $
                      {cashFlows
                        .filter((cf) => cf.direction === 'INCOMING')
                        .reduce((sum, cf) => sum + Number(cf.amount || 0), 0)
                        .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Expenses
                    </p>
                    <p className="font-bold text-2xl text-red-600">
                      $
                      {cashFlows
                        .filter((cf) => cf.direction === 'OUTGOING')
                        .reduce((sum, cf) => sum + Number(cf.amount || 0), 0)
                        .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Net Cash Flow
                    </p>
                    {(() => {
                      const income = cashFlows
                        .filter((cf) => cf.direction === 'INCOMING')
                        .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);
                      const expenses = cashFlows
                        .filter((cf) => cf.direction === 'OUTGOING')
                        .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);
                      const net = income - expenses;
                      return (
                        <p
                          className={`font-bold text-2xl ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {net >= 0 ? '+' : ''}$
                          {net.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      );
                    })()}
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cashFlows.map((cashFlow) => (
              <CashFlowCard
                cashFlow={cashFlow}
                key={cashFlow.id || Math.random()}
              />
            ))}
          </div>
        </>
      )}

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">Add New Cash Flow Entry</H2>
              <P className="text-muted-foreground">
                Record a new income or expense to update your cash flow.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default CASH_FLOW_PAGE;
