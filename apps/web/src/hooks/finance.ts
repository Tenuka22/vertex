import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserBudgets = () =>
  useQuery({
    queryFn: async () => await client.budget.get(),
    queryKey: ['user', 'budgets'],
  });

export const useUserBudgetDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.budget.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'budgets'],
      });
    },
  });
};

export const useUserCashFlows = () =>
  useQuery({
    queryFn: async () => await client.cashFlow.get(),
    queryKey: ['user', 'cashFlows'],
  });

export const useUserCashFlowDelete = () =>
  useMutation({
    mutationFn: client.cashFlow.delete,
    mutationKey: ['user', 'cashFlows', 'delete'],
  });

export const useUserCashFlowAdd = () =>
  useMutation({
    mutationFn: client.cashFlow.createUpdate,
    mutationKey: ['user', 'cashFlows', 'add'],
  });

export const useUserBalanceSheets = () =>
  useQuery({
    queryFn: async () => await client.balanceSheet.get(),
    queryKey: ['user', 'balanceSheets'],
  });

export const useUserBalanceSheetDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.balanceSheet.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'balanceSheets'],
      });
    },
  });
};
