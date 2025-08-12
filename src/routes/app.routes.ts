import { appConfig } from "@config";
import { FastifyPluginAsync } from "fastify";
import { AuthHandler } from "@handlers";

// eslint-disable-next-line @typescript-eslint/require-await
export const AppRoutes: FastifyPluginAsync = async (fastify) => {
	// eslint-disable-next-line @typescript-eslint/require-await
	fastify.get("/", async () => {
		return {
			message: `Welcome to API ${appConfig.APP_NAME}`,
		};
	});

	fastify.post("/login", AuthHandler.login);
	fastify.post("/register", AuthHandler.register);
	fastify.post("/verify-email", AuthHandler.verifyEmail);
	fastify.get(
		"/profile",
		{ preHandler: [fastify.authenticate.bind(fastify)] },
		AuthHandler.profile,
	);
};
