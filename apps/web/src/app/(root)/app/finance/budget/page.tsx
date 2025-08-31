import { ChevronDown, Filter, Plus, Wallet } from 'lucide-react';
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

const budgetCategories = [
  {
    id: 'b1',
    name: 'Marketing',
    allocated: 5000,
    spent: 3200,
    description: 'Advertising, promotions, and campaigns',
  },
  {
    id: 'b2',
    name: 'Operations',
    allocated: 8000,
    spent: 6000,
    description: 'Rent, utilities, and office expenses',
  },
  {
    id: 'b3',
    name: 'Product Development',
    allocated: 10_000,
    spent: 7500,
    description: 'Research, design, and development costs',
  },
  {
    id: 'b4',
    name: 'Staff & Salaries',
    allocated: 12_000,
    spent: 11_800,
    description: 'Employee wages and benefits',
  },
];

const BUDGET_WARNING_THRESHOLD = 70;
const BUDGET_OVER_THRESHOLD = 90;
const MAX_PERCENT = 100;

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
  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
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

      {/* Budget Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgetCategories.map((cat) => {
          const status = getBudgetStatus(cat.spent, cat.allocated);
          const progress = (cat.spent / cat.allocated) * MAX_PERCENT;

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={cat.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500 p-2">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{cat.name}</CardTitle>
                      <Muted className="text-sm">{cat.description}</Muted>
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
                  <span>Allocated: ${cat.allocated.toLocaleString()}</span>
                  <span>Spent: ${cat.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-sm">
                  <span>{progress.toFixed(0)}%</span>
                  <span>
                    Remaining: $
                    {Math.max(cat.allocated - cat.spent, 0).toLocaleString()}
                  </span>
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
