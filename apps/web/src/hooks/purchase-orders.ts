import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePurchaseOrder,
  getUserPurchaseOrders,
} from '@/actions/purchase-orders';

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await getUserPurchaseOrders(),
    queryKey: ['user', 'purchaseOrders'],
  });

export const useUserPurchaseOrderDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deletePurchaseOrder(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'purchaseOrders'],
      });
    },
  });
};
