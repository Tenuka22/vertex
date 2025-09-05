'use client';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { authClient } from '@/lib/auth-client';
import type { AppRouterClient } from '../../../server/src/types/router';

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  headers: async () => {
    const { data } = await authClient.getSession();

    return { Authorization: data?.session.token ?? '' };
  },
});
declare global {
  var $client: AppRouterClient | undefined;
}

export const client: AppRouterClient =
  globalThis.$client ?? createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
