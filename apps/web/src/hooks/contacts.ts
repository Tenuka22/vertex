import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserBusinessContacts = () =>
  useQuery({
    queryFn: async () => await orpc.businessContact.get.call(),
    queryKey: ['user', 'businessContacts'],
    initialData: [],
  });
