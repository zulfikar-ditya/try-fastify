interface ICorsConfig {
	ALLOWED_HOST: string[];
	ALLOWED_METHODS: string[];
	ALLOWED_HEADERS: string[];
	EXPOSED_HEADERS: string[];
	ALLOW_CREDENTIALS: boolean;
	MAX_AGE: number;
}

export const corsConfig: ICorsConfig = {
	ALLOWED_HOST: process.env.ALLOWED_HOST
		? process.env.ALLOWED_HOST.split(",").map((host) => host.trim())
		: ["http://localhost:3000", "https://example.com"],
	ALLOWED_METHODS: process.env.ALLOWED_METHODS
		? process.env.ALLOWED_METHODS.split(",").map((method) => method.trim())
		: ["GET", "POST", "PUT", "DELETE"],
	ALLOWED_HEADERS: process.env.ALLOWED_HEADERS
		? process.env.ALLOWED_HEADERS.split(",").map((header) => header.trim())
		: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
	EXPOSED_HEADERS: process.env.EXPOSED_HEADERS
		? process.env.EXPOSED_HEADERS.split(",").map((header) => header.trim())
		: ["Content-Length", "X-Request-ID"],
	ALLOW_CREDENTIALS: process.env.ALLOW_CREDENTIALS === "true",
	MAX_AGE: process.env.MAX_AGE ? parseInt(process.env.MAX_AGE) : 86400, // 24 hours
};
