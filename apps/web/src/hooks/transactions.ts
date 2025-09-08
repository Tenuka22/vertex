import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createUpdateTransaction,
  getUserTransactions,
} from '@/actions/transactions';

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await getUserTransactions(),
    queryKey: ['user', 'transactions'],
  });

export const useUserAddTransaction = () =>
  useMutation({
    mutationFn: createUpdateTransaction,
    mutationKey: ['user', 'transactions', 'add'],
  });
