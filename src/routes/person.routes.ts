import { FastifyInstance } from "fastify";
import { PersonCreate } from "../interface/person.interface";
import { PersonUseCase } from "../usercases/person.usecase";
import { PersonSchema } from "../schemas/person.schema";
import { HttpError } from "../errors/HttpError";
import { formatZodError } from "../errors/ZoodError";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function personRoutes(fastify: FastifyInstance) {
    const personUseCase = new PersonUseCase();
    
    fastify.addHook('preHandler', authMiddleware);
    fastify.post<{ Body: PersonCreate }>('/', {
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

    fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
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
    });

    fastify.delete<{ Body: PersonCreate, Params: { id: string } }>(
        '/:id',
        async (req, reply) => {
            const { id } = req.params;

            try {
                const data = await personUseCase.delete(id);

                return data;
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

    fastify.put<{ Body: PersonCreate, Params: { id: string } }>(
        '/:id', {
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
