import { FastifyReply, FastifyRequest } from "fastify";

export const AuthHandler = {
	schema: {
		loginSchema: {
			body: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 6 },
				},
			},
			response: {
				200: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
					},
				},
				400: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
						errors: {
							type: "array",
							items: {
								type: "object",
								properties: {
									field: { type: "string" },
									message: { type: "string" },
								},
							},
						},
					},
				},
				500: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
					},
				},
			},
		},
	},

	login: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			// Add your login logic here
			const { email, password } = request.body as {
				email: string;
				password: string;
			};

			// Example response
			return reply.code(200).send({
				success: true,
				message: "Login successful",
			});
		} catch (error) {
			console.error("Login error:", error);

			return reply.code(500).send({
				success: false,
				message: "Internal server error",
			});
		}
	},
};
