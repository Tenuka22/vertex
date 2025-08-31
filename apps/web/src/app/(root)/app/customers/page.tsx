// app/customers/page.tsx

import { ChevronDown, Filter, Mail, Phone, Plus, User } from 'lucide-react';
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

const customers = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 555-123-4567',
    status: 'active',
    joinDate: '2025-07-10',
    totalOrders: 12,
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 555-987-6543',
    status: 'inactive',
    joinDate: '2025-05-20',
    totalOrders: 3,
  },
  {
    id: 'c3',
    name: 'Michael Johnson',
    email: 'mike@example.com',
    phone: '+1 555-555-5555',
    status: 'active',
    joinDate: '2025-08-01',
    totalOrders: 8,
  },
  {
    id: 'c4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 555-111-2222',
    status: 'vip',
    joinDate: '2025-06-18',
    totalOrders: 20,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return { color: 'bg-green-100 text-green-800', text: 'Active' };
    case 'inactive':
      return { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
    case 'vip':
      return { color: 'bg-yellow-100 text-yellow-800', text: 'VIP' };
    default:
      return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const CustomersPage = () => {
  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => {
          const statusInfo = getStatusBadge(customer.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={customer.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500 p-2">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <Muted className="text-sm">{customer.email}</Muted>
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
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Joined {formatDate(customer.joinDate)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center justify-between font-medium text-sm">
                  <span>Total Orders: {customer.totalOrders}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create CTA */}
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
