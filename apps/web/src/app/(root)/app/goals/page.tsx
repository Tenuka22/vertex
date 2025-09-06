'use client';

import {
  Activity,
  BarChart3,
  DollarSign,
  Filter,
  Plus,
  Target,
  TrendingDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserGoalDelete, useUserGoals } from '@/hooks/goals';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_GOALS = 1;

type GoalApiData = {
  id: string;
  businessProfileId: string;
  title: string;
  category: string;
  targetAmount: string;
  currentAmount: string;
  deadline: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type GoalEntry = GoalApiData;

type GoalStats = {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  avgProgress: number;
  activeRatio: number;
  completedRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToGoalEntry = (data: GoalApiData[]): GoalEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const calculateGoalStats = (goals: GoalEntry[]): GoalStats => {
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === 'active').length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const overdueGoals = goals.filter((g) => g.status === 'overdue').length;

  const totalTargetAmount = goals.reduce(
    (sum, g) => sum + Number(g.targetAmount || 0),
    0
  );
  const totalCurrentAmount = goals.reduce(
    (sum, g) => sum + Number(g.currentAmount || 0),
    0
  );

  const totalProgress = goals.reduce((sum, g) => {
    const current = Number.parseFloat(g.currentAmount);
    const target = Number.parseFloat(g.targetAmount);
    return sum + (target > 0 ? (current / target) * PERCENTAGE_MULTIPLIER : 0);
  }, 0);
  const avgProgress = totalProgress / Math.max(MIN_GOALS, totalGoals);

  const activeRatio =
    (activeGoals / Math.max(MIN_GOALS, totalGoals)) * PERCENTAGE_MULTIPLIER;
  const completedRatio =
    (completedGoals / Math.max(MIN_GOALS, totalGoals)) * PERCENTAGE_MULTIPLIER;

  return {
    totalGoals,
    activeGoals,
    completedGoals,
    overdueGoals,
    totalTargetAmount,
    totalCurrentAmount,
    avgProgress,
    activeRatio,
    completedRatio,
  };
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'default',
  badge,
}: StatsCardProps) => {
  const colorClasses = {
    green: 'text-emerald-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    default: 'text-foreground',
  };

  const iconColorClasses = {
    green: 'text-emerald-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
    default: 'text-muted-foreground',
  };

  return (
    <Card className="border shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-medium text-muted-foreground text-sm leading-none">
                {title}
              </p>
              {badge && (
                <Badge className="px-2 py-0.5 text-xs" variant="outline">
                  {badge}
                </Badge>
              )}
            </div>
            <p
              className={`font-bold text-2xl leading-none tracking-tight ${colorClasses[color]}`}
            >
              {value}
            </p>
            {subtitle && (
              <p className="text-muted-foreground text-xs leading-none">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <Icon className={`${ICON_SIZE_CLASS} ${iconColorClasses[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GoalStats = ({ stats }: { stats: GoalStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Target}
        subtitle="Total financial goals set"
        title="Total Goals"
        value={stats.totalGoals.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={Activity}
        subtitle="Goals currently active"
        title="Active Goals"
        value={stats.activeGoals.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle="Goals past their deadline"
        title="Overdue Goals"
        value={stats.overdueGoals.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={DollarSign}
        subtitle="Total target amount across all goals"
        title="Total Target"
        value={`$${formatCurrency(stats.totalTargetAmount)}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="total amount saved towards goals"
        title="Total Saved"
        value={`$${formatCurrency(stats.totalCurrentAmount)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="average progress across all goals"
        title="Avg Progress"
        value={`${stats.avgProgress.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of goals completed"
        title="Completed Goal Ratio"
        value={`${stats.completedRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const GoalTable = ({
  goals,
  deleteGoal,
}: {
  goals: GoalEntry[];
  deleteGoal: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Goal List</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your financial goals in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {goals.length.toLocaleString()} {goals.length === 1 ? 'goal' : 'goals'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteGoal({ id }))),
        })}
        data={goals}
        entityNamePlural="Goals"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const GoalEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Target className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Setting Your Financial Goals
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your financial aspirations by adding your
        first goal. Monitor progress, track deadlines, and analyze achievements
        to make better financial decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Set Your First Goal
      </Button>
    </CardContent>
  </Card>
);

const GoalQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your goal records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Goal
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const GOALS_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserGoals();
  const { mutate: deleteGoal } = useUserGoalDelete();
  const router = useRouter();

  const goals = mapApiDataToGoalEntry(apiData);
  const stats = goals.length > 0 ? calculateGoalStats(goals) : null;

  const handleAddEntry = () => router.push('/app/goals/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats ? () => <GoalStats stats={stats} /> : undefined;

  const renderTable = () => <GoalTable deleteGoal={deleteGoal} goals={goals} />;

  const renderEmptyState = () => <GoalEmptyState onAddEntry={handleAddEntry} />;

  const renderQuickActions = () => (
    <GoalQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={goals}
      description="Track and manage your financial goals, savings, and deadlines."
      entityNamePlural="Goals"
      entityNameSingular="Goal"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Financial Goals Management"
    />
  );
};

export default GOALS_PAGE;
