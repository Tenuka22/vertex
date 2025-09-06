import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await client.purchaseOrder.get(),
    queryKey: ['user', 'purchaseOrders'],
  });
