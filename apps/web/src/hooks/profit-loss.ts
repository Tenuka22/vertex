import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useProfitLossData = (startDate?: string, endDate?: string) =>
  useQuery(
    orpc.profitLoss.getData.queryOptions({ input: { startDate, endDate } })
  );

export const useProfitLossSummary = (startDate?: string, endDate?: string) =>
  useQuery(
    orpc.profitLoss.getSummary.queryOptions({ input: { startDate, endDate } })
  );
