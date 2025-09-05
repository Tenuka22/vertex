import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserBudgets = () => useQuery(orpc.budget.get.queryOptions({}));

export const useUserCashFlows = () =>
  useQuery(orpc.cashFlow.get.queryOptions({}));

export const useUserBalanceSheetItems = () =>
  useQuery(orpc.balanceSheet.get.queryOptions({}));
