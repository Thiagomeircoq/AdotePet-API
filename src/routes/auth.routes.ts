import { FastifyInstance } from "fastify";
import { HttpError } from "../errors/HttpError";
import { formatZodError } from "../errors/ZoodError";
import { UserSchema } from "../schemas/user.schema";
import { UserCreate, UserLogin } from "../interface/user.interface";
import { AuthUseCase } from "../usercases/auth.usecase";
import { LoginSchema } from "../schemas/login.schema";
import { ValidateTokenRequest } from "../interface/token.interface";
import fromZodError from 'zod-to-json-schema';
import jwt from 'jsonwebtoken';

export async function authRoutes(fastify: FastifyInstance) {
    const authUserCase = new AuthUseCase();
    const userJsonSchema = fromZodError(UserSchema);

    fastify.post<{ Body: UserCreate }>('/signup', {
        schema: {
            description: 'Realiza o cadastro do usuário',
            tags: ['Auth'],
            body: userJsonSchema,
            response: {
                201: {
                    description: 'Usuário criado com sucesso',
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                    }
                },
                409: {
                    description: 'Erro de conflito',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                422: {
                    description: 'Erro de validação',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        preHandler: async (req, reply) => {
            const result = UserSchema.safeParse(req.body);

            if (!result.success) {
                throw new HttpError({ code: 422, message: formatZodError(result.error) });
            }

            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;

            try {
                const user = await authUserCase.create(dataBody);

                const token = fastify.jwt.sign(
                    { id: user.id, email: user.email },
                    { expiresIn: '1m' }
                );

                return reply.status(201).send({ token });
            } catch (error) {
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });

    fastify.post<{ Body: UserLogin }>('/login', {
        schema: {
            description: 'Realiza o login do usuário',
            tags: ['Auth'],
            body: fromZodError(LoginSchema),
            response: {
                200: {
                    description: 'Login realizado com sucesso',
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                    }
                },
                401: {
                    description: 'Credenciais inválidas',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                422: {
                    description: 'Erro de validação',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        preHandler: async (req, reply) => {
            const result = LoginSchema.safeParse(req.body);

            if (!result.success) {
                throw new HttpError({ code: 422, message: formatZodError(result.error) });
            }

            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;

            try {
                const user = await authUserCase.verifyCredentials(dataBody);

                if (user) {
                    const token = fastify.jwt.sign(
                        { id: user.id, email: user.email },
                        { expiresIn: '1m' }
                    );

                    return reply.send({ token });
                }

                throw new HttpError({ code: 401, message: 'Credenciais inválidas' });
            } catch (error) {
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });

    fastify.post<{ Body: ValidateTokenRequest }>('/validate-token', {
        schema: {
            description: 'Valida o token JWT fornecido',
            tags: ['Auth'],
            body: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
                },
                required: ['token']
            },
            response: {
                200: {
                    description: 'Token válido',
                    type: 'object',
                    properties: {
                        valid: { type: 'boolean' }
                    }
                },
                400: {
                    description: 'Token não fornecido',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                401: {
                    description: 'Token inválido',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        handler: async (req, reply) => {
            const { token } = req.body;

            if (!token) {
                return reply.status(400).send({ valid: false, message: 'Token não fornecido' });
            }

            try {
                const tokenValidate = await fastify.jwt.verify(token);

                if (!tokenValidate) {
                    throw new HttpError({ code: 401, message: 'Token inválido' });
                }

                return reply.status(200).send({ valid: true });
            } catch (error) {
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });
}
