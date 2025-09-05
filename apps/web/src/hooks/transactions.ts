import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserTransactions = () =>
  useQuery(orpc.transaction.get.queryOptions({}));
