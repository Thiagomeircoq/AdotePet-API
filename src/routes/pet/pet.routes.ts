import { FastifyInstance } from "fastify";
import { HttpError } from "../../errors/HttpError";
import { CreatePetDTO } from "../../interface/pet/pet.interface";

export async function petRoutes(fastify: FastifyInstance) {

    fastify.get<{ Params: { id: string } }>('/:id', {
        handler: async (req, reply) => {
            const { id } = req.params;

            console.log('vasco');
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
        handler: async (req, reply) => {
            const dataBody = req.body;

            try {
               return dataBody;

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
