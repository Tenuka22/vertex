import { db as creatDB } from '@repo/db';
import { account, session, user, verification } from '@repo/db/schema/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, createAuthMiddleware, openAPI } from 'better-auth/plugins';
import { redirect } from 'next/navigation';

const SESSION_CACHE_SECONDS = 5;

export const serverAuth = ({
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
    database: drizzleAdapter(creatDB({ DATABASE_URL }), {
      provider: 'pg',
      schema: { account, session, user, verification },
    }),
    trustedOrigins: [CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
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
        sameSite: 'none',
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
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        const { path, context } = await ctx;
        if (path.startsWith('/callback') && context.newSession) {
          redirect(`/callback?token=${context.newSession.session.token}`);
        }
      }),
    },
    plugins: [
      bearer(),
      openAPI({
        path: '/docs',
      }),
    ],
  });

export const auth = serverAuth({
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.NEXT_PUBLIC_CORS_ORIGIN || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
  BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '',
});
