'use client';

import {
  BarChart3,
  DollarSign,
  Filter,
  Plus,
  Receipt,
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
import { useUserInvoiceDelete, useUserInvoices } from '@/hooks/invoices';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_INVOICES = 1;

type InvoiceApiData = {
  id: string;
  businessProfileId: string;
  invoiceNumber: string;
  amount: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

type InvoiceEntry = InvoiceApiData & {
  customer: string;
};

type InvoiceStats = {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  avgInvoiceAmount: number;
  paidRatio: number;
  pendingRatio: number;
  overdueRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToInvoiceEntry = (data: InvoiceApiData[]): InvoiceEntry[] => {
  return data.map((item) => ({
    ...item,
    customer: 'Unknown Customer',
  }));
};

const calculateInvoiceStats = (invoices: InvoiceEntry[]): InvoiceStats => {
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === 'paid').length;
  const pendingInvoices = invoices.filter((i) => i.status === 'pending').length;
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue').length;

  const totalAmount = invoices.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );
  const avgInvoiceAmount = totalAmount / Math.max(MIN_INVOICES, totalInvoices);

  const paidRatio =
    (paidInvoices / Math.max(MIN_INVOICES, totalInvoices)) *
    PERCENTAGE_MULTIPLIER;
  const pendingRatio =
    (pendingInvoices / Math.max(MIN_INVOICES, totalInvoices)) *
    PERCENTAGE_MULTIPLIER;
  const overdueRatio =
    (overdueInvoices / Math.max(MIN_INVOICES, totalInvoices)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    totalAmount,
    avgInvoiceAmount,
    paidRatio,
    pendingRatio,
    overdueRatio,
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

const InvoiceStats = ({ stats }: { stats: InvoiceStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Receipt}
        subtitle="Total invoices generated"
        title="Total Invoices"
        value={stats.totalInvoices.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={TrendingUp}
        subtitle="Invoices successfully paid"
        title="Paid Invoices"
        value={stats.paidInvoices.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle="Invoices currently overdue"
        title="Overdue Invoices"
        value={stats.overdueInvoices.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={DollarSign}
        subtitle="Total value of all invoices"
        title="Total Invoice Value"
        value={`$${formatCurrency(stats.totalAmount)}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average amount per invoice"
        title="Avg Invoice Value"
        value={`$${formatCurrency(stats.avgInvoiceAmount)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of invoices paid"
        title="Paid Invoice Ratio"
        value={`${stats.paidRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of invoices pending"
        title="Pending Invoice Ratio"
        value={`${stats.pendingRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const InvoiceTable = ({
  invoices,
  deleteInvoice,
}: {
  invoices: InvoiceEntry[];
  deleteInvoice: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Invoice History</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your customer invoices in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {invoices.length.toLocaleString()}{' '}
        {invoices.length === 1 ? 'invoice' : 'invoices'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteInvoice({ id }))),
        })}
        data={invoices}
        entityNamePlural="Invoices"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const InvoiceEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Receipt className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Invoices
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your billing process by adding your first
        invoice. Monitor payment status, track due dates, and analyze revenue to
        make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Create Your First Invoice
      </Button>
    </CardContent>
  </Card>
);

const InvoiceQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your invoice records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            New Invoice
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const InvoicesPage = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserInvoices();
  const { mutate: deleteInvoice } = useUserInvoiceDelete();
  const router = useRouter();

  const invoices = mapApiDataToInvoiceEntry(apiData);
  const stats = invoices.length > 0 ? calculateInvoiceStats(invoices) : null;

  const handleAddEntry = () => router.push('/app/invoices/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats ? () => <InvoiceStats stats={stats} /> : undefined;

  const renderTable = () => (
    <InvoiceTable deleteInvoice={deleteInvoice} invoices={invoices} />
  );

  const renderEmptyState = () => (
    <InvoiceEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <InvoiceQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={invoices}
      description="Manage all customer invoices and their payment statuses."
      entityNamePlural="Invoices"
      entityNameSingular="Invoice"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Invoice Management"
    />
  );
};

export default InvoicesPage;
