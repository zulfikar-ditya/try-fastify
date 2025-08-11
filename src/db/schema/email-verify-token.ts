import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const emailVerifyToken = pgTable("email_verify_tokens", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").notNull(),
	token: varchar({ length: 255 }).notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});
