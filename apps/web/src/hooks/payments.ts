import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserPaymentMethods = () =>
  useQuery(orpc.payment.get.queryOptions({}));

export const useUserTransactions = () =>
  useQuery(orpc.transaction.get.queryOptions({}));
