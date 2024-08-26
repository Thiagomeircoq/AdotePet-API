import Fastify, { FastifyInstance } from "fastify";
import { personRoutes } from "./routes/person.routes";
import jwtAuth from './auth';
import cors from '@fastify/cors'
import { HttpError } from "./errors/HttpError";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const app: FastifyInstance = Fastify({ logger: true });

app.register(swagger, {
    swagger: {
        info: {
            title: 'API Documentation',
            description: 'API documentation with Swagger',
            version: '1.0.0',
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
        host: 'localhost:3100',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    }
});

app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
});

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

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
