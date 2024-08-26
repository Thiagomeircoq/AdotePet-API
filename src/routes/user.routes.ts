import { FastifyInstance } from "fastify";
import { HttpError } from "../errors/HttpError";
import { UpdatePassword, UserCreate } from "../interface/user.interface";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserUseCase } from "../usercases/user.usecase";
import { PasswordUpdate } from "../schemas/user.schema";
import { formatZodError } from "../errors/ZoodError";

export async function userRoutes(fastify: FastifyInstance) {
    const userUseCase = new UserUseCase();
    
    fastify.addHook('preHandler', authMiddleware);

    fastify.delete<{ Params: { id: string } }>(
        '/:id',
        {
            schema: {
                description: 'Deleta um usuário pelo ID',
                tags: ['User'],
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' }
                    },
                    required: ['id']
                },
                response: {
                    200: {
                        description: 'Usuário deletado com sucesso',
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        }
                    },
                    404: {
                        description: 'Usuário não encontrado',
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
            }
        },
        async (req, reply) => {
            const { id } = req.params;

            try {
                const data = await userUseCase.delete(id);
                return reply.status(200).send({ message: 'Usuário deletado com sucesso' });
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
    );

    fastify.patch<{ Body: UpdatePassword, Params: { id: string } }>('/:id/password', {
        schema: {
            description: 'Atualiza a senha do usuário pelo ID',
            tags: ['User'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            },
            body: {
                type: 'object',
                properties: {
                    oldPassword: { type: 'string' },
                    newPassword: { type: 'string' }
                },
                required: ['oldPassword', 'newPassword']
            },
            response: {
                200: {
                    description: 'Senha atualizada com sucesso',
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
                404: {
                    description: 'Usuário não encontrado',
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
            const result = PasswordUpdate.safeParse(req.body);

            if (!result.success)
                throw new HttpError({ code: 422, message: formatZodError(result.error) });

            req.body = result.data;
        },
        handler: async (req, reply) => {
            const { id } = req.params;
            const dataBody = req.body;

            try {
                await userUseCase.updatePassword(dataBody, id);
                return reply.status(200).send({ message: 'Senha atualizada com sucesso' });
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
