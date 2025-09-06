import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserGoals = () =>
  useQuery({
    queryFn: async () => await client.goal.get(),
    queryKey: ['user', 'goals'],
  });

export const useUserGoalDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.goal.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'goals'],
      });
    },
  });
};
