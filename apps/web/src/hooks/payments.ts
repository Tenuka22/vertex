import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserPaymentMethods = () =>
  useQuery({
    queryFn: async () => await client.payment.get(),
    queryKey: ['user', 'paymentMethods'],
  });

export const useUserPaymentMethodDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.payment.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'paymentMethods'],
      });
    },
  });
};

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await client.transaction.get(),
    queryKey: ['user', 'transactions'],
  });

export const useUserTransactionDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.transaction.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'transactions'],
      });
    },
  });
};
