import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserGoals = () => useQuery(orpc.goal.get.queryOptions({}));
