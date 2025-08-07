import Fastify from "fastify";
import { LoggerPlugin } from "@plugins";
import { AppRoutes } from "@routes";
import { appConfig } from "@config";

const app = Fastify({
	logger: false,
});

app.register(LoggerPlugin);
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
	console.error("Error starting server:", err);
	process.exit(1);
});
