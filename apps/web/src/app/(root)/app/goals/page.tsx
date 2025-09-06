'use client';

import {
  AlertCircle,
  ChevronDown,
  DollarSign,
  Filter,
  Loader2,
  Plus,
  Target,
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
import { useUserGoals } from '@/hooks/goals';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
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

const getProgress = (goal: {
  currentAmount: string | number;
  targetAmount: string | number;
}) => {
  const current =
    typeof goal.currentAmount === 'string'
      ? Number.parseFloat(goal.currentAmount)
      : goal.currentAmount;
  const target =
    typeof goal.targetAmount === 'string'
      ? Number.parseFloat(goal.targetAmount)
      : goal.targetAmount;
  return Math.min((current / target) * MAX_PROGRESS, MAX_PROGRESS);
};

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Goal...
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
        <AlertCircle className="h-5 w-5" /> No Goals
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven't created any financial goals yet. Click "Add Goal" to get
        started.
      </p>
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
            There was an error loading your financial goals. Please try
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

const GOALS_PAGE = () => {
  const { data: goals, isLoading, error } = useUserGoals();

  if (isLoading) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Financial Goals</H2>
            <Muted>
              Track and manage your financial goals, savings, and deadlines.
            </Muted>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" disabled variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button className="gap-2" disabled>
              <Plus className="h-4 w-4" /> Add Goal
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map(() => (
            <LoadingCard key={crypto.randomUUID()} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Financial Goals</H2>
            <Muted>
              Track and manage your financial goals, savings, and deadlines.
            </Muted>
          </div>
        </div>

        <Separator />

        <ErrorState />
      </main>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <main className="relative space-y-8 p-6">
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

        <EmptyStateCard />
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
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
                    <span>
                      $
                      {typeof goal.currentAmount === 'string'
                        ? Number.parseFloat(goal.currentAmount)
                        : goal.currentAmount}
                    </span>
                  </div>
                  <span>
                    of $
                    {typeof goal.targetAmount === 'string'
                      ? Number.parseFloat(goal.targetAmount)
                      : goal.targetAmount}
                  </span>
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
