// app/finance/profit-loss/page.tsx
'use client';

import {
  ChevronDown,
  Filter,
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

const PROFIT_THRESHOLD = 0;

const profitLossData = [
  {
    id: '1',
    category: 'Product Sales',
    revenue: 50_000,
    expenses: 30_000,
  },
  {
    id: '2',
    category: 'Consulting',
    revenue: 20_000,
    expenses: 10_000,
  },
  {
    id: '3',
    category: 'Marketing Campaigns',
    revenue: 10_000,
    expenses: 15_000,
  },
];

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
  const totalRevenue = profitLossData.reduce(
    (acc, item) => acc + item.revenue,
    0
  );
  const totalExpenses = profitLossData.reduce(
    (acc, item) => acc + item.expenses,
    0
  );
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Summary */}
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

      {/* Detailed Breakdown */}
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
