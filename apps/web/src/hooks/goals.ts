import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteGoal, getUserGoals } from '@/actions/goals';

export const useUserGoals = () =>
  useQuery({
    queryFn: async () => await getUserGoals(),
    queryKey: ['user', 'goals'],
  });

export const useUserGoalDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) => await deleteGoal(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'goals'],
      });
    },
  });
};
