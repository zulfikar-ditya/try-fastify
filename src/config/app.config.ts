interface AppConfigInterface {
	APP_NAME: string;
	APP_PORT: number;
	APP_URL: string;
}

export const appConfig: AppConfigInterface = {
	APP_NAME: process.env.APP_NAME || "Fastify App",
	APP_PORT: parseInt(process.env.APP_PORT || "3000", 10),
	APP_URL: process.env.APP_URL || "http://localhost:3000",
};
