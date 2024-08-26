import { FastifyInstance } from "fastify";
import { PersonCreate } from "../interface/person.interface";
import { PersonUseCase } from "../usercases/person.usecase";
import { PersonSchema } from "../schemas/person.schema";
import { HttpError } from "../errors/HttpError";
import { formatZodError } from "../errors/ZoodError";
import { authMiddleware } from "../middlewares/auth.middleware";
import fromZodError from 'zod-to-json-schema';

export async function personRoutes(fastify: FastifyInstance) {
    const personUseCase = new PersonUseCase();

    const personJsonSchema = fromZodError(PersonSchema);

    fastify.addHook('preHandler', authMiddleware);

    fastify.post<{ Body: PersonCreate }>('/', {
        schema: {
            description: 'Cria uma nova pessoa',
            tags: ['Person'],
            body: personJsonSchema,
            response: {
                201: {
                    description: 'Pessoa criada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
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
            const result = PersonSchema.safeParse(req.body);

            if (!result.success) {
                throw new HttpError({ code: 422, message: formatZodError(result.error) });
            }

            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;

            try {
                const user = await req.jwtVerify<{ id: string; email: string }>();

                const person = await personUseCase.create(dataBody, user.id);

                return reply.status(201).send(person);

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

    fastify.get<{ Params: { id: string } }>('/:id', {
        schema: {
            description: 'Obtém uma pessoa pelo ID',
            tags: ['Person'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da pessoa' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pessoa encontrada',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        cpf: { type: 'string' },
                        date_of_birth: { type: 'string' },
                        phone_number: { type: 'string' }
                    }
                },
                404: {
                    description: 'Pessoa não encontrada',
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
            const { id } = req.params;

            try {
                const person = await personUseCase.findById(id);

                return reply.send(person);
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

    fastify.delete<{ Params: { id: string } }>('/:id', {
        schema: {
            description: 'Deleta uma pessoa pelo ID',
            tags: ['Person'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da pessoa' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pessoa deletada com sucesso',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                404: {
                    description: 'Pessoa não encontrada',
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
            const { id } = req.params;

            try {
                await personUseCase.delete(id);

                return reply.send({ message: 'Pessoa deletada com sucesso' });
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

    fastify.put<{ Body: PersonCreate, Params: { id: string } }>('/:id', {
        schema: {
            description: 'Atualiza uma pessoa pelo ID',
            tags: ['Person'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da pessoa' }
                },
                required: ['id']
            },
            body: personJsonSchema,
            response: {
                200: {
                    description: 'Pessoa atualizada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        cpf: { type: 'string' },
                        date_of_birth: { type: 'string' },
                        phone_number: { type: 'string' }
                    }
                },
                404: {
                    description: 'Pessoa não encontrada',
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
            const result = PersonSchema.safeParse(req.body);

            if (!result.success) {
                throw new HttpError({ code: 422, message: formatZodError(result.error) });
            }

            req.body = result.data;
        },
        handler: async (req, reply) => {
            const { id } = req.params;
            
            const dataBody = {...req.body, id: id}

            try {
                const data = await personUseCase.update(dataBody);
                
                return reply.status(200).send(data);
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
