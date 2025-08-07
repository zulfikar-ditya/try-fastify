import { appConfig } from "@config";
import { FastifyPluginAsync } from "fastify";

export const AppRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get("/", async (request, reply) => {
		return {
			message: `Welcome to API ${appConfig.APP_NAME}`,
		};
	});
};
