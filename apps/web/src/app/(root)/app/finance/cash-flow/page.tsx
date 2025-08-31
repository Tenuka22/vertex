// app/finance/cash-flow/page.tsx

import {
  Calendar,
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

const cashFlowEntries = [
  {
    id: 'cf1',
    type: 'income',
    description: 'Customer Payments - August',
    amount: 5000,
    date: '2025-08-30',
    category: 'Sales',
  },
  {
    id: 'cf2',
    type: 'expense',
    description: 'Supplier Payments - Inventory Restock',
    amount: 2200,
    date: '2025-08-28',
    category: 'Supplies',
  },
  {
    id: 'cf3',
    type: 'income',
    description: 'Investment Return',
    amount: 1500,
    date: '2025-08-27',
    category: 'Investments',
  },
  {
    id: 'cf4',
    type: 'expense',
    description: 'Office Rent',
    amount: 1200,
    date: '2025-08-25',
    category: 'Operations',
  },
];

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'income':
      return { color: 'bg-green-100 text-green-800', text: 'Income' };
    case 'expense':
      return { color: 'bg-red-100 text-red-800', text: 'Expense' };
    default:
      return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const CASH_FLOW_PAGE = () => {
  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
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

      {/* Cash Flow Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cashFlowEntries.map((entry) => {
          const typeInfo = getTypeBadge(entry.type);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={entry.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        entry.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {entry.type === 'income' ? (
                        <TrendingUp className="h-5 w-5 text-white" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {entry.category}
                      </CardTitle>
                      <Muted className="text-sm">{entry.description}</Muted>
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
                  <Muted className="text-sm">{formatDate(entry.date)}</Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  {formatDate(entry.date)}
                </div>
                <div className="flex items-center justify-between font-semibold text-lg">
                  {entry.type === 'income' ? '+' : '-'}${entry.amount}
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
              <H2 className="font-semibold text-xl">Add New Cash Flow Entry</H2>
              <P>Record a new income or expense to update your cash flow.</P>
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
