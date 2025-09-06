'use client';

import type { businessContacts } from '@repo/db/schema/primary';
import { Activity, BarChart3, Filter, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import CustomTable from '@/components/global/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useUserBusinessContactDelete,
  useUserBusinessContacts,
} from '@/hooks/contacts';
import { getColumns } from './columns';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';
const PERCENTAGE_MULTIPLIER = 100;
const MIN_CONTACTS = 1;

type CustomerApiData = {
  id: string;
  businessProfileId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  title: string | null;
  department: string | null;
  contactType: 'CUSTOMER' | 'LEAD' | 'VENDOR' | 'PARTNER';
  isActive: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type CustomerEntry = CustomerApiData;

type CustomerStats = {
  totalCustomers: number;
  activeCustomers: number;
  primaryContacts: number;
  customerRatio: number;
  leadRatio: number;
  vendorRatio: number;
  partnerRatio: number;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const mapApiDataToCustomerEntry = (
  data: (typeof businessContacts.$inferSelect)[]
): CustomerEntry[] => {
  return data.map((item) => ({
    ...item,
    contactType: item.contactType as 'CUSTOMER' | 'LEAD' | 'VENDOR' | 'PARTNER',
    isActive: item.isActive ?? false,
    isPrimary: item.isPrimary ?? false,
  }));
};

const calculateCustomerStats = (customers: CustomerEntry[]): CustomerStats => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const primaryContacts = customers.filter((c) => c.isPrimary).length;

  const customerCount = customers.filter(
    (c) => c.contactType === 'CUSTOMER'
  ).length;
  const leadCount = customers.filter((c) => c.contactType === 'LEAD').length;
  const vendorCount = customers.filter(
    (c) => c.contactType === 'VENDOR'
  ).length;
  const partnerCount = customers.filter(
    (c) => c.contactType === 'PARTNER'
  ).length;

  const customerRatio =
    (customerCount / Math.max(MIN_CONTACTS, totalCustomers)) *
    PERCENTAGE_MULTIPLIER;
  const leadRatio =
    (leadCount / Math.max(MIN_CONTACTS, totalCustomers)) *
    PERCENTAGE_MULTIPLIER;
  const vendorRatio =
    (vendorCount / Math.max(MIN_CONTACTS, totalCustomers)) *
    PERCENTAGE_MULTIPLIER;
  const partnerRatio =
    (partnerCount / Math.max(MIN_CONTACTS, totalCustomers)) *
    PERCENTAGE_MULTIPLIER;

  return {
    totalCustomers,
    activeCustomers,
    primaryContacts,
    customerRatio,
    leadRatio,
    vendorRatio,
    partnerRatio,
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

const CustomerStats = ({ stats }: { stats: CustomerStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="All Time"
        color="blue"
        icon={User}
        subtitle="Total business contacts"
        title="Total Contacts"
        value={stats.totalCustomers.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="green"
        icon={Activity}
        subtitle="Currently active contacts"
        title="Active Contacts"
        value={stats.activeCustomers.toLocaleString()}
      />
      <StatsCard
        badge="All Time"
        color="default"
        icon={User}
        subtitle="Primary contacts for key accounts"
        title="Primary Contacts"
        value={stats.primaryContacts.toLocaleString()}
      />
      <StatsCard
        badge="Ratio"
        color="blue"
        icon={BarChart3}
        subtitle="Percentage of contacts that are customers"
        title="Customer Ratio"
        value={`${stats.customerRatio.toFixed(0)}%`}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="Percentage of contacts that are leads"
        title="Lead Ratio"
        value={`${stats.leadRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="Percentage of contacts that are vendors"
        title="Vendor Ratio"
        value={`${stats.vendorRatio.toFixed(0)}%`}
      />
      <StatsCard
        color="default"
        icon={BarChart3}
        subtitle="Percentage of contacts that are partners"
        title="Partner Ratio"
        value={`${stats.partnerRatio.toFixed(0)}%`}
      />
    </div>
  </div>
);

const CustomerTable = ({
  customers,
  deleteCustomer,
}: {
  customers: CustomerEntry[];
  deleteCustomer: (params: { id: string }) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <H2 className="font-semibold text-xl">Complete Customer List</H2>
        <p className="text-muted-foreground text-sm">
          View and manage all your business contacts in one place
        </p>
      </div>
      <Badge className="font-medium" variant="secondary">
        {customers.length.toLocaleString()}{' '}
        {customers.length === 1 ? 'contact' : 'contacts'}
      </Badge>
    </div>
    <div className="rounded-lg border bg-card shadow-sm">
      <CustomTable
        columns={getColumns({
          deleteRecord: async ({ ids }) =>
            Promise.all(ids.map(async (id) => deleteCustomer({ id }))),
        })}
        data={customers}
        entityNamePlural="Customers"
        getRowIdAction={(v) => v.id}
      />
    </div>
  </div>
);

const CustomerEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <User className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Start Managing Your Customers
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your customer base by adding your first
        contact. Monitor interactions, track sales, and analyze relationships to
        make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Add Your First Customer
      </Button>
    </CardContent>
  </Card>
);

const CustomerQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your customer records and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Add Customer
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CustomersPage = () => {
  const {
    data: apiData = [],
    error,
    refetch,
    isLoading,
    isFetching,
  } = useUserBusinessContacts();
  const { mutate: deleteCustomer } = useUserBusinessContactDelete();
  const router = useRouter();

  const customers = mapApiDataToCustomerEntry(apiData);
  const stats = customers.length > 0 ? calculateCustomerStats(customers) : null;

  const handleAddEntry = () => router.push('/app/customers/create');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats ? () => <CustomerStats stats={stats} /> : undefined;

  const renderTable = () => (
    <CustomerTable customers={customers} deleteCustomer={deleteCustomer} />
  );

  const renderEmptyState = () => (
    <CustomerEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <CustomerQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={customers}
      description="View and manage your customer base, including contact information, activity, and relationships."
      entityNamePlural="Customers"
      entityNameSingular="Customer"
      error={error}
      isFetching={isFetching}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={refetch}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderTable}
      title="Customer Management"
    />
  );
};

export default CustomersPage;
