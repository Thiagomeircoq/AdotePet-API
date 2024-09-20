import Fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors'
import { HttpError } from "./errors/HttpError";
import { petRoutes } from "./routes/pet/pet.routes";


const app: FastifyInstance = Fastify({ logger: true });

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

app.register(petRoutes, {
    prefix: "/pet",
});

app.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) {
        reply.status(error.code).send({ message: error.message });
    } else {
        reply.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen({ port: 3100, host: '0.0.0.0' }, () => console.log("Server is running on port 3100"));
