'use client';

import type { BusinessLocation } from '@repo/db/schema/primary';
import {
  AlertCircle,
  Building2,
  Calendar,
  Globe,
  Loader2,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { BusinessLocationForm } from '@/components/business/business-location-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  useUserBusinessLocations,
  useUserBusinessProfile,
} from '@/hooks/business';

type PartialLocationData = Partial<BusinessLocation>;

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
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
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
      <p className="mb-4 text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </CardContent>
  </Card>
);

const LocationHeader = ({ data }: { data: PartialLocationData }) => {
  if (!data.locationName) {
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
              No Location Information
            </CardTitle>
            <CardDescription>
              Please add location details to get started.
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
          <AvatarFallback className="font-bold text-lg">
            {data.locationName?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg">{data.locationName}</CardTitle>
          <CardDescription>
            {data.locationType || 'Business Location'}
          </CardDescription>
          <CardAction className="mt-1 flex gap-2">
            {data.isHeadquarters && (
              <Badge className="gap-1" variant="secondary">
                <Building2 className="h-3 w-3" /> Headquarters
              </Badge>
            )}
            <Badge
              className="gap-1"
              variant={data.isActive ? 'default' : 'destructive'}
            >
              {data.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {data.locationType && (
              <Badge variant="outline">{data.locationType}</Badge>
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

const LocationOverview = ({ data }: { data: PartialLocationData }) => {
  if (!data.locationName) {
    return (
      <EmptyStateCard
        description="Add location details to see overview information here."
        icon={Building2}
        title="Location Overview"
      />
    );
  }

  const hasAddress =
    data.addressLine1 || data.city || data.state || data.country;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Location Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <InfoRow label="Location Name" value={data.locationName} />
          {data.locationType && (
            <InfoRow
              label="Location Type"
              value={<Badge variant="outline">{data.locationType}</Badge>}
            />
          )}
          {hasAddress && (
            <InfoRow
              icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
              label="Address"
              value={
                [
                  data.addressLine1,
                  data.addressLine2,
                  data.city,
                  data.state,
                  data.postalCode,
                  data.country,
                ]
                  .filter(Boolean)
                  .join(', ') || 'Address not provided'
              }
            />
          )}
          {data.phone && (
            <InfoRow
              icon={<Phone className="h-4 w-4 text-muted-foreground" />}
              label="Phone"
              value={data.phone}
            />
          )}
          {data.email && (
            <InfoRow
              icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              label="Email"
              value={data.email}
            />
          )}
          {data.latitude && data.longitude && (
            <InfoRow
              icon={<Globe className="h-4 w-4 text-muted-foreground" />}
              label="Coordinates"
              value={`Lat: ${data.latitude}, Lng: ${data.longitude}`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ContactCard = ({ data }: { data: PartialLocationData }) => {
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
  ].filter((i) => i.value);

  if (contactItems.length === 0) {
    return (
      <EmptyStateCard
        description="Add contact details to make it easy for customers to reach this location."
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

const AddressCard = ({ data }: { data: PartialLocationData }) => {
  const hasAddress =
    data.addressLine1 || data.city || data.state || data.country;

  if (!hasAddress) {
    return (
      <EmptyStateCard
        description="Add address information to display location details."
        icon={MapPin}
        title="Address Information"
      />
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" /> Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="space-y-2">
            {data.addressLine1 && (
              <p className="font-semibold">{data.addressLine1}</p>
            )}
            {data.addressLine2 && (
              <p className="text-muted-foreground">{data.addressLine2}</p>
            )}
            {(data.city || data.state || data.postalCode) && (
              <p className="text-muted-foreground">
                {[data.city, data.state, data.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {data.country && <p className="font-medium">{data.country}</p>}
          </div>
        </div>
        {data.latitude && data.longitude && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="font-medium text-muted-foreground text-sm">
                Coordinates
              </Label>
              <div className="flex items-center gap-4">
                <Badge variant="outline">Lat: {data.latitude}</Badge>
                <Badge variant="outline">Lng: {data.longitude}</Badge>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Timeline = ({ data }: { data: PartialLocationData }) => {
  if (!(data.createdAt || data.updatedAt)) {
    return (
      <EmptyStateCard
        description="Timeline information will appear once location data is saved."
        icon={Calendar}
        title="Location Timeline"
      />
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Location Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.createdAt && (
          <div>
            <Label className="font-medium text-muted-foreground text-xs uppercase">
              Created
            </Label>
            <p className="font-medium text-sm">
              {data.createdAt.toLocaleDateString()}
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
              {data.updatedAt.toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LOCATIONS_PAGE = () => {
  const {
    data: businessProfile,
    isFetching: isFetchingProfile,
    error: profileError,
  } = useUserBusinessProfile();

  const {
    data: businessLocations,
    isFetching: isFetchingLocations,
    error: locationsError,
  } = useUserBusinessLocations();

  const isFetching = isFetchingProfile || isFetchingLocations;
  const hasError = profileError || locationsError;

  if (isFetching) {
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
          <div className="space-y-6">
            <LoadingCard title="Loading Location Overview..." />
            <LoadingCard title="Loading Contact Information..." />
            <LoadingCard title="Loading Address Information..." />
          </div>
          <div className="relative h-full">
            <div className="sticky top-4 space-y-6 pb-4">
              <LoadingCard title="Location Form" />
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
          <CardContent className="flex items-center gap-2 pt-6">
            <AlertCircle className="h-4 w-4" />
            <CardDescription>
              There was an error loading your location information. Please try
              refreshing the page.
            </CardDescription>
          </CardContent>
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative h-full">
            <div className="sticky top-4 space-y-6 pb-4">
              <BusinessLocationForm
                defaultData={{
                  businessProfileId: businessProfile?.id || '',
                  id: '',
                }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!businessProfile) {
    return (
      <main className="space-y-8 p-6">
        <EmptyStateCard
          description="Please complete your business profile first before adding locations."
          icon={Building2}
          title="Business Profile Required"
        />
      </main>
    );
  }

  if (businessLocations?.length === 0) {
    return (
      <main className="space-y-8 p-6">
        <EmptyStateCard
          actionLabel="Add First Location"
          description="Add your first business location to get started with managing multiple locations."
          icon={MapPin}
          title="No Locations Found"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative h-full">
            <div className="sticky top-4 space-y-6 pb-4">
              <BusinessLocationForm
                defaultData={{ businessProfileId: businessProfile.id, id: '' }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6">
      {businessLocations?.map((location) => (
        <div key={location.id}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-6">
              <LocationHeader data={location} />
              <LocationOverview data={location} />
              <ContactCard data={location} />
              <AddressCard data={location} />
              <Timeline data={location} />
            </div>
            <div className="relative h-full">
              <div className="sticky top-4 space-y-6 pb-4">
                <BusinessLocationForm
                  defaultData={{
                    ...location,
                    businessProfileId: businessProfile.id,
                  }}
                />
              </div>
            </div>
          </div>
          {businessLocations?.length > 1 &&
            businessLocations?.indexOf(location) <
              businessLocations?.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </main>
  );
};

export default LOCATIONS_PAGE;
