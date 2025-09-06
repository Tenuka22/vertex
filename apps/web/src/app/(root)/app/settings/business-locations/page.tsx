'use client';

import {
  Activity,
  BarChart3,
  Building2,
  Filter,
  MapPin,
  Plus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useUserBusinessLocationDelete,
  useUserBusinessLocations,
} from '@/hooks/business';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_LOCATIONS = 1;

type BusinessLocationApiData = {
  id: string;
  businessProfileId: string;
  locationName: string;
  locationType: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  latitude: string | null;
  longitude: string | null;
  isHeadquarters: boolean | null;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

type BusinessLocationEntry = BusinessLocationApiData & {
  isHeadquarters: boolean;
};

type BusinessLocationStats = {
  totalLocations: number;
  activeLocations: number;
  headquartersCount: number;
  activeRatio: number;
  headquartersRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToBusinessLocationEntry = (
  data: BusinessLocationApiData[]
): BusinessLocationEntry[] => {
  return data.map((item) => ({
    ...item,
    isHeadquarters: item.isHeadquarters ?? false,
    isActive: item.isActive ?? true,
  }));
};

const calculateBusinessLocationStats = (
  locations: BusinessLocationEntry[]
): BusinessLocationStats => {
  const totalLocations = locations.length;
  const activeLocations = locations.filter((l) => l.isActive).length;
  const headquartersCount = locations.filter((l) => l.isHeadquarters).length;

  const activeRatio =
    (activeLocations / Math.max(MIN_LOCATIONS, totalLocations)) *
    PERCENTAGE_MULTIPLIER;
  const headquartersRatio =
    (headquartersCount / Math.max(MIN_LOCATIONS, totalLocations)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalLocations,
    activeLocations,
    headquartersCount,
    activeRatio,
    headquartersRatio,
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

const BusinessLocationStats = ({ stats }: { stats: BusinessLocationStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={Building2}
        subtitle="Total registered business locations"
        title="Total Locations"
        value={stats.totalLocations.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={Activity}
        subtitle="Locations currently active"
        title="Active Locations"
        value={stats.activeLocations.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={MapPin}
        subtitle="Locations designated as headquarters"
        title="Headquarters"
        value={stats.headquartersCount.toLocaleString()}
      />
      <StatsCard
        badge="Ratio"
        color="default"
        icon={BarChart3}
        subtitle="Percentage of locations that are active"
        title="Active Location Ratio"
        value={`${stats.activeRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const BusinessLocationTable = ({
  locations,
  deleteBusinessLocation,
}: {
  locations: BusinessLocationEntry[];
  deleteBusinessLocation: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">
          Complete Business Location List
        </H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your business locations in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {locations.length.toLocaleString()}{' '}
        {locations.length === 1 ? 'location' : 'locations'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteBusinessLocation({ id }))),
        })}
        data={locations}
        entityNamePlural="Business Locations"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const BusinessLocationEmptyState = ({
  onAddEntry,
}: {
  onAddEntry: () => void;
}) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <MapPin className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Business Locations
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your operational footprint by adding your
        first business location. Monitor addresses, contact information, and
        headquarters status to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Business Location
      </Button>
    </CardContent>
  </Card>
);

const BusinessLocationQuickActions = ({
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
            Efficiently manage your business location records and generate
            insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Location
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LOCATIONS_PAGE = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserBusinessLocations();
  const { mutate: deleteBusinessLocation } = useUserBusinessLocationDelete();
  const router = useRouter();

  const locations = mapApiDataToBusinessLocationEntry(apiData);
  const stats =
    locations.length > 0 ? calculateBusinessLocationStats(locations) : null;

  const handleAddEntry = () =>
    router.push('/app/settings/business-locations/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats
    ? () => <BusinessLocationStats stats={stats} />
    : undefined;

  const renderTable = () => (
    <BusinessLocationTable
      deleteBusinessLocation={deleteBusinessLocation}
      locations={locations}
    />
  );

  const renderEmptyState = () => (
    <BusinessLocationEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <BusinessLocationQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={locations}
      description="Monitor your business locations, including addresses, contact information, and headquarters status."
      entityNamePlural="Business Locations"
      entityNameSingular="Business Location"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Business Locations Management"
    />
  );
};

export default LOCATIONS_PAGE;
