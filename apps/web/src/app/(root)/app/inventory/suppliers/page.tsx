'use client';

import {
  Activity,
  BarChart3,
  Filter,
  Plus,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserSupplierDelete, useUserSuppliers } from '@/hooks/inventory';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_SUPPLIERS = 1;

type SupplierApiData = {
  id: string;
  businessProfileId: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type SupplierEntry = SupplierApiData;

type SupplierStats = {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  activeRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToSupplierEntry = (
  data: SupplierApiData[]
): SupplierEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const calculateSupplierStats = (suppliers: SupplierEntry[]): SupplierStats => {
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === 'active').length;
  const inactiveSuppliers = suppliers.filter(
    (s) => s.status === 'inactive'
  ).length;

  const activeRatio =
    (activeSuppliers / Math.max(MIN_SUPPLIERS, totalSuppliers)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalSuppliers,
    activeSuppliers,
    inactiveSuppliers,
    activeRatio,
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

const SupplierStats = ({ stats }: { stats: SupplierStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Truck}
        subtitle="Total registered suppliers"
        title="Total Suppliers"
        value={stats.totalSuppliers.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={Activity}
        subtitle="Suppliers currently active"
        title="Active Suppliers"
        value={stats.activeSuppliers.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle="Suppliers currently inactive"
        title="Inactive Suppliers"
        value={stats.inactiveSuppliers.toLocaleString()}
      />
      <StatsCard
        badge="Ratio"
        color="default"
        icon={BarChart3}
        subtitle="Percentage of suppliers that are active"
        title="Active Supplier Ratio"
        value={`${stats.activeRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const SupplierTable = ({
  suppliers,
  deleteSupplier,
}: {
  suppliers: SupplierEntry[];
  deleteSupplier: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Supplier List</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your business suppliers in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {suppliers.length.toLocaleString()}{' '}
        {suppliers.length === 1 ? 'supplier' : 'suppliers'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteSupplier({ id }))),
        })}
        data={suppliers}
        entityNamePlural="Suppliers"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const SupplierEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Truck className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Suppliers
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your supply chain by adding your first
        supplier. Monitor performance, track orders, and analyze relationships
        to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Supplier
      </Button>
    </CardContent>
  </Card>
);

const SupplierQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your supplier records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Supplier
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SUPPLIERS_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserSuppliers();
  const { mutate: deleteSupplier } = useUserSupplierDelete();
  const router = useRouter();

  const suppliers = mapApiDataToSupplierEntry(apiData);
  const stats = suppliers.length > 0 ? calculateSupplierStats(suppliers) : null;

  const handleAddEntry = () => router.push('/app/inventory/suppliers/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats ? () => <SupplierStats stats={stats} /> : undefined;

  const renderTable = () => (
    <SupplierTable deleteSupplier={deleteSupplier} suppliers={suppliers} />
  );

  const renderEmptyState = () => (
    <SupplierEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <SupplierQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={suppliers}
      description="Track suppliers, their offerings, and sourcing information."
      entityNamePlural="Suppliers"
      entityNameSingular="Supplier"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Supplier Management"
    />
  );
};

export default SUPPLIERS_PAGE;
