import { FastifyInstance } from "fastify";
import { HttpError } from "../../errors/HttpError";
import { formatZodError } from "../../errors/ZoodError";
import { CreateBreedDTO } from "../../interface/breed/breed.interface";
import { BreedUseCase } from "../../usercases/breed/breed.usecase";
import { breedJsonSchema, BreedSchema } from "../../schemas/breed/breed.schema";

export async function breedRoutes(fastify: FastifyInstance) {
    const breedUseCase = new BreedUseCase();

    fastify.get('/', {
        schema: {
            description: 'Obtém todas as Raças',
            tags: ['Raça'],
            response: {
                200: {
                    description: 'Lista de raças encontradas',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            species: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Raça não encontrada',
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
                const breed = await breedUseCase.findAll();

                return reply.send(breed);
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
            description: 'Obtém uma Raça pelo ID',
            tags: ['Raça'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da raça' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Raça encontrado',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        species: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        }
                    }
                },
                404: {
                    description: 'raça não encontrada',
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
                const breed = await breedUseCase.findById(id);

                return reply.send(breed);
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

    fastify.get<{ Params: { id: string } }>('/specie/:id', {
        schema: {
            description: 'Obtém as Raça pelo ID da espécie',
            tags: ['Raça'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da espécie' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Lista de raças encontradas',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            species: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'raça não encontrada',
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
                const breed = await breedUseCase.findAllBySpecieId(id);

                return reply.send(breed);
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

    fastify.post<{ Body: CreateBreedDTO }>('/', {
        schema: {
            description: 'Cadastra uma nova raça',
            tags: ['Raça'],
            body: breedJsonSchema,
            response: {
                201: {
                    description: 'Raça criada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        species: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        }
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
            const result = BreedSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;

            try {
                const breed = await breedUseCase.create(dataBody);

                return reply.status(201).send(breed);
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

    fastify.put<{ Body: CreateBreedDTO , Params: { id: string}}>('/:id', {
        schema: {
            description: 'Atualiza uma nova raça pelo ID',
            tags: ['Raça'],
            body: breedJsonSchema,
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da raça' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Raça encontrado',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        species: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        }
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
            const result = BreedSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const { id } = req.params;
            
            const dataBody = {...req.body, id: id}
        
            try {
                const breed = await breedUseCase.update(dataBody);

                return reply.status(200).send(breed);
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
            description: 'Deleta uma raça pelo ID',
            tags: ['Raça'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da raça' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Raça deletada com sucesso',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                404: {
                    description: 'Raça não encontrada',
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
                await breedUseCase.delete(id);

                return reply.send({ message: 'Raça deletada com sucesso' });
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
