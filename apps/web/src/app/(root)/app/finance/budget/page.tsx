'use client';

import {
  AlertCircle,
  ChevronDown,
  Filter,
  Loader2,
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
import { useUserBudgets } from '@/hooks/finance';

const BUDGET_WARNING_THRESHOLD = 70;
const BUDGET_OVER_THRESHOLD = 90;
const MAX_PERCENT = 100;

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Budget...
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
        <AlertCircle className="h-5 w-5" /> No Budgets
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven't created any budgets yet. Click "Add Budget" to get started.
      </p>
    </CardContent>
  </Card>
);

const getBudgetStatus = (spent: number, allocated: number) => {
  const percent = (spent / allocated) * MAX_PERCENT;
  if (percent >= BUDGET_OVER_THRESHOLD) {
    return { color: 'bg-red-100 text-red-800', text: 'Over Budget' };
  }
  if (percent >= BUDGET_WARNING_THRESHOLD) {
    return { color: 'bg-yellow-100 text-yellow-800', text: 'Warning' };
  }
  return { color: 'bg-green-100 text-green-800', text: 'On Track' };
};

const BUDGET_PLANNING_PAGE = () => {
  const { data: budgets, isLoading, error } = useUserBudgets();
  const formatCurrency = (amount: number | string) => {
    return Number(amount).toLocaleString();
  };

  if (isLoading) {
    return (
      <main className="space-y-8 p-6">
        <H2 className="font-bold text-3xl">Budget Planning</H2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }, () => crypto.randomUUID()).map((k) => (
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
              Could not load budgets. Please refresh the page.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Budget Planning</H2>
          <Muted>Track allocated budgets and spending by category.</Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      <Separator />

      {budgets?.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets?.map((budget) => {
            const allocated = Number(budget.allocatedAmount);
            const spent = Number(budget.spentAmount);
            const status = getBudgetStatus(spent, allocated);
            const progress = (spent / allocated) * MAX_PERCENT;

            return (
              <Card
                className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
                key={budget.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500 p-2">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {budget.category}
                        </CardTitle>
                        <Muted className="text-sm">
                          {new Date(budget.periodStart).toLocaleDateString()} -{' '}
                          {new Date(budget.periodEnd).toLocaleDateString()}
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
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Badge className={status.color}>{status.text}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Allocated: ${formatCurrency(allocated)}</span>
                    <span>Spent: ${formatCurrency(spent)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm">
                    <span>{progress.toFixed(0)}%</span>
                    <span>
                      Remaining: $
                      {formatCurrency(Math.max(allocated - spent, 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">Plan a New Budget</H2>
              <P>Create a new budget category to track expenses.</P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default BUDGET_PLANNING_PAGE;
