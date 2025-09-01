// biome-ignore lint/performance/noNamespaceImport: Drizzle Rule
import * as schema from '@repo/db/schema/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/node-postgres';

export const authClient = ({
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  CORS_ORIGIN,
  DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
}: {
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}) =>
  betterAuth({
    database: drizzleAdapter(drizzle(DATABASE_URL), {
      provider: 'pg',

      schema,
    }),
    trustedOrigins: [CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: GOOGLE_CLIENT_ID as string,
        clientSecret: GOOGLE_CLIENT_SECRET as string,
      },
    },
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [
      openAPI({
        path: '/docs',
      }),
    ],
  });
