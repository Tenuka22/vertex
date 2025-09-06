import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserInventory = () =>
  useQuery({
    queryFn: async () => await client.inventory.get(),
    queryKey: ['user', 'inventory'],
  });

export const useUserInventoryDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.inventory.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'inventory'],
      });
    },
  });
};

export const useUserSuppliers = () =>
  useQuery({
    queryFn: async () => await client.supplier.get(),
    queryKey: ['user', 'suppliers'],
  });

export const useUserSupplierDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.supplier.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'suppliers'],
      });
    },
  });
};

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await client.purchaseOrder.get(),
    queryKey: ['user', 'purchaseOrders'],
  });
