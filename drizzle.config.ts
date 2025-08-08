import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		ssl:
			process.env.DATABASE_SSL === "true"
				? { rejectUnauthorized: false }
				: false,
	},
});
