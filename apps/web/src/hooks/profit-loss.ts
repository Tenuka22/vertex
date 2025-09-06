import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useProfitLossData = (startDate?: string, endDate?: string) =>
  useQuery({
    queryFn: async () =>
      await client.profitLoss.getData({ startDate, endDate }),
    queryKey: ['profitLoss', 'data', { startDate, endDate }],
  });

export const useProfitLossSummary = (startDate?: string, endDate?: string) =>
  useQuery({
    queryFn: async () =>
      await client.profitLoss.getSummary({ startDate, endDate }),
    queryKey: ['profitLoss', 'summary', { startDate, endDate }],
  });
