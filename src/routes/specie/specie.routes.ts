import { FastifyInstance } from "fastify";
import { HttpError } from "../../errors/HttpError";
import { formatZodError } from "../../errors/ZoodError";
import { SpecieUseCase } from "../../usercases/specie/specie.uscase";
import { CreateSpecieDTO } from "../../interface/specie/specie.interface";
import { specieJsonSchema, SpecieSchema } from "../../schemas/specie/specie.schema";

export async function specieRoutes(fastify: FastifyInstance) {
    const specieUseCase = new SpecieUseCase();

    fastify.get('/', {
        schema: {
            description: 'Obtém todas as Espécies',
            tags: ['Espécie'],
            response: {
                200: {
                    description: 'Lista de espécies encontradas',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                        }
                    }
                },
                404: {
                    description: 'Espécie não encontrada',
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
                const species = await specieUseCase.findAll();

                return reply.send(species);
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
            description: 'Obtém uma Espécie pelo ID',
            tags: ['Espécie'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da espécie' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Espécie encontrado',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                    }
                },
                404: {
                    description: 'Espécie não encontrada',
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
                const specie = await specieUseCase.findById(id);

                return reply.send(specie);
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

    fastify.post<{ Body: CreateSpecieDTO }>('/', {
        schema: {
            description: 'Cadastra uma nova Espécie',
            tags: ['Espécie'],
            body: specieJsonSchema,
            response: {
                201: {
                    description: 'Espécie criada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
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
            const result = SpecieSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;
        
            try {
                const specie = await specieUseCase.create(dataBody);

                return reply.status(201).send(specie);
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

    fastify.put<{ Body: CreateSpecieDTO , Params: { id: string}}>('/:id', {
        schema: {
            description: 'Atualiza uma nova Espécie pelo ID',
            tags: ['Espécie'],
            body: specieJsonSchema,
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da espécie' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Espécie atualizada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
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
            const result = SpecieSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const { id } = req.params;
            
            const dataBody = {...req.body, id: id}
        
            try {
                const specie = await specieUseCase.update(dataBody);

                return reply.status(200).send(specie);
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
            description: 'Deleta uma espécie pelo ID',
            tags: ['Espécie'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da espécie' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Espécie deletada com sucesso',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                404: {
                    description: 'Espécie não encontrada',
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
                await specieUseCase.delete(id);

                return reply.send({ message: 'Espécie deletada com sucesso' });
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
