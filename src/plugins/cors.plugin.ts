import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { corsConfig } from "@config";

async function corsPlugin(fastify: FastifyInstance) {
	await fastify.register(fastifyCors, {
		origin: (origin, cb) => {
			if (!origin) return cb(null, true);

			const hostname = new URL(origin).hostname;
			const allowedOrigins = corsConfig.ALLOWED_HOST;
			if (allowedOrigins.includes(hostname)) {
				cb(null, true);
			} else {
				cb(new Error("Not allowed by CORS"), false);
			}
		},
		methods: corsConfig.ALLOWED_METHODS,
		allowedHeaders: corsConfig.ALLOWED_HEADERS,
		exposedHeaders: corsConfig.EXPOSED_HEADERS,
		credentials: corsConfig.ALLOW_CREDENTIALS,
		maxAge: corsConfig.MAX_AGE,
	});
}

export default fastifyPlugin(corsPlugin);
