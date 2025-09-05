import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserTransactions = () =>
  useQuery({
    queryFn: async () => await orpc.transaction.get.call(),
    queryKey: ['user', 'transactions'],
    initialData: [],
  });
