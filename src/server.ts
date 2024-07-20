import fastify, { FastifyInstance } from "fastify";
import { personRoutes } from "./routes/person.routes";
import jwtAuth from './auth';
import { HttpError } from "./errors/HttpError";

const app: FastifyInstance = fastify({ logger: true });

// app.register(jwtAuth);

// app.register(productRoutes, {
//     prefix: "/login",
// });

app.register(personRoutes, {
    prefix: "/person",
});

app.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) {
        reply.status(error.code).send({ message: error.message });
    } else {
        reply.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen({ port: 3100 }, () => console.log("Server is running on port 3100"));