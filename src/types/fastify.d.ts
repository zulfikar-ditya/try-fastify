import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		// eslint-disable-next-line no-unused-vars
		authenticate(_request: FastifyRequest, _reply: FastifyReply): Promise<void>;
	}
}
