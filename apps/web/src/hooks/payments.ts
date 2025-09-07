import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePaymentMethod,
  getUserPaymentMethods,
} from '@/actions/payment-methods';
import { deleteTransaction, getUserTransactions } from '@/actions/transactions';

export const useUserPaymentMethods = () =>
  useQuery({
    queryFn: async () => await getUserPaymentMethods(),
    queryKey: ['user', 'paymentMethods'],
  });

export const useUserPaymentMethodDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deletePaymentMethod(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'paymentMethods'],
      });
    },
  });
};

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await getUserTransactions(),
    queryKey: ['user', 'transactions'],
  });

export const useUserTransactionDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteTransaction(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'transactions'],
      });
    },
  });
};
