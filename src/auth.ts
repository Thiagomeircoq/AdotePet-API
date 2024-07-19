import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

async function jwtAuth(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(fastifyJwt, {
        secret: 's3cr3tK3y1234567890abcdefghijklmnopqrstuvwxyz'
    });

    fastify.decorate('authenticate', async function (req, reply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
}

export default fp(jwtAuth);
