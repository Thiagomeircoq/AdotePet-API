import Fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors';
import { petRoutes } from "./routes/pet/pet.routes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

const app: FastifyInstance = Fastify({ logger: true });

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

app.register(swagger, {
    openapi: {
        info: {
            title: 'Adote Pet API',
            description: 'Documentação da API para o sistema de adoção de pets',
            version: '1.0.0',
        },
        servers: [
            { url: 'http://localhost:3100' }
        ],
    }
});

app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject; },
    transformSpecificationClone: true
});

app.register(petRoutes, {
    prefix: "/pet",
});

app.setErrorHandler((error, request, reply) => {
    reply.status(500).send({ message: 'Internal Server Error' });
});

app.listen({ port: 3100, host: '0.0.0.0' }, () => console.log("Server is running on port 3100"));
