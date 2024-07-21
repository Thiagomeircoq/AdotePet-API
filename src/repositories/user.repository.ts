import { prisma } from "../database/prisma-client";
import { User, UserCreate, UserRepository } from "../interface/user.interface";

class UserRepositoryPrisma implements UserRepository {

    async create(data: UserCreate): Promise<User> {
        const result = await prisma.tbusers.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password
            },
        });

        return result;
    }

    async findById(id: string): Promise<User|null> {
        const result = await prisma.tbusers.findUnique({
            where: {
                id: id
            },
        });

        return result || null;
    }

    async findByEmail(email: string): Promise<User|null> {
        const result = await prisma.tbusers.findUnique({
            where: {
                email: email
            },
        });

        return result || null;
    }

    async findByUsername(username: string): Promise<User|null> { 
        const result = await prisma.tbusers.findUnique({
            where: {
                username: username
            },
        });

        return result || null;
    }

    async delete(id: string): Promise<void> {
        await prisma.tbusers.delete({
            where: {
                id: id
            },
        });

        return;
    }

    async updatePassword(newPassword: string, id: string): Promise<User> {
        const result = await prisma.tbusers.update({
            where: {
                id: id
            },
            data: {
                password: newPassword
            },
        });

        return result;
    }

}

export { UserRepositoryPrisma };