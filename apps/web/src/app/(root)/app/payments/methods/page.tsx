'use client';

import {
  Activity,
  Banknote,
  BarChart3,
  CreditCard,
  Filter,
  Plus,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useUserPaymentMethodDelete,
  useUserPaymentMethods,
} from '@/hooks/payments';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_METHODS = 1;

type PaymentMethodApiData = {
  id: string;
  businessProfileId: string;
  type: 'BANK' | 'CASH' | 'CARD_CREDIT' | 'DIGITAL_WALLET' | 'OTHER';
  details: Record<string, string | number | boolean | Date | null> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type PaymentMethodEntry = PaymentMethodApiData;

type PaymentMethodStats = {
  totalMethods: number;
  activeMethods: number;
  cardMethods: number;
  bankMethods: number;
  digitalWalletMethods: number;
  activeRatio: number;
  cardRatio: number;
  bankRatio: number;
  digitalWalletRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToPaymentMethodEntry = (
  data: PaymentMethodApiData[]
): PaymentMethodEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const calculatePaymentMethodStats = (
  methods: PaymentMethodEntry[]
): PaymentMethodStats => {
  const totalMethods = methods.length;
  const activeMethods = methods.filter((m) => m.isActive).length;
  const cardMethods = methods.filter((m) => m.type === 'CARD_CREDIT').length;
  const bankMethods = methods.filter((m) => m.type === 'BANK').length;
  const digitalWalletMethods = methods.filter(
    (m) => m.type === 'DIGITAL_WALLET'
  ).length;

  const activeRatio =
    (activeMethods / Math.max(MIN_METHODS, totalMethods)) *
    PERCENTAGE_MULTIPLIER;
  const cardRatio =
    (cardMethods / Math.max(MIN_METHODS, totalMethods)) * PERCENTAGE_MULTIPLIER;
  const bankRatio =
    (bankMethods / Math.max(MIN_METHODS, totalMethods)) * PERCENTAGE_MULTIPLIER;
  const digitalWalletRatio =
    (digitalWalletMethods / Math.max(MIN_METHODS, totalMethods)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalMethods,
    activeMethods,
    cardMethods,
    bankMethods,
    digitalWalletMethods,
    activeRatio,
    cardRatio,
    bankRatio,
    digitalWalletRatio,
  };
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

const PaymentMethodStats = ({ stats }: { stats: PaymentMethodStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Wallet}
        subtitle="Total payment methods registered"
        title="Total Methods"
        value={stats.totalMethods.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={Activity}
        subtitle="Payment methods currently active"
        title="Active Methods"
        value={stats.activeMethods.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={CreditCard}
        subtitle="Credit/Debit card methods"
        title="Card Methods"
        value={stats.cardMethods.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={Banknote}
        subtitle="Bank account methods"
        title="Bank Methods"
        value={stats.bankMethods.toLocaleString()}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of methods that are active"
        title="Active Method Ratio"
        value={`${stats.activeRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of methods that are cards"
        title="Card Method Ratio"
        value={`${stats.cardRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of methods that are bank accounts"
        title="Bank Method Ratio"
        value={`${stats.bankRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const PaymentMethodTable = ({
  paymentMethods,
  deletePaymentMethod,
}: {
  paymentMethods: PaymentMethodEntry[];
  deletePaymentMethod: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Payment Method List</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your payment methods in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {paymentMethods.length.toLocaleString()}{' '}
        {paymentMethods.length === 1 ? 'method' : 'methods'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deletePaymentMethod({ id }))),
        })}
        data={paymentMethods}
        entityNamePlural="Payment Methods"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const PaymentMethodEmptyState = ({
  onAddEntry,
}: {
  onAddEntry: () => void;
}) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Wallet className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Payment Methods
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your payment options by adding your first
        payment method. Monitor status, track usage, and analyze preferences to
        make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Payment Method
      </Button>
    </CardContent>
  </Card>
);

const PaymentMethodQuickActions = ({
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
            Efficiently manage your payment method records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Method
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PAYMENT_METHODS_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserPaymentMethods();
  const { mutate: deletePaymentMethod } = useUserPaymentMethodDelete();
  const router = useRouter();

  const paymentMethods = mapApiDataToPaymentMethodEntry(apiData);
  const stats =
    paymentMethods.length > 0
      ? calculatePaymentMethodStats(paymentMethods)
      : null;

  const handleAddEntry = () => router.push('/app/payments/methods/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats
    ? () => <PaymentMethodStats stats={stats} />
    : undefined;

  const renderTable = () => (
    <PaymentMethodTable
      deletePaymentMethod={deletePaymentMethod}
      paymentMethods={paymentMethods}
    />
  );

  const renderEmptyState = () => (
    <PaymentMethodEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <PaymentMethodQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={paymentMethods}
      description="Manage how you pay suppliers and receive payments from customers."
      entityNamePlural="Payment Methods"
      entityNameSingular="Payment Method"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Payment Methods Management"
    />
  );
};

export default PAYMENT_METHODS_PAGE;
