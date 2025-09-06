'use client';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  DollarSign,
  Filter,
  Plus,
  Receipt,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useUserTransactionDelete,
  useUserTransactions,
} from '@/hooks/payments';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_TRANSACTIONS = 1;

type TransactionApiData = {
  id: string;
  businessProfileId: string;
  paymentMethodId: string | null;
  expenseCategoryId: string | null;
  type: 'PAYMENT' | 'PAYOUT';
  amount: string;
  description: string | null;
  reference: string | null;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

type TransactionEntry = TransactionApiData;

type TransactionStats = {
  totalTransactions: number;
  incomingTransactions: number;
  outgoingTransactions: number;
  totalAmount: number;
  avgTransactionAmount: number;
  incomingRatio: number;
  outgoingRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToTransactionEntry = (
  data: TransactionApiData[]
): TransactionEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const calculateTransactionStats = (
  transactions: TransactionEntry[]
): TransactionStats => {
  const totalTransactions = transactions.length;
  const incomingTransactions = transactions.filter(
    (t) => t.type === 'PAYMENT'
  ).length;
  const outgoingTransactions = transactions.filter(
    (t) => t.type === 'PAYOUT'
  ).length;

  const totalAmount = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const avgTransactionAmount =
    totalAmount / Math.max(MIN_TRANSACTIONS, totalTransactions);

  const incomingRatio =
    (incomingTransactions / Math.max(MIN_TRANSACTIONS, totalTransactions)) *
    PERCENTAGE_MULTIPLIER;
  const outgoingRatio =
    (outgoingTransactions / Math.max(MIN_TRANSACTIONS, totalTransactions)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalTransactions,
    incomingTransactions,
    outgoingTransactions,
    totalAmount,
    avgTransactionAmount,
    incomingRatio,
    outgoingRatio,
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

const TransactionStats = ({ stats }: { stats: TransactionStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Receipt}
        subtitle="Total financial transactions recorded"
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={ArrowDownCircle}
        subtitle="Incoming payments received"
        title="Incoming Transactions"
        value={stats.incomingTransactions.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={ArrowUpCircle}
        subtitle="Outgoing payments made"
        title="Outgoing Transactions"
        value={stats.outgoingTransactions.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={DollarSign}
        subtitle="Total value of all transactions"
        title="Total Transaction Value"
        value={`$${formatCurrency(stats.totalAmount)}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average amount per transaction"
        title="Avg Transaction Value"
        value={`$${formatCurrency(stats.avgTransactionAmount)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of transactions that are incoming"
        title="Incoming Transaction Ratio"
        value={`${stats.incomingRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of transactions that are outgoing"
        title="Outgoing Transaction Ratio"
        value={`${stats.outgoingRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const TransactionTable = ({
  transactions,
  deleteTransaction,
}: {
  transactions: TransactionEntry[];
  deleteTransaction: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Transaction History</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your financial transactions in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {transactions.length.toLocaleString()}{' '}
        {transactions.length === 1 ? 'transaction' : 'transactions'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteTransaction({ id }))),
        })}
        data={transactions}
        entityNamePlural="Transactions"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const TransactionEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Receipt className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Transactions
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your financial movements by adding your
        first transaction. Monitor incoming and outgoing funds, track
        references, and analyze trends to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Transaction
      </Button>
    </CardContent>
  </Card>
);

const TransactionQuickActions = ({
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
            Efficiently manage your transaction records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Transaction
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TRANSACTIONS_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserTransactions();
  const { mutate: deleteTransaction } = useUserTransactionDelete();
  const router = useRouter();

  const transactions = mapApiDataToTransactionEntry(apiData);
  const stats =
    transactions.length > 0 ? calculateTransactionStats(transactions) : null;

  const handleAddEntry = () => router.push('/app/payments/transactions/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats
    ? () => <TransactionStats stats={stats} />
    : undefined;

  const renderTable = () => (
    <TransactionTable
      deleteTransaction={deleteTransaction}
      transactions={transactions}
    />
  );

  const renderEmptyState = () => (
    <TransactionEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <TransactionQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={transactions}
      description="View all incoming payments and outgoing supplier payouts."
      entityNamePlural="Transactions"
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
      title="Transaction Management"
    />
  );
};

export default TRANSACTIONS_PAGE;
