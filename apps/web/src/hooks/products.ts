import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserProducts = () =>
  useQuery({
    queryFn: async () => await orpc.product.get.call(),
    queryKey: ['user', 'products'],
    initialData: [],
  });
