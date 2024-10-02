import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon("postgresql://neondb_owner:4khJZQE0bYSI@ep-ancient-rain-a56t439j.us-east-2.aws.neon.tech/ExpensePulse?sslmode=require");
export const db = drizzle(sql, {schema});
