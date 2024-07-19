import fastify, { FastifyInstance } from "fastify";
import { personRoutes } from "./routes/person.routes";
import jwtAuth from './auth';

const app: FastifyInstance = fastify({ logger: true });

// app.register(jwtAuth);

// app.register(productRoutes, {
//     prefix: "/login",
// });

app.register(personRoutes, {
    prefix: "/person",
});

app.listen({ port: 3100 }, () => console.log("Server is running on port 3100"));