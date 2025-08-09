import { FastifyReply } from "fastify";

export class ResponseUtils {
	static success<T>(
		reply: FastifyReply,
		data: T | null,
		message: string = "Success",
		statusCode: number = 200,
	) {
		reply.code(statusCode).send({
			status: statusCode,
			success: true,
			message,
			data,
		});
	}

	static error(reply: FastifyReply, message: string, statusCode: number = 400) {
		reply.code(statusCode).send({
			status: statusCode,
			success: false,
			message,
		});
	}

	static notFound(reply: FastifyReply, message: string = "Resource not found") {
		return this.error(reply, message, 404);
	}

	static unauthorized(reply: FastifyReply, message: string = "Unauthorized") {
		return this.error(reply, message, 401);
	}

	static response<T>(
		reply: FastifyReply,
		success: boolean,
		data: T | null,
		message: string = "Success",
		statusCode: number = 200,
	) {
		reply.code(statusCode).send({
			status: statusCode,
			success,
			message,
			data,
		});
	}

	static validationError(
		reply: FastifyReply,
		errors: { [key: string]: string }[],
		message: string = "Validation failed",
		statusCode: number = 422,
	) {
		reply.code(statusCode).send({
			status: statusCode,
			success: false,
			message,
			errors,
		});
	}
}
