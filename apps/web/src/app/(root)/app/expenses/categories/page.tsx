import type { Expense, ExpenseCategory } from '@repo/db/schema/primary';
import { ChevronDown, Filter, Menu, Plus } from 'lucide-react';
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
import { getCategoryMeta } from '@/lib/helpers';
import { cn } from '@/lib/utils';

type ExpenseData = ExpenseCategory & { expenses: Expense[] };

const businessProfileId = '1111';

const EXPENSE_CATEGORIES_PAGE = () => {
  const rawCategories: ExpenseData[] = [
    {
      id: 'vehicle',
      businessProfileId,
      name: 'VEHICLE',
      status: 'active',
      lastUpdated: new Date('2025-08-28'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '1',
          expenseCategoryId: 'vehicle',
          name: 'Vehicle Repair',
          frequency: 'As needed',
          status: 'inactive',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          expenseCategoryId: 'vehicle',
          name: 'Fuel Expenses',
          frequency: 'Weekly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'housing',
      businessProfileId,
      name: 'HOUSING',
      status: 'active',
      lastUpdated: new Date('2025-08-30'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '3',
          expenseCategoryId: 'housing',
          name: 'Rent/Mortgage',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          expenseCategoryId: 'housing',
          name: 'Utilities',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '5',
          expenseCategoryId: 'housing',
          name: 'Home Maintenance',
          frequency: 'As needed',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'food',
      businessProfileId,
      name: 'FOOD',
      status: 'active',
      lastUpdated: new Date('2025-08-29'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '6',
          expenseCategoryId: 'food',
          name: 'Groceries',
          frequency: 'Weekly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '7',
          expenseCategoryId: 'food',
          name: 'Restaurants',
          frequency: 'Weekly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'shopping',
      businessProfileId,
      name: 'SHOPPING',
      status: 'active',
      lastUpdated: new Date('2025-08-27'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '8',
          expenseCategoryId: 'shopping',
          name: 'Clothing',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '9',
          expenseCategoryId: 'shopping',
          name: 'Electronics',
          frequency: 'As needed',
          status: 'inactive',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'entertainment',
      businessProfileId,
      name: 'ENTERTAINMENT',
      status: 'active',
      lastUpdated: new Date('2025-08-26'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '10',
          expenseCategoryId: 'entertainment',
          name: 'Movies & Shows',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '11',
          expenseCategoryId: 'entertainment',
          name: 'Games & Hobbies',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'education',
      businessProfileId,
      name: 'EDUCATION',
      status: 'active',
      lastUpdated: new Date('2025-08-25'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '12',
          expenseCategoryId: 'education',
          name: 'Online Courses',
          frequency: 'Quarterly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '13',
          expenseCategoryId: 'education',
          name: 'Books & Materials',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'healthcare',
      businessProfileId,
      name: 'HEALTHCARE',
      status: 'active',
      lastUpdated: new Date('2025-08-24'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [
        {
          id: '14',
          expenseCategoryId: 'healthcare',
          name: 'Medical Bills',
          frequency: 'As needed',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '15',
          expenseCategoryId: 'healthcare',
          name: 'Medications',
          frequency: 'Monthly',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ];

  const expenseCategories = rawCategories.map((c) => ({
    ...c,
    ...getCategoryMeta(c),
    expenseCount: c.expenses.length,
  }));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? { color: 'bg-green-100 text-green-800', text: 'Active' }
      : { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  };

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {expenseCategories.map((category) => {
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
                      <CardTitle className="text-lg">{category.name}</CardTitle>
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
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Updated: {formatDate(category.lastUpdated)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Muted className="font-medium text-sm">Expense Types</Muted>
                    <Button className="h-6 text-xs" size="sm" variant="ghost">
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>

                  {category.expenses.map((expense) => {
                    return (
                      <div
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50',
                          expense.status === 'inactive' && 'opacity-50'
                        )}
                        key={expense.id}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {expense.name}
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
                              {expense.frequency}
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
