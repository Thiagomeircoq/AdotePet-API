import { FastifyInstance } from "fastify";
import { registerUserJsonSchema, RegisterUserSchema } from "../../schemas/auth/auth.schema";
import { formatZodError } from "../../errors/ZoodError";
import { HttpError } from "../../errors/HttpError";
import { AuthUseCase } from "../../usercases/auth/auth.usecase";
import { loginJsonSchema, LoginSchema } from "../../schemas/auth/login.schema";
import { LoginUserDTO, RegisterUserDTO } from "../../interface/auth/auth.interface";

export async function authRoutes(fastify: FastifyInstance) {
    const authUseCase = new AuthUseCase();

    fastify.post<{ Body: RegisterUserDTO }>('/register', {
        schema: {
            description: 'Realiza o registro de um novo usuário',
            tags: ['Auth'],
            body: registerUserJsonSchema,
            response: {
                200: {
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
            const result = RegisterUserSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;
        
            try {

                const user = await authUseCase.register(dataBody);

                if (user) {
                    const token = fastify.jwt.sign(
                        { id: user.id, email: user.email },
                        { expiresIn: '7d' }
                    );
                
                    return reply.status(200).send({ token: token });
                }
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

    fastify.post<{ Body: LoginUserDTO }>('/login', {
        schema: {
            description: 'Realiza o login do usuário',
            tags: ['Auth'],
            body: loginJsonSchema,
            response: {
                200: {
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
            const result = LoginSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;
        
            try {
                const user = await authUseCase.verifyCredentials(dataBody);

                if (user) {
                    const token = fastify.jwt.sign(
                        { id: user.id, email: user.email },
                        { expiresIn: '7d' }
                    );
                
                    return reply.status(200).send({ token: token });
                }
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

    fastify.post('/logout', {
        schema: {
            description: 'Realiza o logout do usuário',
            tags: ['Auth'],
            response: {
                200: {
                    description: 'Logout realizado com sucesso',
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
            try {
                reply.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                }).status(200).send({ message: 'Logout realizado com sucesso' });
            } catch (error) {
                reply.status(500).send({ message: 'Erro ao realizar logout' });
            }
        }
    });
}