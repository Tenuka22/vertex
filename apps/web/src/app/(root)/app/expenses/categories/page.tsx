'use client';

import {
  AlertCircle,
  ChevronDown,
  Filter,
  Loader2,
  Menu,
  Plus,
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
import { useUserExpenseCategories, useUserExpenses } from '@/hooks/expenses';
import { getCategoryMeta } from '@/lib/helpers';
import { cn } from '@/lib/utils';

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Category...
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
        <AlertCircle className="h-5 w-5" /> No Expense Categories
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven't created any expense categories yet. Click "Add Category" to
        get started.
      </p>
    </CardContent>
  </Card>
);

const EXPENSE_CATEGORIES_PAGE = () => {
  const {
    data: expenseCategories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useUserExpenseCategories();
  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useUserExpenses();

  const isLoading = isLoadingCategories || isLoadingExpenses;
  const hasError = categoriesError || expensesError;

  const categoriesWithExpenses =
    expenseCategories && expenses
      ? expenseCategories.map((category) => {
          const categoryExpenses = expenses.filter(
            (expense) => expense.expenses?.expenseCategoryId === category.id
          );
          return {
            ...category,
            ...getCategoryMeta(category),
            expenses: categoryExpenses,
            expenseCount: categoryExpenses.length,
          };
        })
      : [];

  const formatDate = (date?: Date | string) => {
    if (!date) {
      return 'N/A';
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? { color: 'bg-green-100 text-green-800', text: 'Active' }
      : { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  };

  if (isLoading) {
    return (
      <main className="space-y-8 p-6">
        <H2 className="font-bold text-3xl">Expense Categories</H2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, () => crypto.randomUUID()).map((k) => (
            <LoadingCard key={k} />
          ))}
        </div>
      </main>
    );
  }

  if (hasError) {
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
              Could not load expense categories. Please refresh the page.
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
          <H2 className="font-bold text-3xl">Expense Categories</H2>
          <Muted>
            Manage and track your expense categories and spending patterns.
          </Muted>
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

      {categoriesWithExpenses.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoriesWithExpenses.map((category) => {
            const statusInfo = getStatusBadge(category.status);

            return (
              <Card
                className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
                key={category.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${category.color}`}>
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <Muted className="text-sm">
                          {category.expenseCount} expense types
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
                        <DropdownMenuItem>View Category</DropdownMenuItem>
                        <DropdownMenuItem>Edit Category</DropdownMenuItem>
                        <DropdownMenuItem>View Reports</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Badge className={statusInfo.color}>
                      {statusInfo.text}
                    </Badge>
                    <Muted className="text-sm">
                      Updated: {formatDate(category.lastUpdated)}
                    </Muted>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Muted className="font-medium text-sm">
                        Expense Types
                      </Muted>
                      <Button className="h-6 text-xs" size="sm" variant="ghost">
                        <Plus className="mr-1 h-3 w-3" /> Add
                      </Button>
                    </div>

                    {category.expenses.map((expense) => {
                      return (
                        <div
                          className={cn(
                            'flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50',
                            expense.expenses?.status === 'inactive' &&
                              'opacity-50'
                          )}
                          key={expense.expenses?.id}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {expense.expenses?.name}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    className="h-6 w-6"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <Menu className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit Expense
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete Expense
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="mt-1 flex items-center justify-between">
                              <Muted className="text-xs">
                                {expense.expenses?.frequency}
                              </Muted>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
              <H2 className="font-semibold text-xl">Need a new category?</H2>
              <P>
                Create custom expense categories to better organize your expense
                management
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create New Category
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default EXPENSE_CATEGORIES_PAGE;
