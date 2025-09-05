import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserPurchaseOrders = () =>
  useQuery(orpc.purchaseOrder.get.queryOptions({}));
