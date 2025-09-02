'use client';

import {
  AlertCircle,
  Banknote,
  ChevronDown,
  CreditCard,
  Filter,
  Loader2,
  Plus,
  Wallet,
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
import { useUserPaymentMethods } from '@/hooks/payments';

// Loading skeleton component
const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

// Loading card placeholder
const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Payment Method...
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

// Empty state card
const EmptyStateCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" /> No Payment Methods
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven’t added any payment methods yet. Click "Add Method" to get
        started.
      </p>
    </CardContent>
  </Card>
);

const PAYMENT_METHODS_PAGE = () => {
  const {
    data: paymentMethods = [],
    isLoading,
    error,
  } = useUserPaymentMethods();

  const getStatusBadge = (isActive: boolean) => ({
    color: isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800',
    text: isActive ? 'Active' : 'Inactive',
  });

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'CARD_CREDIT':
        return <CreditCard className="h-5 w-5 text-white" />;
      case 'BANK':
        return <Banknote className="h-5 w-5 text-white" />;
      default:
        return <Wallet className="h-5 w-5 text-white" />;
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) {
      return 'N/A';
    }
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <main className="space-y-8 p-6">
        <H2 className="font-bold text-3xl">Payment Methods</H2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, () => crypto.randomUUID()).map(
            (k: string) => (
              <LoadingCard key={k} />
            )
          )}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Could not load payment methods. Please refresh the page.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Payment Methods</H2>
          <Muted>
            Manage how you pay suppliers and receive payments from customers.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Method
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content */}
      {paymentMethods.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => {
            const statusInfo = getStatusBadge(method.isActive);
            const d = method.details || {};

            return (
              <Card
                className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
                key={method.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-500 p-2">
                        {getMethodIcon(method.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {method.type.replace('_', ' ')}
                        </CardTitle>
                        <Muted className="text-sm">{d.provider || 'N/A'}</Muted>
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
                    <Badge className={statusInfo.color}>
                      {statusInfo.text}
                    </Badge>
                    <Muted className="text-sm">
                      Last Used: {formatDate(d.lastUsed)}
                    </Muted>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-2">
                  <p className="line-clamp-3 text-muted-foreground text-sm">
                    {d.description || 'No description'}
                  </p>

                  {method.type === 'CARD_CREDIT' && d.last4 && (
                    <p className="font-medium text-sm">
                      Card Ending: **** **** **** {d.last4}
                    </p>
                  )}

                  {method.type === 'BANK' && d.accountNumber && (
                    <p className="font-medium text-sm">
                      Account: {d.accountNumber}
                    </p>
                  )}

                  {method.type === 'DIGITAL_WALLET' && d.accountEmail && (
                    <p className="font-medium text-sm">
                      Email: {d.accountEmail}
                    </p>
                  )}

                  <p className="text-muted-foreground text-xs">
                    Created: {formatDate(method.createdAt)} | Updated:{' '}
                    {formatDate(method.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <H2 className="font-semibold text-xl">Add New Payment Method</H2>
            <P>
              Add a credit card, bank account, or digital payment option for
              easier transactions.
            </P>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PAYMENT_METHODS_PAGE;
