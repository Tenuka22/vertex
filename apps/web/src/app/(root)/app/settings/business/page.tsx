'use client';

import type {
  BusinessInformation,
  BusinessProfile,
} from '@repo/db/schema/primary';
import { format } from 'date-fns';
import {
  Activity,
  Book,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Linkedin,
  Mail,
  Palette,
  Phone,
  Shield,
  Target,
  Twitter,
  Users,
} from 'lucide-react';
import Link from 'next/link';
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

type BusinessData = BusinessProfile & BusinessInformation;

const CompanyHeader = ({ data }: { data: BusinessProfile }) => (
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
        <CardDescription>{data.description}</CardDescription>
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

const CompanyOverview = ({ data }: { data: BusinessData }) => (
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

const MissionVision = ({ data }: { data: BusinessData }) =>
  data.mission || data.vision ? (
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
  ) : null;

const ContactCard = ({ data }: { data: BusinessData }) => {
  const contactItems = [
    {
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
      icon: <Mail className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Phone',
      value: data.phone,
      href: `tel:${data.phone}`,
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

const BrandSettings = ({ data }: { data: BusinessData }) =>
  data.brandColor ? (
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
  ) : null;

const AccountSettings = ({ data }: { data: BusinessData }) => (
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

const Timeline = ({ data }: { data: BusinessData }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" /> Account Timeline
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label className="font-medium text-muted-foreground text-xs uppercase">
          Created
        </Label>
        <p className="font-medium text-sm">
          {format(data.createdAt, 'dd/MM/yy')}
        </p>
      </div>
      <Separator />
      <div>
        <Label className="font-medium text-muted-foreground text-xs uppercase">
          Last Updated
        </Label>
        <p className="font-medium text-sm">
          {format(data.updatedAt, 'dd/MM/yy')}
        </p>
      </div>
    </CardContent>
  </Card>
);

const COMPANY_PAGE = () => {
  const business = {
    id: '11111111-1111-1111-1111-111111111111',
    userId: 'user-123',
    companyName: 'Acme Corporation',
    legalName: 'Acme Corporation Ltd.',
    tradingName: 'Acme Corp',
    email: 'info@acme.com',
    phone: '+1-555-1234',
    website: 'https://www.acme.com',
    twitter: 'https://twitter.com/acme',
    linkedin: 'https://linkedin.com/company/acme',
    addressLine1: '123 Main Street',
    addressLine2: 'Suite 400',
    city: 'Metropolis',
    state: 'CA',
    postalCode: '90210',
    country: 'USA',
    industry: 'Technology',
    businessType: 'Software',
    employeeCount: 250,
    foundedYear: 2005,
    logoUrl: 'https://www.acme.com/logo.png',
    brandColor: '#FF5733',
    description:
      'Acme Corporation develops cutting-edge software solutions worldwide.',
    mission: 'To deliver innovative software products worldwide.',
    vision: 'To be the global leader in software solutions.',
    taxId: 'TAX-123456',
    registrationNumber: 'REG-987654',
    isActive: true,
    isVerified: true,
    createdAt: new Date('2020-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),

    businessProfileId: '11111111-1111-1111-1111-111111111111',
    businessLicense: null,
    baseCurrency: 'USD',
    fiscalYearEnd: '12/31',
    defaultBankAccount: null,
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    businessHoursStart: '09:00',
    businessHoursEnd: '17:00',
    operatingDays: 'Mon-Fri',
    certifications: null,
    complianceNotes: null,
    socialMediaLinks: null,
    internalNotes: null,
  } satisfies BusinessData;

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
            <BusinessProfileForm defaultData={business} />
            <BusinessInformationForm defaultData={business} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default COMPANY_PAGE;
