'use client';
import type {
  NewTransaction,
  Transaction,
  transactionTypeEnum,
} from '@repo/db/schema/primary';
import { useForm } from '@tanstack/react-form';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Muted } from '@/components/design/typography';
import { DatePicker } from '@/components/global/data-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useUserExpenseCategories } from '@/hooks/expenses';
import { useUserPaymentMethods } from '@/hooks/payments';
import { useUserAddTransaction } from '@/hooks/transactions';

type FormType = NewTransaction;

export const TransactionForm = ({ data }: { data?: Transaction }) => {
  const router = useRouter();
  const { mutate: createUpdateTransaction } = useUserAddTransaction();
  const { data: paymentMethods } = useUserPaymentMethods();
  const { data: expenseCategories } = useUserExpenseCategories();

  const form = useForm({
    defaultValues: {
      businessProfileId: '',
      paymentMethodId: '',
      expenseCategoryId: '',
      type: 'INCOME' as const,
      amount: '',
      description: '',
      transactionDate: new Date(),
      reference: '',
      createdAt: undefined,
      updatedAt: undefined,
      id: undefined,
      ...data,
    } satisfies FormType as FormType,
    onSubmit: async ({ value }: { value: FormType }) => {
      try {
        const transactionData: NewTransaction = {
          businessProfileId: value.businessProfileId,
          paymentMethodId: value.paymentMethodId || undefined,
          expenseCategoryId: value.expenseCategoryId || undefined,
          type: value.type,
          amount: value.amount,
          description: value.description || undefined,
          transactionDate: value.transactionDate,
          reference: value.reference || undefined,
        };

        const getCashFlowDirection = (
          uiType: (typeof transactionTypeEnum.enumValues)[number]
        ): 'PAYMENT' | 'PAYOUT' => {
          switch (uiType) {
            case 'INCOME':
              return 'PAYMENT';
            case 'EXPENSE':
            case 'TRANSFER':
              return 'PAYOUT';
            default:
              return 'PAYOUT';
          }
        };

        const cashFlowData = {
          direction: getCashFlowDirection(value.type),
          amount: value.amount,
          flowDate: value.transactionDate,
        };

        await createUpdateTransaction({
          transaction: transactionData,
          cashFlow: cashFlowData,
        });

        toast.success('Transaction created successfully');
        router.back();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create transaction';
        toast.error(errorMessage);
      }
    },
  });

  return (
    <div>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="type">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Transaction Type</Label>
                  <Select
                    onValueChange={(value: 'INCOME' | 'EXPENSE' | 'TRANSFER') =>
                      field.handleChange(value)
                    }
                    value={field.state.value}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="amount">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={field.state.value}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter transaction description"
                  value={field.state.value ?? ''}
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="paymentMethodId">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Payment Method (Optional)</Label>
                  <Select
                    onValueChange={(value) =>
                      field.handleChange(value === 'none' ? undefined : value)
                    }
                    value={field.state.value ?? 'none'}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.type} -{' '}
                          {m.details?.accountNumber ||
                            m.details?.provider ||
                            m.details?.accountEmail ||
                            m.details?.description?.substring(0, 10) ||
                            (m.details?.last4 && `..* ${m.details?.last4}`)}
                        </SelectItem>
                      ))}
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="expenseCategoryId">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    Expense Category (Optional)
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      field.handleChange(value === 'none' ? undefined : value)
                    }
                    value={field.state.value ?? 'none'}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} - {m.status}
                        </SelectItem>
                      ))}
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="transactionDate">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Transaction Date</Label>
                  <DatePicker
                    id={field.name}
                    onValueChange={field.handleChange}
                    value={field.state.value ?? new Date()}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="reference">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Reference (Optional)</Label>
                  <Input
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Reference number"
                    value={field.state.value ?? ''}
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Cash Flow Details</h3>
            <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs">
              Automatic
            </span>
          </div>

          <div className="space-y-2 rounded-md border-2 border-foreground border-dashed p-4">
            <p className="font-medium text-sm">
              💡 Cash flow details are automatically generated:
            </p>
            <ul className="ml-4 space-y-1 text-xs">
              <li>
                • <strong>Direction:</strong> Income → Incoming, Expense →
                Outgoing, Transfer → Outgoing
              </li>
              <li>
                • <strong>Amount:</strong> Same as transaction amount
              </li>
              <li>
                • <strong>Flow Date:</strong> Same as transaction date
              </li>
            </ul>
          </div>

          <form.Field name="type">
            {(field) => {
              const getDisplayDirection = (type: string) => {
                switch (type) {
                  case 'INCOME':
                    return 'Incoming';
                  case 'EXPENSE':
                    return 'Outgoing';
                  case 'TRANSFER':
                    return 'Outgoing';
                  default:
                    return 'Not selected';
                }
              };

              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cash Flow Direction</Label>
                    <div className="rounded-md bg-muted px-3 py-2 text-sm">
                      {getDisplayDirection(field.state.value)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Flow Date</Label>
                    <div className="rounded-md bg-muted px-3 py-2 text-sm">
                      Same as transaction date
                    </div>
                  </div>
                </div>
              );
            }}
          </form.Field>
        </div>
        <form.Subscribe>
          {(state) => (
            <Button
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
              type="submit"
            >
              {state.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Creating Transaction...
                </div>
              ) : (
                'Create Transaction & Cash Flow'
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <Muted>or</Muted>
        </div>
      </div>

      <div className="mt-4 text-center text-sm">
        <Muted>Changed your mind?</Muted>
        <Button
          className="px-2 font-medium"
          onClick={() => router.back()}
          variant="link"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
