import Fastify, { FastifyInstance } from "fastify";
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import { petRoutes } from "./routes/pet/pet.routes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { specieRoutes } from "./routes/specie/specie.routes";
import { breedRoutes } from "./routes/breed/breed.routes";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { authRoutes } from "./routes/auth/auth.routes";

dotenv.config();

const uploadPath = path.join(process.cwd(), 'src', 'uploads');

const app: FastifyInstance = Fastify({ logger: true });

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'defaultSecretKey',
    sign: {
        expiresIn: '1h',
    },
    verify: {
        algorithms: ['HS256'],
    }
});

app.register(fastifyCookie, {
    parseOptions: {}
});

app.register(fastifyMultipart, {
    limits: {
        fileSize: 25 * 1024 * 1024,
    }
});

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

app.register(fastifyStatic, {
    root: uploadPath,
    prefix: '/uploads/',
    list: true,
    index: false,
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

app.decorate("authenticate", async (request: any, reply: any) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: 'Token inválido ou expirado' });
    }
});

app.register(petRoutes, {
    prefix: "/pet",
});

app.register(specieRoutes, {
    prefix: "/specie",
});

app.register(breedRoutes, {
    prefix: "/breed",
});

app.register(authRoutes, {
    prefix: "/auth",
});

app.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(500).send({ message: 'Internal Server Error' });
});

app.listen({ port: 3100, host: '0.0.0.0' }, (err) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log('Server is running on port 3100');
});
