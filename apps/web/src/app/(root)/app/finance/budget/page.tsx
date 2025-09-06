'use client';

import { BarChart3, Filter, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserBudgetDelete, useUserBudgets } from '@/hooks/finance';
import { getColumns } from './columns';

const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';

type BudgetApiData = {
  id: string;
  businessProfileId: string;
  category:
    | 'MARKETING'
    | 'OPERATIONS'
    | 'PAYROLL'
    | 'UTILITIES'
    | 'MISCELLANEOUS';
  allocatedAmount: string;
  spentAmount: string;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
};

type BudgetEntry = BudgetApiData;

const mapApiDataToBudgetEntry = (data: BudgetApiData[]): BudgetEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const BudgetTable = ({
  budgets,
  deleteBudget,
}: {
  budgets: BudgetEntry[];
  deleteBudget: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Budget History</H2>
        <p className="text-muted-foreground text-sm">
          Track and manage all your budget reports in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {budgets.length.toLocaleString()}{' '}
        {budgets.length === 1 ? 'budget' : 'budgets'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteBudget({ id }))),
        })}
        data={budgets}
        entityNamePlural="Budget Reports"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const BudgetEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <BarChart3 className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Tracking Your Budgets
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your financial planning by recording your
        first budget. Monitor allocated amounts, spent amounts, and remaining
        funds to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Record Your First Budget
      </Button>
    </CardContent>
  </Card>
);

const BudgetQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your budget records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Budget
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BUDGET_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserBudgets();
  const { mutate: deleteBudget } = useUserBudgetDelete();
  const router = useRouter();

  const budgets = mapApiDataToBudgetEntry(apiData);

  const handleAddEntry = () => router.push('/app/finance/budget/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderTable = () => (
    <BudgetTable budgets={budgets} deleteBudget={deleteBudget} />
  );

  const renderEmptyState = () => (
    <BudgetEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <BudgetQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={budgets}
      description="Monitor your financial planning by tracking all allocated amounts, spent amounts, and remaining funds over time."
      entityNamePlural="Budget Reports"
      entityNameSingular="Budget"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderTable={renderTable}
      title="Budget Management"
    />
  );
};

export default BUDGET_PAGE;
