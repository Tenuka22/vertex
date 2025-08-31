// app/invoices/page.tsx

import {
  Calendar,
  ChevronDown,
  DollarSign,
  Filter,
  Plus,
  Receipt,
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

const invoices = [
  {
    id: 'inv1',
    customer: 'John Doe',
    amount: 1200,
    status: 'paid',
    issueDate: '2025-08-20',
    dueDate: '2025-08-30',
    invoiceNumber: 'INV-001',
  },
  {
    id: 'inv2',
    customer: 'Jane Smith',
    amount: 450,
    status: 'pending',
    issueDate: '2025-08-18',
    dueDate: '2025-09-01',
    invoiceNumber: 'INV-002',
  },
  {
    id: 'inv3',
    customer: 'Michael Johnson',
    amount: 980,
    status: 'overdue',
    issueDate: '2025-07-28',
    dueDate: '2025-08-10',
    invoiceNumber: 'INV-003',
  },
  {
    id: 'inv4',
    customer: 'Alice Brown',
    amount: 2100,
    status: 'paid',
    issueDate: '2025-08-15',
    dueDate: '2025-08-25',
    invoiceNumber: 'INV-004',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return { color: 'bg-green-100 text-green-800', text: 'Paid' };
    case 'pending':
      return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
    case 'overdue':
      return { color: 'bg-red-100 text-red-800', text: 'Overdue' };
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

const InvoicesPage = () => {
  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Invoices</H2>
          <Muted>
            Manage all customer invoices and their payment statuses.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
        </div>
      </div>

      <Separator />

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {invoices.map((invoice) => {
          const statusInfo = getStatusBadge(invoice.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={invoice.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500 p-2">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {invoice.invoiceNumber}
                      </CardTitle>
                      <Muted className="text-sm">{invoice.customer}</Muted>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Due {formatDate(invoice.dueDate)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Issued {formatDate(invoice.issueDate)}
                  </div>
                </div>
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {invoice.amount}
                  </span>
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
              <H2 className="font-semibold text-xl">Create New Invoice</H2>
              <P>
                Quickly create a new invoice for your customers and manage their
                payments efficiently.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default InvoicesPage;
