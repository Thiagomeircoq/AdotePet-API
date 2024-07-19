import { FastifyInstance } from "fastify";
import { PersonCreate } from "../interface/person.interface";

export async function personRoutes(fastify: FastifyInstance) {
    const personUserCase = new personUserCase();
    
    fastify.post<{ Body: PersonCreate }>('/', {
        preHandler: validateProductCreate,
        handler: async (req, reply) => {
            const dataBody = req.body;

            try {
                const data = await productUserCase.create(dataBody);
                return reply.send(data);
            } catch (error) {
                reply.status(500).send(error);
            }
        }
    });

    fastify.get('/', async (req, reply) => {
        return 'Hello World!';

        try {

        } catch (error) {
            reply.status(500).send(error);
        }
    });

    

}
