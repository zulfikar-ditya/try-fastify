import { FastifyPluginAsync } from "fastify";

export const LoggerPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("onRequest", async (request, reply) => {
		fastify.log.info(`[${request.method}] ${request.url}`);
	});
};
