import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserGoals = () =>
  useQuery({
    queryFn: async () => await client.goal.get(),
    queryKey: ['user', 'goals'],
  });
