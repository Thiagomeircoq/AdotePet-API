import { prisma } from "../database/prisma-client";
import { HttpError } from "../errors/HttpError";
import { Person, PersonCreate, PersonRepository, PersonUpdate } from "../interface/person.interface";

class PersonRepositoryPrisma implements PersonRepository {

    async create(data: PersonCreate, userId: string): Promise<Person> {
        const person = await prisma.$transaction(async (prisma) => {
            const person = await prisma.tbpersons.create({
                data: {
                    cpf: data.cpf,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    date_of_birth: data.date_of_birth || '',
                    phone_number: data.phone_number,
                },
            });
    
            const user = await prisma.tbusers.findUnique({
                where: { id: userId },
            });
    
            if (!user) {
                throw new HttpError({ code: 404, message: `User with ID ${userId} not found.` });
            }
    
            await prisma.tbusers.update({
                where: { id: userId },
                data: { person_id: person.id },
            });
            return person;
        });

        return person;
    }

    async findById(id: string): Promise<Person | null> {
        const result = await prisma.tbpersons.findUnique({
            where: {
                id: id
            },
        });

        return result || null;
    }

    async findByCpf(cpf: string, id?: string): Promise<Person | null> {
        const result = await prisma.tbpersons.findFirst({
            where: {
                cpf: cpf,
                AND: id ? { id: { not: id } } : {},
            },
        });

        return result || null;
    }

    async findByPhoneNumber(phone_number: string, id?: string): Promise<Person | null> {
        const result = await prisma.tbpersons.findFirst({
            where: {
                phone_number: phone_number,
                AND: id ? { id: { not: id } } : {},
            },
        });

        return result || null;
    }

    async delete(id: string): Promise<void> {
        await prisma.tbpersons.delete({
            where: {
                id: id
            },
        });

        return;
    }

    async update(data: PersonUpdate): Promise<Person> {
        const result = await prisma.tbpersons.update({
            where: {
                id: data.id
            },
            data: {
                cpf: data.cpf,
                first_name: data.first_name,
                last_name: data.last_name,
                date_of_birth: data.date_of_birth || undefined,
                phone_number: data.phone_number
            },
        });

        return result;
    }
}

export { PersonRepositoryPrisma };