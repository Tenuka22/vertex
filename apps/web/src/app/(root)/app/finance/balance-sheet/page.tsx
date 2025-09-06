'use client';

import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Filter,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useUserBalanceSheetDelete,
  useUserBalanceSheets,
} from '@/hooks/finance';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const MIN_ENTRIES = 1;

type BalanceSheetApiData = {
  id: string;
  title: string;
  description: string | null;
  amount: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY';
  createdAt: Date;
  updatedAt: Date;
};

type BalanceSheetEntry = BalanceSheetApiData;

type BalanceSheetStats = {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  thisMonthAssets: number;
  thisMonthLiabilities: number;
  thisMonthEquity: number;
  totalEntries: number;
  avgAssets: number;
  avgLiabilities: number;
  avgEquity: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToBalanceSheetEntry = (
  data: BalanceSheetApiData[]
): BalanceSheetEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const calculateBalanceSheetStats = (
  balanceSheetItems: BalanceSheetEntry[]
): BalanceSheetStats => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalAssets = balanceSheetItems
    .filter((item) => item.type === 'ASSET')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalLiabilities = balanceSheetItems
    .filter((item) => item.type === 'LIABILITY')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalEquity = balanceSheetItems
    .filter((item) => item.type === 'EQUITY')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const thisMonthEntries = balanceSheetItems.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  });

  const thisMonthAssets = thisMonthEntries
    .filter((item) => item.type === 'ASSET')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const thisMonthLiabilities = thisMonthEntries
    .filter((item) => item.type === 'LIABILITY')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const thisMonthEquity = thisMonthEntries
    .filter((item) => item.type === 'EQUITY')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const avgAssets =
    totalAssets /
    Math.max(
      MIN_ENTRIES,
      balanceSheetItems.filter((item) => item.type === 'ASSET').length
    );
  const avgLiabilities =
    totalLiabilities /
    Math.max(
      MIN_ENTRIES,
      balanceSheetItems.filter((item) => item.type === 'LIABILITY').length
    );
  const avgEquity =
    totalEquity /
    Math.max(
      MIN_ENTRIES,
      balanceSheetItems.filter((item) => item.type === 'EQUITY').length
    );

  return {
    totalAssets,
    totalLiabilities,
    totalEquity,
    thisMonthAssets,
    thisMonthLiabilities,
    thisMonthEquity,
    totalEntries: balanceSheetItems.length,
    avgAssets,
    avgLiabilities,
    avgEquity,
  };
};

const getEquityColor = (equity: number): 'green' | 'red' => {
  return equity >= 0 ? 'green' : 'red';
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

const BalanceSheetStats = ({ stats }: { stats: BalanceSheetStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="green"
        icon={TrendingUp}
        subtitle={`Total assets across ${stats.totalEntries.toLocaleString()} reports`}
        title="Total Assets"
        value={`$${formatCurrency(stats.totalAssets)}`}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle={`Total liabilities across ${stats.totalEntries.toLocaleString()} reports`}
        title="Total Liabilities"
        value={`$${formatCurrency(stats.totalLiabilities)}`}
      />
      <StatsCard
        color={getEquityColor(stats.totalEquity)}
        icon={Activity}
        subtitle={`Net equity across ${stats.totalEntries.toLocaleString()} reports`}
        title="Total Equity"
        value={`${stats.totalEquity >= 0 ? '+' : ''}$${formatCurrency(Math.abs(stats.totalEquity))}`}
      />
      <StatsCard
        badge="Current Month"
        color={getEquityColor(stats.thisMonthEquity)}
        icon={Calendar}
        subtitle={`Equity for ${stats.thisMonthEquity.toLocaleString()} reports this month`}
        title="Monthly Equity"
        value={`$${formatCurrency(Math.abs(stats.thisMonthEquity))}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average assets per report"
        title="Avg Assets Per Report"
        value={`$${formatCurrency(stats.avgAssets)}`}
      />
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average liabilities per report"
        title="Avg Liabilities Per Report"
        value={`$${formatCurrency(stats.avgLiabilities)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="average equity per report"
        title="Avg Equity Per Report"
        value={`$${formatCurrency(stats.avgEquity)}`}
      />
    </div>
  </div>
);

const BalanceSheetTable = ({
  balanceSheets,
  deleteBalanceSheet,
}: {
  balanceSheets: BalanceSheetEntry[];
  deleteBalanceSheet: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">
          Complete Balance Sheet History
        </H2>
        <p className="text-muted-foreground text-sm">
          Track and manage all your balance sheet reports in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {balanceSheets.length.toLocaleString()}{' '}
        {balanceSheets.length === 1 ? 'report' : 'reports'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteBalanceSheet({ id }))),
        })}
        data={balanceSheets}
        entityNamePlural="Balance Sheet Reports"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const BalanceSheetEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <BarChart3 className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Tracking Your Balance Sheet
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your financial position by recording your
        first balance sheet. Monitor assets, liabilities, and equity to make
        better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Record Your First Balance Sheet
      </Button>
    </CardContent>
  </Card>
);

const BalanceSheetQuickActions = ({
  onAddEntry,
}: {
  onAddEntry: () => void;
}) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your balance sheet records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Balance Sheet
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BALANCE_SHEET_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserBalanceSheets();
  const { mutate: deleteBalanceSheet } = useUserBalanceSheetDelete();
  const router = useRouter();

  const balanceSheetItems = mapApiDataToBalanceSheetEntry(apiData);
  const stats =
    balanceSheetItems.length > 0
      ? calculateBalanceSheetStats(balanceSheetItems)
      : null;

  const handleAddEntry = () => router.push('/app/finance/balance-sheet/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats
    ? () => <BalanceSheetStats stats={stats} />
    : undefined;

  const renderTable = () => (
    <BalanceSheetTable
      balanceSheets={balanceSheetItems}
      deleteBalanceSheet={deleteBalanceSheet}
    />
  );

  const renderEmptyState = () => (
    <BalanceSheetEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <BalanceSheetQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={balanceSheetItems}
      description="Monitor your financial position by tracking all assets, liabilities, and equity over time."
      entityNamePlural="Balance Sheet Reports"
      entityNameSingular="Balance Sheet"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Balance Sheet Management"
    />
  );
};

export default BALANCE_SHEET_PAGE;
