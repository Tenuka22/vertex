import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserProducts = () =>
  useQuery(orpc.product.get.queryOptions({}));
