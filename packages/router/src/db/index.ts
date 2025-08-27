import { env } from 'cloudflare:workers';
import {db as clientDB} from '@repo/db/index'

export const db = clientDB({...env}) 