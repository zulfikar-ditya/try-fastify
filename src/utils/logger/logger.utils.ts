import { appConfig } from "@config";
import { DateUtils } from "@utils";

export class LoggerUtils {
	private static isDevelopment = appConfig.APP_ENV === "development";

	static error(
		message: string,
		// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
		error?: Error | unknown,
		context?: object,
	): void {
		const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
		const separator = "=".repeat(80);

		// eslint-disable-next-line
		console.error(`\n${separator}`);

		// eslint-disable-next-line
		console.error(`[ERROR] ${timestamp}`);

		// eslint-disable-next-line
		console.error(`Message: ${message}`);

		if (context) {
			// eslint-disable-next-line
			console.error(`Context:`, JSON.stringify(context, null, 2));
		}

		if (error) {
			if (error instanceof Error) {
				// eslint-disable-next-line
				console.error(`Error Name: ${error.name}`);

				// eslint-disable-next-line
				console.error(`Error Message: ${error.message}`);

				if (this.isDevelopment && error.stack) {
					// eslint-disable-next-line
					console.error(`Stack Trace:\n${error.stack}`);
				}
			} else {
				// eslint-disable-next-line
				console.error(`Error Details:`, error);
			}
		}

		// eslint-disable-next-line
		console.error(separator);
	}

	static warn(message: string, context?: object): void {
		const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
		// eslint-disable-next-line
		console.warn(`[WARN] ${timestamp} - ${message}`);

		if (context) {
			// eslint-disable-next-line
			console.warn(`Context:`, JSON.stringify(context, null, 2));
		}
	}

	static info(message: string, context?: object): void {
		const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
		// eslint-disable-next-line
		console.info(`[INFO] ${timestamp} - ${message}`);

		if (context) {
			// eslint-disable-next-line
			console.info(`Context:`, JSON.stringify(context, null, 2));
		}
	}

	static debug(message: string, context?: object): void {
		if (this.isDevelopment) {
			const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
			// eslint-disable-next-line
			console.debug(`[DEBUG] ${timestamp} - ${message}`);

			if (context) {
				// eslint-disable-next-line
				console.debug(`Context:`, JSON.stringify(context, null, 2));
			}
		}
	}
}
