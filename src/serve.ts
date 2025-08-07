import Fastify from "fastify";
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

// Logger ==================================================
app.addHook("onRequest", async (request, reply) => {
	app.log.info({
		method: request.method,
		url: request.url,
		userAgent: request.headers["user-agent"],
		ip: request.ip,
	});
});

app.addHook("onResponse", async (request, reply) => {
	app.log.info({
		method: request.method,
		url: request.url,
		statusCode: reply.statusCode,
	});
});

app.addHook("onError", async (request, reply, error) => {
	app.log.error({
		method: request.method,
		url: request.url,
		error: error.message,
		stack: error.stack,
	});
});

// Routes ==================================================
app.register(AppRoutes);

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
