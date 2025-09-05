import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserBusinessContacts = () =>
  useQuery({
    queryFn: async () => {
      const data = await orpc.businessContact.get.call();
      return data;
    },
    queryKey: ['user', 'businessContacts'],
    initialData: [],
  });
