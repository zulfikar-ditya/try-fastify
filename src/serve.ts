import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { AppRoutes } from "@routes";
import { appConfig } from "@config";
import { errors } from "@vinejs/vine";
import { DateUtils, LoggerUtils, ResponseUtils } from "@utils";
import fastifyJwt from "@fastify/jwt";
import mailPlugin from "@plugins/mail.plugin";

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

app.register(fastifyJwt, {
	secret: appConfig.JWT_SECRET,
});

// PLUGIN DECORATOR =====================================================
app.decorate(
	"authenticate",
	async function (req: FastifyRequest, reply: FastifyReply) {
		try {
			await req.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	},
);

app.register(mailPlugin);

// Routes ==================================================
app.register(AppRoutes);

// Error Handler ==========================================
app.setErrorHandler((error, request, reply) => {
	// Vine validation error
	if (error instanceof errors.E_VALIDATION_ERROR) {
		ResponseUtils.validationError(
			reply,
			(error.messages as { field: string; message: string }[]).map(
				(msg: { field: string; message: string }) => ({
					field: msg.field,
					message: msg.message,
				}),
			),
		);

		return;
	}

	// fastify validation error
	if (error instanceof Fastify.errorCodes.FST_ERR_NOT_FOUND) {
		ResponseUtils.notFound(reply, error.message);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_VALIDATION) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_INVALID_TYPE) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_EMPTY_TYPE) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_INVALID_HANDLER) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_INVALID_PARSE_TYPE) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_INVALID_MEDIA_TYPE) {
		ResponseUtils.error(reply, error.message, 415);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_INVALID_CONTENT_LENGTH) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_EMPTY_JSON_BODY) {
		ResponseUtils.error(reply, "JSON Parse error: " + error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_REP_INVALID_PAYLOAD_TYPE) {
		ResponseUtils.error(reply, error.message, 400);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_BODY_TOO_LARGE) {
		ResponseUtils.error(reply, error.message, 413);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_FAILED_ERROR_SERIALIZATION) {
		ResponseUtils.error(reply, error.message, 500);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_SEND_UNDEFINED_ERR) {
		ResponseUtils.error(reply, error.message, 500);
		return;
	}

	if (error instanceof Fastify.errorCodes.FST_ERR_REP_ALREADY_SENT) {
		ResponseUtils.error(reply, error.message, 500);
		return;
	}

	if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
		ResponseUtils.error(reply, error.message, error.statusCode);
		return;
	}

	request.log.error(
		`APP Error: ${error.message}, Stack: ${error.stack}, Error name: ${error.name || "undefined"}`,
	);

	ResponseUtils.error(reply, "Internal Server Error", 500);
});

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
