'use client';

import {
  Activity,
  BarChart3,
  DollarSign,
  Filter,
  Package,
  Plus,
  Store,
  Tag,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserProductDelete, useUserProducts } from '@/hooks/products';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_OFFERINGS = 1;

type ProductApiData = {
  id: string;
  businessProfileId: string;
  name: string;
  description: string | null;
  price: string;
  type: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProductEntry = ProductApiData;

type ProductStats = {
  totalOfferings: number;
  activeOfferings: number;
  totalProducts: number;
  totalServices: number;
  avgPrice: number;
  productRatio: number;
  serviceRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToProductEntry = (data: ProductApiData[]): ProductEntry[] => {
  return data.map((item) => ({
    ...item,
  }));
};

const calculateProductStats = (offerings: ProductEntry[]): ProductStats => {
  const totalOfferings = offerings.length;
  const activeOfferings = offerings.filter((o) => o.status === 'active').length;
  const totalProducts = offerings.filter((o) => o.type === 'Product').length;
  const totalServices = offerings.filter((o) => o.type === 'Service').length;

  const totalPrice = offerings.reduce(
    (sum, o) => sum + Number(o.price || 0),
    0
  );
  const avgPrice = totalPrice / Math.max(MIN_OFFERINGS, totalOfferings);

  const productRatio =
    (totalProducts / Math.max(MIN_OFFERINGS, totalOfferings)) *
    PERCENTAGE_MULTIPLIER;
  const serviceRatio =
    (totalServices / Math.max(MIN_OFFERINGS, totalOfferings)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalOfferings,
    activeOfferings,
    totalProducts,
    totalServices,
    avgPrice,
    productRatio,
    serviceRatio,
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

const ProductStats = ({ stats }: { stats: ProductStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Package}
        subtitle="Total products and services offered"
        title="Total Offerings"
        value={stats.totalOfferings.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={Activity}
        subtitle="Currently active products and services"
        title="Active Offerings"
        value={stats.activeOfferings.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={Store}
        subtitle="Total number of products"
        title="Total Products"
        value={stats.totalProducts.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={Tag}
        subtitle="Total number of services"
        title="Total Services"
        value={stats.totalServices.toLocaleString()}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average price across all offerings"
        title="Average Price"
        value={`$${formatCurrency(stats.avgPrice)}`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of offerings that are products"
        title="Product Ratio"
        value={`${stats.productRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of offerings that are services"
        title="Service Ratio"
        value={`${stats.serviceRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const ProductTable = ({
  offerings,
  deleteProduct,
}: {
  offerings: ProductEntry[];
  deleteProduct: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Offerings List</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your products and services in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {offerings.length.toLocaleString()}{' '}
        {offerings.length === 1 ? 'offering' : 'offerings'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteProduct({ id }))),
        })}
        data={offerings}
        entityNamePlural="Products & Services"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const ProductEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Offerings
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your products and services by adding your
        first offering. Monitor inventory, track sales, and analyze performance
        to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Offering
      </Button>
    </CardContent>
  </Card>
);

const ProductQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your offerings and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Offering
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PRODUCTS_SERVICES_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserProducts();
  const { mutate: deleteProduct } = useUserProductDelete();
  const router = useRouter();

  const offerings = mapApiDataToProductEntry(apiData);
  const stats = offerings.length > 0 ? calculateProductStats(offerings) : null;

  const handleAddEntry = () => router.push('/app/inventory/products/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats ? () => <ProductStats stats={stats} /> : undefined;

  const renderTable = () => (
    <ProductTable deleteProduct={deleteProduct} offerings={offerings} />
  );

  const renderEmptyState = () => (
    <ProductEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <ProductQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={offerings}
      description="Manage your offerings and keep track of availability and pricing."
      entityNamePlural="Products & Services"
      entityNameSingular="Product/Service"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Products & Services Management"
    />
  );
};

export default PRODUCTS_SERVICES_PAGE;
