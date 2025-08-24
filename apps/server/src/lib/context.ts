import { env } from 'cloudflare:workers';
import type { Context as HonoContext } from 'hono';
import { authClient } from './auth-client';

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await authClient({ ...env }).api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
