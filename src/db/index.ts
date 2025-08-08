import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// You can specify any property from the node-postgres connection options
const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL!,
		ssl:
			process.env.DATABASE_SSL === "true"
				? { rejectUnauthorized: false }
				: false,
	},
});

const pool = db.$client;

export { db, pool };

export * from "./schema/user";
