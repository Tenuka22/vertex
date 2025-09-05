import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useProfitLossData = (startDate?: string, endDate?: string) =>
  useQuery({
    queryFn: async () =>
      await orpc.profitLoss.getData.call({ startDate, endDate }),
    queryKey: ['profitLoss', 'data', startDate, endDate],
    initialData: [],
  });

export const useProfitLossSummary = (startDate?: string, endDate?: string) =>
  useQuery({
    queryFn: async () =>
      await orpc.profitLoss.getSummary.call({ startDate, endDate }),
    queryKey: ['profitLoss', 'summary', startDate, endDate],
    initialData: { totalRevenue: 0, totalExpenses: 0, netProfit: 0 },
  });
