import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteBalanceSheetItem,
  getUserBalanceSheetItems,
} from '@/actions/balance-sheet';
import { deleteBudget, getUserBudgets } from '@/actions/budgets';
import {
  createUpdateCashFlow,
  deleteCashFlow,
  getUserCashFlows,
} from '@/actions/cash-flows';

export const useUserBudgets = () =>
  useQuery({
    queryFn: async () => await getUserBudgets(),
    queryKey: ['user', 'budgets'],
  });

export const useUserBudgetDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) => await deleteBudget(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'budgets'],
      });
    },
  });
};

export const useUserCashFlows = () =>
  useQuery({
    queryFn: async () => await getUserCashFlows(),
    queryKey: ['user', 'cashFlows'],
  });

export const useUserCashFlowDelete = () =>
  useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteCashFlow(params.id),
    mutationKey: ['user', 'cashFlows', 'delete'],
  });

export const useUserCashFlowAdd = () =>
  useMutation({
    mutationFn: createUpdateCashFlow,
    mutationKey: ['user', 'cashFlows', 'add'],
  });

export const useUserBalanceSheets = () =>
  useQuery({
    queryFn: async () => await getUserBalanceSheetItems(),
    queryKey: ['user', 'balanceSheets'],
  });

export const useUserBalanceSheetDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteBalanceSheetItem(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'balanceSheets'],
      });
    },
  });
};
