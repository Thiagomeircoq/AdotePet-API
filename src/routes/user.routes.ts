import { FastifyInstance } from "fastify";
import { HttpError } from "../errors/HttpError";
import { UpdatePassword, UserCreate, UserLogin } from "../interface/user.interface";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserUseCase } from "../usercases/user.usecase";
import { PasswordUpdate } from "../schemas/user.schema";
import { formatZodError } from "../errors/ZoodError";

export async function userRoutes(fastify: FastifyInstance) {
    const userUseCase = new UserUseCase();
    
    fastify.addHook('preHandler', authMiddleware);
    fastify.delete<{ Body: UserCreate, Params: { id: string } }>(
        '/:id',
        async (req, reply) => {
            const { id } = req.params;

            try {
                const data = await userUseCase.delete(id);

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

    fastify.patch<{ Body: UpdatePassword, Params: { id:string } }>('/:id/password', {
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
                const data = await userUseCase.updatePassword(dataBody, id);
                return reply.status(201).send(data);

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
