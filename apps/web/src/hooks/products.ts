import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, getUserProducts } from '@/actions/products';

export const useUserProducts = () =>
  useQuery({
    queryFn: async () => await getUserProducts(),
    queryKey: ['user', 'products'],
  });

export const useUserProductDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteProduct(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'products'],
      });
    },
  });
};
