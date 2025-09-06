import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserPaymentMethods = () =>
  useQuery({
    queryFn: async () => await client.payment.get(),
    queryKey: ['user', 'paymentMethods'],
  });

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await client.transaction.get(),
    queryKey: ['user', 'transactions'],
  });
