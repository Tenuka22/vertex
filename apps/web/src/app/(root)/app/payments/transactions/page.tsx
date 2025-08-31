'use client';

import type {
  ExpenseCategory,
  PaymentMethod,
  Transaction,
} from '@repo/db/schema/primary';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
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

const transactions: Transaction[] = [
  {
    id: 't1',
    businessProfileId: 'bp1',
    type: 'PAYMENT',
    amount: '1200',
    description: 'Customer Payment - Order #1234',
    paymentMethodId: 'pm1',
    expenseCategoryId: 'ec1',
    transactionDate: new Date('2025-08-29'),
    reference: 'ORD1234',
    createdAt: new Date('2025-08-29'),
    updatedAt: new Date('2025-08-29'),
  },
  {
    id: 't2',
    businessProfileId: 'bp1',
    type: 'PAYOUT',
    amount: '320',
    description: 'Supplier Payment - Global Supplies Inc.',
    paymentMethodId: 'pm2',
    expenseCategoryId: 'ec2',
    transactionDate: new Date('2025-08-28'),
    reference: 'SUP5678',
    createdAt: new Date('2025-08-28'),
    updatedAt: new Date('2025-08-28'),
  },
];

const paymentMethods: Record<string, PaymentMethod> = {
  pm1: {
    id: 'pm1',
    type: 'CARD_CREDIT',
    details: { provider: 'Visa', last4: '1234' },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    businessProfileId: 'bp1',
  },
  pm2: {
    id: 'pm2',
    type: 'BANK',
    details: { provider: 'Chase Bank', accountNumber: '****5678' },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    businessProfileId: 'bp1',
  },
};

const expenseCategories: Record<string, ExpenseCategory> = {
  ec1: {
    id: 'ec1',
    name: 'SALES',
    status: 'active',
    businessProfileId: 'bp1',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date(),
  },
  ec2: {
    id: 'ec2',
    name: 'SUPPLIES',
    status: 'active',
    businessProfileId: 'bp1',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date(),
  },
};

const TRANSACTIONS_PAGE = () => {
  const getTransactionIcon = (type: string) =>
    type === 'PAYMENT' ? (
      <ArrowDownCircle className="h-5 w-5 text-white" />
    ) : (
      <ArrowUpCircle className="h-5 w-5 text-white" />
    );

  const getStatusBadge = (amount: number) =>
    amount >= 0
      ? { color: 'bg-green-100 text-green-800', text: 'Income' }
      : { color: 'bg-red-100 text-red-800', text: 'Expense' };

  const formatDate = (date?: string | Date) => {
    if (!date) {
      return 'N/A';
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | string) =>
    `$${Number(amount).toLocaleString()}`;

  return (
    <main className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Transactions</H2>
          <Muted>
            View all incoming payments and outgoing supplier payouts.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <Separator />

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {transactions.map((tx) => {
          const txAmount = Number(tx.amount);
          const method = tx.paymentMethodId
            ? paymentMethods[tx.paymentMethodId]
            : undefined;
          const category = tx.expenseCategoryId
            ? expenseCategories[tx.expenseCategoryId]
            : undefined;
          const statusInfo = getStatusBadge(
            tx.type === 'PAYMENT' ? txAmount : -txAmount
          );

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={tx.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${tx.type === 'PAYMENT' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className="text-lg">
                        {tx.type === 'PAYMENT' ? 'Incoming' : 'Outgoing'}
                      </CardTitle>
                      {method?.details?.provider && (
                        <Badge variant="secondary">
                          {method.details.provider}
                        </Badge>
                      )}
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
                <div className="flex items-center justify-between pt-2">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    {formatDate(tx.transactionDate)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-2">
                <p className="line-clamp-2 text-muted-foreground">
                  {tx.description}
                </p>
                {category && <Badge variant="outline">{category.name}</Badge>}
                {tx.reference && (
                  <P className="text-sm">Reference: {tx.reference}</P>
                )}
                <div className="mt-2 flex items-center justify-between font-medium text-lg">
                  <span className="font-semibold">
                    {tx.type === 'PAYMENT' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                  <Receipt className="h-5 w-5" />
                </div>
                <P className="mt-1 text-muted-foreground text-xs">
                  Created: {formatDate(tx.createdAt)} | Updated:{' '}
                  {formatDate(tx.updatedAt)}
                </P>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create CTA */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <H2 className="font-semibold text-xl">Add New Transaction</H2>
          <P>Record a new payment or payout to keep your financials updated.</P>
          <Button className="mt-2 gap-2">
            <Plus className="h-4 w-4" /> Create Transaction
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default TRANSACTIONS_PAGE;
