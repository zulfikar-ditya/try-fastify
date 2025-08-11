interface IMailConfig {
	MAIL_HOST: string;
	MAIL_PORT: number;
	MAIL_SECURE: boolean;
	MAIL_USER: string;
	MAIL_PASSWORD: string;
	MAIL_FROM: string;
	MAIL_FROM_NAME: string;
}

export const MailConfig: IMailConfig = {
	MAIL_HOST: process.env.MAIL_HOST || "smtp.example.com",
	MAIL_PORT: Number(process.env.MAIL_PORT) || 587,
	MAIL_SECURE: process.env.MAIL_SECURE === "true",
	MAIL_USER: process.env.MAIL_USERNAME || "",
	MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
	MAIL_FROM: process.env.MAIL_FROM || "",
	MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || "No Reply",
};
