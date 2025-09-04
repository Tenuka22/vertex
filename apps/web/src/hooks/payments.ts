import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserPaymentMethods = () =>
  useQuery({
    queryFn: async () => await orpc.payment.get.call(),
    queryKey: ['user', 'paymentMethods'],
    initialData: [],
  });

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await orpc.transaction.get.call(),
    queryKey: ['user', 'transactions'],
    initialData: [],
  });
