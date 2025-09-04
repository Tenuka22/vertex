import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserInventory = () =>
  useQuery({
    queryFn: async () => await orpc.inventory.get.call(),
    queryKey: ['user', 'inventory'],
    initialData: [],
  });

export const useUserSuppliers = () =>
  useQuery({
    queryFn: async () => await orpc.supplier.get.call(),
    queryKey: ['user', 'suppliers'],
    initialData: [],
  });

export const useUserPurchaseOrders = () =>
  useQuery({
    queryFn: async () => await orpc.purchaseOrder.get.call(),
    queryKey: ['user', 'purchaseOrders'],
    initialData: [],
  });
