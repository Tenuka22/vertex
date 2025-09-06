'use client';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { AppRouterClient } from '../../../server/src/types/router';

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  headers: () => {
    const token = localStorage.getItem('bearer_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  },
});

export const client: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
