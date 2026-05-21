import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./Schema";

declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = globalThis.db || drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
