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
import {
  useUserPurchaseOrderDelete,
  useUserPurchaseOrders,
} from '@/hooks/purchase-orders';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_ORDERS = 1;

type PurchaseOrderApiData = {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: string;
  orderDate: Date;
  expectedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
  supplier: {
    id: string;
    name: string | null;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
  };
};

type PurchaseOrderEntry = PurchaseOrderApiData;

type PurchaseOrderStats = {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  canceledOrders: number;
  totalAmount: number;
  avgOrderAmount: number;
  pendingRatio: number;
  deliveredRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToPurchaseOrderEntry = (
  data: PurchaseOrderApiData[]
): PurchaseOrderEntry[] => {
  return data;
};

const calculatePurchaseOrderStats = (
  orders: PurchaseOrderEntry[]
): PurchaseOrderStats => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const canceledOrders = orders.filter((o) => o.status === 'canceled').length;

  const totalAmount = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );
  const avgOrderAmount = totalAmount / Math.max(MIN_ORDERS, totalOrders);

  const pendingRatio =
    (pendingOrders / Math.max(MIN_ORDERS, totalOrders)) * PERCENTAGE_MULTIPLIER;
  const deliveredRatio =
    (deliveredOrders / Math.max(MIN_ORDERS, totalOrders)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalOrders,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    canceledOrders,
    totalAmount,
    avgOrderAmount,
    pendingRatio,
    deliveredRatio,
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

const PurchaseOrderStats = ({ stats }: { stats: PurchaseOrderStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Receipt}
        subtitle="Total purchase orders placed"
        title="Total Orders"
        value={stats.totalOrders.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle="Orders currently awaiting fulfillment"
        title="Pending Orders"
        value={stats.pendingOrders.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={TrendingUp}
        subtitle="Orders successfully delivered"
        title="Delivered Orders"
        value={stats.deliveredOrders.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={DollarSign}
        subtitle="Total value of all purchase orders"
        title="Total Order Value"
        value={`$${formatCurrency(stats.totalAmount)}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average amount per purchase order"
        title="Avg Order Value"
        value={`$${formatCurrency(stats.avgOrderAmount)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of orders currently pending"
        title="Pending Order Ratio"
        value={`${stats.pendingRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of orders successfully delivered"
        title="Delivered Order Ratio"
        value={`${stats.deliveredRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const PurchaseOrderTable = ({
  orders,
  deletePurchaseOrder,
}: {
  orders: PurchaseOrderEntry[];
  deletePurchaseOrder: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">
          Complete Purchase Order History
        </H2>
        <p className="text-muted-foreground text-sm">
          Track and manage all your purchase orders in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {orders.length.toLocaleString()}{' '}
        {orders.length === 1 ? 'order' : 'orders'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deletePurchaseOrder({ id }))),
        })}
        data={orders}
        entityNamePlural="Purchase Orders"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const PurchaseOrderEmptyState = ({
  onAddEntry,
}: {
  onAddEntry: () => void;
}) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Receipt className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Purchase Orders
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your procurement process by adding your
        first purchase order. Monitor status, track deliveries, and analyze
        supplier performance to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Create Your First Purchase Order
      </Button>
    </CardContent>
  </Card>
);

const PurchaseOrderQuickActions = ({
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
            Efficiently manage your purchase order records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            New Order
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ORDERS_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserPurchaseOrders();
  const { mutate: deletePurchaseOrder } = useUserPurchaseOrderDelete();
  const router = useRouter();

  const orders = mapApiDataToPurchaseOrderEntry(apiData);
  const stats = orders.length > 0 ? calculatePurchaseOrderStats(orders) : null;

  const handleAddEntry = () =>
    router.push('/app/inventory/purchase-orders/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats
    ? () => <PurchaseOrderStats stats={stats} />
    : undefined;

  const renderTable = () => (
    <PurchaseOrderTable
      deletePurchaseOrder={deletePurchaseOrder}
      orders={orders}
    />
  );

  const renderEmptyState = () => (
    <PurchaseOrderEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <PurchaseOrderQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={orders}
      description="Track orders placed with suppliers and follow up on delivery status."
      entityNamePlural="Purchase Orders"
      entityNameSingular="Purchase Order"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Purchase Order Management"
    />
  );
};

export default ORDERS_PAGE;
