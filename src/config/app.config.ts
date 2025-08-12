interface AppConfigInterface {
	APP_NAME: string;
	APP_PORT: number;
	APP_KEY: string;
	APP_URL: string;
	APP_ENV: "development" | "production" | "test" | "staging" | "local";
	APP_TIMEZONE: string;

	LOG_LEVEL: "info" | "debug" | "warn" | "error";

	JWT_SECRET: string;

	CLIENT_URL: string;
}

export const appConfig: AppConfigInterface = {
	APP_NAME: process.env.APP_NAME || "Fastify App",
	APP_PORT: parseInt(process.env.APP_PORT || "3000", 10),
	APP_KEY: process.env.APP_KEY || "default-secret-key",
	APP_URL: process.env.APP_URL || "http://localhost:3000",
	APP_ENV:
		(process.env.APP_ENV as
			| "development"
			| "production"
			| "test"
			| "staging"
			| "local") || "development",
	APP_TIMEZONE: process.env.APP_TIMEZONE || "UTC",

	LOG_LEVEL:
		(process.env.LOG_LEVEL as "info" | "debug" | "warn" | "error") || "info",

	JWT_SECRET: process.env.JWT_SECRET || "supersecret",

	CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
