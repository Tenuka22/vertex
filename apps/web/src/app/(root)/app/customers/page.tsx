'use client';

import {
  AlertCircle,
  ChevronDown,
  Filter,
  Loader2,
  Mail,
  Phone,
  Plus,
  User,
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
import { useUserBusinessContacts } from '@/hooks/contacts';

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const LoadingCard = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Contact...
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
        <AlertCircle className="h-5 w-5" /> No Contacts
      </CardTitle>
    </CardHeader>
    <CardContent className="py-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">
        You haven't added any business contacts yet. Click "Add Customer" to get
        started.
      </p>
    </CardContent>
  </Card>
);

const getStatusBadge = (isActive: boolean, isPrimary: boolean) => {
  if (isPrimary) {
    return { color: 'bg-yellow-100 text-yellow-800', text: 'Primary' };
  }
  return isActive
    ? { color: 'bg-green-100 text-green-800', text: 'Active' }
    : { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
};

const CustomersPage = () => {
  const { data: contacts, isFetching, error } = useUserBusinessContacts();

  if (isFetching) {
    return (
      <main className="space-y-8 p-6">
        <H2 className="font-bold text-3xl">Customers</H2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }, () => crypto.randomUUID()).map((k) => (
            <LoadingCard key={k} />
          ))}
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
              Could not load contacts. Please refresh the page.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Customers</H2>
          <Muted>View and manage your customer base.</Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <Separator />

      {contacts?.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contacts?.map((contact) => {
            const statusInfo = getStatusBadge(
              contact.isActive ?? false,
              contact.isPrimary ?? false
            );

            return (
              <Card
                className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
                key={contact.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500 p-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {contact.firstName} {contact.lastName}
                        </CardTitle>
                        <Muted className="text-sm">
                          {contact.email || 'No email'}
                        </Muted>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
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
                    <Muted className="text-sm">{contact.contactType}</Muted>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </div>
                  )}
                  {contact.title && (
                    <div className="flex items-center justify-between font-medium text-sm">
                      <span>Title: {contact.title}</span>
                    </div>
                  )}
                  {contact.department && (
                    <div className="flex items-center justify-between font-medium text-sm">
                      <span>Department: {contact.department}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">Add New Customer</H2>
              <P>Create a new customer record and start tracking activity.</P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default CustomersPage;
