// biome-ignore lint/performance/noNamespaceImport:  WholeSchema Required
import * as schema from '@repo/db/schema/primary';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { openAPI } from 'better-auth/plugins';
import { db } from './db';

const SESSION_CACHE_SECONDS = 5;

export const serverAuth = ({
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  CORS_ORIGIN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
}: {
  CORS_ORIGIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    trustedOrigins: [CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'email-password'],
      },
    },
    socialProviders: {
      google: {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: SESSION_CACHE_SECONDS * 60,
      },
    },
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      },
    },
    emailVerification: {
      sendVerificationEmail: async (e) => {
        // biome-ignore lint/suspicious/noConsole: Need to console
        await console.log(e);
      },
    },
    plugins: [
      nextCookies(),
      openAPI({
        path: '/docs',
      }),
    ],
  });

export const auth = serverAuth({
  CORS_ORIGIN: process.env.NEXT_PUBLIC_CORS_ORIGIN || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
  BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '',
});
