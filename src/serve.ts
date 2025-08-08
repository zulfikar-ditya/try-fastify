import Fastify, { fastify } from "fastify";
import { AppRoutes } from "@routes";
import { appConfig } from "@config";

const app = Fastify({
	logger: {
		level: appConfig.LOG_LEVEL,
		base: null,
		timestamp: () => `,"time":"${new Date().toISOString()}"`,
		formatters: {
			level: (label) => {
				return { level: label.toUpperCase() };
			},
			log(object) {
				return {
					...object,
					time: new Date().toISOString(),
				};
			},
		},
		browser: {},
		file: "src/storage/logs/app.log",
		serializers: {
			req: (req) => {
				return {
					method: req.method,
					url: req.url,
				};
			},
			res: (res) => {
				return {
					statusCode: res.statusCode,
				};
			},
		},
	},
});

// Routes ==================================================
app.register(AppRoutes);

// Error Handler ==========================================
app.setErrorHandler((error, request, reply) => {
	if (error instanceof Fastify.errorCodes.FST_ERR_NOT_FOUND) {
		reply.status(404).send({
			success: false,
			message: "Not Found",
			data: null,
		});
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_BAD_URL) {
		reply.status(404).send({
			success: false,
			message: "Not Found",
			data: null,
		});
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_INVALID_URL) {
		reply.status(404).send({
			success: false,
			message: "Not Found",
			data: null,
		});
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_VALIDATION) {
		reply.status(400).send({
			success: false,
			message: "Validation Error",
			errors: error.validation,
		});
	}

	console.log(error);

	reply.send(error);
});

// Logger ==================================================
// app.addHook("onRequest", async (request, reply) => {
// 	app.log.info({
// 		method: request.method,
// 		url: request.url,
// 		userAgent: request.headers["user-agent"],
// 		ip: request.ip,
// 	});
// });

// app.addHook("onResponse", async (request, reply) => {
// 	app.log.info({
// 		method: request.method,
// 		url: request.url,
// 		statusCode: reply.statusCode,
// 	});
// });

// app.addHook("onError", async (request, reply, error) => {
// 	app.log.error({
// 		method: request.method,
// 		url: request.url,
// 		error: error.message,
// 		stack: error.stack,
// 	});
// });
const start = async () => {
	try {
		await app.listen({ port: appConfig.APP_PORT });
		console.log(`🚀 Server ready at ${appConfig.APP_URL}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start().catch((err) => {
	process.exit(1);
});
