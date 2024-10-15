import { FastifyInstance } from "fastify";
import { RegisterUserDTO } from "../../interface/user/user.interface";
import { RegisterUserSchema } from "../../schemas/auth/auth.schema";
import { formatZodError } from "../../errors/ZoodError";
import { HttpError } from "../../errors/HttpError";
import { AuthUseCase } from "../../usercases/auth/auth.usecase";

export async function authRoutes(fastify: FastifyInstance) {
    const authUseCase = new AuthUseCase();

    fastify.post<{ Body: RegisterUserDTO }>('/register', {
        // schema: {
        //     description: 'Cadastra uma nova Espécie',
        //     tags: ['Espécie'],
        //     body: specieJsonSchema,
        //     response: {
        //         201: {
        //             description: 'Espécie criada com sucesso',
        //             type: 'object',
        //             properties: {
        //                 id: { type: 'string' },
        //                 name: { type: 'string' },
        //             }
        //         },
        //         409: {
        //             description: 'Erro de conflito',
        //             type: 'object',
        //             properties: {
        //                 message: { type: 'string' }
        //             }
        //         },
        //         422: {
        //             description: 'Erro de validação',
        //             type: 'object',
        //             properties: {
        //                 message: { type: 'string' }
        //             }
        //         },
        //         500: {
        //             description: 'Erro interno do servidor',
        //             type: 'object',
        //             properties: {
        //                 message: { type: 'string' }
        //             }
        //         }
        //     }
        // },
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

                return user;
                // return reply.status(201).send(specie);
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