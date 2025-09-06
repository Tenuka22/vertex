import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await client.purchaseOrder.get(),
    queryKey: ['user', 'purchaseOrders'],
  });

export const useUserPurchaseOrderDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.purchaseOrder.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'purchaseOrders'],
      });
    },
  });
};
