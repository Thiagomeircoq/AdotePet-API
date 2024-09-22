import { FastifyInstance } from "fastify";
import { HttpError } from "../../errors/HttpError";
import { CreatePetDTO } from "../../interface/pet/pet.interface";
import fromZodError from 'zod-to-json-schema';
import { PetSchema } from "../../schemas/pet/pet.schema";
import { formatZodError } from "../../errors/ZoodError";
import { PetUseCase } from "../../usercases/pet/pet.usecase";

export async function petRoutes(fastify: FastifyInstance) {
    const petUseCase = new PetUseCase();
    const petJsonSchema = fromZodError(PetSchema);

    fastify.get<{ Params: { id: string } }>('/:id', {
        handler: async (req, reply) => {
            const { id } = req.params;

            try {
                return 'teste';
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
