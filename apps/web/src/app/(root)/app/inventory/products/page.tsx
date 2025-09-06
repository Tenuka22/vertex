'use client';

import {
  AlertCircle,
  ChevronDown,
  DollarSign,
  Filter,
  Loader2,
  Package,
  Plus,
  Store,
  Tag,
} from 'lucide-react';
import { H2, Muted, P } from '@/components/design/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useUserProducts } from '@/hooks/products';

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Offering...
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const EmptyStateCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" /> No Products or Services
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven't added any products or services yet. Click "Add Offering" to
        get started.
      </p>
    </CardContent>
  </Card>
);

const ErrorState = () => (
  <Card className="border-destructive">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="w-fit">
          <H2 className="font-semibold text-xl">Error Loading Data</H2>
          <P>
            There was an error loading your products and services. Please try
            refreshing the page.
          </P>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    </CardContent>
  </Card>
);

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getStatusBadge = (status: string) => {
  return status === 'active'
    ? { color: 'bg-green-100 text-green-800', text: 'Active' }
    : { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
};

const PRODUCTS_SERVICES_PAGE = () => {
  const { data: offerings, isLoading, error } = useUserProducts();

  if (isLoading) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Products & Services</H2>
            <Muted>
              Manage your offerings and keep track of availability and pricing.
            </Muted>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" disabled variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button className="gap-2" disabled>
              <Plus className="h-4 w-4" /> Add Offering
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map(() => (
            <LoadingCard key={crypto.randomUUID()} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Products & Services</H2>
            <Muted>
              Manage your offerings and keep track of availability and pricing.
            </Muted>
          </div>
        </div>

        <Separator />

        <ErrorState />
      </main>
    );
  }

  if (!offerings || offerings.length === 0) {
    return (
      <main className="relative space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">Products & Services</H2>
            <Muted>
              Manage your offerings and keep track of availability and pricing.
            </Muted>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Offering
            </Button>
          </div>
        </div>

        <Separator />

        <EmptyStateCard />
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Products & Services</H2>
          <Muted>
            Manage your offerings and keep track of availability and pricing.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Offering
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offerings.map((item) => {
          const statusInfo = getStatusBadge(item.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={item.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500 p-2">
                      {item.type === 'Service' ? (
                        <Store className="h-5 w-5 text-white" />
                      ) : (
                        <Package className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Muted className="text-sm">{item.category}</Muted>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Updated: {formatDate(item.updatedAt)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {item.description}
                </p>
                <div className="flex items-center justify-between font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />$
                    {typeof item.price === 'string'
                      ? Number.parseFloat(item.price)
                      : item.price}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {item.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">
                Add New Product or Service
              </H2>
              <P>
                Create a new offering to showcase your products and services.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Offering
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PRODUCTS_SERVICES_PAGE;
