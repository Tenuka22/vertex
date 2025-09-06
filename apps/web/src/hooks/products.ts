import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserProducts = () =>
  useQuery({
    queryFn: async () => await client.product.get(),
    queryKey: ['user', 'products'],
  });

export const useUserProductDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.product.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'products'],
      });
    },
  });
};
