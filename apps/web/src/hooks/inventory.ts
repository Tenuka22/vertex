import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteInventory, getUserInventory } from '@/actions/inventory';
import { getUserPurchaseOrders } from '@/actions/purchase-orders';
import { deleteSupplier, getUserSuppliers } from '@/actions/suppliers';

export const useUserInventory = () =>
  useQuery({
    queryFn: async () => await getUserInventory(),
    queryKey: ['user', 'inventory'],
  });

export const useUserInventoryDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteInventory(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'inventory'],
      });
    },
  });
};

export const useUserSuppliers = () =>
  useQuery({
    queryFn: async () => await getUserSuppliers(),
    queryKey: ['user', 'suppliers'],
  });

export const useUserSupplierDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteSupplier(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'suppliers'],
      });
    },
  });
};

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await getUserPurchaseOrders(),
    queryKey: ['user', 'purchaseOrders'],
  });
