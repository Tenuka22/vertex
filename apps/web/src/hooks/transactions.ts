import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await client.transaction.get(),
    queryKey: ['user', 'transactions'],
  });
