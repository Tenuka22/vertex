import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AppRouterClient } from '../../../server/src/types/router';
import { getHeaders } from './headers';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: 'Retry',
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  fetch: async (url, options) => {
    const customHeaders = await getHeaders();

    const cookiesHeader = customHeaders.find(([k]) => k === 'cookie');
    return fetch(url, {
      ...options,
      headers: cookiesHeader
        ? { [cookiesHeader[0]]: cookiesHeader[1] }
        : undefined,
      credentials: 'include',
    });
  },
});

export const client: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
