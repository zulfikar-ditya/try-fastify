import { EmailService } from "@services/email.service";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
	const emailService = new EmailService();
	fastify.decorate("emailService", emailService);
});
