'use client';

import {
  BarChart3,
  DollarSign,
  Filter,
  Package,
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
import { useUserInventory, useUserInventoryDelete } from '@/hooks/inventory';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_ITEMS = 1;

type InventoryApiData = {
  id: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string | null;
    type: string;
    price: string | null;
    category: string;
    status: string;
  };
};

type InventoryEntry = InventoryApiData;

type InventoryStats = {
  totalItems: number;
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalQuantity: number;
  totalValue: number;
  avgQuantity: number;
  avgUnitCost: number;
  inStockRatio: number;
  lowStockRatio: number;
  outOfStockRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToInventoryEntry = (
  data: InventoryApiData[]
): InventoryEntry[] => {
  return data;
};

const calculateInventoryStats = (
  inventoryItems: InventoryEntry[]
): InventoryStats => {
  const totalItems = inventoryItems.length;
  const inStockItems = inventoryItems.filter(
    (item) => item.product?.status === 'in_stock'
  ).length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.product?.status === 'low_stock'
  ).length;
  const outOfStockItems = inventoryItems.filter(
    (item) => item.product?.status === 'out_of_stock'
  ).length;

  const totalQuantity = inventoryItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * Number(item.unitCost || 0),
    0
  );

  const avgQuantity = totalQuantity / Math.max(MIN_ITEMS, totalItems);
  const avgUnitCost = totalValue / Math.max(MIN_ITEMS, totalQuantity);

  const inStockRatio =
    (inStockItems / Math.max(MIN_ITEMS, totalItems)) * PERCENTAGE_MULTIPLIER;
  const lowStockRatio =
    (lowStockItems / Math.max(MIN_ITEMS, totalItems)) * PERCENTAGE_MULTIPLIER;
  const outOfStockRatio =
    (outOfStockItems / Math.max(MIN_ITEMS, totalItems)) * PERCENTAGE_MULTIPLIER;

  return {
    totalItems,
    inStockItems,
    lowStockItems,
    outOfStockItems,
    totalQuantity,
    totalValue,
    avgQuantity,
    avgUnitCost,
    inStockRatio,
    lowStockRatio,
    outOfStockRatio,
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

const InventoryStats = ({ stats }: { stats: InventoryStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Package}
        subtitle="Total unique inventory items"
        title="Total Items"
        value={stats.totalItems.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={TrendingUp}
        subtitle="Items currently in stock"
        title="In Stock Items"
        value={stats.inStockItems.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="red"
        icon={TrendingDown}
        subtitle="Items that are out of stock"
        title="Out of Stock Items"
        value={stats.outOfStockItems.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={DollarSign}
        subtitle="Total value of all inventory"
        title="Total Inventory Value"
        value={`$${formatCurrency(stats.totalValue)}`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="blue"
        icon={DollarSign}
        subtitle="average quantity per item"
        title="Avg Quantity Per Item"
        value={stats.avgQuantity.toFixed(0)}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of items in stock"
        title="In Stock Ratio"
        value={`${stats.inStockRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="percentage of items with low stock"
        title="Low Stock Ratio"
        value={`${stats.lowStockRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const InventoryTable = ({
  inventoryItems,
  deleteInventoryItem,
}: {
  inventoryItems: InventoryEntry[];
  deleteInventoryItem: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Inventory List</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your inventory items in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {inventoryItems.length.toLocaleString()}{' '}
        {inventoryItems.length === 1 ? 'item' : 'items'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteInventoryItem({ id }))),
        })}
        data={inventoryItems}
        entityNamePlural="Inventory Items"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const InventoryEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Inventory
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your stock levels by adding your first
        inventory item. Monitor quantities, track movements, and analyze demand
        to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Inventory Item
      </Button>
    </CardContent>
  </Card>
);

const InventoryQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your inventory records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Inventory Item
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const STOCK_MANAGEMENT_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserInventory();
  const { mutate: deleteInventoryItem } = useUserInventoryDelete();
  const router = useRouter();

  const inventoryItems = mapApiDataToInventoryEntry(apiData);
  const stats =
    inventoryItems.length > 0 ? calculateInventoryStats(inventoryItems) : null;

  const handleAddEntry = () => router.push('/app/inventory/stock/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats
    ? () => <InventoryStats stats={stats} />
    : undefined;

  const renderTable = () => (
    <InventoryTable
      deleteInventoryItem={deleteInventoryItem}
      inventoryItems={inventoryItems}
    />
  );

  const renderEmptyState = () => (
    <InventoryEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <InventoryQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={inventoryItems}
      description="Monitor inventory levels and manage restocking efficiently."
      entityNamePlural="Inventory Items"
      entityNameSingular="Stock Item"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Stock Management"
    />
  );
};

export default STOCK_MANAGEMENT_PAGE;
