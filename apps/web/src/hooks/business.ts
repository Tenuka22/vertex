import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserBusinessInformation = () =>
  useQuery({
    queryFn: async () => await orpc.businessInformation.get.call(),
    queryKey: ['user', 'businessInfo'],
    initialData: undefined,
  });

export const useUserBusinessProfile = () =>
  useQuery({
    queryFn: async () => await orpc.businessProfile.get.call(),
    queryKey: ['user', 'businessProfile'],
    initialData: undefined,
  });
