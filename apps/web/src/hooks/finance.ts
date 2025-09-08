import { useMutation, useQuery } from '@tanstack/react-query';
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
import { queryClient } from '@/components/providers/providers';

export const useUserBudgets = () =>
  useQuery({
    queryFn: async () => await getUserBudgets(),
    queryKey: ['user', 'budgets'],
  });

export const useUserBudgetDelete = () => {
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

export const useDeleteUserCashFlow = () =>
  useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteCashFlow(params.id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['user', 'cashFlows'],
      }),
    mutationKey: ['user', 'cashFlows', 'delete'],
  });

export const useAddUserCashFlow = () =>
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
