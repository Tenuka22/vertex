import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await orpc.purchaseOrder.get.call(),
    queryKey: ['user', 'purchaseOrders'],
    initialData: [],
  });
