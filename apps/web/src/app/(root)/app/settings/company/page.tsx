import { format } from 'date-fns';
import {
  Activity,
  Building2,
  Calendar,
  Eye,
  Globe,
  Mail,
  MapPin,
  Palette,
  Phone,
  Shield,
  Target,
  Users,
} from 'lucide-react';
import Link from 'next/link';
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
import { orpc } from '@/utils/orpc';
import type { BusinessProfile } from '../../../../../../../server/src/db/schema/primary';

const CompanyHeader = ({ data }: { data: BusinessProfile }) => (
  <Card>
    <CardHeader className="flex items-center gap-4">
      <Avatar className="size-14 shadow-md">
        <AvatarImage alt="Logo" src={data.logoUrl ?? undefined} />
        <AvatarFallback className="font-bold text-lg">
          {data.companyName?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <CardTitle>{data.companyName}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
        <CardAction className="flex gap-2">
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
  <div className="space-y-2">
    <Label className="font-medium text-muted-foreground text-sm">{label}</Label>
    <div className="flex items-center gap-2">
      {icon}
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const CompanyOverview = ({ data }: { data: BusinessProfile }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        Company Overview
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

const MissionVision = ({ data }: { data: BusinessProfile }) =>
  data.mission || data.vision ? (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Mission & Vision
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.mission && (
          <div className="space-y-2">
            <Label className="font-medium text-muted-foreground text-sm">
              Mission
            </Label>
            <p className="text-sm leading-relaxed">{data.mission}</p>
          </div>
        )}
        {data.mission && data.vision && <Separator />}
        {data.vision && (
          <div className="flex items-start gap-2">
            <Eye className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p className="text-sm leading-relaxed">{data.vision}</p>
          </div>
        )}
      </CardContent>
    </Card>
  ) : null;

const ContactCard = ({ data }: { data: BusinessProfile }) => {
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
  ].filter((i) => i.value);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contactItems.map((item) => (
          <div
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            key={item.label}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {item.icon}
            </div>
            <div className="flex-1 space-y-1">
              <Label className="font-medium text-muted-foreground text-xs uppercase">
                {item.label}
              </Label>
              {item.href && (
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
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AddressCard = ({ data }: { data: BusinessProfile }) =>
  data.addressLine1 ? (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Business Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{data.addressLine1}</p>
            {data.addressLine2 && (
              <p className="font-medium">{data.addressLine2}</p>
            )}
            <p className="font-medium">
              {data.city && `${data.city}, `}
              {data.state} {data.postalCode}
            </p>
            {data.country && (
              <p className="text-muted-foreground">{data.country}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;

const BrandSettings = ({ data }: { data: BusinessProfile }) =>
  data.brandColor ? (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Brand & Settings
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

const Timeline = ({ data }: { data: BusinessProfile }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Account Timeline
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label className="font-medium text-muted-foreground text-xs uppercase">
          Created
        </Label>
        <p className="font-medium text-sm">
          {/*    {format(data.createdAt, 'dd/mm/yy')} */}
        </p>
      </div>
      <Separator />
      <div>
        <Label className="font-medium text-muted-foreground text-xs uppercase">
          Last Updated
        </Label>
        <p className="font-medium text-sm">
          {/*   {format(data.updatedAt, 'dd/mm/yy')} */}
        </p>
      </div>
    </CardContent>
  </Card>
);

const COMPANY_PAGE = async () => {
  const business = await orpc.businessProfile.get.call({});

  return (
    <main className="space-y-8 p-6">
      <CompanyHeader data={business} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-6 xl:col-span-2">
          <CompanyOverview data={business} />
          <MissionVision data={business} />
          <ContactCard data={business} />
          <AddressCard data={business} />
          <BrandSettings data={business} />
          <Timeline data={business} />
        </div>
        <div className="relative h-full min-h-screen">
          <div className="sticky top-4 space-y-6 pb-4">
            <BusinessProfileForm defaultData={business} />
          </div>
        </div>
      </div>
    </main>
  );
};
export default COMPANY_PAGE;
