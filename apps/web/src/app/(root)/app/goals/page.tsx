import { ChevronDown, DollarSign, Filter, Plus, Target } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const GOALS_PAGE = () => {
  const goals = [
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: '2025-12-31',
      status: 'active',
      category: 'Savings',
    },
    {
      id: '2',
      title: 'Vacation Trip',
      targetAmount: 3000,
      currentAmount: 1500,
      deadline: '2025-10-15',
      status: 'active',
      category: 'Travel',
    },
    {
      id: '3',
      title: 'New Laptop',
      targetAmount: 2000,
      currentAmount: 2000,
      deadline: '2025-09-30',
      status: 'completed',
      category: 'Tech',
    },
    {
      id: '4',
      title: 'Home Renovation',
      targetAmount: 10_000,
      currentAmount: 4000,
      deadline: '2026-03-01',
      status: 'active',
      category: 'Home',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', text: 'Active' };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-800', text: 'Completed' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
    }
  };

  const MAX_PROGRESS = 100;

  const getProgress = (goal: { currentAmount: number; targetAmount: number }) =>
    Math.min(
      (goal.currentAmount / goal.targetAmount) * MAX_PROGRESS,
      MAX_PROGRESS
    );

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Financial Goals</H2>
          <Muted>
            Track and manage your financial goals, savings, and deadlines.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        </div>
      </div>

      <Separator />

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          const statusInfo = getStatusBadge(goal.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={goal.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500 p-2">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Muted className="text-sm">{goal.category}</Muted>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Goal</DropdownMenuItem>
                      <DropdownMenuItem>Edit Goal</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Goal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Deadline: {formatDate(goal.deadline)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>${goal.currentAmount}</span>
                  </div>
                  <span>of ${goal.targetAmount}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full bg-blue-500 transition-all',
                      progress === MAX_PROGRESS && 'bg-green-500'
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Goal CTA */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">Set a New Goal</H2>
              <P>
                Create financial goals to stay on top of your savings and
                spending targets.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default GOALS_PAGE;
