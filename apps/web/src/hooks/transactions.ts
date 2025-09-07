import { useQuery } from '@tanstack/react-query';
import { getUserTransactions } from '@/actions/transactions';

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await getUserTransactions(),
    queryKey: ['user', 'transactions'],
  });
