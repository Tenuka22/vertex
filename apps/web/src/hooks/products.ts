import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserProducts = () =>
  useQuery({
    queryFn: async () => await client.product.get(),
    queryKey: ['user', 'products'],
  });
