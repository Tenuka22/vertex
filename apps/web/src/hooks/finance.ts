import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserBudgets = () =>
  useQuery({
    queryFn: async () => await orpc.budget.get.call(),
    queryKey: ['user', 'budgets'],
    initialData: [],
  });

export const useUserCashFlows = () =>
  useQuery({
    queryFn: async () => await orpc.cashFlow.get.call(),
    queryKey: ['user', 'cashFlows'],
    initialData: [],
  });

export const useUserBalanceSheetItems = () =>
  useQuery({
    queryFn: async () => await orpc.balanceSheet.get.call(),
    queryKey: ['user', 'balanceSheetItems'],
    initialData: [],
  });
