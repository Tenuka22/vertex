import type { RouterClient } from '@orpc/server';
import type { appRouter } from '@repo/router/routers/index';

export type AppRouterClient = RouterClient<typeof appRouter>;
