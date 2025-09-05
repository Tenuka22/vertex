import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserInvoices = () =>
  useQuery(orpc.invoice.get.queryOptions({}));
