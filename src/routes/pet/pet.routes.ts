import { FastifyInstance } from "fastify";
import { HttpError } from "../../errors/HttpError";
import { CreatePetDTO } from "../../interface/pet/pet.interface";
import { petJsonSchema, PetSchema } from "../../schemas/pet/pet.schema";
import { formatZodError } from "../../errors/ZoodError";
import { PetUseCase } from "../../usercases/pet/pet.usecase";

export async function petRoutes(fastify: FastifyInstance) {
    const petUseCase = new PetUseCase();

    fastify.get<{ Params: { id: string } }>('/:id', {
        schema: {
            description: 'Obtém um pet pelo ID',
            tags: ['Pet'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do pet' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pet encontrado',
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        species_id: { type: 'number' },
                        breed_id: { type: 'number' },
                        color: { type: 'string' },
                        size: { type: 'string' },
                        age: { type: 'number' },
                        gender: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        species: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                name: { type: 'string' }
                            }
                        }
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
                const pet = await petUseCase.findById(id);

                return reply.send(pet);
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

    fastify.post<{ Body: CreatePetDTO }>('/', {
        schema: {
            description: 'Cadastra um novo PET',
            tags: ['Pet'],
            body: petJsonSchema,
            response: {
                200: {
                    description: 'Pet criado com sucesso',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
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
            const result = PetSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const dataBody = req.body;
        
            try {
                const pet = await petUseCase.create(dataBody);

                return reply.status(201).send(pet);
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
