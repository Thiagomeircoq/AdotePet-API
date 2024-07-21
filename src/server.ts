import fastify, { FastifyInstance } from "fastify";
import { personRoutes } from "./routes/person.routes";
import jwtAuth from './auth';
import { HttpError } from "./errors/HttpError";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";

const app: FastifyInstance = fastify({ logger: true });

app.register(jwtAuth);

app.register(personRoutes, {
    prefix: "/person",
});

app.register(authRoutes, {
    prefix: "/auth",
});

app.register(userRoutes, {
    prefix: "/user",
});

app.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) {
        reply.status(error.code).send({ message: error.message });
    } else {
        reply.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen({ port: 3100 }, () => console.log("Server is running on port 3100"));