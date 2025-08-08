import { appConfig } from "@config";
import { FastifyPluginAsync } from "fastify";
import { AuthHandler } from "@handlers";

export const AppRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get("/", async (request, reply) => {
		return {
			message: `Welcome to API ${appConfig.APP_NAME}`,
		};
	});

	fastify.post(
		"/login",
		{ schema: AuthHandler.schema.loginSchema },
		AuthHandler.login,
	);
};
