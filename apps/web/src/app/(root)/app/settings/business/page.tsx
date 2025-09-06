'use client';
import type {
  BusinessInformation,
  BusinessProfile,
} from '@repo/db/schema/primary';
import {
  Activity,
  BarChart3,
  Book,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Filter,
  Globe,
  Linkedin,
  Mail,
  Palette,
  Phone,
  Plus,
  Shield,
  Target,
  Twitter,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { BusinessInformationForm } from '@/components/business/business-information-form';
import { BusinessProfileForm } from '@/components/business/business-profile-form';
import { H2, P } from '@/components/design/typography';
import EntityPageWrapper from '@/components/global/entity-page-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  useUserBusinessInformation,
  useUserBusinessProfile,
} from '@/hooks/business';

const ICON_SIZE_CLASS = 'h-8 w-8';
const ICON_SIZE_SMALL_CLASS = 'h-4 w-4';

type BusinessData = BusinessProfile & BusinessInformation;
type PartialBusinessData = Partial<BusinessProfile> &
  Partial<BusinessInformation>;

type BusinessStats = {
  isVerified: boolean;
  isActive: boolean;
  employeeCount: number;
  foundedYear: number | null;
  businessType: string | null;
  industry: string | null;
};

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'green' | 'red' | 'blue' | 'default';
  badge?: string;
};

const calculateBusinessStats = (
  business: PartialBusinessData
): BusinessStats => {
  return {
    isVerified: business.isVerified ?? false,
    isActive: business.isActive ?? false,
    employeeCount: business.employeeCount || 0,
    foundedYear: business.foundedYear || null,
    businessType: business.businessType || null,
    industry: business.industry || null,
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

const BusinessStats = ({ stats }: { stats: BusinessStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        badge="Status"
        color={stats.isActive ? 'green' : 'red'}
        icon={Activity}
        subtitle="Current operational status"
        title="Business Status"
        value={stats.isActive ? 'Active' : 'Inactive'}
      />
      <StatsCard
        badge="Status"
        color={stats.isVerified ? 'blue' : 'red'}
        icon={Shield}
        subtitle="Verification status of the business"
        title="Verification"
        value={stats.isVerified ? 'Verified' : 'Unverified'}
      />
      <StatsCard
        badge="Details"
        color="default"
        icon={Users}
        subtitle="Total number of employees"
        title="Employee Count"
        value={stats.employeeCount.toLocaleString()}
      />
      <StatsCard
        badge="Details"
        color="default"
        icon={Calendar}
        subtitle="Year business was founded"
        title="Founded Year"
        value={stats.foundedYear ? String(stats.foundedYear) : 'N/A'}
      />
    </div>
  </div>
);

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="font-medium text-muted-foreground text-sm">{label}</Label>
    <div className="flex items-center gap-2">
      {icon}
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const CompanyOverview = ({ data }: { data: PartialBusinessData }) => {
  if (!data.companyName) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Company Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <InfoRow label="Company Name" value={data.companyName} />
          {data.legalName && (
            <InfoRow label="Legal Name" value={data.legalName} />
          )}
          {data.businessType && (
            <InfoRow
              label="Business Type"
              value={<Badge variant="outline">{data.businessType}</Badge>}
            />
          )}
          {data.industry && (
            <InfoRow
              label="Industry"
              value={<Badge variant="outline">{data.industry}</Badge>}
            />
          )}
          {data.foundedYear && (
            <InfoRow label="Founded" value={data.foundedYear} />
          )}
          {data.employeeCount && (
            <InfoRow
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              label="Employees"
              value={data.employeeCount.toLocaleString()}
            />
          )}
          {data.taxId && <InfoRow label="Tax ID" value={data.taxId} />}
          {data.registrationNumber && (
            <InfoRow label="Reg. No." value={data.registrationNumber} />
          )}
          {data.businessLicense && (
            <InfoRow
              icon={<Book className="h-4 w-4 text-muted-foreground" />}
              label="Business License"
              value={data.businessLicense}
            />
          )}
        </div>
        {data.description && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="font-medium text-muted-foreground text-sm">
                Description
              </Label>
              <p className="text-sm leading-relaxed">{data.description}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const MissionVision = ({ data }: { data: PartialBusinessData }) => {
  if (!(data.mission || data.vision)) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" /> Mission & Vision
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.mission && (
          <div className="space-y-1">
            <Label className="font-medium text-muted-foreground text-sm">
              Mission
            </Label>
            <p className="text-sm leading-relaxed">{data.mission}</p>
          </div>
        )}
        {data.mission && data.vision && <Separator />}
        {data.vision && (
          <div className="space-y-1">
            <Label className="font-medium text-muted-foreground text-sm">
              Vision
            </Label>
            <p className="text-sm leading-relaxed">{data.vision}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ContactCard = ({ data }: { data: PartialBusinessData }) => {
  const contactItems = [
    {
      label: 'Email',
      value: data.email,
      href: data.email ? `mailto:${data.email}` : undefined,
      icon: <Mail className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Phone',
      value: data.phone,
      href: data.phone ? `tel:${data.phone}` : undefined,
      icon: <Phone className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Website',
      value: data.website,
      href: data.website,
      icon: <Globe className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Twitter',
      value: data.twitter,
      href: data.twitter,
      icon: <Twitter className="h-4 w-4 text-primary" />,
    },
    {
      label: 'LinkedIn',
      value: data.linkedin,
      href: data.linkedin,
      icon: <Linkedin className="h-4 w-4 text-primary" />,
    },
  ].filter((i) => i.value);

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contactItems.map((item) => (
          <div
            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            key={item.label}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {item.icon}
            </div>
            <div className="flex-1">
              <Label className="font-medium text-muted-foreground text-xs uppercase">
                {item.label}
              </Label>
              {item.href ? (
                <Button
                  asChild
                  className="h-auto p-0 font-medium"
                  variant="link"
                >
                  <Link
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.value}
                  </Link>
                </Button>
              ) : (
                <p className="font-semibold">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const BrandSettings = ({ data }: { data: PartialBusinessData }) => {
  if (!data.brandColor) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" /> Brand & Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div
            className="h-8 w-8 rounded-md border shadow-sm"
            style={{ backgroundColor: data.brandColor }}
          />
          <Badge className="font-mono text-xs" variant="outline">
            {data.brandColor}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const AccountSettings = ({ data }: { data: PartialBusinessData }) => {
  const hasSettings =
    data.baseCurrency ||
    data.fiscalYearEnd ||
    data.defaultBankAccount ||
    data.timezone ||
    data.dateFormat ||
    data.numberFormat ||
    data.businessHoursStart ||
    data.businessHoursEnd ||
    data.operatingDays ||
    data.certifications ||
    data.complianceNotes ||
    data.internalNotes;

  if (!hasSettings) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Financial & Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.baseCurrency && (
          <InfoRow
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            label="Base Currency"
            value={data.baseCurrency}
          />
        )}
        {data.fiscalYearEnd && (
          <InfoRow label="Fiscal Year End" value={data.fiscalYearEnd} />
        )}
        {data.defaultBankAccount && (
          <InfoRow label="Bank Account" value={data.defaultBankAccount} />
        )}
        {data.timezone && (
          <InfoRow
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            label="Timezone"
            value={data.timezone}
          />
        )}
        {data.dateFormat && (
          <InfoRow label="Date Format" value={data.dateFormat} />
        )}
        {data.numberFormat && (
          <InfoRow label="Number Format" value={data.numberFormat} />
        )}
        {data.businessHoursStart && data.businessHoursEnd && (
          <InfoRow
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            label="Business Hours"
            value={`${data.businessHoursStart} - ${data.businessHoursEnd}`}
          />
        )}
        {data.operatingDays && (
          <InfoRow label="Operating Days" value={data.operatingDays} />
        )}
        {data.certifications && (
          <InfoRow
            icon={<Book className="h-4 w-4 text-muted-foreground" />}
            label="Certifications"
            value={data.certifications}
          />
        )}
        {data.complianceNotes && (
          <InfoRow
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            label="Compliance Notes"
            value={data.complianceNotes}
          />
        )}
        {data.internalNotes && (
          <InfoRow
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            label="Internal Notes"
            value={data.internalNotes}
          />
        )}
      </CardContent>
    </Card>
  );
};

const Timeline = ({ data }: { data: PartialBusinessData }) => {
  if (!(data.createdAt || data.updatedAt)) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Account Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.createdAt && (
          <div>
            <Label className="font-medium text-muted-foreground text-xs uppercase">
              Created
            </Label>
            <p className="font-medium text-sm">
              {data.createdAt.toLocaleString()}
            </p>
          </div>
        )}
        {data.createdAt && data.updatedAt && <Separator />}
        {data.updatedAt && (
          <div>
            <Label className="font-medium text-muted-foreground text-xs uppercase">
              Last Updated
            </Label>
            <p className="font-medium text-sm">
              {data.updatedAt.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BusinessDetails = ({ business }: { business: PartialBusinessData }) => (
  <div className="space-y-6">
    <CompanyOverview data={business} />
    <MissionVision data={business} />
    <ContactCard data={business} />
    <BrandSettings data={business} />
    <AccountSettings data={business} />
    <Timeline data={business} />
  </div>
);

const BusinessEmptyState = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-2 border-dashed shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
    <CardContent className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
        <Building2 className="h-10 w-10 text-primary" />
      </div>
      <H2 className="mb-3 font-semibold text-xl">
        Complete Your Business Profile
      </H2>
      <P className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
        Get complete visibility into your business operations by setting up your
        business profile. Monitor key information, track contacts, and analyze
        performance to make better business decisions.
      </P>
      <Button className="gap-2 px-6" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL_CLASS} />
        Create Business Profile
      </Button>
    </CardContent>
  </Card>
);

const BusinessQuickActions = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Card className="border-dashed transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <H2 className="mb-2 font-semibold text-xl">Quick Actions</H2>
          <P className="text-muted-foreground">
            Efficiently manage your business profile and generate insights
          </P>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2" variant="outline">
            <BarChart3 className={ICON_SIZE_SMALL_CLASS} />
            View Analytics
          </Button>
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL_CLASS} />
            Edit Profile
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const COMPANY_PAGE = () => {
  const {
    data: businessInfo,
    isLoading: isLoadingInfo,
    error: infoError,
  } = useUserBusinessInformation();
  const {
    data: businessProfile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useUserBusinessProfile();

  const business = useMemo(
    () => ({
      ...businessInfo,
      ...businessProfile,
    }),
    [businessInfo, businessProfile]
  );

  const isLoading = isLoadingInfo || isLoadingProfile;
  const hasError = infoError || profileError;

  const stats = business.companyName ? calculateBusinessStats(business) : null;

  const router = useRouter();
  const handleAddEntry = () => router.push('/app/settings/business/edit');

  const additionalActions = (
    <Button className="gap-2" variant="outline">
      <Filter className={ICON_SIZE_SMALL_CLASS} />
      Advanced Filters
    </Button>
  );

  const renderStats = stats ? () => <BusinessStats stats={stats} /> : undefined;

  const renderDetails = () => (
    <div className="grid gap-4 lg:grid-cols-2">
      <BusinessDetails business={business} />
      <div className="relative h-full min-h-screen">
        <div className="sticky top-4 space-y-6 pb-4">
          <BusinessProfileForm
            defaultData={business.id ? (business as BusinessData) : undefined}
          />
          <BusinessInformationForm
            defaultData={business.id ? (business as BusinessData) : undefined}
          />
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <BusinessEmptyState onAddEntry={handleAddEntry} />
  );

  const renderQuickActions = () => (
    <BusinessQuickActions onAddEntry={handleAddEntry} />
  );

  return (
    <EntityPageWrapper
      additionalActions={additionalActions}
      data={business.companyName ? [business] : []}
      description="Manage your business profile, including company information, mission, vision, contact details, and settings."
      entityNamePlural="Business Profile"
      entityNameSingular="Business Profile"
      error={hasError}
      isFetching={isLoading}
      isLoading={isLoading}
      onAddEntry={handleAddEntry}
      onRefetch={() => {
        console.log('refetch');
      }}
      renderEmptyState={renderEmptyState}
      renderQuickActions={renderQuickActions}
      renderStats={renderStats}
      renderTable={renderDetails}
      title="Business Profile Management"
    />
  );
};

export default COMPANY_PAGE;
