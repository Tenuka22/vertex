import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserBudgets = () =>
  useQuery({
    queryFn: async () => await client.budget.get(),
    queryKey: ['user', 'budgets'],
  });

export const useUserCashFlows = () =>
  useQuery({
    queryFn: async () => await client.cashFlow.get(),
    queryKey: ['user', 'cashFlows'],
  });

export const useUserBalanceSheetItems = () =>
  useQuery({
    queryFn: async () => await client.balanceSheet.get(),
    queryKey: ['user', 'balanceSheetItems'],
  });
