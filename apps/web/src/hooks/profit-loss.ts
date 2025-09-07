import { useQuery } from '@tanstack/react-query';
import { getProfitLossData, getProfitLossSummary } from '@/actions/profit-loss';

export const useProfitLossData = (startDate?: string, endDate?: string) =>
  useQuery({
    queryFn: async () => await getProfitLossData({ startDate, endDate }),
    queryKey: ['profitLoss', 'data', { startDate, endDate }],
  });

export const useProfitLossSummary = (startDate?: string, endDate?: string) =>
  useQuery({
    queryFn: async () => await getProfitLossSummary({ startDate, endDate }),
    queryKey: ['profitLoss', 'summary', { startDate, endDate }],
  });
