import { MailConfig } from "@config";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";

export class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: MailConfig.MAIL_HOST,
			port: MailConfig.MAIL_PORT,
			secure: MailConfig.MAIL_SECURE,
			auth: {
				user: MailConfig.MAIL_USER,
				pass: MailConfig.MAIL_PASSWORD,
			},
		});
	}

	async sendMail(options: SendMailOptions) {
		await this.transporter.sendMail(options);
	}
}
