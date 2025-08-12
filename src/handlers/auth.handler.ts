import { db } from "@db/index";
import { FastifyReply, FastifyRequest } from "fastify";
import { usersTable } from "../db/schema/user";
import { and, eq, isNotNull, ne } from "drizzle-orm";
import { HashUtils, ResponseUtils, StrUtils } from "@utils/index";
import vine from "@vinejs/vine";
import { StrongPassword } from "@utils";
import { emailVerifyToken } from "@db/schema/email-verify-token";
import { appConfig } from "@config/app.config";

export const AuthHandler = {
	schema: {
		loginSchema: {
			body: vine.object({
				email: vine.string().email(),
				password: vine.string(),
			}),
			response: {
				200: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
						data: {},
					},
				},
			},
		},

		registerSchema: {
			body: vine.object({
				name: vine.string().minLength(1),
				email: vine.string().email(),
				password: vine.string().minLength(8).confirmed().regex(StrongPassword),
			}),
			response: {
				201: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
						data: {},
					},
				},
			},
		},

		verifyEmailSchema: {
			params: vine.object({
				token: vine.string().minLength(1),
			}),
			response: {
				200: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
						data: {},
					},
				},
			},
		},
	},

	login: async (request: FastifyRequest, reply: FastifyReply) => {
		const body = request.body as {
			email: string;
			password: string;
		};

		const validate = await vine.validate({
			schema: AuthHandler.schema.loginSchema.body,
			data: body,
		});

		const user = await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				password: usersTable.password,
			})
			.from(usersTable)
			.where(
				and(
					isNotNull(usersTable.emailVerifiedAt),
					eq(usersTable.email, validate.email),
				),
			)
			.limit(1);

		if (user.length === 0) {
			return reply.code(400).send({
				success: false,
				message: "Invalid email or password",
				errors: [{ field: "email", message: "User not found" }],
			});
		}

		const isPasswordValid = await HashUtils.compareHash(
			validate.password,
			user[0].password,
		);
		if (!isPasswordValid) {
			return reply.code(400).send({
				success: false,
				message: "Invalid email or password",
				errors: [{ field: "password", message: "Incorrect password" }],
			});
		}

		const token = await reply.jwtSign({
			id: user[0].id,
		});

		return reply.code(200).send({
			success: true,
			message: "Login successful",
			data: {
				user_information: {
					id: user[0].id,
					name: user[0].name,
					email: user[0].email,
				},
				token,
			},
		});
	},

	register: async (request: FastifyRequest, reply: FastifyReply) => {
		const body = request.body as {
			name: string;
			email: string;
			password: string;
		};

		const validate = await vine.validate({
			schema: AuthHandler.schema.registerSchema.body,
			data: body,
		});

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, validate.email))
			.limit(1);

		if (existingUser.length > 0) {
			ResponseUtils.validationError(reply, [
				{
					field: "email",
					message: "Email already exists",
				},
			]);
		}

		const hashedPassword = await HashUtils.generateHash(validate.password);
		const data = await db.transaction(async (tx) => {
			// insert user and get inserted data.
			await tx.insert(usersTable).values({
				name: validate.name,
				email: validate.email,
				password: hashedPassword,
			});

			const rawUser = await tx
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, validate.email))
				.limit(1);

			if (rawUser.length === 0) {
				throw new Error("User registration failed");
			}

			const user = rawUser[0];

			// create token and send email
			const tokenVerify = StrUtils.random(64);
			await tx.insert(emailVerifyToken).values({
				userId: user.id,
				token: tokenVerify,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
			});

			await request.server.emailService.sendMail({
				to: user.email,
				subject: "Verify your email",
				html: `<p>Click <a href="${appConfig.CLIENT_URL}/verify-email?token=${tokenVerify}">here</a> to verify your email.</p>`,
			});

			return user;
		});

		return ResponseUtils.success(
			reply,
			{
				user_information: {
					id: data.id,
					name: data.name,
					email: data.email,
				},
			},
			"User registered successfully, please check your email to verify your account.",
			201,
		);
	},

	verifyEmail: async (request: FastifyRequest, reply: FastifyReply) => {
		const validate = await vine.validate({
			schema: AuthHandler.schema.verifyEmailSchema.params,
			data: request.body,
		});

		const token = validate.token;
		const emailVerifyTokenData = await db
			.select()
			.from(emailVerifyToken)
			.where(eq(emailVerifyToken.token, token))
			.limit(1);

		if (emailVerifyTokenData.length === 0) {
			return ResponseUtils.validationError(reply, [
				{
					field: "token",
					message: "Invalid or expired token",
				},
			]);
		}

		if (emailVerifyTokenData[0].expiresAt < new Date()) {
			return ResponseUtils.validationError(reply, [
				{
					field: "token",
					message: "Invalid or expired token",
				},
			]);
		}

		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, emailVerifyTokenData[0].userId))
			.limit(1);

		if (user.length === 0) {
			return ResponseUtils.notFound(reply, "User not found");
		}

		await db.transaction(async (tx) => {
			await tx
				.update(usersTable)
				.set({
					emailVerifiedAt: new Date(),
				})
				.where(eq(usersTable.id, user[0].id));

			await tx
				.delete(emailVerifyToken)
				.where(eq(emailVerifyToken.id, emailVerifyTokenData[0].id));
		});

		return ResponseUtils.success(
			reply,
			{
				user_information: {
					id: user[0].id,
					name: user[0].name,
					email: user[0].email,
				},
			},
			"Email verified successfully",
		);
	},

	profile: async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user as { id: string; email: string; name: string };

		if (!user) {
			return ResponseUtils.unauthorized(reply, "User not authenticated");
		}

		const userData = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, user.id))
			.limit(1);

		if (userData.length === 0) {
			return ResponseUtils.notFound(reply, "User not found");
		}

		return ResponseUtils.success(
			reply,
			{
				id: userData[0].id,
				name: userData[0].name,
				email: userData[0].email,
			},
			"User profile retrieved successfully",
		);
	},
};
