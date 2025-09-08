'use client';

import type { cashFlows } from '@repo/db/schema/primary';
import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { H3, Muted, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDeleteUserCashFlow, useUserCashFlows } from '@/hooks/finance';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_TRANSACTIONS = 1;

type CashFlowEntry = typeof cashFlows.$inferSelect & {
  type: 'PAYMENT' | 'PAYOUT';
  transactionDate: string | Date;
};

type Stats = {
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  avgIncome: number;
  avgExpense: number;
  totalTransactions: number;
  incomeTransactions: number;
  expenseTransactions: number;
  thisMonthTransactions: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToCashFlowEntry = (
  data: (typeof cashFlows.$inferSelect)[]
): CashFlowEntry[] => {
  return data.map((item) => ({
    ...item,
    type:
      item.direction === 'INCOMING'
        ? ('PAYMENT' as const)
        : ('PAYOUT' as const),
    transactionDate: item.flowDate,
  }));
};

const calculateStats = (cashFlowData: CashFlowEntry[]): Stats => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalIncome = cashFlowData
    .filter((cf) => cf.type === 'PAYMENT')
    .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);

  const totalExpenses = cashFlowData
    .filter((cf) => cf.type === 'PAYOUT')
    .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);

  const netFlow = totalIncome - totalExpenses;

  const thisMonthTransactions = cashFlowData.filter((cf) => {
    const transactionDate = new Date(cf.transactionDate);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const thisMonthIncome = thisMonthTransactions
    .filter((cf) => cf.type === 'PAYMENT')
    .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter((cf) => cf.type === 'PAYOUT')
    .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);

  const incomeTransactions = cashFlowData.filter(
    (cf) => cf.type === 'PAYMENT'
  ).length;
  const expenseTransactions = cashFlowData.filter(
    (cf) => cf.type === 'PAYOUT'
  ).length;

  const avgIncome =
    totalIncome / Math.max(MIN_TRANSACTIONS, incomeTransactions);
  const avgExpense =
    totalExpenses / Math.max(MIN_TRANSACTIONS, expenseTransactions);

  const totalTransactions = cashFlowData.length;

  return {
    totalIncome,
    totalExpenses,
    netFlow,
    thisMonthIncome,
    thisMonthExpenses,
    avgIncome,
    avgExpense,
    totalTransactions,
    incomeTransactions,
    expenseTransactions,
    thisMonthTransactions: thisMonthTransactions.length,
  };
};

const getNetFlowColor = (netFlow: number): 'green' | 'red' => {
  return netFlow >= 0 ? 'green' : 'red';
};

const getThisMonthColor = (
  thisMonthIncome: number,
  thisMonthExpenses: number
): 'green' | 'red' => {
  return thisMonthIncome - thisMonthExpenses >= 0 ? 'green' : 'red';
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
      <CardContent>
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

const CashFlowStats = ({ stats }: { stats: Stats }) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="green"
        icon={TrendingUp}
        subtitle={`${stats.incomeTransactions.toLocaleString()} incoming transactions`}
        title="Total Revenue"
        value={`$${formatCurrency(stats.totalIncome)}`}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle={`${stats.expenseTransactions.toLocaleString()} outgoing transactions`}
        title="Total Expenses"
        value={`$${formatCurrency(stats.totalExpenses)}`}
      />
      <StatsCard
        color={getNetFlowColor(stats.netFlow)}
        icon={Activity}
        subtitle={`${stats.totalTransactions.toLocaleString()} total transactions processed`}
        title="Net Cash Flow"
        value={`${stats.netFlow >= 0 ? '+' : ''}$${formatCurrency(Math.abs(stats.netFlow))}`}
      />
      <StatsCard
        badge="Current Month"
        color={getThisMonthColor(
          stats.thisMonthIncome,
          stats.thisMonthExpenses
        )}
        icon={Calendar}
        subtitle={`${stats.thisMonthTransactions.toLocaleString()} transactions this month`}
        title="Monthly Performance"
        value={`$${formatCurrency(Math.abs(stats.thisMonthIncome - stats.thisMonthExpenses))}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average per incoming transaction"
        title="Avg Revenue Per Transaction"
        value={`$${formatCurrency(stats.avgIncome)}`}
      />
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average per outgoing transaction"
        title="Avg Expense Per Transaction"
        value={`$${formatCurrency(stats.avgExpense)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of transactions that are incoming"
        title="Revenue Transaction Ratio"
        value={`${Math.round((stats.incomeTransactions / Math.max(MIN_TRANSACTIONS, stats.totalTransactions)) * PERCENTAGE_MULTIPLIER)}%`}
      />
    </div>
  </div>
);

const CashFlowTable = ({
  cashFlowData,
  deleteCashFlow,
}: {
  cashFlowData: CashFlowEntry[];
  deleteCashFlow: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H3 className="font-semibold text-xl">Complete Transaction History</H3>
        <p className="text-muted-foreground text-sm">
          Track and manage all your cash flow transactions in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {cashFlowData.length.toLocaleString()}{' '}
        {cashFlowData.length === 1 ? 'transaction' : 'transactions'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card p-1 shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteCashFlow({ id }))),
        })}
        data={cashFlowData}
        entityNamePlural="Cash Flow Transactions"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const CashFlowEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <BarChart3 className="h-10 w-10 text-primary" />
      </div>
      <H3 className="mb-3 font-semibold text-xl">
        Start Tracking Your Cash Flow
      </H3>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your financial health by recording your
        first transaction. Monitor incoming revenue, track expenses, and analyze
        trends to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Record Your First Transaction
      </Button>
    </CardContent>
  </Card>
);

const CashFlowQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card>
    <CardContent>
      <H3 className="font-semibold text-xl">Quick Actions</H3>
      <Muted className="text-muted-foreground">
        Efficiently manage your cash flow records and generate insights
      </Muted>
      <div className="flex w-fit justify-start gap-3 pt-4">
        <Button asChild className="gap-2" variant="outline">
          <Link href="/app/analytics">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Link>
        </Button>
        <Button className="gap-2" onClick={onAddEntry}>
          <Plus className={ICON_SIZE_SMALL_CLASS} />
          Add Transaction
        </Button>
      </div>
    </CardContent>
  </Card>
);

const CASH_FLOW_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserCashFlows();
  const { mutate: deleteCashFlow } = useDeleteUserCashFlow();
  const router = useRouter();

  const cashFlowData = mapApiDataToCashFlowEntry(apiData);
  const stats = cashFlowData.length > 0 ? calculateStats(cashFlowData) : null;

  const handleAddEntry = () => router.push('/app/finance/cash-flow/create');

  const renderStats = stats ? () => <CashFlowStats stats={stats} /> : undefined;

  const renderTable = () => (
    <CashFlowTable
      cashFlowData={cashFlowData}
      deleteCashFlow={deleteCashFlow}
    />
  );

  const renderEmptyState = () => (
    <CashFlowEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <CashFlowQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      data={cashFlowData}
      description="Monitor your financial health by tracking all incoming revenue and outgoing expenses over time."
      entityNamePlural="Cash Flow Transactions"
      entityNameSingular="Transaction"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Cash Flow Management"
    />
  );
};

export default CASH_FLOW_PAGE;
