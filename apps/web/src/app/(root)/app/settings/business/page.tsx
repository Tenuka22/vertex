'use client';
import type {
  BusinessInformation,
  BusinessProfile,
} from '@repo/db/schema/primary';
import {
  Activity,
  AlertCircle,
  Book,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Linkedin,
  Loader2,
  type LucideIcon,
  Mail,
  Palette,
  Phone,
  Shield,
  Target,
  Twitter,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { BusinessInformationForm } from '@/components/business/business-information-form';
import { BusinessProfileForm } from '@/components/business/business-profile-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  useUserBusinessInformation,
  useUserBusinessProfile,
} from '@/hooks/business';

type BusinessData = BusinessProfile & BusinessInformation;
type PartialBusinessData = Partial<BusinessProfile> &
  Partial<BusinessInformation>;

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = ({ title }: { title: string }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const EmptyStateCard = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const CompanyHeader = ({ data }: { data: PartialBusinessData }) => {
  if (!data.companyName) {
    return (
      <Card className="shadow-md">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-16 w-16 shadow-md">
            <AvatarFallback>
              <Building2 className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg text-muted-foreground">
              No Company Information
            </CardTitle>
            <CardDescription>
              Please complete your business profile to get started.
            </CardDescription>
            <CardAction className="mt-1 flex gap-2">
              <Badge variant="outline">Setup Required</Badge>
            </CardAction>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex items-center gap-4">
        <Avatar className="h-16 w-16 shadow-md">
          <AvatarImage alt="Logo" src={data.logoUrl ?? undefined} />
          <AvatarFallback className="font-bold text-lg">
            {data.companyName?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg">{data.companyName}</CardTitle>
          <CardDescription>
            {data.description || 'No description provided'}
          </CardDescription>
          <CardAction className="mt-1 flex gap-2">
            {data.isVerified && (
              <Badge className="gap-1" variant="secondary">
                <Shield className="h-3 w-3" /> Verified
              </Badge>
            )}
            <Badge
              className="gap-1"
              variant={data.isActive ? 'default' : 'destructive'}
            >
              <Activity className="h-3 w-3" />
              {data.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {data.tradingName && (
              <Badge variant="outline">{data.tradingName}</Badge>
            )}
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  );
};

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
    return (
      <EmptyStateCard
        description="Complete your business profile to see company information here."
        icon={Building2}
        title="Company Overview"
      />
    );
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
    return (
      <EmptyStateCard
        description="Add your company's mission and vision statements to inspire your team."
        icon={Target}
        title="Mission & Vision"
      />
    );
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
    return (
      <EmptyStateCard
        description="Add your contact details to make it easy for customers to reach you."
        icon={Mail}
        title="Contact Information"
      />
    );
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
    return (
      <EmptyStateCard
        description="Set your brand colors and visual identity to personalize your experience."
        icon={Palette}
        title="Brand & Settings"
      />
    );
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
    return (
      <EmptyStateCard
        description="Configure your financial and operational settings for better business management."
        icon={CreditCard}
        title="Financial & Settings"
      />
    );
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
    return (
      <EmptyStateCard
        description="Timeline information will appear once your business profile is created."
        icon={Calendar}
        title="Account Timeline"
      />
    );
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
            <p className="font-medium text-sm">{data.createdAt.toString()}</p>
          </div>
        )}
        {data.createdAt && data.updatedAt && <Separator />}
        {data.updatedAt && (
          <div>
            <Label className="font-medium text-muted-foreground text-xs uppercase">
              Last Updated
            </Label>
            <p className="font-medium text-sm">{data.updatedAt.toString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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

  if (isLoading) {
    return (
      <main className="space-y-8 p-6">
        <Card className="shadow-md">
          <CardHeader className="flex items-center gap-4">
            <LoadingSkeleton className="h-16 w-16 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <LoadingSkeleton className="h-6 w-48" />
              <LoadingSkeleton className="h-4 w-64" />
              <LoadingSkeleton className="h-6 w-32" />
            </div>
          </CardHeader>
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-6 xl:col-span-2">
            <LoadingCard title="Loading Company Overview..." />
            <LoadingCard title="Loading Contact Information..." />
            <LoadingCard title="Loading Account Settings..." />
          </div>
          <div className="relative h-full min-h-screen">
            <div className="sticky top-4 space-y-6 pb-4">
              <LoadingCard title="Business Profile Form" />
              <LoadingCard title="Business Information Form" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="space-y-8 p-6">
        <Card>
          <AlertCircle className="h-4 w-4" />
          <CardDescription>
            There was an error loading your business information. Please try
            refreshing the page.
          </CardDescription>
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative h-full min-h-screen">
            <div className="sticky top-4 space-y-6 pb-4">
              <BusinessProfileForm />
              <BusinessInformationForm />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6">
      <CompanyHeader data={business} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-6 xl:col-span-2">
          <CompanyOverview data={business} />
          <MissionVision data={business} />
          <ContactCard data={business} />
          <BrandSettings data={business} />
          <AccountSettings data={business} />
          <Timeline data={business} />
        </div>
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
    </main>
  );
};

export default COMPANY_PAGE;
