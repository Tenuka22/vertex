import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserGoals = () =>
  useQuery({
    queryFn: async () => await orpc.goal.get.call(),
    queryKey: ['user', 'goals'],
    initialData: [],
  });
