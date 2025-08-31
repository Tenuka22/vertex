'use client';

import type { BusinessLocation } from '@repo/db/schema/primary';
import { Building2, Globe, MapPin, Phone } from 'lucide-react';
import { BusinessLocationForm } from '@/components/business/business-location-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type LocationData = BusinessLocation;

const LocationHeader = ({ data }: { data: LocationData }) => (
  <Card className="shadow-md">
    <CardHeader className="flex items-center gap-4">
      <Avatar className="h-16 w-16 shadow-md">
        <AvatarFallback className="font-bold text-lg">
          {data.locationName?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <CardTitle className="text-lg">{data.locationName}</CardTitle>
        <div className="mt-1 flex gap-2">
          {data.isHeadquarters && (
            <Badge className="gap-1" variant="secondary">
              Headquarters
            </Badge>
          )}
          <Badge
            className="gap-1"
            variant={data.isActive ? 'default' : 'destructive'}
          >
            {data.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
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

const LocationOverview = ({ data }: { data: LocationData }) => (
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
        <InfoRow
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          label="Address"
          value={`${data.addressLine1 ?? ''} ${data.addressLine2 ?? ''}, ${data.city}, ${data.state}, ${data.postalCode}, ${data.country}`}
        />
        {data.phone && (
          <InfoRow
            icon={<Phone className="h-4 w-4 text-muted-foreground" />}
            label="Phone"
            value={data.phone}
          />
        )}
        {data.email && (
          <InfoRow
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            label="Email"
            value={data.email}
          />
        )}
        {data.latitude && data.longitude && (
          <InfoRow
            label="Coordinates"
            value={`Lat: ${data.latitude}, Lng: ${data.longitude}`}
          />
        )}
      </div>
    </CardContent>
  </Card>
);

const Timeline = ({ data }: { data: LocationData }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-5 w-5" /> Timeline
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label className="font-medium text-muted-foreground text-xs uppercase">
          Created
        </Label>
        <p className="font-medium text-sm">
          {data.createdAt.toLocaleDateString()}
        </p>
      </div>
      <Separator />
      <div>
        <Label className="font-medium text-muted-foreground text-xs uppercase">
          Last Updated
        </Label>
        <p className="font-medium text-sm">
          {data.updatedAt.toLocaleDateString()}
        </p>
      </div>
    </CardContent>
  </Card>
);

const LOCATIONS_PAGE = () => {
  const locations = [
    {
      id: '22222222-2222-2222-2222-222222222222',
      businessProfileId: '11111111-1111-1111-1111-111111111111',
      locationName: 'Acme HQ',
      locationType: 'Headquarters',
      addressLine1: '123 Main Street',
      addressLine2: 'Suite 400',
      city: 'Metropolis',
      state: 'CA',
      postalCode: '90210',
      country: 'USA',
      phone: '+1-555-5678',
      email: 'hq@acme.com',
      latitude: '34.052_235',
      longitude: '-118.243_683',
      isHeadquarters: true,
      isActive: true,
      createdAt: new Date('2020-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      businessProfileId: '11111111-1111-1111-1111-111111111111',
      locationName: 'Acme Branch 1',
      locationType: 'Branch',
      addressLine1: '456 Side Street',
      addressLine2: 'Suite 101',
      city: 'Gotham',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1-555-9876',
      email: 'branch1@acme.com',
      latitude: '40.712_776',
      longitude: '-74.005_974',
      isHeadquarters: false,
      isActive: true,
      createdAt: new Date('2021-05-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      businessProfileId: '11111111-1111-1111-1111-111111111111',
      locationName: 'Acme Branch 2',
      locationType: 'Branch',
      addressLine1: '789 Commerce Blvd',
      addressLine2: '',
      city: 'Star City',
      state: 'WA',
      postalCode: '98101',
      country: 'USA',
      phone: '+1-555-2468',
      email: 'branch2@acme.com',
      latitude: '47.606_209',
      longitude: '-122.332_069',
      isHeadquarters: false,
      isActive: true,
      createdAt: new Date('2022-03-15T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    },
  ];

  return (
    <main className="space-y-8 p-6">
      {locations.map((location) => (
        <div className="grid gap-4 lg:grid-cols-2" key={location.id}>
          <div className="space-y-6 xl:col-span-2">
            <LocationHeader data={location} />
            <LocationOverview data={location} />
            <Timeline data={location} />
          </div>
          <div className="relative h-full min-h-screen">
            <div className="sticky top-4 space-y-6 pb-4">
              <BusinessLocationForm defaultData={location} />
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default LOCATIONS_PAGE;
