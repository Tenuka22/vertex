// app/finance/balance-sheet/page.tsx

import {
  ChevronDown,
  Filter,
  Plus,
  TrendingDown,
  TrendingUp,
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

const balanceSheetItems = [
  {
    id: 'asset1',
    type: 'asset',
    title: 'Cash & Bank',
    amount: 12_000,
    description: 'Available liquid funds in all accounts',
  },
  {
    id: 'asset2',
    type: 'asset',
    title: 'Inventory',
    amount: 8000,
    description: 'Total value of unsold products',
  },
  {
    id: 'liability1',
    type: 'liability',
    title: 'Supplier Credit',
    amount: 5000,
    description: 'Outstanding payments to suppliers',
  },
  {
    id: 'liability2',
    type: 'liability',
    title: 'Bank Loan',
    amount: 7000,
    description: 'Pending loan repayment',
  },
  {
    id: 'equity1',
    type: 'equity',
    title: 'Owner’s Equity',
    amount: 8000,
    description: 'Capital invested by owners',
  },
];

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'asset':
      return { color: 'bg-green-100 text-green-800', text: 'Asset' };
    case 'liability':
      return { color: 'bg-red-100 text-red-800', text: 'Liability' };
    case 'equity':
      return { color: 'bg-blue-100 text-blue-800', text: 'Equity' };
    default:
      return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'asset':
      return TrendingUp;
    case 'liability':
      return TrendingDown;
    case 'equity':
      return Wallet;
    default:
      return Wallet;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'asset':
      return 'bg-green-500';
    case 'liability':
      return 'bg-red-500';
    case 'equity':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const BALANCE_SHEET_PAGE = () => {
  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Balance Sheet</H2>
          <Muted>Overview of your assets, liabilities, and equity.</Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      <Separator />

      {/* Balance Sheet Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {balanceSheetItems.map((item) => {
          const badge = getTypeBadge(item.type);
          const Icon = getTypeIcon(item.type);
          const bgColor = getTypeColor(item.type);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={item.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${bgColor}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Muted className="text-sm">{item.description}</Muted>
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
                  <Badge className={badge.color}>{badge.text}</Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex items-center justify-between font-semibold text-lg">
                  ${item.amount.toLocaleString()}
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
              <H2 className="font-semibold text-xl">
                Add New Balance Sheet Item
              </H2>
              <P>Record a new asset, liability, or equity item.</P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default BALANCE_SHEET_PAGE;
