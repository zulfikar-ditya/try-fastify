interface IRedisConfig {
	HOST: string;
	PORT: number;
	PASSWORD?: string;
	DB: number;
	TTL: number;
}

export const redisConfig: IRedisConfig = {
	HOST: process.env.REDIS_HOST || "localhost",
	PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
	PASSWORD: process.env.REDIS_PASSWORD,
	DB: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
	TTL: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL) : 3600,
};
