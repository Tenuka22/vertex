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
          label: 'retry',
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
    const headersObject: Record<string, string> = {};

    if (customHeaders instanceof Headers) {
      for (const [key, value] of customHeaders.entries()) {
        headersObject[key] = value;
      }
    } else if (
      customHeaders &&
      typeof customHeaders === 'object' &&
      Symbol.iterator in customHeaders
    ) {
      for (const [key, value] of customHeaders) {
        if (typeof key === 'string' && typeof value === 'string') {
          headersObject[key] = value;
        }
      }
    } else if (customHeaders && typeof customHeaders === 'object') {
      Object.assign(headersObject, customHeaders);
    }

    return fetch(url, {
      ...options,
      headers: headersObject,
      credentials: 'include',
    });
  },
});

export const client: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
