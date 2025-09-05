import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserInventory = () =>
  useQuery(orpc.inventory.get.queryOptions({}));

export const useUserSuppliers = () =>
  useQuery(orpc.supplier.get.queryOptions({}));

export const useUserPurchaseOrders = () =>
  useQuery(orpc.purchaseOrder.get.queryOptions({}));
