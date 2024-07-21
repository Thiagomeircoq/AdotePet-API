import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '../errors/HttpError';

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
    try {
        const decoded = await req.jwtVerify<{ id: string; email: string }>();
        req.user = decoded;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'JsonWebTokenError') {
                throw new HttpError({ code: 401, message: 'Invalid token provided.' });
            } else if (error.name === 'TokenExpiredError') {
                throw new HttpError({ code: 401, message: 'Token has expired. Please login again.' });
            } else {
                throw new HttpError({ code: 401, message: 'Unauthorized access. Please provide a valid token.' });
            }
        } else {
            throw new HttpError({ code: 500, message: 'An unknown error occurred during authentication.' });
        }
    }
}