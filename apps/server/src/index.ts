import { env } from 'cloudflare:workers';
import { RPCHandler } from '@orpc/server/fetch';
import { appRouter } from '@repo/router/routers/index';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authClient } from './lib/auth-client';
import { createContext } from './lib/context';

const app = new Hono();

app.use(logger());
app.use(
  '/*',
  cors({
    origin: [env.CORS_ORIGIN || ''],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.on(['POST', 'GET'], '/api/auth/**', (c) =>
  authClient({ ...env }).handler(c.req.raw)
);

const handler = new RPCHandler(appRouter);
app.use('/rpc/*', async (c, next) => {
  const context = await createContext({ context: c });
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/rpc',
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

app.get('/', (c) => {
  return c.text('OK');
});

const RedirectPath = /^\/client-redirect/;

app.get('/client-redirect/*', (c) => {
  const path = c.req.path.replace(RedirectPath, '');

  const url = new URL(`${path}`, env.CORS_ORIGIN);

  const searchParams = c.req.query();
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.append(key, value);
  }

  return c.redirect(url.toString());
});

export default app;
