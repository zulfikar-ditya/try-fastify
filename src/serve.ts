import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyRedis from "@fastify/redis";

import { AppRoutes } from "@routes";
import { appConfig, redisConfig } from "@config";
import { DateUtils, LoggerUtils } from "@utils";

import corsPlugin from "@plugins/cors.plugin";
import authPlugin from "@plugins/auth.plugin";
import mailPlugin from "@plugins/mail.plugin";
import { errorHandler } from "@plugins/error-handler.plugin";

const app = Fastify({
	logger: {
		level: appConfig.LOG_LEVEL,
		base: null,
		timestamp: () =>
			`,"time":"${DateUtils.getDateTimeInformative(DateUtils.now())}"`,
		formatters: {
			level: (label) => {
				return { level: label.toUpperCase() };
			},
			log(object) {
				return {
					...object,
					time: DateUtils.getDateTimeInformative(DateUtils.now()),
				};
			},
		},
		browser: {
			disabled: false,
		},
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

// PLUGIN DECORATOR =====================================================
app.register(fastifyJwt, {
	secret: appConfig.JWT_SECRET,
});

app.register(corsPlugin);
app.register(authPlugin);
app.register(mailPlugin);

app.register(fastifyRedis, {
	host: redisConfig.HOST,
	port: redisConfig.PORT,
	password: redisConfig.PASSWORD,
	db: redisConfig.DB,
});

// Routes ==================================================
app.register(AppRoutes);

// Error Handler ==========================================
app.setErrorHandler(errorHandler);

const start = async () => {
	try {
		LoggerUtils.info(`Starting server on port ${appConfig.APP_PORT}...`);
		await app.listen({ port: appConfig.APP_PORT });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

// eslint-disable-next-line
start().catch((err) => {
	process.exit(1);
});
