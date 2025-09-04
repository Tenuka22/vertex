import { env } from 'cloudflare:workers';
import { db as clientDB } from '@repo/db';

export const db = clientDB({ ...env });
