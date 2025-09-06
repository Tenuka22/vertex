import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserInventory = () =>
  useQuery({
    queryFn: async () => await client.inventory.get(),
    queryKey: ['user', 'inventory'],
  });

export const useUserSuppliers = () =>
  useQuery({
    queryFn: async () => await client.supplier.get(),
    queryKey: ['user', 'suppliers'],
  });

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await client.purchaseOrder.get(),
    queryKey: ['user', 'purchaseOrders'],
  });
