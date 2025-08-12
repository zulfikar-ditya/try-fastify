import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { db, usersTable } from "../db";
import { and, eq, isNotNull } from "drizzle-orm";
import { redisConfig } from "@config";
import { ResponseUtils } from "@utils";

async function authPlugin(fastify: FastifyInstance) {
	fastify.decorate(
		"authenticate",
		async function (req: FastifyRequest, reply: FastifyReply) {
			try {
				await req.jwtVerify();
				const userJwt = req.user as { id: string };

				const sessionKey = `session:${userJwt.id}`;
				const cacheUser = await this.redis.get(sessionKey);

				if (!cacheUser) {
					const userData = await db
						.select({
							id: usersTable.id,
							name: usersTable.name,
							email: usersTable.email,
						})
						.from(usersTable)
						.where(
							and(
								eq(usersTable.id, userJwt.id),
								isNotNull(usersTable.emailVerifiedAt),
							),
						)
						.limit(1);

					if (userData.length === 0) {
						ResponseUtils.unauthorized(
							reply,
							"User not found or email not verified",
						);
						return;
					}

					await this.redis.set(
						sessionKey,
						JSON.stringify(userData[0]),
						"EX",
						redisConfig.TTL,
					);
					req.user = userData[0];
				} else {
					req.user = JSON.parse(cacheUser);
				}
			} catch (err) {
				reply.send(err);
			}
		},
	);
}

export default fastifyPlugin(authPlugin);
